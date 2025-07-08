// src/routes/api/cuisines/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

// ========================================
// TYPES & INTERFACES
// ========================================

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    timestamp: string;
}

interface CuisineResponse {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    sortOrder: number;
    isActive: boolean;
    recipeCount: number;
    createdAt: Date;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };
}

function createErrorResponse(error: string, statusCode: number = 500): Response {
    const response: ApiResponse = {
        success: false,
        error,
        timestamp: new Date().toISOString()
    };

    return json(response, { status: statusCode });
}

// ========================================
// API HANDLERS
// ========================================

/**
 * GET /api/cuisines
 * Returns all active cuisines with recipe counts, ordered by sortOrder
 */
export const GET: RequestHandler = async () => {
    try {
        console.log('[API] GET /api/cuisines - Fetching cuisines...');

        // Query active cuisines ordered by sortOrder, then name
        const cuisines = await db
            .select({
                id: table.cuisine.id,
                name: table.cuisine.name,
                slug: table.cuisine.slug,
                description: table.cuisine.description,
                image: table.cuisine.image,
                sortOrder: table.cuisine.sortOrder,
                isActive: table.cuisine.isActive,
                createdAt: table.cuisine.createdAt,
                // We'll add recipe count later with a more complex query if needed
                recipeCount: 0 // Placeholder for now
            })
            .from(table.cuisine)
            .where(eq(table.cuisine.isActive, true)) // Only active cuisines
            .orderBy(asc(table.cuisine.sortOrder), asc(table.cuisine.name));

        console.log(`[API] Found ${cuisines.length} active cuisines`);

        // Transform the data to match our response interface
        const cuisineResponse: CuisineResponse[] = cuisines.map(cuisine => ({
            id: cuisine.id,
            name: cuisine.name,
            slug: cuisine.slug,
            description: cuisine.description,
            image: cuisine.image,
            sortOrder: cuisine.sortOrder,
            isActive: cuisine.isActive,
            recipeCount: cuisine.recipeCount,
            createdAt: cuisine.createdAt
        }));

        return json(createSuccessResponse(cuisineResponse, 'Cuisines fetched successfully'));

    } catch (error) {
        console.error('[API] Error fetching cuisines:', error);

        return createErrorResponse(
            'Failed to fetch cuisines. Please try again later.',
            500
        );
    }
};

/**
 * POST /api/cuisines
 * Creates a new cuisine (Admin only)
 */
export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        // Check authentication
        if (!locals.user) {
            return createErrorResponse('Authentication required', 401);
        }

        // For now, we'll skip admin check - add later if needed
        // if (!locals.user.isAdmin) {
        //   return createErrorResponse('Admin access required', 403);
        // }

        console.log('[API] POST /api/cuisines - Creating new cuisine...');

        // Parse request body
        const requestData = await request.json();

        // Basic validation
        if (!requestData.name || typeof requestData.name !== 'string') {
            return createErrorResponse('Cuisine name is required', 400);
        }

        if (requestData.name.trim().length < 2) {
            return createErrorResponse('Cuisine name must be at least 2 characters', 400);
        }

        if (requestData.name.trim().length > 100) {
            return createErrorResponse('Cuisine name cannot exceed 100 characters', 400);
        }

        // Generate slug from name
        const slug = requestData.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (slug.length > 100) {
            return createErrorResponse('Generated slug is too long', 400);
        }

        // Check if cuisine with this slug already exists
        const existingCuisine = await db
            .select({ id: table.cuisine.id })
            .from(table.cuisine)
            .where(eq(table.cuisine.slug, slug))
            .limit(1);

        if (existingCuisine.length > 0) {
            return createErrorResponse('A cuisine with this name already exists', 409);
        }

        // Prepare cuisine data with all fields
        const cuisineData = {
            name: requestData.name.trim(),
            slug: slug,
            description: requestData.description?.trim() || null,
            image: requestData.image?.trim() || null,
            sortOrder: requestData.sortOrder ? parseInt(requestData.sortOrder) : 0,
            isActive: requestData.isActive !== undefined ? requestData.isActive : true
        };

        // Validate sortOrder
        if (isNaN(cuisineData.sortOrder)) {
            return createErrorResponse('Sort order must be a valid number', 400);
        }

        // Create the cuisine
        const [newCuisine] = await db
            .insert(table.cuisine)
            .values(cuisineData)
            .returning({
                id: table.cuisine.id,
                name: table.cuisine.name,
                slug: table.cuisine.slug,
                description: table.cuisine.description,
                image: table.cuisine.image,
                sortOrder: table.cuisine.sortOrder,
                isActive: table.cuisine.isActive,
                createdAt: table.cuisine.createdAt
            });

        console.log(`[API] Created cuisine: ${newCuisine.name} (ID: ${newCuisine.id})`);

        const cuisineResponse: CuisineResponse = {
            ...newCuisine,
            recipeCount: 0
        };

        return json(
            createSuccessResponse(cuisineResponse, 'Cuisine created successfully'),
            { status: 201 }
        );

    } catch (error) {
        console.error('[API] Error creating cuisine:', error);

        // Handle unique constraint violations
        if (error instanceof Error && error.message.includes('unique')) {
            return createErrorResponse('A cuisine with this name already exists', 409);
        }

        return createErrorResponse(
            'Failed to create cuisine. Please try again later.',
            500
        );
    }
};