import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	console.log('[Recipe Page] Loading recipe:', slug);

	// Fetch recipe with all related data
	const [recipe] = await db
		.select({
			id: table.recipe.id,
			title: table.recipe.title,
			slug: table.recipe.slug,
			description: table.recipe.description,
			content: table.recipe.content,
			prepTime: table.recipe.prepTime,
			cookTime: table.recipe.cookTime,
			totalTime: table.recipe.totalTime,
			servings: table.recipe.servings,
			difficulty: table.recipe.difficulty,
			dietaryType: table.recipe.dietaryType,
			featuredImage: table.recipe.featuredImage,
			videoUrl: table.recipe.videoUrl,
			views: table.recipe.views,
			likesCount: table.recipe.likesCount,
			ratingsCount: table.recipe.ratingsCount,
			averageRating: table.recipe.averageRating,
			isPublished: table.recipe.isPublished,
			createdAt: table.recipe.createdAt,
			// Author info
			author: {
				id: table.user.id,
				username: table.user.username,
				firstName: table.user.firstName,
				lastName: table.user.lastName,
				profileImage: table.user.profileImage
			},
			// Category info
			category: {
				id: table.category.id,
				name: table.category.name,
				slug: table.category.slug
			},
			// Cuisine info
			cuisine: {
				id: table.cuisine.id,
				name: table.cuisine.name,
				slug: table.cuisine.slug
			}
		})
		.from(table.recipe)
		.leftJoin(table.user, eq(table.recipe.authorId, table.user.id))
		.leftJoin(table.category, eq(table.recipe.categoryId, table.category.id))
		.leftJoin(table.cuisine, eq(table.recipe.cuisineId, table.cuisine.id))
		.where(
			and(
				eq(table.recipe.slug, slug),
				eq(table.recipe.isPublished, true)
			)
		)
		.limit(1);

	if (!recipe) {
		throw error(404, 'Recipe not found');
	}

	// Fetch ingredients
	const ingredients = await db
		.select({
			id: table.recipeIngredient.id,
			groupName: table.recipeIngredient.groupName,
			groupOrder: table.recipeIngredient.groupOrder,
			name: table.recipeIngredient.name,
			amount: table.recipeIngredient.amount,
			unit: table.recipeIngredient.unit,
			preparation: table.recipeIngredient.preparation,
			notes: table.recipeIngredient.notes,
			itemOrder: table.recipeIngredient.itemOrder
		})
		.from(table.recipeIngredient)
		.where(eq(table.recipeIngredient.recipeId, recipe.id))
		.orderBy(table.recipeIngredient.groupOrder, table.recipeIngredient.itemOrder);

	// Fetch instructions
	const instructions = await db
		.select({
			id: table.recipeInstruction.id,
			stepNumber: table.recipeInstruction.stepNumber,
			title: table.recipeInstruction.title,
			content: table.recipeInstruction.content,
			image: table.recipeInstruction.image,
			videoUrl: table.recipeInstruction.videoUrl,
			estimatedTime: table.recipeInstruction.estimatedTime,
			temperature: table.recipeInstruction.temperature,
			tips: table.recipeInstruction.tips
		})
		.from(table.recipeInstruction)
		.where(eq(table.recipeInstruction.recipeId, recipe.id))
		.orderBy(table.recipeInstruction.stepNumber);

	// Fetch tips
	const tips = await db
		.select({
			id: table.recipeTip.id,
			content: table.recipeTip.content,
			category: table.recipeTip.category,
			sortOrder: table.recipeTip.sortOrder
		})
		.from(table.recipeTip)
		.where(eq(table.recipeTip.recipeId, recipe.id))
		.orderBy(table.recipeTip.sortOrder);

	console.log(`[Recipe Page] Found recipe: ${recipe.title} with ${ingredients.length} ingredients and ${instructions.length} steps`);

	return {
		recipe,
		ingredients,
		instructions,
		tips
	};
};
