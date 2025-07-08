// src/routes/write/+page.server.ts - ENHANCED VERSION
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// ========================================
// TYPES AND INTERFACES
// ========================================

interface CategoryData {
	id: number;
	name: string;
	slug: string;
	description: string | null;
}

interface CuisineData {
	id: number;
	name: string;
	slug: string;
	description: string | null;
}

interface WritePageData {
	categories: CategoryData[];
	cuisines: CuisineData[];
	user: {
		id: string;
		username: string;
		firstName: string | null;
		lastName: string | null;
	} | null;
}

// ========================================
// PAGE LOAD FUNCTION
// ========================================

export const load: PageServerLoad = async ({ locals, url }) => {
	// Check authentication - redirect to login if not authenticated
	if (!locals.session || !locals.user) {
		// Preserve the current URL for redirect after login
		const redirectTo = encodeURIComponent(url.pathname + url.search);
		throw redirect(303, `/login?redirectTo=${redirectTo}`);
	}

	try {
		// Fetch categories and cuisines in parallel for better performance
		const [categoriesResult, cuisinesResult] = await Promise.all([
			fetchActiveCategories(),
			fetchActiveCuisines()
		]);

		const pageData: WritePageData = {
			categories: categoriesResult,
			cuisines: cuisinesResult,
			user: {
				id: locals.user.id,
				username: locals.user.username,
				firstName: locals.user.firstName,
				lastName: locals.user.lastName
			}
		};

		return pageData;

	} catch (error) {
		console.error('[WRITE PAGE] Error loading data:', error);

		// Return minimal data to prevent page crash
		return {
			categories: [],
			cuisines: [],
			user: locals.user ? {
				id: locals.user.id,
				username: locals.user.username,
				firstName: locals.user.firstName,
				lastName: locals.user.lastName
			} : null,
			error: 'Failed to load some data. Please refresh the page.'
		};
	}
};

// ========================================
// HELPER FUNCTIONS
// ========================================

async function fetchActiveCategories(): Promise<CategoryData[]> {
	try {
		const categories = await db
			.select({
				id: table.category.id,
				name: table.category.name,
				slug: table.category.slug,
				description: table.category.description
			})
			.from(table.category)
			.where(eq(table.category.isActive, true))
			.orderBy(table.category.sortOrder, table.category.name);

		return categories;
	} catch (error) {
		console.error('[WRITE PAGE] Error fetching categories:', error);
		return [];
	}
}

async function fetchActiveCuisines(): Promise<CuisineData[]> {
	try {
		const cuisines = await db
			.select({
				id: table.cuisine.id,
				name: table.cuisine.name,
				slug: table.cuisine.slug,
				description: table.cuisine.description
			})
			.from(table.cuisine)
			.where(eq(table.cuisine.isActive, true))
			.orderBy(table.cuisine.sortOrder, table.cuisine.name);

		return cuisines;
	} catch (error) {
		console.error('[WRITE PAGE] Error fetching cuisines:', error);
		return [];
	}
}

// ========================================
// FORM ACTIONS (Optional - for progressive enhancement)
// ========================================

export const actions: Actions = {
	// Draft save action - saves recipe as draft without validation
	saveDraft: async ({ request, locals }) => {
		if (!locals.session || !locals.user) {
			return {
				success: false,
				error: 'Authentication required',
				status: 401
			};
		}

		try {
			const formData = await request.formData();
			const recipeData = Object.fromEntries(formData);

			// Basic draft save logic (implement as needed)
			console.log('[WRITE PAGE] Saving draft for user:', locals.user.username);
			console.log('[WRITE PAGE] Draft data:', recipeData);

			// TODO: Implement draft saving logic
			// This could save to a drafts table or save as unpublished recipe

			return {
				success: true,
				message: 'Draft saved successfully',
				draftId: 'temp-draft-id' // Return draft ID for frontend
			};

		} catch (error) {
			console.error('[WRITE PAGE] Draft save error:', error);
			return {
				success: false,
				error: 'Failed to save draft',
				status: 500
			};
		}
	},

	// Auto-save action - for periodic saves while writing
	autoSave: async ({ request, locals }) => {
		if (!locals.session || !locals.user) {
			return {
				success: false,
				error: 'Authentication required'
			};
		}

		try {
			const formData = await request.formData();
			const content = formData.get('content')?.toString() || '';
			const title = formData.get('title')?.toString() || '';

			// Implement auto-save logic here
			console.log('[WRITE PAGE] Auto-saving for user:', locals.user.username);

			return {
				success: true,
				lastSaved: new Date().toISOString()
			};

		} catch (error) {
			console.error('[WRITE PAGE] Auto-save error:', error);
			return {
				success: false,
				error: 'Auto-save failed'
			};
		}
	}
};

// ========================================
// ADDITIONAL UTILITY FUNCTIONS
// ========================================

/**
 * Validates user permissions for recipe creation
 */
function validateUserPermissions(user: any): boolean {
	// Add any business logic for user permissions
	// For example, check if user account is verified, not banned, etc.

	if (!user.username || user.username.trim() === '') {
		return false;
	}

	// Add more validation rules as needed
	return true;
}

/**
 * Gets user's recent drafts (for future implementation)
 */
async function getUserDrafts(userId: string): Promise<any[]> {
	try {
		// This would fetch user's recent drafts
		// const drafts = await db.select()...
		return [];
	} catch (error) {
		console.error('[WRITE PAGE] Error fetching user drafts:', error);
		return [];
	}
}

/**
 * Checks if user has reached recipe creation limits (for future implementation)
 */
async function checkCreationLimits(userId: string): Promise<{ allowed: boolean; limit?: number; current?: number }> {
	try {
		// This could implement rate limiting or subscription-based limits
		// For now, allow unlimited creation
		return { allowed: true };
	} catch (error) {
		console.error('[WRITE PAGE] Error checking creation limits:', error);
		return { allowed: true };
	}
}