// src/routes/recipes/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { recipe, user, category, cuisine, recipeIngredient, recipeInstruction, recipeTip } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;

	// Fetch recipe with all related data
	const recipeData = await db
		.select({
			id: recipe.id,
			title: recipe.title,
			slug: recipe.slug,
			description: recipe.description,
			prepTime: recipe.prepTime,
			cookTime: recipe.cookTime,
			totalTime: recipe.totalTime,
			servings: recipe.servings,
			difficulty: recipe.difficulty,
			dietaryType: recipe.dietaryType,
			featuredImage: recipe.featuredImage,
			videoUrl: recipe.videoUrl,
			averageRating: recipe.averageRating,
			likesCount: recipe.likesCount,
			ratingsCount: recipe.ratingsCount,
			views: recipe.views,
			// Nutrition fields
			nutritionCalories: recipe.nutritionCalories,
			nutritionProtein: recipe.nutritionProtein,
			nutritionCarbs: recipe.nutritionCarbs,
			nutritionFat: recipe.nutritionFat,
			nutritionFiber: recipe.nutritionFiber,
			nutritionSugar: recipe.nutritionSugar,
			// Author fields
			authorId: user.id,
			authorUsername: user.username,
			authorFirstName: user.firstName,
			authorLastName: user.lastName,
			authorProfileImage: user.profileImage,
			// Category
			categoryId: category.id,
			categoryName: category.name,
			categorySlug: category.slug,
			// Cuisine
			cuisineId: cuisine.id,
			cuisineName: cuisine.name,
			cuisineSlug: cuisine.slug
		})
		.from(recipe)
		.leftJoin(user, eq(recipe.authorId, user.id))
		.leftJoin(category, eq(recipe.categoryId, category.id))
		.leftJoin(cuisine, eq(recipe.cuisineId, cuisine.id))
		.where(eq(recipe.slug, slug))
		.limit(1);

	if (!recipeData || recipeData.length === 0) {
		throw error(404, 'Recipe not found');
	}

	const recipeRecord = recipeData[0];

	// Fetch ingredients
	const ingredients = await db
		.select()
		.from(recipeIngredient)
		.where(eq(recipeIngredient.recipeId, recipeRecord.id))
		.orderBy(recipeIngredient.groupOrder, recipeIngredient.itemOrder);

	// Fetch instructions
	const instructions = await db
		.select()
		.from(recipeInstruction)
		.where(eq(recipeInstruction.recipeId, recipeRecord.id))
		.orderBy(recipeInstruction.stepNumber);

	// Fetch tips
	const tips = await db
		.select()
		.from(recipeTip)
		.where(eq(recipeTip.recipeId, recipeRecord.id))
		.orderBy(recipeTip.sortOrder);

	// Check if the current user is the author (for edit/delete permissions)
	const isOwner = locals.user?.id === recipeRecord.authorId;

	// Format the data for the component
	return {
		recipe: {
			id: recipeRecord.id,
			title: recipeRecord.title,
			slug: recipeRecord.slug,
			description: recipeRecord.description,
			prepTime: recipeRecord.prepTime,
			cookTime: recipeRecord.cookTime,
			totalTime: recipeRecord.totalTime,
			servings: recipeRecord.servings,
			difficulty: recipeRecord.difficulty,
			dietaryType: recipeRecord.dietaryType,
			featuredImage: recipeRecord.featuredImage,
			videoUrl: recipeRecord.videoUrl,
			averageRating: recipeRecord.averageRating,
			likesCount: recipeRecord.likesCount,
			ratingsCount: recipeRecord.ratingsCount,
			views: recipeRecord.views,
			// Nutrition
			nutritionCalories: recipeRecord.nutritionCalories,
			nutritionProtein: recipeRecord.nutritionProtein,
			nutritionCarbs: recipeRecord.nutritionCarbs,
			nutritionFat: recipeRecord.nutritionFat,
			nutritionFiber: recipeRecord.nutritionFiber,
			nutritionSugar: recipeRecord.nutritionSugar,
			author: {
				id: recipeRecord.authorId,
				username: recipeRecord.authorUsername,
				firstName: recipeRecord.authorFirstName,
				lastName: recipeRecord.authorLastName,
				profileImage: recipeRecord.authorProfileImage
			},
			category: recipeRecord.categoryId ? {
				id: recipeRecord.categoryId,
				name: recipeRecord.categoryName,
				slug: recipeRecord.categorySlug
			} : null,
			cuisine: recipeRecord.cuisineId ? {
				id: recipeRecord.cuisineId,
				name: recipeRecord.cuisineName,
				slug: recipeRecord.cuisineSlug
			} : null
		},
		ingredients,
		instructions,
		tips,
		isOwner // Pass ownership flag to the UI
	};
};
