// src/lib/server/db/schema.ts - ENTERPRISE VERSION
import { pgTable, serial, text, integer, timestamp, varchar, boolean, json, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================================
// CORE USER TABLES (Already exists)
// ========================================
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	email: text('email').unique(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	bio: text('bio'),
	profileImage: text('profile_image'),
	location: text('location'),          
	website: text('website'),            
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// ========================================
// RECIPE TAXONOMY TABLES
// ========================================
export const category = pgTable('category', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull().unique(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	description: text('description'),
	image: text('image'),
	sortOrder: integer('sort_order').default(0),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	slugIdx: index('category_slug_idx').on(table.slug),
	activeIdx: index('category_active_idx').on(table.isActive)
}));

export const cuisine = pgTable('cuisine', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull().unique(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	description: text('description'),
	image: text('image'),
	sortOrder: integer('sort_order').default(0),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	slugIdx: index('cuisine_slug_idx').on(table.slug),
	activeIdx: index('cuisine_active_idx').on(table.isActive)
}));

// ========================================
// CORE RECIPE TABLE
// ========================================
export const recipe = pgTable('recipe', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	description: text('description').notNull(),
	content: text('content'), // Rich text instructions (optional - we have steps table)

	// Recipe Metrics
	prepTime: integer('prep_time').notNull(), // minutes
	cookTime: integer('cook_time').notNull(), // minutes
	totalTime: integer('total_time').notNull(), // computed: prep + cook
	servings: integer('servings').notNull(),
	difficulty: varchar('difficulty', { length: 20 }).notNull(), // 'Easy', 'Medium', 'Hard'
	dietaryType: varchar('dietary_type', { length: 20 }).default('non-vegetarian'), // 'vegetarian', 'vegan', 'non-vegetarian'

	// Media
	featuredImage: text('featured_image'), // Main recipe image
	videoUrl: text('video_url'),

	// Relationships
	authorId: text('author_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	categoryId: integer('category_id')
		.references(() => category.id, { onDelete: 'set null' }),
	cuisineId: integer('cuisine_id')
		.references(() => cuisine.id, { onDelete: 'set null' }),

	// Content Status
	isPublished: boolean('is_published').default(false).notNull(),
	isDraft: boolean('is_draft').default(true).notNull(),

	// Analytics
	views: integer('views').default(0).notNull(),
	likesCount: integer('likes_count').default(0).notNull(),
	ratingsCount: integer('ratings_count').default(0).notNull(),
	averageRating: integer('average_rating').default(0), // Store as integer (x100) for precision

	// Timestamps
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	publishedAt: timestamp('published_at', { withTimezone: true, mode: 'date' })
}, (table) => ({
	// Performance Indexes - Big Tech Style!
	slugIdx: index('recipe_slug_idx').on(table.slug),
	authorIdx: index('recipe_author_idx').on(table.authorId),
	categoryIdx: index('recipe_category_idx').on(table.categoryId),
	cuisineIdx: index('recipe_cuisine_idx').on(table.cuisineId),
	publishedIdx: index('recipe_published_idx').on(table.isPublished, table.publishedAt),
	popularIdx: index('recipe_popular_idx').on(table.likesCount, table.averageRating),
	searchIdx: index('recipe_search_idx').on(table.title, table.description)
}));

// ========================================
// RECIPE INGREDIENTS (Grouped & Structured)
// ========================================
export const recipeIngredient = pgTable('recipe_ingredient', {
	id: serial('id').primaryKey(),
	recipeId: integer('recipe_id')
		.notNull()
		.references(() => recipe.id, { onDelete: 'cascade' }),

	// Grouping (e.g., "For the sauce", "For the garnish")
	groupName: varchar('group_name', { length: 100 }), // Optional grouping
	groupOrder: integer('group_order').default(0), // Order of groups

	// Ingredient Details
	name: varchar('name', { length: 255 }).notNull(), // "all-purpose flour"
	amount: varchar('amount', { length: 50 }), // "2" or "1.5"
	unit: varchar('unit', { length: 50 }), // "cups", "tbsp", "kg"
	preparation: varchar('preparation', { length: 100 }), // "chopped", "diced", "melted"
	notes: text('notes'), // "room temperature", "organic preferred"

	// Ordering
	itemOrder: integer('item_order').default(0), // Order within group

	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	recipeIdx: index('ingredient_recipe_idx').on(table.recipeId),
	orderIdx: index('ingredient_order_idx').on(table.recipeId, table.groupOrder, table.itemOrder)
}));

// ========================================
// RECIPE INSTRUCTIONS (Step-by-Step)
// ========================================
export const recipeInstruction = pgTable('recipe_instruction', {
	id: serial('id').primaryKey(),
	recipeId: integer('recipe_id')
		.notNull()
		.references(() => recipe.id, { onDelete: 'cascade' }),

	stepNumber: integer('step_number').notNull(), // 1, 2, 3...
	title: varchar('title', { length: 200 }), // Optional step title
	content: text('content').notNull(), // Step instructions

	// Optional Media for Steps
	image: text('image'), // Step-specific image
	videoUrl: text('video_url'), // Step-specific video

	// Timing (optional)
	estimatedTime: integer('estimated_time'), // minutes for this step
	temperature: varchar('temperature', { length: 50 }), // "350°F", "medium heat"

	// Tips & Notes
	tips: text('tips'), // Chef tips for this step

	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	recipeIdx: index('instruction_recipe_idx').on(table.recipeId),
	stepIdx: index('instruction_step_idx').on(table.recipeId, table.stepNumber)
}));

// ========================================
// RECIPE MEDIA GALLERY
// ========================================
export const recipeImage = pgTable('recipe_image', {
	id: serial('id').primaryKey(),
	recipeId: integer('recipe_id')
		.notNull()
		.references(() => recipe.id, { onDelete: 'cascade' }),

	url: text('url').notNull(),
	alt: text('alt'), // Accessibility text
	caption: text('caption'), // User-provided caption

	// Image Metadata
	width: integer('width'),
	height: integer('height'),
	fileSize: integer('file_size'), // bytes
	mimeType: varchar('mime_type', { length: 50 }),

	// Ordering & Status
	sortOrder: integer('sort_order').default(0),
	isFeatured: boolean('is_featured').default(false),

	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	recipeIdx: index('image_recipe_idx').on(table.recipeId),
	orderIdx: index('image_order_idx').on(table.recipeId, table.sortOrder)
}));

// ========================================
// TAGGING SYSTEM
// ========================================
export const tag = pgTable('tag', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 50 }).notNull().unique(),
	slug: varchar('slug', { length: 50 }).notNull().unique(),
	description: text('description'),
	color: varchar('color', { length: 7 }), // hex color
	usageCount: integer('usage_count').default(0), // Denormalized for performance
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	slugIdx: index('tag_slug_idx').on(table.slug),
	popularIdx: index('tag_popular_idx').on(table.usageCount)
}));

export const recipeTag = pgTable('recipe_tag', {
	id: serial('id').primaryKey(),
	recipeId: integer('recipe_id')
		.notNull()
		.references(() => recipe.id, { onDelete: 'cascade' }),
	tagId: integer('tag_id')
		.notNull()
		.references(() => tag.id, { onDelete: 'cascade' }),
	addedAt: timestamp('added_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	recipeIdx: index('recipe_tag_recipe_idx').on(table.recipeId),
	tagIdx: index('recipe_tag_tag_idx').on(table.tagId),
	uniqueIdx: index('recipe_tag_unique_idx').on(table.recipeId, table.tagId)
}));

// ========================================
// RECIPE TIPS (Separate from instructions)
// ========================================
export const recipeTip = pgTable('recipe_tip', {
	id: serial('id').primaryKey(),
	recipeId: integer('recipe_id')
		.notNull()
		.references(() => recipe.id, { onDelete: 'cascade' }),

	content: text('content').notNull(),
	category: varchar('category', { length: 50 }), // 'chef_tip', 'storage', 'variation'
	sortOrder: integer('sort_order').default(0),

	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	recipeIdx: index('tip_recipe_idx').on(table.recipeId),
	orderIdx: index('tip_order_idx').on(table.recipeId, table.sortOrder)
}));

// ========================================
// SOCIAL FEATURES (Instagram-style)
// ========================================
export const recipeLike = pgTable('recipe_like', {
	id: serial('id').primaryKey(),
	recipeId: integer('recipe_id')
		.notNull()
		.references(() => recipe.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	recipeIdx: index('like_recipe_idx').on(table.recipeId),
	userIdx: index('like_user_idx').on(table.userId),
	uniqueIdx: index('like_unique_idx').on(table.recipeId, table.userId)
}));

export const recipeRating = pgTable('recipe_rating', {
	id: serial('id').primaryKey(),
	recipeId: integer('recipe_id')
		.notNull()
		.references(() => recipe.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),

	rating: integer('rating').notNull(), // 1-5 stars
	review: text('review'), // Optional written review

	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
}, (table) => ({
	recipeIdx: index('rating_recipe_idx').on(table.recipeId),
	userIdx: index('rating_user_idx').on(table.userId),
	ratingIdx: index('rating_value_idx').on(table.rating),
	uniqueIdx: index('rating_unique_idx').on(table.recipeId, table.userId)
}));

// ========================================
// DRIZZLE RELATIONS (Type-Safe Queries)
// ========================================
export const userRelations = relations(user, ({ many }) => ({
	recipes: many(recipe),
	likes: many(recipeLike),
	ratings: many(recipeRating)
}));

export const recipeRelations = relations(recipe, ({ one, many }) => ({
	author: one(user, {
		fields: [recipe.authorId],
		references: [user.id]
	}),
	category: one(category, {
		fields: [recipe.categoryId],
		references: [category.id]
	}),
	cuisine: one(cuisine, {
		fields: [recipe.cuisineId],
		references: [cuisine.id]
	}),
	ingredients: many(recipeIngredient),
	instructions: many(recipeInstruction),
	images: many(recipeImage),
	tags: many(recipeTag),
	tips: many(recipeTip),
	likes: many(recipeLike),
	ratings: many(recipeRating)
}));

export const categoryRelations = relations(category, ({ many }) => ({
	recipes: many(recipe)
}));

export const cuisineRelations = relations(cuisine, ({ many }) => ({
	recipes: many(recipe)
}));

export const recipeIngredientRelations = relations(recipeIngredient, ({ one }) => ({
	recipe: one(recipe, {
		fields: [recipeIngredient.recipeId],
		references: [recipe.id]
	})
}));

export const recipeInstructionRelations = relations(recipeInstruction, ({ one }) => ({
	recipe: one(recipe, {
		fields: [recipeInstruction.recipeId],
		references: [recipe.id]
	})
}));

export const recipeImageRelations = relations(recipeImage, ({ one }) => ({
	recipe: one(recipe, {
		fields: [recipeImage.recipeId],
		references: [recipe.id]
	})
}));

export const tagRelations = relations(tag, ({ many }) => ({
	recipes: many(recipeTag)
}));

export const recipeTagRelations = relations(recipeTag, ({ one }) => ({
	recipe: one(recipe, {
		fields: [recipeTag.recipeId],
		references: [recipe.id]
	}),
	tag: one(tag, {
		fields: [recipeTag.tagId],
		references: [tag.id]
	})
}));

export const recipeTipRelations = relations(recipeTip, ({ one }) => ({
	recipe: one(recipe, {
		fields: [recipeTip.recipeId],
		references: [recipe.id]
	})
}));

export const recipeLikeRelations = relations(recipeLike, ({ one }) => ({
	recipe: one(recipe, {
		fields: [recipeLike.recipeId],
		references: [recipe.id]
	}),
	user: one(user, {
		fields: [recipeLike.userId],
		references: [user.id]
	})
}));

export const recipeRatingRelations = relations(recipeRating, ({ one }) => ({
	recipe: one(recipe, {
		fields: [recipeRating.recipeId],
		references: [recipe.id]
	}),
	user: one(user, {
		fields: [recipeRating.userId],
		references: [user.id]
	})
}));

// ========================================
// TYPESCRIPT TYPES (Full Type Safety)
// ========================================
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Recipe = typeof recipe.$inferSelect;
export type NewRecipe = typeof recipe.$inferInsert;

export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;

export type Cuisine = typeof cuisine.$inferSelect;
export type NewCuisine = typeof cuisine.$inferInsert;

export type RecipeIngredient = typeof recipeIngredient.$inferSelect;
export type NewRecipeIngredient = typeof recipeIngredient.$inferInsert;

export type RecipeInstruction = typeof recipeInstruction.$inferSelect;
export type NewRecipeInstruction = typeof recipeInstruction.$inferInsert;

export type RecipeImage = typeof recipeImage.$inferSelect;
export type NewRecipeImage = typeof recipeImage.$inferInsert;

export type Tag = typeof tag.$inferSelect;
export type NewTag = typeof tag.$inferInsert;

export type RecipeTag = typeof recipeTag.$inferSelect;
export type NewRecipeTag = typeof recipeTag.$inferInsert;

export type RecipeTip = typeof recipeTip.$inferSelect;
export type NewRecipeTip = typeof recipeTip.$inferInsert;

export type RecipeLike = typeof recipeLike.$inferSelect;
export type NewRecipeLike = typeof recipeLike.$inferInsert;

export type RecipeRating = typeof recipeRating.$inferSelect;
export type NewRecipeRating = typeof recipeRating.$inferInsert;

export type Session = typeof session.$inferSelect;

// ========================================
// COMPLEX QUERY TYPES (API Response Types)
// ========================================
export type RecipeWithDetails = Recipe & {
	author: Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'profileImage'>;
	category: Category | null;
	cuisine: Cuisine | null;
	ingredients: (RecipeIngredient & { groupName?: string })[];
	instructions: RecipeInstruction[];
	images: RecipeImage[];
	tips: RecipeTip[];
	tags: (Tag & { pivot: RecipeTag })[];
	stats: {
		likesCount: number;
		ratingsCount: number;
		averageRating: number;
		views: number;
		userLiked?: boolean;
		userRating?: number;
	};
};

export type RecipeCard = Pick<Recipe,
	'id' | 'title' | 'slug' | 'description' | 'featuredImage' |
	'prepTime' | 'cookTime' | 'servings' | 'difficulty' |
	'likesCount' | 'averageRating' | 'createdAt'
> & {
	author: Pick<User, 'id' | 'username' | 'profileImage'>;
	category: Pick<Category, 'id' | 'name' | 'slug'> | null;
	tags: Pick<Tag, 'id' | 'name' | 'slug'>[];
};