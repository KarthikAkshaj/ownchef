import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		session: locals.session ? {
			id: locals.session.id,
			userId: locals.session.userId,
			expiresAt: locals.session.expiresAt.toISOString()
		} : null,
		user: locals.user ? {
			id: locals.user.id,
			username: locals.user.username,
			email: locals.user.email,
			firstName: locals.user.firstName,
			lastName: locals.user.lastName,
			bio: locals.user.bio,
			profileImage: locals.user.profileImage,
			age: locals.user.age,
			createdAt: locals.user.createdAt.toISOString(),
			updatedAt: locals.user.updatedAt.toISOString()
		} : null
	};
};
