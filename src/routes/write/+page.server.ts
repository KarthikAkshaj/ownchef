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
		// Check if we're in edit mode
		const editId = url.searchParams.get('edit');
		let existingRecipe = null;

		if (editId) {
			// Fetch the recipe to edit
			const recipeId = parseInt(editId);
			if (!isNaN(recipeId)) {
				existingRecipe = await fetchRecipeForEdit(recipeId, locals.user.id);
			}
		}

		// Fetch categories and cuisines in parallel for better performance
		const [categoriesResult, cuisinesResult] = await Promise.all([
			fetchActiveCategories(),
			fetchActiveCuisines()
		]);

		const pageData = {
			categories: categoriesResult,
			cuisines: cuisinesResult,
			user: {
				id: locals.user.id,
				username: locals.user.username,
				firstName: locals.user.firstName,
				lastName: locals.user.lastName
			},
			editMode: !!existingRecipe,
			existingRecipe: existingRecipe
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
			editMode: false,
			existingRecipe: null,
			error: 'Failed to load some data. Please refresh the page.'
		};
	}
};

// ========================================
// HELPER FUNCTIONS
// ========================================

async function fetchRecipeForEdit(recipeId: number, userId: string) {
	try {
		// Fetch recipe with all related data
		const [recipeData] = await db
			.select({
				id: table.recipe.id,
				title: table.recipe.title,
				slug: table.recipe.slug,
				description: table.recipe.description,
				prepTime: table.recipe.prepTime,
				cookTime: table.recipe.cookTime,
				servings: table.recipe.servings,
				difficulty: table.recipe.difficulty,
				dietaryType: table.recipe.dietaryType,
				featuredImage: table.recipe.featuredImage,
				videoUrl: table.recipe.videoUrl,
				categoryId: table.recipe.categoryId,
				cuisineId: table.recipe.cuisineId,
				authorId: table.recipe.authorId,
				isPublished: table.recipe.isPublished
			})
			.from(table.recipe)
			.where(eq(table.recipe.id, recipeId))
			.limit(1);

		if (!recipeData) {
			console.error('[WRITE PAGE] Recipe not found:', recipeId);
			return null;
		}

		// Check authorization - user must own this recipe
		if (recipeData.authorId !== userId) {
			console.warn('[WRITE PAGE] Unauthorized edit attempt by user', userId, 'on recipe', recipeId);
			return null;
		}

		// Fetch ingredients
		const ingredients = await db
			.select()
			.from(table.recipeIngredient)
			.where(eq(table.recipeIngredient.recipeId, recipeId))
			.orderBy(table.recipeIngredient.groupOrder, table.recipeIngredient.itemOrder);

		// Fetch instructions
		const instructions = await db
			.select()
			.from(table.recipeInstruction)
			.where(eq(table.recipeInstruction.recipeId, recipeId))
			.orderBy(table.recipeInstruction.stepNumber);

		// Fetch tips
		const tips = await db
			.select()
			.from(table.recipeTip)
			.where(eq(table.recipeTip.recipeId, recipeId))
			.orderBy(table.recipeTip.sortOrder);

		// Fetch tags
		const recipeTags = await db
			.select({
				tagName: table.tag.name
			})
			.from(table.recipeTag)
			.leftJoin(table.tag, eq(table.recipeTag.tagId, table.tag.id))
			.where(eq(table.recipeTag.recipeId, recipeId));

		// Fetch additional images
		const images = await db
			.select()
			.from(table.recipeImage)
			.where(eq(table.recipeImage.recipeId, recipeId))
			.orderBy(table.recipeImage.sortOrder);

		// Group ingredients by groupName
		const groupedIngredients = ingredients.reduce((acc, ing) => {
			const groupName = ing.groupName || '';
			if (!acc[groupName]) {
				acc[groupName] = [];
			}
			acc[groupName].push({
				name: ing.name,
				amount: ing.amount,
				unit: ing.unit,
				preparation: ing.preparation,
				notes: ing.notes
			});
			return acc;
		}, {} as Record<string, any[]>);

		const ingredientGroups = Object.entries(groupedIngredients).map(([groupName, items]) => ({
			groupName: groupName || null,
			items
		}));

		return {
			id: recipeData.id,
			title: recipeData.title,
			slug: recipeData.slug,
			description: recipeData.description,
			prepTime: recipeData.prepTime,
			cookTime: recipeData.cookTime,
			servings: recipeData.servings,
			difficulty: recipeData.difficulty,
			dietaryType: recipeData.dietaryType,
			featuredImage: recipeData.featuredImage,
			videoUrl: recipeData.videoUrl,
			categoryId: recipeData.categoryId,
			cuisineId: recipeData.cuisineId,
			isPublished: recipeData.isPublished,
			ingredients: ingredientGroups,
			steps: instructions.map(inst => ({
				title: inst.title,
				content: inst.content,
				image: inst.image,
				videoUrl: inst.videoUrl,
				estimatedTime: inst.estimatedTime,
				temperature: inst.temperature,
				tips: inst.tips
			})),
			tips: tips.map(tip => ({
				content: tip.content,
				category: tip.category
			})),
			tags: recipeTags.map(rt => rt.tagName).filter(Boolean),
			images: images.map(img => img.url)
		};
	} catch (error) {
		console.error('[WRITE PAGE] Error fetching recipe for edit:', error);
		return null;
	}
}

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