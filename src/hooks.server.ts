// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// FOR DEVELOPMENT ONLY: Create a mock session
	event.locals.session = {
		id: 'mock-session',
		userId: 'mock-user',
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours from now
	};

	event.locals.user = {
		id: 'mock-user',
		username: 'test_user',
	};

	// Comment out this section for development
	/*
	const protectedRoutes = ['/write'];
	const isProtectedRoute = protectedRoutes.some((route) => event.url.pathname.startsWith(route));

	if (isProtectedRoute && !event.locals.session) {
		throw redirect(303, '/login');
	}
	*/

	const response = await resolve(event);
	return response;
};