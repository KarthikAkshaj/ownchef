// src/routes/api/recipes/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, desc, asc, ilike, sql, count, or, ne } from 'drizzle-orm';

// ========================================
// TYPES & INTERFACES
// ========================================

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    timestamp: string;
    requestId?: string;
}

interface CreateRecipeRequest {
    title: string;
    description: string;
    content?: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    dietaryType?: 'vegetarian' | 'vegan' | 'non-vegetarian';
    categoryId?: number;
    cuisineId?: number;
    featuredImage?: string;
    videoUrl?: string;
    images?: string[];
    ingredients: IngredientGroup[];
    steps: InstructionStep[];
    tips?: RecipeTip[];
    tags?: string[];
    isPublished?: boolean;
}

interface IngredientGroup {
    groupName?: string;
    items: IngredientItem[];
}

interface IngredientItem {
    name: string;
    amount?: string;
    unit?: string;
    preparation?: string;
    notes?: string;
}

interface InstructionStep {
    title?: string;
    content: string;
    image?: string;
    videoUrl?: string;
    estimatedTime?: number;
    temperature?: string;
    tips?: string;
}

interface RecipeTip {
    content: string;
    category?: 'chef_tip' | 'storage' | 'variation' | 'substitution' | 'timing';
}

interface RecipeResponse {
    id: number;
    title: string;
    slug: string;
    description: string;
    prepTime: number;
    cookTime: number;
    totalTime: number;
    servings: number;
    difficulty: string;
    featuredImage: string | null;
    isPublished: boolean;
    createdAt: Date;
    author: {
        id: string;
        username: string;
        firstName: string | null;
        lastName: string | null;
    };
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    cuisine: {
        id: number;
        name: string;
        slug: string;
    } | null;
    stats: {
        views: number;
        likes: number;
        ratings: number;
        averageRating: number;
    };
    urls: {
        view: string;
        edit: string;
        api: string;
    };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function createSuccessResponse<T>(data: T, message?: string, requestId?: string): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
        requestId
    };
}

function createErrorResponse(error: string, statusCode: number = 500, requestId?: string): Response {
    const response: ApiResponse = {
        success: false,
        error,
        timestamp: new Date().toISOString(),
        requestId
    };

    return json(response, { status: statusCode });
}

function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .slice(0, 200); // Limit length
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const whereClause = excludeId
            ? and(eq(table.recipe.slug, slug), ne(table.recipe.id, excludeId))
            : eq(table.recipe.slug, slug);

        const [existing] = await db
            .select({ id: table.recipe.id })
            .from(table.recipe)
            .where(whereClause)
            .limit(1);

        if (!existing) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;

        // Prevent infinite loops
        if (counter > 100) {
            throw new Error('Unable to generate unique slug');
        }
    }
}

async function validateReferences(categoryId?: number, cuisineId?: number): Promise<void> {
    if (categoryId) {
        const [category] = await db
            .select({ id: table.category.id })
            .from(table.category)
            .where(and(
                eq(table.category.id, categoryId),
                eq(table.category.isActive, true)
            ))
            .limit(1);

        if (!category) {
            throw new Error(`Category with ID ${categoryId} does not exist or is inactive`);
        }
    }

    if (cuisineId) {
        const [cuisine] = await db
            .select({ id: table.cuisine.id })
            .from(table.cuisine)
            .where(and(
                eq(table.cuisine.id, cuisineId),
                eq(table.cuisine.isActive, true)
            ))
            .limit(1);

        if (!cuisine) {
            throw new Error(`Cuisine with ID ${cuisineId} does not exist or is inactive`);
        }
    }
}

function validateRecipeData(data: CreateRecipeRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Title validation
    if (!data.title || typeof data.title !== 'string') {
        errors.push('Title is required');
    } else if (data.title.trim().length < 3) {
        errors.push('Title must be at least 3 characters');
    } else if (data.title.trim().length > 255) {
        errors.push('Title cannot exceed 255 characters');
    }

    // Description validation
    if (!data.description || typeof data.description !== 'string') {
        errors.push('Description is required');
    } else if (data.description.trim().length < 10) {
        errors.push('Description must be at least 10 characters');
    } else if (data.description.trim().length > 1000) {
        errors.push('Description cannot exceed 1000 characters');
    }

    // Time validation
    if (!Number.isInteger(data.prepTime) || data.prepTime < 0 || data.prepTime > 1440) {
        errors.push('Prep time must be between 0 and 1440 minutes');
    }

    if (!Number.isInteger(data.cookTime) || data.cookTime < 0 || data.cookTime > 1440) {
        errors.push('Cook time must be between 0 and 1440 minutes');
    }

    // Servings validation
    if (!Number.isInteger(data.servings) || data.servings < 1 || data.servings > 100) {
        errors.push('Servings must be between 1 and 100');
    }

    // Difficulty validation
    if (!['Easy', 'Medium', 'Hard'].includes(data.difficulty)) {
        errors.push('Difficulty must be Easy, Medium, or Hard');
    }

    // Ingredients validation
    if (!data.ingredients || !Array.isArray(data.ingredients) || data.ingredients.length === 0) {
        errors.push('At least one ingredient group is required');
    } else {
        let hasValidIngredient = false;
        data.ingredients.forEach((group, groupIndex) => {
            if (!group.items || !Array.isArray(group.items)) {
                errors.push(`Ingredient group ${groupIndex + 1} must have items array`);
                return;
            }

            group.items.forEach((item, itemIndex) => {
                if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
                    errors.push(`Ingredient ${groupIndex + 1}.${itemIndex + 1} name is required`);
                } else {
                    hasValidIngredient = true;
                }
            });
        });

        if (!hasValidIngredient) {
            errors.push('At least one valid ingredient is required');
        }
    }

    // Steps validation
    if (!data.steps || !Array.isArray(data.steps) || data.steps.length === 0) {
        errors.push('At least one instruction step is required');
    } else {
        let hasValidStep = false;
        data.steps.forEach((step, index) => {
            if (!step.content || typeof step.content !== 'string' || step.content.trim().length < 5) {
                errors.push(`Step ${index + 1} content must be at least 5 characters`);
            } else {
                hasValidStep = true;
            }
        });

        if (!hasValidStep) {
            errors.push('At least one valid instruction step is required');
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ========================================
// COMPLEX TRANSACTION FUNCTION
// ========================================

async function createRecipeWithRelations(
    validatedData: CreateRecipeRequest,
    authorId: string,
    requestId: string
): Promise<RecipeResponse> {

    return await db.transaction(async (tx) => {
        console.log(`[${requestId}] Starting recipe creation transaction`);

        try {
            // Step 1: Validate foreign key references
            await validateReferences(validatedData.categoryId, validatedData.cuisineId);

            // Step 2: Generate unique slug
            const baseSlug = generateSlug(validatedData.title);
            const uniqueSlug = await ensureUniqueSlug(baseSlug);

            console.log(`[${requestId}] Generated unique slug: ${uniqueSlug}`);

            // Step 3: Create main recipe record
            const totalTime = validatedData.prepTime + validatedData.cookTime;

            const [newRecipe] = await tx
                .insert(table.recipe)
                .values({
                    title: validatedData.title.trim(),
                    slug: uniqueSlug,
                    description: validatedData.description.trim(),
                    content: validatedData.content?.trim() || null,
                    prepTime: validatedData.prepTime,
                    cookTime: validatedData.cookTime,
                    totalTime: totalTime,
                    servings: validatedData.servings,
                    difficulty: validatedData.difficulty,
                    dietaryType: validatedData.dietaryType || 'non-vegetarian',
                    featuredImage: validatedData.featuredImage?.trim() || null,
                    videoUrl: validatedData.videoUrl?.trim() || null,
                    authorId: authorId,
                    categoryId: validatedData.categoryId || null,
                    cuisineId: validatedData.cuisineId || null,
                    isPublished: validatedData.isPublished || false,
                    isDraft: !(validatedData.isPublished || false),
                    publishedAt: validatedData.isPublished ? new Date() : null,
                    views: 0,
                    likesCount: 0,
                    ratingsCount: 0,
                    averageRating: 0
                })
                .returning({
                    id: table.recipe.id,
                    slug: table.recipe.slug,
                    title: table.recipe.title,
                    createdAt: table.recipe.createdAt
                });

            const recipeId = newRecipe.id;
            console.log(`[${requestId}] Created recipe: ${newRecipe.title} (ID: ${recipeId})`);

            // Step 4: Insert ingredients with groups
            let ingredientCount = 0;
            for (let groupIndex = 0; groupIndex < validatedData.ingredients.length; groupIndex++) {
                const group = validatedData.ingredients[groupIndex];

                for (let itemIndex = 0; itemIndex < group.items.length; itemIndex++) {
                    const item = group.items[itemIndex];
                    if (item.name.trim()) {
                        await tx.insert(table.recipeIngredient).values({
                            recipeId,
                            groupName: group.groupName?.trim() || null,
                            groupOrder: groupIndex,
                            name: item.name.trim(),
                            amount: item.amount?.trim() || null,
                            unit: item.unit?.trim() || null,
                            preparation: item.preparation?.trim() || null,
                            notes: item.notes?.trim() || null,
                            itemOrder: itemIndex
                        });
                        ingredientCount++;
                    }
                }
            }

            console.log(`[${requestId}] Created ${ingredientCount} ingredients`);

            // Step 5: Insert instruction steps
            let stepCount = 0;
            for (let index = 0; index < validatedData.steps.length; index++) {
                const step = validatedData.steps[index];
                if (step.content.trim()) {
                    await tx.insert(table.recipeInstruction).values({
                        recipeId,
                        stepNumber: index + 1,
                        title: step.title?.trim() || null,
                        content: step.content.trim(),
                        image: step.image?.trim() || null,
                        videoUrl: step.videoUrl?.trim() || null,
                        estimatedTime: step.estimatedTime || null,
                        temperature: step.temperature?.trim() || null,
                        tips: step.tips?.trim() || null
                    });
                    stepCount++;
                }
            }

            console.log(`[${requestId}] Created ${stepCount} instruction steps`);

            // Step 6: Insert additional images
            if (validatedData.images && validatedData.images.length > 0) {
                const imageInserts = validatedData.images
                    .filter(url => url.trim())
                    .map((url, index) => ({
                        recipeId,
                        url: url.trim(),
                        sortOrder: index,
                        isFeatured: false
                    }));

                if (imageInserts.length > 0) {
                    await tx.insert(table.recipeImage).values(imageInserts);
                    console.log(`[${requestId}] Created ${imageInserts.length} recipe images`);
                }
            }

            // Step 7: Handle tags (create if needed, then link)
            let tagCount = 0;
            if (validatedData.tags && validatedData.tags.length > 0) {
                const uniqueTags = [...new Set(validatedData.tags.filter(tag => tag.trim()))];

                for (const tagName of uniqueTags) {
                    let tagId: number;

                    // Try to find existing tag
                    const [existingTag] = await tx
                        .select({ id: table.tag.id })
                        .from(table.tag)
                        .where(eq(table.tag.name, tagName.trim()))
                        .limit(1);

                    if (existingTag) {
                        tagId = existingTag.id;
                        // Update usage count
                        await tx
                            .update(table.tag)
                            .set({ usageCount: sql`${table.tag.usageCount} + 1` })
                            .where(eq(table.tag.id, tagId));
                    } else {
                        // Create new tag
                        const tagSlug = generateSlug(tagName);
                        const [newTag] = await tx
                            .insert(table.tag)
                            .values({
                                name: tagName.trim(),
                                slug: tagSlug,
                                usageCount: 1
                            })
                            .returning({ id: table.tag.id });
                        tagId = newTag.id;
                    }

                    // Link tag to recipe
                    await tx.insert(table.recipeTag).values({
                        recipeId,
                        tagId
                    });
                    tagCount++;
                }

                console.log(`[${requestId}] Created/linked ${tagCount} tags`);
            }

            // Step 8: Insert tips
            let tipCount = 0;
            if (validatedData.tips && validatedData.tips.length > 0) {
                const tipInserts = validatedData.tips
                    .filter(tip => tip.content.trim())
                    .map((tip, index) => ({
                        recipeId,
                        content: tip.content.trim(),
                        category: tip.category || null,
                        sortOrder: index
                    }));

                if (tipInserts.length > 0) {
                    await tx.insert(table.recipeTip).values(tipInserts);
                    tipCount = tipInserts.length;
                    console.log(`[${requestId}] Created ${tipCount} recipe tips`);
                }
            }

            // Step 9: Get created recipe with relations for response
            const [recipeWithRelations] = await tx
                .select({
                    id: table.recipe.id,
                    title: table.recipe.title,
                    slug: table.recipe.slug,
                    description: table.recipe.description,
                    prepTime: table.recipe.prepTime,
                    cookTime: table.recipe.cookTime,
                    totalTime: table.recipe.totalTime,
                    servings: table.recipe.servings,
                    difficulty: table.recipe.difficulty,
                    featuredImage: table.recipe.featuredImage,
                    isPublished: table.recipe.isPublished,
                    views: table.recipe.views,
                    likesCount: table.recipe.likesCount,
                    ratingsCount: table.recipe.ratingsCount,
                    averageRating: table.recipe.averageRating,
                    createdAt: table.recipe.createdAt,
                    // Author info
                    authorId: table.user.id,
                    authorUsername: table.user.username,
                    authorFirstName: table.user.firstName,
                    authorLastName: table.user.lastName,
                    // Category info
                    categoryId: table.category.id,
                    categoryName: table.category.name,
                    categorySlug: table.category.slug,
                    // Cuisine info
                    cuisineId: table.cuisine.id,
                    cuisineName: table.cuisine.name,
                    cuisineSlug: table.cuisine.slug
                })
                .from(table.recipe)
                .leftJoin(table.user, eq(table.recipe.authorId, table.user.id))
                .leftJoin(table.category, eq(table.recipe.categoryId, table.category.id))
                .leftJoin(table.cuisine, eq(table.recipe.cuisineId, table.cuisine.id))
                .where(eq(table.recipe.id, recipeId))
                .limit(1);

            console.log(`[${requestId}] Recipe creation completed successfully`);

            // Build response
            const response: RecipeResponse = {
                id: recipeWithRelations.id,
                title: recipeWithRelations.title,
                slug: recipeWithRelations.slug,
                description: recipeWithRelations.description,
                prepTime: recipeWithRelations.prepTime,
                cookTime: recipeWithRelations.cookTime,
                totalTime: recipeWithRelations.totalTime,
                servings: recipeWithRelations.servings,
                difficulty: recipeWithRelations.difficulty,
                featuredImage: recipeWithRelations.featuredImage,
                isPublished: recipeWithRelations.isPublished,
                createdAt: recipeWithRelations.createdAt,
                author: {
                    id: recipeWithRelations.authorId,
                    username: recipeWithRelations.authorUsername,
                    firstName: recipeWithRelations.authorFirstName,
                    lastName: recipeWithRelations.authorLastName
                },
                category: recipeWithRelations.categoryId ? {
                    id: recipeWithRelations.categoryId,
                    name: recipeWithRelations.categoryName!,
                    slug: recipeWithRelations.categorySlug!
                } : null,
                cuisine: recipeWithRelations.cuisineId ? {
                    id: recipeWithRelations.cuisineId,
                    name: recipeWithRelations.cuisineName!,
                    slug: recipeWithRelations.cuisineSlug!
                } : null,
                stats: {
                    views: recipeWithRelations.views,
                    likes: recipeWithRelations.likesCount,
                    ratings: recipeWithRelations.ratingsCount,
                    averageRating: recipeWithRelations.averageRating || 0
                },
                urls: {
                    view: `/recipes/${recipeWithRelations.slug}`,
                    edit: `/recipes/${recipeWithRelations.slug}/edit`,
                    api: `/api/recipes/${recipeWithRelations.id}`
                }
            };

            return response;

        } catch (error) {
            console.error(`[${requestId}] Transaction error:`, error);
            throw error;
        }
    });
}

// ========================================
// API HANDLERS
// ========================================

/**
 * POST /api/recipes
 * Creates a new recipe with all relations
 */
export const POST: RequestHandler = async ({ request, locals }) => {
    const requestId = generateRequestId();

    try {
        // Check authentication
        if (!locals.user || !locals.user.id || !locals.user.username) {
            return createErrorResponse('Authentication required', 401, requestId);
        }

        console.log(`[${requestId}] Recipe creation request started by: ${locals.user.username}`);

        // Parse request body
        let requestData;
        try {
            requestData = await request.json();
        } catch (e) {
            return createErrorResponse('Invalid JSON in request body', 400, requestId);
        }

        // Validate recipe data
        const validation = validateRecipeData(requestData);
        if (!validation.valid) {
            console.log(`[${requestId}] Validation failed:`, validation.errors);
            return createErrorResponse(
                `Validation failed: ${validation.errors.join(', ')}`,
                400,
                requestId
            );
        }

        // Create recipe with all relations
        const createdRecipe = await createRecipeWithRelations(
            requestData,
            locals.user.id,
            requestId
        );

        const message = requestData.isPublished
            ? 'Recipe published successfully!'
            : 'Recipe saved as draft!';

        console.log(`[${requestId}] Recipe creation completed: ${createdRecipe.slug}`);

        return json(
            createSuccessResponse(createdRecipe, message, requestId),
            { status: 201 }
        );

    } catch (error) {
        console.error(`[${requestId}] Recipe creation failed:`, error);

        if (error instanceof Error) {
            if (error.message.includes('does not exist')) {
                return createErrorResponse(error.message, 400, requestId);
            }
            if (error.message.includes('unique')) {
                return createErrorResponse('A recipe with this title already exists', 409, requestId);
            }
        }

        return createErrorResponse(
            'Failed to create recipe. Please try again later.',
            500,
            requestId
        );
    }
};

/**
 * GET /api/recipes
 * Get recipes with filtering, pagination, and search
 */
export const GET: RequestHandler = async ({ url }) => {
    const requestId = generateRequestId();

    try {
        console.log(`[${requestId}] Recipe list request started`);

        // Parse query parameters
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
        const search = url.searchParams.get('search')?.trim();
        const category = url.searchParams.get('category')?.trim();
        const cuisine = url.searchParams.get('cuisine')?.trim();
        const difficulty = url.searchParams.get('difficulty')?.trim();
        const author = url.searchParams.get('author')?.trim();
        const published = url.searchParams.get('published') !== 'false'; // Default to published only

        const offset = (page - 1) * limit;

        // Build where conditions
        const conditions = [eq(table.recipe.isPublished, published)];

        if (search) {
            conditions.push(
                or(
                    ilike(table.recipe.title, `%${search}%`),
                    ilike(table.recipe.description, `%${search}%`)
                )
            );
        }

        if (category) {
            conditions.push(eq(table.category.slug, category));
        }

        if (cuisine) {
            conditions.push(eq(table.cuisine.slug, cuisine));
        }

        if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
            conditions.push(eq(table.recipe.difficulty, difficulty));
        }

        if (author) {
            conditions.push(eq(table.user.username, author));
        }

        // Get total count for pagination
        const [{ totalCount }] = await db
            .select({ totalCount: count() })
            .from(table.recipe)
            .leftJoin(table.user, eq(table.recipe.authorId, table.user.id))
            .leftJoin(table.category, eq(table.recipe.categoryId, table.category.id))
            .leftJoin(table.cuisine, eq(table.recipe.cuisineId, table.cuisine.id))
            .where(and(...conditions));

        // Get recipes
        const recipes = await db
            .select({
                id: table.recipe.id,
                title: table.recipe.title,
                slug: table.recipe.slug,
                description: table.recipe.description,
                prepTime: table.recipe.prepTime,
                cookTime: table.recipe.cookTime,
                totalTime: table.recipe.totalTime,
                servings: table.recipe.servings,
                difficulty: table.recipe.difficulty,
                featuredImage: table.recipe.featuredImage,
                isPublished: table.recipe.isPublished,
                views: table.recipe.views,
                likesCount: table.recipe.likesCount,
                ratingsCount: table.recipe.ratingsCount,
                averageRating: table.recipe.averageRating,
                createdAt: table.recipe.createdAt,
                // Author info
                authorId: table.user.id,
                authorUsername: table.user.username,
                authorFirstName: table.user.firstName,
                authorLastName: table.user.lastName,
                // Category info
                categoryId: table.category.id,
                categoryName: table.category.name,
                categorySlug: table.category.slug,
                // Cuisine info
                cuisineId: table.cuisine.id,
                cuisineName: table.cuisine.name,
                cuisineSlug: table.cuisine.slug
            })
            .from(table.recipe)
            .leftJoin(table.user, eq(table.recipe.authorId, table.user.id))
            .leftJoin(table.category, eq(table.recipe.categoryId, table.category.id))
            .leftJoin(table.cuisine, eq(table.recipe.cuisineId, table.cuisine.id))
            .where(and(...conditions))
            .orderBy(desc(table.recipe.createdAt))
            .limit(limit)
            .offset(offset);

        // Transform to response format
        const recipeResponses: RecipeResponse[] = recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            slug: recipe.slug,
            description: recipe.description,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            totalTime: recipe.totalTime,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            featuredImage: recipe.featuredImage,
            isPublished: recipe.isPublished,
            createdAt: recipe.createdAt,
            author: {
                id: recipe.authorId,
                username: recipe.authorUsername,
                firstName: recipe.authorFirstName,
                lastName: recipe.authorLastName
            },
            category: recipe.categoryId ? {
                id: recipe.categoryId,
                name: recipe.categoryName!,
                slug: recipe.categorySlug!
            } : null,
            cuisine: recipe.cuisineId ? {
                id: recipe.cuisineId,
                name: recipe.cuisineName!,
                slug: recipe.cuisineSlug!
            } : null,
            stats: {
                views: recipe.views,
                likes: recipe.likesCount,
                ratings: recipe.ratingsCount,
                averageRating: recipe.averageRating || 0
            },
            urls: {
                view: `/recipes/${recipe.slug}`,
                edit: `/recipes/${recipe.slug}/edit`,
                api: `/api/recipes/${recipe.id}`
            }
        }));

        const totalPages = Math.ceil(totalCount / limit);

        const responseData = {
            recipes: recipeResponses,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            filters: {
                search,
                category,
                cuisine,
                difficulty,
                author,
                published
            }
        };

        console.log(`[${requestId}] Recipe list completed: ${recipes.length} recipes`);

        return json(createSuccessResponse(responseData, 'Recipes retrieved successfully', requestId));

    } catch (error) {
        console.error(`[${requestId}] Recipe list failed:`, error);
        return createErrorResponse('Failed to fetch recipes', 500, requestId);
    }
};

/**
 * PATCH /api/recipes?id={recipeId}
 * Updates an existing recipe with authorization check
 */
export const PATCH: RequestHandler = async ({ request, locals, url }) => {
    const requestId = generateRequestId();

    try {
        // Check authentication
        if (!locals.user || !locals.user.id) {
            return createErrorResponse('Authentication required', 401, requestId);
        }

        // Get recipe ID from query parameter
        const recipeId = url.searchParams.get('id');
        if (!recipeId || isNaN(parseInt(recipeId))) {
            return createErrorResponse('Valid recipe ID is required', 400, requestId);
        }

        const id = parseInt(recipeId);
        console.log(`[${requestId}] Recipe update request for ID ${id} by: ${locals.user.username}`);

        // Fetch existing recipe to verify ownership
        const [existingRecipe] = await db
            .select({
                id: table.recipe.id,
                authorId: table.recipe.authorId,
                slug: table.recipe.slug
            })
            .from(table.recipe)
            .where(eq(table.recipe.id, id))
            .limit(1);

        if (!existingRecipe) {
            return createErrorResponse('Recipe not found', 404, requestId);
        }

        // CRITICAL: Authorization check - verify user owns this recipe
        if (existingRecipe.authorId !== locals.user.id) {
            console.warn(`[${requestId}] Unauthorized update attempt by ${locals.user.username} on recipe ${id}`);
            return createErrorResponse('Forbidden: You can only edit your own recipes', 403, requestId);
        }

        // Parse request body
        let requestData;
        try {
            requestData = await request.json();
        } catch (e) {
            return createErrorResponse('Invalid JSON in request body', 400, requestId);
        }

        // Validate recipe data
        const validation = validateRecipeData(requestData);
        if (!validation.valid) {
            console.log(`[${requestId}] Validation failed:`, validation.errors);
            return createErrorResponse(
                `Validation failed: ${validation.errors.join(', ')}`,
                400,
                requestId
            );
        }

        // Validate foreign key references
        await validateReferences(requestData.categoryId, requestData.cuisineId);

        // Generate new slug if title changed
        let finalSlug = existingRecipe.slug;
        if (requestData.title.trim() !== existingRecipe.slug) {
            const baseSlug = generateSlug(requestData.title);
            finalSlug = await ensureUniqueSlug(baseSlug, id);
        }

        // Update recipe in transaction
        const updatedRecipe = await db.transaction(async (tx) => {
            console.log(`[${requestId}] Starting recipe update transaction`);

            // Update main recipe record
            const totalTime = requestData.prepTime + requestData.cookTime;
            await tx
                .update(table.recipe)
                .set({
                    title: requestData.title.trim(),
                    slug: finalSlug,
                    description: requestData.description.trim(),
                    content: requestData.content?.trim() || null,
                    prepTime: requestData.prepTime,
                    cookTime: requestData.cookTime,
                    totalTime: totalTime,
                    servings: requestData.servings,
                    difficulty: requestData.difficulty,
                    dietaryType: requestData.dietaryType || 'non-vegetarian',
                    featuredImage: requestData.featuredImage?.trim() || null,
                    videoUrl: requestData.videoUrl?.trim() || null,
                    categoryId: requestData.categoryId || null,
                    cuisineId: requestData.cuisineId || null,
                    isPublished: requestData.isPublished || false,
                    isDraft: !(requestData.isPublished || false),
                    publishedAt: requestData.isPublished && !existingRecipe.publishedAt
                        ? new Date()
                        : existingRecipe.publishedAt,
                    updatedAt: new Date()
                })
                .where(eq(table.recipe.id, id));

            console.log(`[${requestId}] Updated recipe: ${requestData.title} (ID: ${id})`);

            // Delete existing ingredients and re-insert
            await tx.delete(table.recipeIngredient).where(eq(table.recipeIngredient.recipeId, id));

            let ingredientCount = 0;
            for (let groupIndex = 0; groupIndex < requestData.ingredients.length; groupIndex++) {
                const group = requestData.ingredients[groupIndex];
                for (let itemIndex = 0; itemIndex < group.items.length; itemIndex++) {
                    const item = group.items[itemIndex];
                    if (item.name.trim()) {
                        await tx.insert(table.recipeIngredient).values({
                            recipeId: id,
                            groupName: group.groupName?.trim() || null,
                            groupOrder: groupIndex,
                            name: item.name.trim(),
                            amount: item.amount?.trim() || null,
                            unit: item.unit?.trim() || null,
                            preparation: item.preparation?.trim() || null,
                            notes: item.notes?.trim() || null,
                            itemOrder: itemIndex
                        });
                        ingredientCount++;
                    }
                }
            }
            console.log(`[${requestId}] Updated ${ingredientCount} ingredients`);

            // Delete existing instructions and re-insert
            await tx.delete(table.recipeInstruction).where(eq(table.recipeInstruction.recipeId, id));

            let stepCount = 0;
            for (let index = 0; index < requestData.steps.length; index++) {
                const step = requestData.steps[index];
                if (step.content.trim()) {
                    await tx.insert(table.recipeInstruction).values({
                        recipeId: id,
                        stepNumber: index + 1,
                        title: step.title?.trim() || null,
                        content: step.content.trim(),
                        image: step.image?.trim() || null,
                        videoUrl: step.videoUrl?.trim() || null,
                        estimatedTime: step.estimatedTime || null,
                        temperature: step.temperature?.trim() || null,
                        tips: step.tips?.trim() || null
                    });
                    stepCount++;
                }
            }
            console.log(`[${requestId}] Updated ${stepCount} instruction steps`);

            // Delete existing additional images and re-insert
            await tx.delete(table.recipeImage).where(eq(table.recipeImage.recipeId, id));

            if (requestData.images && requestData.images.length > 0) {
                const imageInserts = requestData.images
                    .filter(url => url.trim())
                    .map((url, index) => ({
                        recipeId: id,
                        url: url.trim(),
                        sortOrder: index,
                        isFeatured: false
                    }));

                if (imageInserts.length > 0) {
                    await tx.insert(table.recipeImage).values(imageInserts);
                    console.log(`[${requestId}] Updated ${imageInserts.length} recipe images`);
                }
            }

            // Update tags (delete old, decrement counts, insert new)
            const existingTags = await tx
                .select({ tagId: table.recipeTag.tagId })
                .from(table.recipeTag)
                .where(eq(table.recipeTag.recipeId, id));

            await tx.delete(table.recipeTag).where(eq(table.recipeTag.recipeId, id));

            // Decrement usage count for old tags
            for (const { tagId } of existingTags) {
                await tx
                    .update(table.tag)
                    .set({ usageCount: sql`${table.tag.usageCount} - 1` })
                    .where(eq(table.tag.id, tagId));
            }

            // Insert new tags
            let tagCount = 0;
            if (requestData.tags && requestData.tags.length > 0) {
                const uniqueTags = [...new Set(requestData.tags.filter(tag => tag.trim()))];

                for (const tagName of uniqueTags) {
                    let tagId: number;

                    const [existingTag] = await tx
                        .select({ id: table.tag.id })
                        .from(table.tag)
                        .where(eq(table.tag.name, tagName.trim()))
                        .limit(1);

                    if (existingTag) {
                        tagId = existingTag.id;
                        await tx
                            .update(table.tag)
                            .set({ usageCount: sql`${table.tag.usageCount} + 1` })
                            .where(eq(table.tag.id, tagId));
                    } else {
                        const tagSlug = generateSlug(tagName);
                        const [newTag] = await tx
                            .insert(table.tag)
                            .values({
                                name: tagName.trim(),
                                slug: tagSlug,
                                usageCount: 1
                            })
                            .returning({ id: table.tag.id });
                        tagId = newTag.id;
                    }

                    await tx.insert(table.recipeTag).values({
                        recipeId: id,
                        tagId
                    });
                    tagCount++;
                }
                console.log(`[${requestId}] Updated ${tagCount} tags`);
            }

            // Delete existing tips and re-insert
            await tx.delete(table.recipeTip).where(eq(table.recipeTip.recipeId, id));

            let tipCount = 0;
            if (requestData.tips && requestData.tips.length > 0) {
                const tipInserts = requestData.tips
                    .filter(tip => tip.content.trim())
                    .map((tip, index) => ({
                        recipeId: id,
                        content: tip.content.trim(),
                        category: tip.category || null,
                        sortOrder: index
                    }));

                if (tipInserts.length > 0) {
                    await tx.insert(table.recipeTip).values(tipInserts);
                    tipCount = tipInserts.length;
                    console.log(`[${requestId}] Updated ${tipCount} recipe tips`);
                }
            }

            // Get updated recipe with relations
            const [recipeWithRelations] = await tx
                .select({
                    id: table.recipe.id,
                    title: table.recipe.title,
                    slug: table.recipe.slug,
                    description: table.recipe.description,
                    prepTime: table.recipe.prepTime,
                    cookTime: table.recipe.cookTime,
                    totalTime: table.recipe.totalTime,
                    servings: table.recipe.servings,
                    difficulty: table.recipe.difficulty,
                    featuredImage: table.recipe.featuredImage,
                    isPublished: table.recipe.isPublished,
                    views: table.recipe.views,
                    likesCount: table.recipe.likesCount,
                    ratingsCount: table.recipe.ratingsCount,
                    averageRating: table.recipe.averageRating,
                    createdAt: table.recipe.createdAt,
                    // Author info
                    authorId: table.user.id,
                    authorUsername: table.user.username,
                    authorFirstName: table.user.firstName,
                    authorLastName: table.user.lastName,
                    // Category info
                    categoryId: table.category.id,
                    categoryName: table.category.name,
                    categorySlug: table.category.slug,
                    // Cuisine info
                    cuisineId: table.cuisine.id,
                    cuisineName: table.cuisine.name,
                    cuisineSlug: table.cuisine.slug
                })
                .from(table.recipe)
                .leftJoin(table.user, eq(table.recipe.authorId, table.user.id))
                .leftJoin(table.category, eq(table.recipe.categoryId, table.category.id))
                .leftJoin(table.cuisine, eq(table.recipe.cuisineId, table.cuisine.id))
                .where(eq(table.recipe.id, id))
                .limit(1);

            console.log(`[${requestId}] Recipe update completed successfully`);

            return recipeWithRelations;
        });

        // Build response
        const response: RecipeResponse = {
            id: updatedRecipe.id,
            title: updatedRecipe.title,
            slug: updatedRecipe.slug,
            description: updatedRecipe.description,
            prepTime: updatedRecipe.prepTime,
            cookTime: updatedRecipe.cookTime,
            totalTime: updatedRecipe.totalTime,
            servings: updatedRecipe.servings,
            difficulty: updatedRecipe.difficulty,
            featuredImage: updatedRecipe.featuredImage,
            isPublished: updatedRecipe.isPublished,
            createdAt: updatedRecipe.createdAt,
            author: {
                id: updatedRecipe.authorId,
                username: updatedRecipe.authorUsername,
                firstName: updatedRecipe.authorFirstName,
                lastName: updatedRecipe.authorLastName
            },
            category: updatedRecipe.categoryId ? {
                id: updatedRecipe.categoryId,
                name: updatedRecipe.categoryName!,
                slug: updatedRecipe.categorySlug!
            } : null,
            cuisine: updatedRecipe.cuisineId ? {
                id: updatedRecipe.cuisineId,
                name: updatedRecipe.cuisineName!,
                slug: updatedRecipe.cuisineSlug!
            } : null,
            stats: {
                views: updatedRecipe.views,
                likes: updatedRecipe.likesCount,
                ratings: updatedRecipe.ratingsCount,
                averageRating: updatedRecipe.averageRating || 0
            },
            urls: {
                view: `/recipes/${updatedRecipe.slug}`,
                edit: `/recipes/${updatedRecipe.slug}/edit`,
                api: `/api/recipes/${updatedRecipe.id}`
            }
        };

        const message = requestData.isPublished
            ? 'Recipe updated and published successfully!'
            : 'Recipe updated and saved as draft!';

        return json(
            createSuccessResponse(response, message, requestId),
            { status: 200 }
        );

    } catch (error) {
        console.error(`[${requestId}] Recipe update failed:`, error);

        if (error instanceof Error) {
            if (error.message.includes('does not exist')) {
                return createErrorResponse(error.message, 400, requestId);
            }
        }

        return createErrorResponse(
            'Failed to update recipe. Please try again later.',
            500,
            requestId
        );
    }
};

/**
 * DELETE /api/recipes?id={recipeId}
 * Deletes a recipe with authorization check
 */
export const DELETE: RequestHandler = async ({ locals, url }) => {
    const requestId = generateRequestId();

    try {
        // Check authentication
        if (!locals.user || !locals.user.id) {
            return createErrorResponse('Authentication required', 401, requestId);
        }

        // Get recipe ID from query parameter
        const recipeId = url.searchParams.get('id');
        if (!recipeId || isNaN(parseInt(recipeId))) {
            return createErrorResponse('Valid recipe ID is required', 400, requestId);
        }

        const id = parseInt(recipeId);
        console.log(`[${requestId}] Recipe delete request for ID ${id} by: ${locals.user.username}`);

        // Fetch existing recipe to verify ownership
        const [existingRecipe] = await db
            .select({
                id: table.recipe.id,
                authorId: table.recipe.authorId,
                title: table.recipe.title,
                slug: table.recipe.slug
            })
            .from(table.recipe)
            .where(eq(table.recipe.id, id))
            .limit(1);

        if (!existingRecipe) {
            return createErrorResponse('Recipe not found', 404, requestId);
        }

        // CRITICAL: Authorization check - verify user owns this recipe
        if (existingRecipe.authorId !== locals.user.id) {
            console.warn(`[${requestId}] Unauthorized delete attempt by ${locals.user.username} on recipe ${id}`);
            return createErrorResponse('Forbidden: You can only delete your own recipes', 403, requestId);
        }

        // Delete recipe in transaction (cascade deletes will handle related records)
        await db.transaction(async (tx) => {
            console.log(`[${requestId}] Starting recipe deletion transaction`);

            // Get associated tags to decrement their usage count
            const recipeTags = await tx
                .select({ tagId: table.recipeTag.tagId })
                .from(table.recipeTag)
                .where(eq(table.recipeTag.recipeId, id));

            // Delete recipe (cascades will delete related records automatically)
            await tx.delete(table.recipe).where(eq(table.recipe.id, id));

            // Decrement tag usage counts
            for (const { tagId } of recipeTags) {
                await tx
                    .update(table.tag)
                    .set({ usageCount: sql`GREATEST(0, ${table.tag.usageCount} - 1)` })
                    .where(eq(table.tag.id, tagId));
            }

            console.log(`[${requestId}] Recipe deleted successfully: ${existingRecipe.title}`);
        });

        return json(
            createSuccessResponse(
                {
                    deletedRecipe: {
                        id: existingRecipe.id,
                        title: existingRecipe.title,
                        slug: existingRecipe.slug
                    }
                },
                'Recipe deleted successfully',
                requestId
            ),
            { status: 200 }
        );

    } catch (error) {
        console.error(`[${requestId}] Recipe deletion failed:`, error);

        return createErrorResponse(
            'Failed to delete recipe. Please try again later.',
            500,
            requestId
        );
    }
};