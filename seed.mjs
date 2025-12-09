// seed.mjs - Standalone database seed script
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { readFileSync } from 'fs';

// Load .env manually
try {
	const envFile = readFileSync('.env', 'utf8');
	envFile.split('\n').forEach(line => {
		const match = line.match(/^([^=:#]+?)[=:](.*)$/);
		if (match) {
			const key = match[1].trim();
			let value = match[2].trim();
			// Remove quotes if present
			if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
				value = value.slice(1, -1);
			}
			process.env[key] = value;
		}
	});
} catch (error) {
	console.warn('Warning: Could not load .env file');
}

// Define schema (minimal version just for seeding)
const cuisine = pgTable('cuisine', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull().unique(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	description: text('description'),
	image: text('image'),
	sortOrder: integer('sort_order').default(0),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

const category = pgTable('category', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull().unique(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	description: text('description'),
	image: text('image'),
	sortOrder: integer('sort_order').default(0),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

async function seed() {
	if (!process.env.DATABASE_URL) {
		console.error('❌ DATABASE_URL is not set in environment');
		process.exit(1);
	}

	const client = postgres(process.env.DATABASE_URL);
	const db = drizzle(client);

	console.log('🌱 Seeding database...\n');

	// Run migration for dietary_type column
	console.log('📍 Adding dietary_type column to recipe table...');
	try {
		await client`
			ALTER TABLE recipe
			ADD COLUMN IF NOT EXISTS dietary_type VARCHAR(20) DEFAULT 'non-vegetarian'
		`;
		console.log('  ✓ dietary_type column added\n');
	} catch (error) {
		console.log('  ✓ dietary_type column already exists or error:', error.message);
	}

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
			console.error(`  ✗ Failed to create ${cuisineData.name}:`, error.message);
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
	for (const categoryData of categories) {
		try {
			await db.insert(category).values(categoryData).onConflictDoNothing();
			console.log(`  ✓ ${categoryData.name}`);
		} catch (error) {
			console.error(`  ✗ Failed to create ${categoryData.name}:`, error.message);
		}
	}

	console.log('\n✅ Seeding complete!\n');
	await client.end();
	process.exit(0);
}

seed().catch((error) => {
	console.error('❌ Seeding failed:', error);
	process.exit(1);
});
