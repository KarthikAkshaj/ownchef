import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		session: locals.session ?? null, // Ensures a value is always returned
		user: locals.user ?? null
	} satisfies LayoutServerLoad;
};
