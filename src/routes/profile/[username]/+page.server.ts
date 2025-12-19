// src/routes/profile/[username]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user, recipe, recipeLike } from '$lib/server/db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { username } = params;

	// Fetch user profile
	const userProfile = await db
		.select({
			id: user.id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			bio: user.bio,
			profileImage: user.profileImage,
			location: user.location,
			website: user.website,
			createdAt: user.createdAt
		})
		.from(user)
		.where(eq(user.username, username))
		.limit(1);

	if (!userProfile || userProfile.length === 0) {
		throw error(404, 'User not found');
	}

	const profile = userProfile[0];

	// Get user's recipe count
	const recipeCountResult = await db
		.select({ count: count() })
		.from(recipe)
		.where(eq(recipe.authorId, profile.id));

	const recipeCount = recipeCountResult[0]?.count || 0;

	// Get user's total likes count (sum of likes on all their recipes)
	const likesCountResult = await db
		.select({ total: sql<number>`COALESCE(SUM(${recipe.likesCount}), 0)` })
		.from(recipe)
		.where(eq(recipe.authorId, profile.id));

	const totalLikes = Number(likesCountResult[0]?.total || 0);

	// Fetch user's published recipes with category and cuisine info
	const userRecipes = await db
		.select({
			id: recipe.id,
			title: recipe.title,
			slug: recipe.slug,
			description: recipe.description,
			featuredImage: recipe.featuredImage,
			prepTime: recipe.prepTime,
			cookTime: recipe.cookTime,
			difficulty: recipe.difficulty,
			averageRating: recipe.averageRating,
			likesCount: recipe.likesCount,
			categoryId: recipe.categoryId,
			cuisineId: recipe.cuisineId
		})
		.from(recipe)
		.where(eq(recipe.authorId, profile.id))
		.orderBy(desc(recipe.createdAt))
		.limit(20);

	// For now, we'll return empty arrays for saved and liked recipes
	// These would require additional queries when those features are implemented
	const savedRecipes: any[] = [];
	const likedRecipes: any[] = [];

	// Check if viewing own profile (if user is logged in)
	const isOwnProfile = locals.user ? locals.user.id === profile.id : false;

	// Format the profile data to match the component's expected structure
	return {
		profile: {
			id: profile.id,
			username: profile.username,
			name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username,
			avatar: profile.profileImage || '/images/default-avatar.jpg',
			bio: profile.bio || '',
			location: profile.location || '',
			joined: profile.createdAt?.toISOString() || '',
			website: profile.website || '',
			social: {
				instagram: '',
				youtube: '',
				tiktok: ''
			},
			stats: {
				followers: 0, // TODO: Implement followers feature
				following: 0, // TODO: Implement following feature
				recipes: Number(recipeCount),
				likes: totalLikes
			},
			isFollowing: false, // TODO: Implement following feature
			isOwnProfile,
			verified: false // TODO: Implement verification feature
		},
		recipes: userRecipes.map((r) => ({
			id: r.slug,
			slug: r.slug, // Add slug property for Card component link
			title: r.title,
			description: r.description,
			image: r.featuredImage || '/images/default-recipe.jpg',
			cookTime: r.cookTime,
			category: 'Recipe', // TODO: Fetch actual category name
			difficulty: r.difficulty,
			author: {
				name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username,
				avatar: profile.profileImage || '/images/default-avatar.jpg'
			},
			rating: r.averageRating ? r.averageRating / 100 : 0 // Convert from integer (x100) to decimal
		})),
		savedRecipes,
		likedRecipes
	};
};
