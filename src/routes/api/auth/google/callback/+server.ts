// src/routes/api/auth/google/callback/+server.ts - Handle Google OAuth callback
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { eq } from 'drizzle-orm';

interface GoogleTokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
	id_token: string;
}

interface GoogleUserInfo {
	sub: string; // Google user ID
	email: string;
	email_verified: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
}

export const GET: RequestHandler = async (event) => {
	const { url, cookies } = event;
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');

	// Validate state parameter (CSRF protection)
	if (!state || !storedState || state !== storedState) {
		console.error('[OAuth] Invalid state parameter');
		return redirect(302, '/login?error=invalid_state');
	}

	// Clear state cookie
	cookies.delete('oauth_state', { path: '/' });

	if (!code) {
		console.error('[OAuth] No authorization code received');
		return redirect(302, '/login?error=no_code');
	}

	try {
		// Exchange authorization code for access token
		const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				code,
				client_id: GOOGLE_CLIENT_ID,
				client_secret: GOOGLE_CLIENT_SECRET,
				redirect_uri: `${url.origin}/api/auth/google/callback`,
				grant_type: 'authorization_code'
			})
		});

		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text();
			console.error('[OAuth] Token exchange failed:', errorText);
			return redirect(302, '/login?error=token_exchange_failed');
		}

		const tokens: GoogleTokenResponse = await tokenResponse.json();

		// Get user info from Google
		const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`
			}
		});

		if (!userInfoResponse.ok) {
			console.error('[OAuth] Failed to fetch user info');
			return redirect(302, '/login?error=user_info_failed');
		}

		const googleUser: GoogleUserInfo = await userInfoResponse.json();

		// Check if user already exists by email
		const [existingUser] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.email, googleUser.email))
			.limit(1);

		let userId: string;

		if (existingUser) {
			// User exists - update their info
			userId = existingUser.id;

			await db
				.update(table.user)
				.set({
					firstName: googleUser.given_name,
					lastName: googleUser.family_name,
					profileImage: googleUser.picture,
					updatedAt: new Date()
				})
				.where(eq(table.user.id, userId));

			console.log(`[OAuth] Existing user logged in: ${googleUser.email}`);
		} else {
			// Create new user from Google account
			userId = auth.generateUserId();
			const now = new Date();

			// Generate a unique username from email
			const baseUsername = googleUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
			let username = baseUsername;
			let counter = 1;

			// Ensure username is unique
			while (true) {
				const [existing] = await db
					.select({ id: table.user.id })
					.from(table.user)
					.where(eq(table.user.username, username))
					.limit(1);

				if (!existing) break;
				username = `${baseUsername}${counter}`;
				counter++;
			}

			await db.insert(table.user).values({
				id: userId,
				username,
				email: googleUser.email,
				firstName: googleUser.given_name,
				lastName: googleUser.family_name,
				profileImage: googleUser.picture,
				passwordHash: null, // OAuth users don't have passwords
				createdAt: now,
				updatedAt: now
			});

			console.log(`[OAuth] New user created: ${googleUser.email} (${username})`);
		}

		// Create session
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} catch (error) {
		console.error('[OAuth] Unexpected error:', error);
		return redirect(302, '/login?error=unexpected');
	}

	// Redirect to home page (outside try-catch to avoid catching the redirect)
	// Note: SvelteKit will automatically reload layout data on navigation
	return redirect(303, '/');
};
