// src/routes/api/auth/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as auth from '$lib/server/auth';
import { verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json();
	const { username, password } = data;

	if (!username || !password) {
		return json({ error: 'Missing credentials' }, { status: 400 });
	}

	try {
		// Find user by username
		const results = await db.select().from(table.user).where(eq(table.user.username, username));

		const user = results[0];

		if (!user) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Verify password
		const validPassword = await verify(user.passwordHash, password);
		if (!validPassword) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Create session
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);

		// Set session cookie
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return json({ success: true });
	} catch (error) {
		console.error('Authentication error:', error);
		return json({ error: 'Authentication failed' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async (event) => {
	if (event.locals.session) {
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);
	}
	return json({ success: true });
};
