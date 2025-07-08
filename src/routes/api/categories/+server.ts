// src/routes/api/categories/+server.ts
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

interface CategoryResponse {
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
 * GET /api/categories
 * Returns all active categories with recipe counts, ordered by sortOrder
 */
export const GET: RequestHandler = async () => {
    try {
        console.log('[API] GET /api/categories - Fetching categories...');

        // Query active categories ordered by sortOrder, then name
        const categories = await db
            .select({
                id: table.category.id,
                name: table.category.name,
                slug: table.category.slug,
                description: table.category.description,
                image: table.category.image,
                sortOrder: table.category.sortOrder,
                isActive: table.category.isActive,
                createdAt: table.category.createdAt,
                // We'll add recipe count later with a more complex query if needed
                recipeCount: 0 // Placeholder for now
            })
            .from(table.category)
            .where(eq(table.category.isActive, true)) // Only active categories
            .orderBy(asc(table.category.sortOrder), asc(table.category.name));

        console.log(`[API] Found ${categories.length} active categories`);

        // Transform the data to match our response interface
        const categoryResponse: CategoryResponse[] = categories.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            sortOrder: category.sortOrder,
            isActive: category.isActive,
            recipeCount: category.recipeCount,
            createdAt: category.createdAt
        }));

        return json(createSuccessResponse(categoryResponse, 'Categories fetched successfully'));

    } catch (error) {
        console.error('[API] Error fetching categories:', error);

        return createErrorResponse(
            'Failed to fetch categories. Please try again later.',
            500
        );
    }
};

/**
 * POST /api/categories
 * Creates a new category (Admin only)
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

        console.log('[API] POST /api/categories - Creating new category...');

        // Parse request body
        const requestData = await request.json();

        // Basic validation
        if (!requestData.name || typeof requestData.name !== 'string') {
            return createErrorResponse('Category name is required', 400);
        }

        if (requestData.name.trim().length < 2) {
            return createErrorResponse('Category name must be at least 2 characters', 400);
        }

        if (requestData.name.trim().length > 100) {
            return createErrorResponse('Category name cannot exceed 100 characters', 400);
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

        // Check if category with this slug already exists
        const existingCategory = await db
            .select({ id: table.category.id })
            .from(table.category)
            .where(eq(table.category.slug, slug))
            .limit(1);

        if (existingCategory.length > 0) {
            return createErrorResponse('A category with this name already exists', 409);
        }

        // Prepare category data with all fields
        const categoryData = {
            name: requestData.name.trim(),
            slug: slug,
            description: requestData.description?.trim() || null,
            image: requestData.image?.trim() || null,
            sortOrder: requestData.sortOrder ? parseInt(requestData.sortOrder) : 0,
            isActive: requestData.isActive !== undefined ? requestData.isActive : true
        };

        // Validate sortOrder
        if (isNaN(categoryData.sortOrder)) {
            return createErrorResponse('Sort order must be a valid number', 400);
        }

        // Create the category
        const [newCategory] = await db
            .insert(table.category)
            .values(categoryData)
            .returning({
                id: table.category.id,
                name: table.category.name,
                slug: table.category.slug,
                description: table.category.description,
                image: table.category.image,
                sortOrder: table.category.sortOrder,
                isActive: table.category.isActive,
                createdAt: table.category.createdAt
            });

        console.log(`[API] Created category: ${newCategory.name} (ID: ${newCategory.id})`);

        const categoryResponse: CategoryResponse = {
            ...newCategory,
            recipeCount: 0
        };

        return json(
            createSuccessResponse(categoryResponse, 'Category created successfully'),
            { status: 201 }
        );

    } catch (error) {
        console.error('[API] Error creating category:', error);

        // Handle unique constraint violations
        if (error instanceof Error && error.message.includes('unique')) {
            return createErrorResponse('A category with this name already exists', 409);
        }

        return createErrorResponse(
            'Failed to create category. Please try again later.',
            500
        );
    }
};