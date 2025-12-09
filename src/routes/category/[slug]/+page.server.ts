import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, desc, or, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Map of cuisine slugs to display names
	const cuisineNames: Record<string, string> = {
		indian: 'Indian',
		chinese: 'Chinese',
		italian: 'Italian',
		spanish: 'Spanish',
		thai: 'Thai',
		japanese: 'Japanese',
		mexican: 'Mexican',
		french: 'French',
		korean: 'Korean',
		vietnamese: 'Vietnamese',
		mediterranean: 'Mediterranean',
		american: 'American',
		'middle-eastern': 'Middle Eastern'
	};

	// Check if this is a cuisine or a meal-type category
	const isCuisine = slug in cuisineNames;
	let category;
	let posts;

	if (isCuisine) {
		// It's a cuisine - use existing logic
		category = {
			slug,
			name: cuisineNames[slug],
			type: 'cuisine'
		};

		const recipes = await db
			.select({
				id: table.recipe.id,
				title: table.recipe.title,
				slug: table.recipe.slug,
				description: table.recipe.description,
				featuredImage: table.recipe.featuredImage,
				prepTime: table.recipe.prepTime,
				cookTime: table.recipe.cookTime,
				servings: table.recipe.servings,
				difficulty: table.recipe.difficulty,
				likesCount: table.recipe.likesCount,
				averageRating: table.recipe.averageRating,
				createdAt: table.recipe.createdAt,
				// Author info
				authorId: table.user.id,
				authorUsername: table.user.username,
				authorProfileImage: table.user.profileImage
			})
			.from(table.recipe)
			.leftJoin(table.user, eq(table.recipe.authorId, table.user.id))
			.leftJoin(table.cuisine, eq(table.recipe.cuisineId, table.cuisine.id))
			.where(
				and(
					eq(table.cuisine.slug, slug),
					eq(table.recipe.isPublished, true)
				)
			)
			.orderBy(desc(table.recipe.createdAt))
			.limit(50);

		// Transform data to match Card component expectations
		posts = recipes.map((r) => ({
			title: r.title,
			slug: r.slug,
			description: r.description || '',
			image: r.featuredImage || '/images/recipes/placeholder.jpg',
			cookTime: r.cookTime,
			category: cuisineNames[slug],
			difficulty: r.difficulty,
			author: {
				name: r.authorUsername || 'Unknown Chef',
				avatar: r.authorProfileImage || '/images/users/default-avatar.jpg'
			},
			rating: r.averageRating || 0
		}));

		console.log(`[Category Page] Cuisine "${slug}": Found ${posts.length} recipes`);
	} else {
		// It might be a meal-type category (breakfast, desserts, etc.)
		// Look it up in the category table
		const [categoryData] = await db
			.select({
				id: table.category.id,
				name: table.category.name,
				slug: table.category.slug
			})
			.from(table.category)
			.where(eq(table.category.slug, slug))
			.limit(1);

		if (categoryData) {
			category = {
				slug: categoryData.slug,
				name: categoryData.name,
				type: 'category'
			};

			const recipes = await db
				.select({
					id: table.recipe.id,
					title: table.recipe.title,
					slug: table.recipe.slug,
					description: table.recipe.description,
					featuredImage: table.recipe.featuredImage,
					prepTime: table.recipe.prepTime,
					cookTime: table.recipe.cookTime,
					servings: table.recipe.servings,
					difficulty: table.recipe.difficulty,
					likesCount: table.recipe.likesCount,
					averageRating: table.recipe.averageRating,
					createdAt: table.recipe.createdAt,
					// Author info
					authorId: table.user.id,
					authorUsername: table.user.username,
					authorProfileImage: table.user.profileImage
				})
				.from(table.recipe)
				.leftJoin(table.user, eq(table.recipe.authorId, table.user.id))
				.leftJoin(table.cuisine, eq(table.recipe.cuisineId, table.cuisine.id))
				.where(
					and(
						eq(table.recipe.categoryId, categoryData.id),
						eq(table.recipe.isPublished, true)
					)
				)
				.orderBy(desc(table.recipe.createdAt))
				.limit(50);

			// Transform data to match Card component expectations
			posts = recipes.map((r) => ({
				title: r.title,
				slug: r.slug,
				description: r.description || '',
				image: r.featuredImage || '/images/recipes/placeholder.jpg',
				cookTime: r.cookTime,
				category: categoryData.name,
				difficulty: r.difficulty,
				author: {
					name: r.authorUsername || 'Unknown Chef',
					avatar: r.authorProfileImage || '/images/users/default-avatar.jpg'
				},
				rating: r.averageRating || 0
			}));

			console.log(`[Category Page] Category "${slug}": Found ${posts.length} recipes`);
		} else {
			// Category not found - return empty
			category = {
				slug,
				name: slug.charAt(0).toUpperCase() + slug.slice(1),
				type: 'unknown'
			};
			posts = [];
		}
	}

	return {
		category,
		posts
	};
};
