// src/routes/write/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// if (!locals.session) {
	// 	throw redirect(303, '/login');
	// }
	return {};
};
