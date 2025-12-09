import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, desc, lte, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Define filter configurations
	const filterConfig: Record<string, {
		name: string;
		description: string;
		filterFn: () => any;
	}> = {
		'quick': {
			name: 'Quick & Easy',
			description: 'Ready in 30 minutes or less',
			filterFn: () => lte(table.recipe.totalTime, 30)
		},
		'vegetarian': {
			name: 'Vegetarian',
			description: 'Plant-based delights',
			filterFn: () => eq(table.recipe.dietaryType, 'vegetarian')
		},
		'vegan': {
			name: 'Vegan',
			description: 'Completely plant-based',
			filterFn: () => eq(table.recipe.dietaryType, 'vegan')
		},
		'non-veg': {
			name: 'Non-Vegetarian',
			description: 'Recipes with meat, poultry, or seafood',
			filterFn: () => eq(table.recipe.dietaryType, 'non-vegetarian')
		},
		'breakfast': {
			name: 'Breakfast',
			description: 'Start your day right',
			filterFn: async () => {
				// Find the breakfast category ID
				const [breakfastCat] = await db
					.select({ id: table.category.id })
					.from(table.category)
					.where(eq(table.category.slug, 'breakfast'))
					.limit(1);

				return breakfastCat ? eq(table.recipe.categoryId, breakfastCat.id) : sql`1=0`;
			}
		},
		'desserts': {
			name: 'Desserts',
			description: 'Sweet treats & bakes',
			filterFn: async () => {
				const [dessertCat] = await db
					.select({ id: table.category.id })
					.from(table.category)
					.where(eq(table.category.slug, 'desserts'))
					.limit(1);

				return dessertCat ? eq(table.recipe.categoryId, dessertCat.id) : sql`1=0`;
			}
		},
		'healthy': {
			name: 'Healthy',
			description: 'Nutritious & delicious',
			filterFn: () => {
				// For now, return all recipes
				// Later you might filter by tags or nutritional info
				return sql`1=1`;
			}
		},
		'party': {
			name: 'Party Food',
			description: 'Crowd-pleasing favorites',
			filterFn: () => {
				// Filter by servings > 6 for party food
				return sql`${table.recipe.servings} >= 6`;
			}
		}
	};

	const config = filterConfig[slug];

	if (!config) {
		// If filter doesn't exist, return empty
		return {
			filter: {
				slug,
				name: slug.charAt(0).toUpperCase() + slug.slice(1),
				description: ''
			},
			posts: []
		};
	}

	const filter = {
		slug,
		name: config.name,
		description: config.description
	};

	// Get the filter condition (might be async for category lookups)
	const filterCondition = await config.filterFn();

	// Fetch published recipes matching the filter
	const posts = await db
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
			author: {
				id: table.user.id,
				username: table.user.username,
				profileImage: table.user.profileImage
			}
		})
		.from(table.recipe)
		.leftJoin(table.user, eq(table.recipe.authorId, table.user.id))
		.where(
			and(
				filterCondition,
				eq(table.recipe.isPublished, true)
			)
		)
		.orderBy(desc(table.recipe.createdAt))
		.limit(50);

	return {
		filter,
		posts
	};
};
