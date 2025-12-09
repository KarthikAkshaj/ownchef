// src/lib/server/db/seed.ts
import { db } from './index';
import * as table from './schema';

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

	console.log('\n✅ Seeding complete!\n');
	process.exit(0);
}

seed().catch((error) => {
	console.error('❌ Seeding failed:', error);
	process.exit(1);
});
