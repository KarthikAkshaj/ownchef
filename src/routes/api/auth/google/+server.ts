// src/routes/api/auth/google/+server.ts - Initiate Google OAuth
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GOOGLE_CLIENT_ID } from '$env/static/private';

export const GET: RequestHandler = async ({ url, cookies }) => {
	// Generate state parameter for CSRF protection
	const state = crypto.randomUUID();

	// Store state in cookie for verification
	cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 minutes
	});

	// Build Google OAuth authorization URL
	const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
	authUrl.searchParams.set('redirect_uri', `${url.origin}/api/auth/google/callback`);
	authUrl.searchParams.set('response_type', 'code');
	authUrl.searchParams.set('scope', 'openid email profile');
	authUrl.searchParams.set('state', state);

	return redirect(302, authUrl.toString());
};
