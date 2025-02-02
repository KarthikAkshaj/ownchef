import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = null; 
	event.locals.user = null; 

	const protectedRoutes = ['/write'];
	const isProtectedRoute = protectedRoutes.some((route) => event.url.pathname.startsWith(route));

	if (isProtectedRoute && !event.locals.session) {
		throw redirect(303, '/login');
	}

	const response = await resolve(event);
	return response;
};
