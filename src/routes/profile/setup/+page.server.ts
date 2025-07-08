// src/routes/profile/setup/+page.server.ts - COMPLETE FIXED VERSION
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    console.log('[PROFILE_SETUP] Load function called');
    console.log('[PROFILE_SETUP] locals.user:', locals.user ? 'exists' : 'null');
    console.log('[PROFILE_SETUP] locals.session:', locals.session ? 'exists' : 'null');

    // Redirect to login if not authenticated
    if (!locals.user) {
        console.log('[PROFILE_SETUP] No user found, redirecting to login');
        const redirectTo = '/profile/setup';
        throw redirect(302, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }

    // Log user state for debugging
    console.log('[PROFILE_SETUP] User authenticated:', {
        id: locals.user.id,
        username: locals.user.username,
        firstName: locals.user.firstName,
        lastName: locals.user.lastName,
        hasProfile: !!(locals.user.firstName && locals.user.lastName)
    });

    // Check if profile is already complete
    const hasCompleteProfile = locals.user.firstName && locals.user.lastName;

    // Allow access to setup page even if profile is complete
    // This enables users to edit their profile through the setup flow
    if (hasCompleteProfile) {
        console.log('[PROFILE_SETUP] Profile already complete, but allowing access for editing');
        // Optionally redirect to profile page instead:
        // throw redirect(302, '/profile');
    }

    return {
        user: {
            id: locals.user.id,
            username: locals.user.username,
            email: locals.user.email || '',
            firstName: locals.user.firstName || '',
            lastName: locals.user.lastName || '',
            bio: locals.user.bio || '',
            profileImage: locals.user.profileImage || '',
            age: locals.user.age || null
        },
        isNewUser: !hasCompleteProfile
    };
};

// FIXED: Use actions instead of PUT export for form handling
export const actions: Actions = {
    default: async ({ request, locals }) => {
        // Check authentication
        if (!locals.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        try {
            const formData = await request.formData();
            const profileData = {
                firstName: formData.get('firstName')?.toString().trim(),
                lastName: formData.get('lastName')?.toString().trim(),
                email: formData.get('email')?.toString().trim(),
                bio: formData.get('bio')?.toString().trim(),
                location: formData.get('location')?.toString().trim(),
                website: formData.get('website')?.toString().trim(),
                profileImage: formData.get('profileImage')?.toString().trim(),
                age: formData.get('age') ? parseInt(formData.get('age')?.toString() || '0') : null
            };

            console.log('[PROFILE_SETUP] Received form data:', profileData);

            // Validate required fields
            if (!profileData.firstName || !profileData.lastName) {
                console.log('[PROFILE_SETUP] Validation failed: missing required fields');
                return fail(400, {
                    error: 'First name and last name are required',
                    data: profileData
                });
            }

            // Validate optional email if provided
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

            console.log('[PROFILE_SETUP] Updating user with data:', updateData);

            // Update user in database
            await db
                .update(table.user)
                .set(updateData)
                .where(eq(table.user.id, locals.user.id));

            console.log(`[PROFILE_SETUP] Profile updated successfully for user: ${locals.user.username}`);

            // FIXED: Don't catch redirect as error - let it happen naturally
        } catch (error) {
            // FIXED: Don't catch redirects as errors
            if (error instanceof Response && error.status >= 300 && error.status < 400) {
                // This is a redirect, re-throw it
                throw error;
            }

            console.error('[PROFILE_SETUP] Database update error:', error);
            return fail(500, { error: 'Failed to update profile. Please try again.' });
        }

        // FIXED: Use redirect function properly (moved outside try-catch)
        throw redirect(302, '/');
    }
};