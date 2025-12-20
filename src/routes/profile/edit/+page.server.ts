import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to login if not authenticated
	if (!locals.user) {
		throw redirect(302, '/login?redirectTo=/profile/edit');
	}

	// Return user data for editing
	return {
		user: {
			id: locals.user.id,
			username: locals.user.username,
			email: locals.user.email || '',
			firstName: locals.user.firstName || '',
			lastName: locals.user.lastName || '',
			bio: locals.user.bio || '',
			profileImage: locals.user.profileImage || '',
			age: locals.user.age || null,
			location: locals.user.location || '',
			website: locals.user.website || ''
		}
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// Check authentication
		if (!locals.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const formData = await request.formData();
		const profileData = {
			firstName: formData.get('firstName')?.toString().trim(),
			lastName: formData.get('lastName')?.toString().trim(),
			email: formData.get('email')?.toString().trim(),
			bio: formData.get('bio')?.toString().trim(),
			profileImage: formData.get('profileImage')?.toString().trim(),
			location: formData.get('location')?.toString().trim(),
			website: formData.get('website')?.toString().trim(),
			age: formData.get('age') ? parseInt(formData.get('age')?.toString() || '0') : null
		};

		// Validate required fields
		if (!profileData.firstName || !profileData.lastName) {
			return fail(400, {
				error: 'First name and last name are required',
				data: profileData
			});
		}

		// Validate email if provided
		if (profileData.email && !auth.validateEmail(profileData.email)) {
			return fail(400, {
				error: 'Invalid email format',
				data: profileData
			});
		}

		// Prepare update data
		const updateData: any = {
			firstName: profileData.firstName,
			lastName: profileData.lastName,
			updatedAt: new Date()
		};

		// Add optional fields only if they have values
		if (profileData.bio) updateData.bio = profileData.bio;
		if (profileData.email) updateData.email = profileData.email;
		if (profileData.profileImage) updateData.profileImage = profileData.profileImage;
		if (profileData.location) updateData.location = profileData.location;
		if (profileData.website) {
			// Ensure website has protocol
			const website = profileData.website;
			updateData.website = website.startsWith('http') ? website : `https://${website}`;
		}
		if (profileData.age && profileData.age > 0) updateData.age = profileData.age;

		try {
			// Update user in database
			await db
				.update(table.user)
				.set(updateData)
				.where(eq(table.user.id, locals.user.id));
		} catch (error) {
			console.error('[PROFILE_EDIT] Database error:', error);
			return fail(500, { error: 'Failed to update profile. Please try again.' });
		}

		// Success - redirect to profile page (outside try-catch so it doesn't get caught)
		throw redirect(302, `/profile/${locals.user.username}`);
	}
};
