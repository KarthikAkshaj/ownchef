// src/lib/server/db/seed.mjs
import { db, closeConnection } from './seed-db.mjs';
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

	// Seed test recipes with ingredients, instructions, and tips
	console.log('\n🍳 Seeding test recipes...');

	// Recipe 1: Classic Butter Chicken
	try {
		const [butterChicken] = await db.insert(table.recipe).values({
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
			averageRating: 480,
			likesCount: 124,
			ratingsCount: 43
		}).returning({ id: table.recipe.id }).onConflictDoNothing();

		if (butterChicken) {
			// Ingredients for Butter Chicken
			await db.insert(table.recipeIngredient).values([
				{ recipeId: butterChicken.id, groupName: 'For Marinade', groupOrder: 0, name: 'chicken thighs', amount: '500', unit: 'g', preparation: 'cut into pieces', itemOrder: 0 },
				{ recipeId: butterChicken.id, groupName: 'For Marinade', groupOrder: 0, name: 'yogurt', amount: '1/2', unit: 'cup', itemOrder: 1 },
				{ recipeId: butterChicken.id, groupName: 'For Marinade', groupOrder: 0, name: 'lemon juice', amount: '2', unit: 'tbsp', itemOrder: 2 },
				{ recipeId: butterChicken.id, groupName: 'For Marinade', groupOrder: 0, name: 'ginger-garlic paste', amount: '1', unit: 'tbsp', itemOrder: 3 },
				{ recipeId: butterChicken.id, groupName: 'For Curry', groupOrder: 1, name: 'butter', amount: '4', unit: 'tbsp', itemOrder: 0 },
				{ recipeId: butterChicken.id, groupName: 'For Curry', groupOrder: 1, name: 'onions', amount: '2', unit: 'medium', preparation: 'finely chopped', itemOrder: 1 },
				{ recipeId: butterChicken.id, groupName: 'For Curry', groupOrder: 1, name: 'tomato puree', amount: '2', unit: 'cups', itemOrder: 2 },
				{ recipeId: butterChicken.id, groupName: 'For Curry', groupOrder: 1, name: 'heavy cream', amount: '1/2', unit: 'cup', itemOrder: 3 },
				{ recipeId: butterChicken.id, groupName: 'For Curry', groupOrder: 1, name: 'garam masala', amount: '1', unit: 'tsp', itemOrder: 4 }
			]);

			// Instructions for Butter Chicken
			await db.insert(table.recipeInstruction).values([
				{ recipeId: butterChicken.id, stepNumber: 1, title: 'Marinate the Chicken', content: 'Mix chicken with yogurt, lemon juice, and ginger-garlic paste. Refrigerate for at least 2 hours or overnight.' },
				{ recipeId: butterChicken.id, stepNumber: 2, title: 'Cook the Chicken', content: 'Grill or pan-fry the marinated chicken until cooked through and slightly charred.' },
				{ recipeId: butterChicken.id, stepNumber: 3, title: 'Prepare the Curry', content: 'In a large pan, melt butter and sauté onions until golden. Add tomato puree and cook for 10 minutes.' },
				{ recipeId: butterChicken.id, stepNumber: 4, title: 'Combine and Simmer', content: 'Add the cooked chicken, cream, and garam masala. Simmer for 10 minutes until the sauce thickens.' },
				{ recipeId: butterChicken.id, stepNumber: 5, title: 'Serve', content: 'Garnish with fresh cilantro and serve hot with naan or rice.' }
			]);

			// Tips for Butter Chicken
			await db.insert(table.recipeTip).values([
				{ recipeId: butterChicken.id, content: 'Marinate the chicken overnight for maximum flavor', category: 'chef_tip', sortOrder: 0 },
				{ recipeId: butterChicken.id, content: 'Use Kashmiri chili powder for authentic color without too much heat', category: 'substitution', sortOrder: 1 },
				{ recipeId: butterChicken.id, content: 'Store leftovers in an airtight container for up to 3 days', category: 'storage', sortOrder: 2 }
			]);

			console.log('  ✓ Classic Butter Chicken (with ingredients, instructions, and tips)');
		}
	} catch (error) {
		console.error('  ✗ Failed to create Butter Chicken:', error);
	}

	// Recipe 2: Palak Paneer
	try {
		const [palakPaneer] = await db.insert(table.recipe).values({
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
			averageRating: 470,
			likesCount: 98,
			ratingsCount: 35
		}).returning({ id: table.recipe.id }).onConflictDoNothing();

		if (palakPaneer) {
			// Ingredients for Palak Paneer
			await db.insert(table.recipeIngredient).values([
				{ recipeId: palakPaneer.id, groupName: 'Main Ingredients', groupOrder: 0, name: 'spinach', amount: '500', unit: 'g', preparation: 'washed and chopped', itemOrder: 0 },
				{ recipeId: palakPaneer.id, groupName: 'Main Ingredients', groupOrder: 0, name: 'paneer', amount: '250', unit: 'g', preparation: 'cubed', itemOrder: 1 },
				{ recipeId: palakPaneer.id, groupName: 'Main Ingredients', groupOrder: 0, name: 'onions', amount: '2', unit: 'medium', preparation: 'finely chopped', itemOrder: 2 },
				{ recipeId: palakPaneer.id, groupName: 'Main Ingredients', groupOrder: 0, name: 'tomatoes', amount: '2', unit: 'medium', preparation: 'chopped', itemOrder: 3 },
				{ recipeId: palakPaneer.id, groupName: 'Spices', groupOrder: 1, name: 'ginger-garlic paste', amount: '1', unit: 'tbsp', itemOrder: 0 },
				{ recipeId: palakPaneer.id, groupName: 'Spices', groupOrder: 1, name: 'cumin seeds', amount: '1', unit: 'tsp', itemOrder: 1 },
				{ recipeId: palakPaneer.id, groupName: 'Spices', groupOrder: 1, name: 'garam masala', amount: '1', unit: 'tsp', itemOrder: 2 },
				{ recipeId: palakPaneer.id, groupName: 'Spices', groupOrder: 1, name: 'heavy cream', amount: '1/4', unit: 'cup', itemOrder: 3 }
			]);

			// Instructions for Palak Paneer
			await db.insert(table.recipeInstruction).values([
				{ recipeId: palakPaneer.id, stepNumber: 1, title: 'Blanch the Spinach', content: 'Boil spinach in salted water for 2 minutes. Drain and plunge into ice water. Blend into a smooth puree.' },
				{ recipeId: palakPaneer.id, stepNumber: 2, title: 'Prepare the Base', content: 'Heat oil and add cumin seeds. Sauté onions until golden, then add ginger-garlic paste and tomatoes.' },
				{ recipeId: palakPaneer.id, stepNumber: 3, title: 'Add Spinach Puree', content: 'Add the spinach puree and cook for 5 minutes. Season with salt and garam masala.' },
				{ recipeId: palakPaneer.id, stepNumber: 4, title: 'Add Paneer', content: 'Gently add paneer cubes and cream. Simmer for 5 minutes until heated through.' },
				{ recipeId: palakPaneer.id, stepNumber: 5, title: 'Serve', content: 'Garnish with a swirl of cream and serve hot with naan or rice.' }
			]);

			// Tips for Palak Paneer
			await db.insert(table.recipeTip).values([
				{ recipeId: palakPaneer.id, content: 'Blanch spinach quickly to retain bright green color', category: 'chef_tip', sortOrder: 0 },
				{ recipeId: palakPaneer.id, content: 'You can substitute paneer with tofu for a vegan version', category: 'substitution', sortOrder: 1 },
				{ recipeId: palakPaneer.id, content: 'Add paneer at the end to prevent it from becoming hard', category: 'timing', sortOrder: 2 }
			]);

			console.log('  ✓ Palak Paneer (with ingredients, instructions, and tips)');
		}
	} catch (error) {
		console.error('  ✗ Failed to create Palak Paneer:', error);
	}

	// Recipe 3: Chicken Biryani
	try {
		const [chickenBiryani] = await db.insert(table.recipe).values({
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
			averageRating: 490,
			likesCount: 156,
			ratingsCount: 52
		}).returning({ id: table.recipe.id }).onConflictDoNothing();

		if (chickenBiryani) {
			// Ingredients for Chicken Biryani
			await db.insert(table.recipeIngredient).values([
				{ recipeId: chickenBiryani.id, groupName: 'For Rice', groupOrder: 0, name: 'basmati rice', amount: '2', unit: 'cups', preparation: 'soaked for 30 minutes', itemOrder: 0 },
				{ recipeId: chickenBiryani.id, groupName: 'For Rice', groupOrder: 0, name: 'whole spices', amount: '1', unit: 'tbsp', notes: 'cinnamon, cardamom, cloves', itemOrder: 1 },
				{ recipeId: chickenBiryani.id, groupName: 'For Chicken', groupOrder: 1, name: 'chicken', amount: '750', unit: 'g', preparation: 'cut into pieces', itemOrder: 0 },
				{ recipeId: chickenBiryani.id, groupName: 'For Chicken', groupOrder: 1, name: 'yogurt', amount: '1', unit: 'cup', itemOrder: 1 },
				{ recipeId: chickenBiryani.id, groupName: 'For Chicken', groupOrder: 1, name: 'onions', amount: '3', unit: 'large', preparation: 'thinly sliced', itemOrder: 2 },
				{ recipeId: chickenBiryani.id, groupName: 'For Chicken', groupOrder: 1, name: 'ginger-garlic paste', amount: '2', unit: 'tbsp', itemOrder: 3 },
				{ recipeId: chickenBiryani.id, groupName: 'For Layering', groupOrder: 2, name: 'saffron', amount: '1', unit: 'pinch', preparation: 'soaked in milk', itemOrder: 0 },
				{ recipeId: chickenBiryani.id, groupName: 'For Layering', groupOrder: 2, name: 'fried onions', amount: '1/2', unit: 'cup', itemOrder: 1 },
				{ recipeId: chickenBiryani.id, groupName: 'For Layering', groupOrder: 2, name: 'fresh mint', amount: '1/4', unit: 'cup', preparation: 'chopped', itemOrder: 2 }
			]);

			// Instructions for Chicken Biryani
			await db.insert(table.recipeInstruction).values([
				{ recipeId: chickenBiryani.id, stepNumber: 1, title: 'Marinate the Chicken', content: 'Mix chicken with yogurt, ginger-garlic paste, and spices. Marinate for at least 1 hour.' },
				{ recipeId: chickenBiryani.id, stepNumber: 2, title: 'Cook the Rice', content: 'Boil rice with whole spices until 70% cooked. Drain and set aside.' },
				{ recipeId: chickenBiryani.id, stepNumber: 3, title: 'Prepare the Chicken', content: 'In a heavy-bottomed pot, layer fried onions, chicken, and partially cooked rice.' },
				{ recipeId: chickenBiryani.id, stepNumber: 4, title: 'Layer and Dum', content: 'Sprinkle saffron milk, mint, and fried onions. Cover tightly and cook on low heat for 30 minutes.' },
				{ recipeId: chickenBiryani.id, stepNumber: 5, title: 'Serve', content: 'Gently mix the biryani and serve hot with raita and salad.' }
			]);

			// Tips for Chicken Biryani
			await db.insert(table.recipeTip).values([
				{ recipeId: chickenBiryani.id, content: 'Soak basmati rice for 30 minutes for longer, fluffier grains', category: 'chef_tip', sortOrder: 0 },
				{ recipeId: chickenBiryani.id, content: 'The dum (steaming) step is crucial - don\'t skip it', category: 'timing', sortOrder: 1 },
				{ recipeId: chickenBiryani.id, content: 'Use a heavy-bottomed pot with a tight-fitting lid', category: 'chef_tip', sortOrder: 2 }
			]);

			console.log('  ✓ Chicken Biryani (with ingredients, instructions, and tips)');
		}
	} catch (error) {
		console.error('  ✗ Failed to create Chicken Biryani:', error);
	}

	console.log('\n✅ Seeding complete!\n');
	console.log('Test credentials:');
	console.log('  Username: chef_yuki');
	console.log('  Password: password123');
	console.log('  Profile URL: /profile/chef_yuki\n');

	await closeConnection();
	process.exit(0);
}

seed().catch(async (error) => {
	console.error('❌ Seeding failed:', error);
	await closeConnection();
	process.exit(1);
});
