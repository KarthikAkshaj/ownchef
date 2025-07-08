// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { sessionCookieName, validateSessionToken } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get(sessionCookieName);
    
    if (!token) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user } = await validateSessionToken(token);
    
    if (session && user) {
        event.locals.session = session;
        event.locals.user = user;
    } else {
        event.locals.session = null;
        event.locals.user = null;
        event.cookies.delete(sessionCookieName, { path: '/' });
    }

    return resolve(event);
};