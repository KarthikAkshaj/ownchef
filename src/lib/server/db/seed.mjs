// src/lib/server/db/seed.mjs
import { db } from './index.ts';
import * as table from './schema.ts';
import { hash } from '@node-rs/argon2';

async function seed() {
	console.log('🌱 Seeding database...\n');

	// Seed cuisines
	const cuisines = [
		{ name: 'Indian', slug: 'indian', sortOrder: 1, isActive: true },
		{ name: 'Chinese', slug: 'chinese', sortOrder: 2, isActive: true },
		{ name: 'Italian', slug: 'italian', sortOrder: 3, isActive: true },
		{ name: 'Spanish', slug: 'spanish', sortOrder: 4, isActive: true },
		{ name: 'Thai', slug: 'thai', sortOrder: 5, isActive: true },
		{ name: 'Japanese', slug: 'japanese', sortOrder: 6, isActive: true },
		{ name: 'Mexican', slug: 'mexican', sortOrder: 7, isActive: true },
		{ name: 'French', slug: 'french', sortOrder: 8, isActive: true },
		{ name: 'Korean', slug: 'korean', sortOrder: 9, isActive: true },
		{ name: 'Vietnamese', slug: 'vietnamese', sortOrder: 10, isActive: true },
		{ name: 'Mediterranean', slug: 'mediterranean', sortOrder: 11, isActive: true },
		{ name: 'American', slug: 'american', sortOrder: 12, isActive: true },
		{ name: 'Middle Eastern', slug: 'middle-eastern', sortOrder: 13, isActive: true }
	];

	console.log('📍 Seeding cuisines...');
	for (const cuisine of cuisines) {
		try {
			await db.insert(table.cuisine).values(cuisine).onConflictDoNothing();
			console.log(`  ✓ ${cuisine.name}`);
		} catch (error) {
			console.error(`  ✗ Failed to create ${cuisine.name}:`, error);
		}
	}

	// Seed categories
	const categories = [
		{ name: 'Appetizers', slug: 'appetizers', sortOrder: 1, isActive: true },
		{ name: 'Main Course', slug: 'main-course', sortOrder: 2, isActive: true },
		{ name: 'Desserts', slug: 'desserts', sortOrder: 3, isActive: true },
		{ name: 'Breakfast', slug: 'breakfast', sortOrder: 4, isActive: true },
		{ name: 'Lunch', slug: 'lunch', sortOrder: 5, isActive: true },
		{ name: 'Dinner', slug: 'dinner', sortOrder: 6, isActive: true },
		{ name: 'Snacks', slug: 'snacks', sortOrder: 7, isActive: true },
		{ name: 'Beverages', slug: 'beverages', sortOrder: 8, isActive: true },
		{ name: 'Salads', slug: 'salads', sortOrder: 9, isActive: true },
		{ name: 'Soups', slug: 'soups', sortOrder: 10, isActive: true },
		{ name: 'Side Dishes', slug: 'side-dishes', sortOrder: 11, isActive: true },
		{ name: 'Breads', slug: 'breads', sortOrder: 12, isActive: true }
	];

	console.log('\n📍 Seeding categories...');
	for (const category of categories) {
		try {
			await db.insert(table.category).values(category).onConflictDoNothing();
			console.log(`  ✓ ${category.name}`);
		} catch (error) {
			console.error(`  ✗ Failed to create ${category.name}:`, error);
		}
	}

	// Seed test user
	console.log('\n👤 Seeding test user...');
	const passwordHash = await hash('password123', {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	const testUserId = 'test-user-1';
	try {
		await db.insert(table.user).values({
			id: testUserId,
			username: 'chef_yuki',
			passwordHash,
			email: 'yuki@example.com',
			firstName: 'Yuki',
			lastName: 'Sakai',
			bio: 'Professional chef with over 10 years of experience in Japanese and fusion cuisine. Passionate about sharing authentic family recipes and teaching cooking techniques.',
			location: 'Tokyo, Japan',
			website: 'https://yukiskitchen.com',
			profileImage: '/images/users/chef-yuki.jpg'
		}).onConflictDoNothing();
		console.log('  ✓ Test user created: chef_yuki');
	} catch (error) {
		console.error('  ✗ Failed to create test user:', error);
	}

	// Seed test recipes
	console.log('\n🍳 Seeding test recipes...');
	const recipes = [
		{
			title: 'Classic Butter Chicken',
			slug: 'classic-butter-chicken',
			description: 'A rich and creamy tomato-based curry with tender chicken pieces marinated in yogurt and spices.',
			authorId: testUserId,
			categoryId: 2, // Main Course
			cuisineId: 1, // Indian
			prepTime: 30,
			cookTime: 45,
			totalTime: 75,
			servings: 4,
			difficulty: 'Medium',
			dietaryType: 'non-vegetarian',
			featuredImage: '/images/recipes/butter-chicken.jpg',
			isPublished: true,
			isDraft: false,
			averageRating: 480, // 4.8 * 100
			likesCount: 124,
			ratingsCount: 43
		},
		{
			title: 'Palak Paneer',
			slug: 'palak-paneer',
			description: 'Creamy spinach curry with soft paneer cheese cubes, flavored with garlic, ginger, and aromatic spices.',
			authorId: testUserId,
			categoryId: 2, // Main Course
			cuisineId: 1, // Indian
			prepTime: 20,
			cookTime: 35,
			totalTime: 55,
			servings: 4,
			difficulty: 'Easy',
			dietaryType: 'vegetarian',
			featuredImage: '/images/recipes/palak-paneer.jpg',
			isPublished: true,
			isDraft: false,
			averageRating: 470, // 4.7 * 100
			likesCount: 98,
			ratingsCount: 35
		},
		{
			title: 'Chicken Biryani',
			slug: 'chicken-biryani',
			description: 'Fragrant basmati rice cooked with tender chicken pieces, saffron, and a blend of traditional spices.',
			authorId: testUserId,
			categoryId: 2, // Main Course
			cuisineId: 1, // Indian
			prepTime: 40,
			cookTime: 60,
			totalTime: 100,
			servings: 6,
			difficulty: 'Medium',
			dietaryType: 'non-vegetarian',
			featuredImage: '/images/recipes/biriyani.jpg',
			isPublished: true,
			isDraft: false,
			averageRating: 490, // 4.9 * 100
			likesCount: 156,
			ratingsCount: 52
		}
	];

	for (const recipe of recipes) {
		try {
			await db.insert(table.recipe).values(recipe).onConflictDoNothing();
			console.log(`  ✓ ${recipe.title}`);
		} catch (error) {
			console.error(`  ✗ Failed to create ${recipe.title}:`, error);
		}
	}

	console.log('\n✅ Seeding complete!\n');
	console.log('Test credentials:');
	console.log('  Username: chef_yuki');
	console.log('  Password: password123');
	console.log('  Profile URL: /profile/chef_yuki\n');
	process.exit(0);
}

seed().catch((error) => {
	console.error('❌ Seeding failed:', error);
	process.exit(1);
});
