// seed.mjs - Standalone seed script
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from '@node-rs/argon2';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
	const [key, ...valueParts] = line.split('=');
	if (key && valueParts.length) {
		const value = valueParts.join('=').replace(/^"(.*)"$/, '$1');
		process.env[key.trim()] = value.trim();
	}
});

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

// Create database connection
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

// Import schema
import { user, recipe, category, cuisine, recipeIngredient, recipeInstruction, recipeTip, tag, recipeTag } from './src/lib/server/db/schema.ts';
import { eq } from 'drizzle-orm';

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
	for (const cuisineData of cuisines) {
		try {
			await db.insert(cuisine).values(cuisineData).onConflictDoNothing();
			console.log(`  ✓ ${cuisineData.name}`);
		} catch (error) {
			console.error(`  ✗ Failed to create ${cuisineData.name}:`, error);
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
	for (const cat of categories) {
		try {
			await db.insert(category).values(cat).onConflictDoNothing();
			console.log(`  ✓ ${cat.name}`);
		} catch (error) {
			console.error(`  ✗ Failed to create ${cat.name}:`, error);
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
		await db.insert(user).values({
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

	// Seed tags first
	console.log('\n🏷️  Seeding tags...');
	const tags = [
		{ name: 'Spicy', slug: 'spicy', color: '#FF5733' },
		{ name: 'Comfort Food', slug: 'comfort-food', color: '#FFA500' },
		{ name: 'Indian', slug: 'indian', color: '#FF6B35' },
		{ name: 'Curry', slug: 'curry', color: '#FFD700' },
		{ name: 'Vegetarian', slug: 'vegetarian', color: '#4CAF50' },
		{ name: 'Healthy', slug: 'healthy', color: '#8BC34A' },
		{ name: 'Rice Dish', slug: 'rice-dish', color: '#795548' },
		{ name: 'Festive', slug: 'festive', color: '#FF4081' }
	];

	// Insert tags without conflict handling
	for (const tagData of tags) {
		try {
			await db.insert(tag).values(tagData).onConflictDoNothing();
			console.log(`  ✓ ${tagData.name}`);
		} catch (error) {
			console.error(`  ✗ Failed to create tag ${tagData.name}:`, error);
		}
	}

	// Fetch all tag IDs after insertion
	const tagIds = {};
	for (const tagData of tags) {
		try {
			const existingTags = await db.select().from(tag).where(eq(tag.slug, tagData.slug)).limit(1);
			if (existingTags.length > 0) {
				tagIds[tagData.slug] = existingTags[0].id;
			}
		} catch (error) {
			console.error(`  ✗ Failed to fetch tag ${tagData.name}:`, error);
		}
	}

	// Seed test recipes with full details
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
			averageRating: 480,
			likesCount: 124,
			ratingsCount: 43,
			// Nutrition per serving (approximate)
			nutritionCalories: 420,
			nutritionProtein: 28,
			nutritionCarbs: 12,
			nutritionFat: 32,
			nutritionFiber: 3,
			nutritionSugar: 8
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
			averageRating: 470,
			likesCount: 98,
			ratingsCount: 35,
			// Nutrition per serving (approximate)
			nutritionCalories: 280,
			nutritionProtein: 12,
			nutritionCarbs: 15,
			nutritionFat: 20,
			nutritionFiber: 5,
			nutritionSugar: 4
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
			averageRating: 490,
			likesCount: 156,
			ratingsCount: 52,
			// Nutrition per serving (approximate)
			nutritionCalories: 485,
			nutritionProtein: 24,
			nutritionCarbs: 58,
			nutritionFat: 16,
			nutritionFiber: 2,
			nutritionSugar: 3
		}
	];

	const recipeIds = {};
	for (const recipeData of recipes) {
		try {
			const [insertedRecipe] = await db.insert(recipe).values(recipeData).returning({ id: recipe.id });
			recipeIds[recipeData.slug] = insertedRecipe.id;
			console.log(`  ✓ ${recipeData.title}`);
		} catch (error) {
			console.error(`  ✗ Failed to create ${recipeData.title}:`, error);
		}
	}

	// Seed ingredients for Butter Chicken
	console.log('\n🥘 Seeding ingredients...');
	const butterChickenId = recipeIds['classic-butter-chicken'];
	if (butterChickenId) {
		const butterChickenIngredients = [
			// Marinade
			{ recipeId: butterChickenId, groupName: 'For the Marinade', groupOrder: 1, itemOrder: 1, name: 'boneless chicken thighs', amount: '1.5', unit: 'lbs', preparation: 'cut into bite-sized pieces' },
			{ recipeId: butterChickenId, groupName: 'For the Marinade', groupOrder: 1, itemOrder: 2, name: 'plain yogurt', amount: '1/2', unit: 'cup', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Marinade', groupOrder: 1, itemOrder: 3, name: 'lemon juice', amount: '2', unit: 'tbsp', preparation: 'freshly squeezed' },
			{ recipeId: butterChickenId, groupName: 'For the Marinade', groupOrder: 1, itemOrder: 4, name: 'ginger-garlic paste', amount: '1', unit: 'tbsp', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Marinade', groupOrder: 1, itemOrder: 5, name: 'garam masala', amount: '1', unit: 'tsp', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Marinade', groupOrder: 1, itemOrder: 6, name: 'turmeric powder', amount: '1/2', unit: 'tsp', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Marinade', groupOrder: 1, itemOrder: 7, name: 'salt', amount: '1', unit: 'tsp', preparation: '' },
			// Sauce
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 1, name: 'butter', amount: '4', unit: 'tbsp', preparation: 'divided' },
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 2, name: 'onion', amount: '1', unit: 'large', preparation: 'finely chopped' },
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 3, name: 'ginger-garlic paste', amount: '1', unit: 'tbsp', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 4, name: 'tomato puree', amount: '1.5', unit: 'cups', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 5, name: 'heavy cream', amount: '1', unit: 'cup', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 6, name: 'kashmiri red chili powder', amount: '1', unit: 'tsp', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 7, name: 'garam masala', amount: '1', unit: 'tsp', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 8, name: 'honey', amount: '1', unit: 'tbsp', preparation: '' },
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 9, name: 'kasuri methi', amount: '1', unit: 'tsp', preparation: 'dried fenugreek leaves, crushed' },
			{ recipeId: butterChickenId, groupName: 'For the Sauce', groupOrder: 2, itemOrder: 10, name: 'fresh cilantro', amount: '2', unit: 'tbsp', preparation: 'chopped for garnish' }
		];

		for (const ing of butterChickenIngredients) {
			await db.insert(recipeIngredient).values(ing).onConflictDoNothing();
		}
		console.log('  ✓ Butter Chicken ingredients');
	}

	// Seed ingredients for Palak Paneer
	const palakPaneerId = recipeIds['palak-paneer'];
	if (palakPaneerId) {
		const palakPaneerIngredients = [
			{ recipeId: palakPaneerId, groupName: 'Main Ingredients', groupOrder: 1, itemOrder: 1, name: 'fresh spinach', amount: '1', unit: 'lb', preparation: 'washed and chopped' },
			{ recipeId: palakPaneerId, groupName: 'Main Ingredients', groupOrder: 1, itemOrder: 2, name: 'paneer', amount: '200', unit: 'g', preparation: 'cubed' },
			{ recipeId: palakPaneerId, groupName: 'Main Ingredients', groupOrder: 1, itemOrder: 3, name: 'onion', amount: '1', unit: 'large', preparation: 'finely chopped' },
			{ recipeId: palakPaneerId, groupName: 'Main Ingredients', groupOrder: 1, itemOrder: 4, name: 'tomato', amount: '2', unit: 'medium', preparation: 'pureed' },
			{ recipeId: palakPaneerId, groupName: 'Main Ingredients', groupOrder: 1, itemOrder: 5, name: 'ginger', amount: '1', unit: 'inch', preparation: 'grated' },
			{ recipeId: palakPaneerId, groupName: 'Main Ingredients', groupOrder: 1, itemOrder: 6, name: 'garlic cloves', amount: '4', unit: '', preparation: 'minced' },
			{ recipeId: palakPaneerId, groupName: 'Main Ingredients', groupOrder: 1, itemOrder: 7, name: 'green chilies', amount: '2', unit: '', preparation: 'slit' },
			{ recipeId: palakPaneerId, groupName: 'Main Ingredients', groupOrder: 1, itemOrder: 8, name: 'heavy cream', amount: '1/4', unit: 'cup', preparation: '' },
			// Spices
			{ recipeId: palakPaneerId, groupName: 'Spices', groupOrder: 2, itemOrder: 1, name: 'cumin seeds', amount: '1', unit: 'tsp', preparation: '' },
			{ recipeId: palakPaneerId, groupName: 'Spices', groupOrder: 2, itemOrder: 2, name: 'turmeric powder', amount: '1/2', unit: 'tsp', preparation: '' },
			{ recipeId: palakPaneerId, groupName: 'Spices', groupOrder: 2, itemOrder: 3, name: 'coriander powder', amount: '1', unit: 'tsp', preparation: '' },
			{ recipeId: palakPaneerId, groupName: 'Spices', groupOrder: 2, itemOrder: 4, name: 'garam masala', amount: '1/2', unit: 'tsp', preparation: '' },
			{ recipeId: palakPaneerId, groupName: 'Spices', groupOrder: 2, itemOrder: 5, name: 'salt', amount: '1', unit: 'tsp', preparation: 'to taste' },
			{ recipeId: palakPaneerId, groupName: 'Spices', groupOrder: 2, itemOrder: 6, name: 'vegetable oil', amount: '2', unit: 'tbsp', preparation: '' }
		];

		for (const ing of palakPaneerIngredients) {
			await db.insert(recipeIngredient).values(ing).onConflictDoNothing();
		}
		console.log('  ✓ Palak Paneer ingredients');
	}

	// Seed ingredients for Chicken Biryani
	const biryaniId = recipeIds['chicken-biryani'];
	if (biryaniId) {
		const biryaniIngredients = [
			// Rice
			{ recipeId: biryaniId, groupName: 'For the Rice', groupOrder: 1, itemOrder: 1, name: 'basmati rice', amount: '2', unit: 'cups', preparation: 'soaked for 30 minutes' },
			{ recipeId: biryaniId, groupName: 'For the Rice', groupOrder: 1, itemOrder: 2, name: 'bay leaves', amount: '2', unit: '', preparation: '' },
			{ recipeId: biryaniId, groupName: 'For the Rice', groupOrder: 1, itemOrder: 3, name: 'cinnamon stick', amount: '1', unit: 'inch', preparation: '' },
			{ recipeId: biryaniId, groupName: 'For the Rice', groupOrder: 1, itemOrder: 4, name: 'green cardamom', amount: '3', unit: 'pods', preparation: '' },
			{ recipeId: biryaniId, groupName: 'For the Rice', groupOrder: 1, itemOrder: 5, name: 'salt', amount: '2', unit: 'tsp', preparation: '' },
			// Chicken Marinade
			{ recipeId: biryaniId, groupName: 'For the Chicken', groupOrder: 2, itemOrder: 1, name: 'chicken', amount: '1.5', unit: 'lbs', preparation: 'cut into pieces' },
			{ recipeId: biryaniId, groupName: 'For the Chicken', groupOrder: 2, itemOrder: 2, name: 'plain yogurt', amount: '1', unit: 'cup', preparation: '' },
			{ recipeId: biryaniId, groupName: 'For the Chicken', groupOrder: 2, itemOrder: 3, name: 'ginger-garlic paste', amount: '2', unit: 'tbsp', preparation: '' },
			{ recipeId: biryaniId, groupName: 'For the Chicken', groupOrder: 2, itemOrder: 4, name: 'red chili powder', amount: '1', unit: 'tsp', preparation: '' },
			{ recipeId: biryaniId, groupName: 'For the Chicken', groupOrder: 2, itemOrder: 5, name: 'turmeric powder', amount: '1/2', unit: 'tsp', preparation: '' },
			{ recipeId: biryaniId, groupName: 'For the Chicken', groupOrder: 2, itemOrder: 6, name: 'biryani masala', amount: '2', unit: 'tsp', preparation: '' },
			{ recipeId: biryaniId, groupName: 'For the Chicken', groupOrder: 2, itemOrder: 7, name: 'salt', amount: '1.5', unit: 'tsp', preparation: '' },
			// For Layering
			{ recipeId: biryaniId, groupName: 'For Layering', groupOrder: 3, itemOrder: 1, name: 'fried onions', amount: '1', unit: 'cup', preparation: 'crispy' },
			{ recipeId: biryaniId, groupName: 'For Layering', groupOrder: 3, itemOrder: 2, name: 'fresh mint leaves', amount: '1/4', unit: 'cup', preparation: 'chopped' },
			{ recipeId: biryaniId, groupName: 'For Layering', groupOrder: 3, itemOrder: 3, name: 'fresh cilantro', amount: '1/4', unit: 'cup', preparation: 'chopped' },
			{ recipeId: biryaniId, groupName: 'For Layering', groupOrder: 3, itemOrder: 4, name: 'saffron strands', amount: '1/4', unit: 'tsp', preparation: 'soaked in 1/4 cup warm milk' },
			{ recipeId: biryaniId, groupName: 'For Layering', groupOrder: 3, itemOrder: 5, name: 'ghee', amount: '3', unit: 'tbsp', preparation: 'melted' }
		];

		for (const ing of biryaniIngredients) {
			await db.insert(recipeIngredient).values(ing).onConflictDoNothing();
		}
		console.log('  ✓ Chicken Biryani ingredients');
	}

	// Seed instructions for Butter Chicken
	console.log('\n📋 Seeding instructions...');
	if (butterChickenId) {
		const butterChickenInstructions = [
			{ recipeId: butterChickenId, stepNumber: 1, title: 'Marinate the Chicken', content: 'In a large bowl, combine chicken pieces with yogurt, lemon juice, ginger-garlic paste, garam masala, turmeric, and salt. Mix well to coat all pieces evenly. Cover and refrigerate for at least 30 minutes, or up to 4 hours for best flavor.', estimatedTime: 10 },
			{ recipeId: butterChickenId, stepNumber: 2, title: 'Cook the Chicken', content: 'Heat 2 tablespoons of butter in a large skillet over medium-high heat. Add marinated chicken pieces and cook for 8-10 minutes, turning occasionally, until golden brown and cooked through. Remove chicken and set aside.', estimatedTime: 10, temperature: 'Medium-high heat' },
			{ recipeId: butterChickenId, stepNumber: 3, title: 'Prepare the Sauce Base', content: 'In the same pan, melt remaining 2 tablespoons of butter. Add chopped onions and sauté until golden brown, about 5-7 minutes. Add ginger-garlic paste and cook for another minute until fragrant.', estimatedTime: 8, temperature: 'Medium heat' },
			{ recipeId: butterChickenId, stepNumber: 4, title: 'Build the Curry', content: 'Add tomato puree, Kashmiri red chili powder, and garam masala to the pan. Cook for 10-12 minutes, stirring occasionally, until the sauce thickens and oil starts to separate from the sides.', estimatedTime: 12, temperature: 'Medium heat' },
			{ recipeId: butterChickenId, stepNumber: 5, title: 'Add Cream and Finish', content: 'Reduce heat to low. Stir in heavy cream and honey, mixing well. Add the cooked chicken pieces back to the pan. Simmer for 5-7 minutes to allow flavors to meld. Crush kasuri methi between your palms and add to the curry.', estimatedTime: 8, temperature: 'Low heat' },
			{ recipeId: butterChickenId, stepNumber: 6, title: 'Garnish and Serve', content: 'Taste and adjust salt if needed. Garnish with fresh cilantro. Serve hot with naan bread, roti, or basmati rice. Enjoy your homemade butter chicken!', estimatedTime: 2 }
		];

		for (const inst of butterChickenInstructions) {
			await db.insert(recipeInstruction).values(inst).onConflictDoNothing();
		}
		console.log('  ✓ Butter Chicken instructions');
	}

	// Seed instructions for Palak Paneer
	if (palakPaneerId) {
		const palakPaneerInstructions = [
			{ recipeId: palakPaneerId, stepNumber: 1, title: 'Blanch the Spinach', content: 'Bring a large pot of water to boil. Add spinach and blanch for 2 minutes. Immediately drain and transfer to ice-cold water to preserve the bright green color. Drain again and blend to a smooth puree. Set aside.', estimatedTime: 5 },
			{ recipeId: palakPaneerId, stepNumber: 2, title: 'Prepare the Paneer', content: 'Cut paneer into 1-inch cubes. Optionally, lightly fry the paneer cubes in a little oil until golden on all sides, or use them directly for a softer texture. Set aside.', estimatedTime: 5, temperature: 'Medium heat' },
			{ recipeId: palakPaneerId, stepNumber: 3, title: 'Sauté the Base', content: 'Heat oil in a large pan over medium heat. Add cumin seeds and let them sizzle. Add chopped onions and sauté until golden brown, about 5-6 minutes. Add ginger, garlic, and green chilies. Cook for 1-2 minutes.', estimatedTime: 8, temperature: 'Medium heat' },
			{ recipeId: palakPaneerId, stepNumber: 4, title: 'Add Tomatoes and Spices', content: 'Add pureed tomatoes, turmeric, coriander powder, and salt. Cook until the tomatoes are well cooked and oil starts separating, about 5-7 minutes. Stir occasionally to prevent sticking.', estimatedTime: 7, temperature: 'Medium heat' },
			{ recipeId: palakPaneerId, stepNumber: 5, title: 'Combine with Spinach', content: 'Add the spinach puree to the pan and mix well. Add 1/4 cup water if the consistency is too thick. Bring to a gentle simmer and cook for 3-4 minutes, allowing flavors to blend.', estimatedTime: 5, temperature: 'Low-medium heat' },
			{ recipeId: palakPaneerId, stepNumber: 6, title: 'Add Paneer and Finish', content: 'Gently add paneer cubes to the spinach gravy. Add cream and garam masala. Stir gently to avoid breaking the paneer. Simmer for 2-3 minutes. Serve hot with naan or rice.', estimatedTime: 3, temperature: 'Low heat' }
		];

		for (const inst of palakPaneerInstructions) {
			await db.insert(recipeInstruction).values(inst).onConflictDoNothing();
		}
		console.log('  ✓ Palak Paneer instructions');
	}

	// Seed instructions for Chicken Biryani
	if (biryaniId) {
		const biryaniInstructions = [
			{ recipeId: biryaniId, stepNumber: 1, title: 'Marinate the Chicken', content: 'In a large bowl, combine chicken with yogurt, ginger-garlic paste, red chili powder, turmeric, biryani masala, and salt. Mix thoroughly to coat all pieces. Cover and marinate for at least 1 hour, preferably 2-3 hours in the refrigerator.', estimatedTime: 10 },
			{ recipeId: biryaniId, stepNumber: 2, title: 'Parboil the Rice', content: 'Bring a large pot of water to boil. Add bay leaves, cinnamon stick, cardamom pods, and salt. Add soaked and drained rice. Cook until rice is 70% done (grains should still have a bite). Drain immediately and set aside.', estimatedTime: 8, temperature: 'High heat' },
			{ recipeId: biryaniId, stepNumber: 3, title: 'Cook the Chicken', content: 'Heat oil in a heavy-bottomed pot or Dutch oven. Add half of the fried onions and sauté briefly. Add marinated chicken and cook on high heat for 5-6 minutes, stirring occasionally, until chicken is partially cooked and releases its juices.', estimatedTime: 8, temperature: 'High heat' },
			{ recipeId: biryaniId, stepNumber: 4, title: 'Layer the Biryani', content: 'Spread the partially cooked chicken evenly in the pot. Layer the parboiled rice on top of the chicken. Sprinkle remaining fried onions, mint leaves, and cilantro over the rice. Drizzle saffron milk and melted ghee evenly over everything.', estimatedTime: 5 },
			{ recipeId: biryaniId, stepNumber: 5, title: 'Dum Cooking (Steam)', content: 'Cover the pot with a tight-fitting lid. If needed, seal the edges with dough or aluminum foil to trap steam. Cook on high heat for 3 minutes, then reduce to lowest heat and cook for 25-30 minutes. This is the crucial dum (steaming) process.', estimatedTime: 30, temperature: 'Low heat', tips: 'Do not open the lid during dum cooking' },
			{ recipeId: biryaniId, stepNumber: 6, title: 'Rest and Serve', content: 'Turn off heat and let the biryani rest for 5 minutes without opening the lid. Gently fluff the biryani with a fork, mixing layers carefully. Serve hot with raita, salad, and pickle. Enjoy the aromatic layers!', estimatedTime: 5 }
		];

		for (const inst of biryaniInstructions) {
			await db.insert(recipeInstruction).values(inst).onConflictDoNothing();
		}
		console.log('  ✓ Chicken Biryani instructions');
	}

	// Seed tips for Butter Chicken
	console.log('\n💡 Seeding tips...');
	if (butterChickenId) {
		const butterChickenTips = [
			{ recipeId: butterChickenId, content: 'For the best flavor, marinate the chicken for at least 2-3 hours or overnight. This allows the spices to penetrate deeply into the meat.', category: 'chef_tip', sortOrder: 1 },
			{ recipeId: butterChickenId, content: 'Use Kashmiri red chili powder for vibrant color without too much heat. If you want it spicier, add cayenne pepper separately.', category: 'chef_tip', sortOrder: 2 },
			{ recipeId: butterChickenId, content: 'Crushing kasuri methi (dried fenugreek leaves) between your palms releases its aroma. This is a signature ingredient that makes butter chicken authentic.', category: 'chef_tip', sortOrder: 3 },
			{ recipeId: butterChickenId, content: 'Store leftovers in an airtight container in the refrigerator for up to 3 days. The flavors actually deepen and taste even better the next day!', category: 'storage', sortOrder: 4 },
			{ recipeId: butterChickenId, content: 'For a restaurant-style smooth gravy, blend the onion-tomato sauce before adding cream. You can also add a tablespoon of cashew paste for extra richness.', category: 'variation', sortOrder: 5 }
		];

		for (const tip of butterChickenTips) {
			await db.insert(recipeTip).values(tip).onConflictDoNothing();
		}
		console.log('  ✓ Butter Chicken tips');
	}

	// Seed tips for Palak Paneer
	if (palakPaneerId) {
		const palakPaneerTips = [
			{ recipeId: palakPaneerId, content: 'Blanching spinach in boiling water and immediately transferring to ice water helps retain its bright green color and removes any bitterness.', category: 'chef_tip', sortOrder: 1 },
			{ recipeId: palakPaneerId, content: 'For softer paneer, soak the cubes in warm water for 10 minutes before adding to the curry. For firmer texture with a golden crust, lightly pan-fry them.', category: 'chef_tip', sortOrder: 2 },
			{ recipeId: palakPaneerId, content: 'Add a small pinch of sugar to balance the slight bitterness of spinach if needed. This is especially helpful if using mature spinach leaves.', category: 'chef_tip', sortOrder: 3 },
			{ recipeId: palakPaneerId, content: 'This dish tastes great the next day as the paneer absorbs the flavors. Store in the refrigerator for up to 2 days. Reheat gently to avoid breaking the paneer.', category: 'storage', sortOrder: 4 },
			{ recipeId: palakPaneerId, content: 'For a vegan version, substitute paneer with firm tofu. Press the tofu well to remove excess moisture before cubing and using.', category: 'variation', sortOrder: 5 }
		];

		for (const tip of palakPaneerTips) {
			await db.insert(recipeTip).values(tip).onConflictDoNothing();
		}
		console.log('  ✓ Palak Paneer tips');
	}

	// Seed tips for Chicken Biryani
	if (biryaniId) {
		const biryaniTips = [
			{ recipeId: biryaniId, content: 'The key to perfect biryani is the layering technique and dum (steam cooking). Never skip the dum process - it allows the flavors to infuse beautifully.', category: 'chef_tip', sortOrder: 1 },
			{ recipeId: biryaniId, content: 'Parboil the rice to exactly 70% doneness. Overcooked rice will become mushy during dum, while undercooked rice will remain hard.', category: 'chef_tip', sortOrder: 2 },
			{ recipeId: biryaniId, content: 'If you don\'t have saffron, you can use a few drops of yellow food color mixed with milk, or simply skip it. The biryani will still taste delicious.', category: 'variation', sortOrder: 3 },
			{ recipeId: biryaniId, content: 'Use a heavy-bottomed pot with a tight-fitting lid. If the lid is loose, seal the edges with aluminum foil or dough to trap all the steam inside.', category: 'chef_tip', sortOrder: 4 },
			{ recipeId: biryaniId, content: 'Leftover biryani can be stored in an airtight container for 2-3 days. Reheat in a microwave or on stovetop with a splash of water to restore moisture.', category: 'storage', sortOrder: 5 },
			{ recipeId: biryaniId, content: 'For extra flavor, add a few drops of rose water or kewra (screwpine) water along with the saffron milk during layering.', category: 'variation', sortOrder: 6 }
		];

		for (const tip of biryaniTips) {
			await db.insert(recipeTip).values(tip).onConflictDoNothing();
		}
		console.log('  ✓ Chicken Biryani tips');
	}

	// Link recipes to tags
	console.log('\n🔗 Linking recipes to tags...');
	if (butterChickenId && tagIds['spicy'] && tagIds['comfort-food'] && tagIds['indian'] && tagIds['curry']) {
		await db.insert(recipeTag).values({ recipeId: butterChickenId, tagId: tagIds['spicy'] }).onConflictDoNothing();
		await db.insert(recipeTag).values({ recipeId: butterChickenId, tagId: tagIds['comfort-food'] }).onConflictDoNothing();
		await db.insert(recipeTag).values({ recipeId: butterChickenId, tagId: tagIds['indian'] }).onConflictDoNothing();
		await db.insert(recipeTag).values({ recipeId: butterChickenId, tagId: tagIds['curry'] }).onConflictDoNothing();
		console.log('  ✓ Butter Chicken tags');
	}

	if (palakPaneerId && tagIds['vegetarian'] && tagIds['healthy'] && tagIds['indian'] && tagIds['curry']) {
		await db.insert(recipeTag).values({ recipeId: palakPaneerId, tagId: tagIds['vegetarian'] }).onConflictDoNothing();
		await db.insert(recipeTag).values({ recipeId: palakPaneerId, tagId: tagIds['healthy'] }).onConflictDoNothing();
		await db.insert(recipeTag).values({ recipeId: palakPaneerId, tagId: tagIds['indian'] }).onConflictDoNothing();
		await db.insert(recipeTag).values({ recipeId: palakPaneerId, tagId: tagIds['curry'] }).onConflictDoNothing();
		console.log('  ✓ Palak Paneer tags');
	}

	if (biryaniId && tagIds['spicy'] && tagIds['festive'] && tagIds['indian'] && tagIds['rice-dish']) {
		await db.insert(recipeTag).values({ recipeId: biryaniId, tagId: tagIds['spicy'] }).onConflictDoNothing();
		await db.insert(recipeTag).values({ recipeId: biryaniId, tagId: tagIds['festive'] }).onConflictDoNothing();
		await db.insert(recipeTag).values({ recipeId: biryaniId, tagId: tagIds['indian'] }).onConflictDoNothing();
		await db.insert(recipeTag).values({ recipeId: biryaniId, tagId: tagIds['rice-dish'] }).onConflictDoNothing();
		console.log('  ✓ Chicken Biryani tags');
	}

	console.log('\n✅ Seeding complete!\n');
	console.log('Test credentials:');
	console.log('  Username: chef_yuki');
	console.log('  Password: password123');
	console.log('  Profile URL: /profile/chef_yuki\n');

	await client.end();
	process.exit(0);
}

seed().catch((error) => {
	console.error('❌ Seeding failed:', error);
	process.exit(1);
});
