// src/routes/api/auth/+server.ts - FIXED VERSION
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { eq } from 'drizzle-orm';

// ========================================
// POST = Register new user
// ========================================
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { username, password } = await request.json();

		// Validate input
		if (!auth.validateUsername(username)) {
			return json({
				error: 'Invalid username (3-31 chars, alphanumeric and underscore only)'
			}, { status: 400 });
		}

		if (!auth.validatePassword(password)) {
			return json({
				error: 'Invalid password (6-255 characters)'
			}, { status: 400 });
		}

		// Check if username already exists
		const [existing] = await db
			.select({ id: table.user.id })
			.from(table.user)
			.where(eq(table.user.username, username))
			.limit(1);

		if (existing) {
			return json({ error: 'Username already exists' }, { status: 409 });
		}

		// Create user with proper defaults for new fields
		const userId = auth.generateUserId();
		const passwordHash = await auth.hashPassword(password);
		const now = new Date();

		await db.insert(table.user).values({
			id: userId,
			username,
			passwordHash,
			// Initialize profile fields as null - will be set in profile setup
			email: null,
			firstName: null,
			lastName: null,
			bio: null,
			profileImage: null,
			age: null,
			createdAt: now,
			updatedAt: now
		});

		// Create session immediately after user creation
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);
		auth.setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

		console.log(`[AUTH] User registered and logged in: ${username}`);

		return json({
			success: true,
			message: 'User created and logged in',
			data: {
				id: userId,
				username,
				needsProfileSetup: true // Flag to indicate profile setup is needed
			}
		});

	} catch (error) {
		console.error('[AUTH] Registration error:', error);
		return json({ error: 'Registration failed' }, { status: 500 });
	}
};

// ========================================
// PUT = Login existing user
// ========================================
export const PUT: RequestHandler = async ({ request, cookies }) => {
	try {
		const { username, password } = await request.json();

		// Validate input
		if (!username || !password) {
			return json({ error: 'Username and password required' }, { status: 400 });
		}

		// Find user with all profile fields
		const [user] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username))
			.limit(1);

		if (!user) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Verify password
		const validPassword = await auth.verifyPassword(user.passwordHash, password);
		if (!validPassword) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Create session
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

		console.log(`[AUTH] User logged in: ${username}`);

		// Check if user needs profile setup
		const needsProfileSetup = !user.firstName || !user.lastName;

		return json({
			success: true,
			message: 'Login successful',
			data: {
				id: user.id,
				username: user.username,
				needsProfileSetup
			}
		});

	} catch (error) {
		console.error('[AUTH] Login error:', error);
		return json({ error: 'Login failed' }, { status: 500 });
	}
};

// ========================================
// GET = Get current user info
// ========================================
export const GET: RequestHandler = async ({ locals }) => {
	try {
		if (!locals.user) {
			return json({ error: 'Not authenticated' }, { status: 401 });
		}

		// Return current user data (excluding password)
		const userData = {
			id: locals.user.id,
			username: locals.user.username,
			email: locals.user.email,
			firstName: locals.user.firstName,
			lastName: locals.user.lastName,
			bio: locals.user.bio,
			profileImage: locals.user.profileImage,
			age: locals.user.age,
			needsProfileSetup: !locals.user.firstName || !locals.user.lastName
		};

		return json({
			success: true,
			message: 'User data retrieved',
			data: userData
		});

	} catch (error) {
		console.error('[AUTH] Get user error:', error);
		return json({ error: 'Failed to get user data' }, { status: 500 });
	}
};

// ========================================
// DELETE = Logout
// ========================================
export const DELETE: RequestHandler = async ({ locals, cookies }) => {
	try {
		if (locals.session) {
			await auth.invalidateSession(locals.session.id);
			console.log(`[AUTH] Session invalidated: ${locals.session.id}`);
		}

		// Clear session cookie
		auth.deleteSessionTokenCookie({ cookies } as any);

		return json({
			success: true,
			message: 'Logout successful'
		});

	} catch (error) {
		console.error('[AUTH] Logout error:', error);
		return json({ error: 'Logout failed' }, { status: 500 });
	}
};