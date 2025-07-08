// src/routes/api/users/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, desc, count, ne } from 'drizzle-orm';

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

interface PublicUserProfile {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    profileImage: string | null;
    createdAt: Date;
    stats: {
        recipesCount: number;
        likesReceived: number;
        averageRating: number;
    };
}

interface PrivateUserProfile extends PublicUserProfile {
    email: string | null;
    age: number | null;
    updatedAt: Date;
}

interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    bio?: string;
    email?: string;
    age?: number;
    profileImage?: string;
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

async function getUserStats(userId: string) {
    try {
        // Count user's published recipes
        const [recipeCount] = await db
            .select({ count: count() })
            .from(table.recipe)
            .where(and(
                eq(table.recipe.authorId, userId),
                eq(table.recipe.isPublished, true)
            ));

        // Count likes on user's recipes
        const [likesCount] = await db
            .select({ count: count() })
            .from(table.recipeLike)
            .innerJoin(table.recipe, eq(table.recipeLike.recipeId, table.recipe.id))
            .where(eq(table.recipe.authorId, userId));

        // Calculate average rating of user's recipes
        const userRecipes = await db
            .select({ averageRating: table.recipe.averageRating })
            .from(table.recipe)
            .where(and(
                eq(table.recipe.authorId, userId),
                eq(table.recipe.isPublished, true)
            ));

        const totalRating = userRecipes.reduce((sum, recipe) =>
            sum + (recipe.averageRating || 0), 0
        );
        const averageRating = userRecipes.length > 0 ? totalRating / userRecipes.length : 0;

        return {
            recipesCount: recipeCount.count,
            likesReceived: likesCount.count,
            averageRating: Math.round(averageRating)
        };
    } catch (error) {
        console.error('[USERS] Error calculating user stats:', error);
        return {
            recipesCount: 0,
            likesReceived: 0,
            averageRating: 0
        };
    }
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateAge(age: number): boolean {
    return age >= 13 && age <= 120;
}

function sanitizeUserInput(input: UpdateUserRequest): UpdateUserRequest {
    const sanitized: UpdateUserRequest = {};

    if (input.firstName !== undefined) {
        sanitized.firstName = input.firstName?.trim().slice(0, 50) || null;
    }

    if (input.lastName !== undefined) {
        sanitized.lastName = input.lastName?.trim().slice(0, 50) || null;
    }

    if (input.bio !== undefined) {
        sanitized.bio = input.bio?.trim().slice(0, 500) || null;
    }

    if (input.email !== undefined) {
        sanitized.email = input.email?.trim().toLowerCase() || null;
    }

    if (input.age !== undefined) {
        sanitized.age = typeof input.age === 'number' ? input.age : null;
    }

    if (input.profileImage !== undefined) {
        sanitized.profileImage = input.profileImage?.trim() || null;
    }

    return sanitized;
}

// ========================================
// API HANDLERS
// ========================================

/**
 * GET /api/users?username=john - Get public profile by username
 * GET /api/users?me=true - Get current user's private profile
 */
export const GET: RequestHandler = async ({ url, locals }) => {
    try {
        const username = url.searchParams.get('username');
        const isMe = url.searchParams.get('me') === 'true';

        // Handle current user's private profile request
        if (isMe) {
            if (!locals.user) {
                return createErrorResponse('Authentication required', 401);
            }

            console.log(`[API] GET /api/users?me=true - Fetching private profile for: ${locals.user.username}`);

            // Get user's complete profile (including private fields)
            const [user] = await db
                .select({
                    id: table.user.id,
                    username: table.user.username,
                    firstName: table.user.firstName,
                    lastName: table.user.lastName,
                    bio: table.user.bio,
                    email: table.user.email,
                    age: table.user.age,
                    profileImage: table.user.profileImage,
                    createdAt: table.user.createdAt,
                    updatedAt: table.user.updatedAt
                    // Note: Still excluding passwordHash for security
                })
                .from(table.user)
                .where(eq(table.user.id, locals.user.id))
                .limit(1);

            if (!user) {
                return createErrorResponse('User not found', 404);
            }

            // Get user statistics
            const stats = await getUserStats(user.id);

            const privateProfile: PrivateUserProfile = {
                ...user,
                stats
            };

            return json(createSuccessResponse(privateProfile, 'Private profile retrieved successfully'));
        }

        // Handle public profile request
        if (!username) {
            return createErrorResponse('Username parameter is required', 400);
        }

        console.log(`[API] GET /api/users - Fetching public profile for: ${username}`);

        // Get user basic info (excluding sensitive data)
        const [user] = await db
            .select({
                id: table.user.id,
                username: table.user.username,
                firstName: table.user.firstName,
                lastName: table.user.lastName,
                bio: table.user.bio,
                profileImage: table.user.profileImage,
                createdAt: table.user.createdAt,
                // Note: Explicitly excluding passwordHash, email, age for public profile
            })
            .from(table.user)
            .where(eq(table.user.username, username))
            .limit(1);

        if (!user) {
            return createErrorResponse('User not found', 404);
        }

        // Get user statistics
        const stats = await getUserStats(user.id);

        const publicProfile: PublicUserProfile = {
            ...user,
            stats
        };

        return json(createSuccessResponse(publicProfile, 'User profile retrieved successfully'));

    } catch (error) {
        console.error('[API] Error fetching user profile:', error);
        return createErrorResponse('Failed to fetch user profile', 500);
    }
};

/**
 * PUT /api/users
 * Update current user's profile
 */
export const PUT: RequestHandler = async ({ request, locals }) => {
    try {
        // Check authentication
        if (!locals.user) {
            return createErrorResponse('Authentication required', 401);
        }

        console.log(`[API] PUT /api/users - Updating profile for: ${locals.user.username}`);

        // Parse and validate request body
        const requestData = await request.json();
        const sanitizedData = sanitizeUserInput(requestData);

        // Validate email if provided
        if (sanitizedData.email && !validateEmail(sanitizedData.email)) {
            return createErrorResponse('Invalid email format', 400);
        }

        // Validate age if provided
        if (sanitizedData.age !== undefined && sanitizedData.age !== null && !validateAge(sanitizedData.age)) {
            return createErrorResponse('Age must be between 13 and 120', 400);
        }

        // Check if email is already taken (if email is being updated)
        if (sanitizedData.email) {
            const [existingUser] = await db
                .select({ id: table.user.id })
                .from(table.user)
                .where(and(
                    eq(table.user.email, sanitizedData.email),
                    ne(table.user.id, locals.user.id)
                ))
                .limit(1);

            if (existingUser) {
                return createErrorResponse('Email is already in use', 409);
            }
        }

        // Build update data (only include fields that were provided)
        const updateData: any = {
            updatedAt: new Date()
        };

        Object.entries(sanitizedData).forEach(([key, value]) => {
            if (value !== undefined) {
                updateData[key] = value;
            }
        });

        // Update user profile
        const [updatedUser] = await db
            .update(table.user)
            .set(updateData)
            .where(eq(table.user.id, locals.user.id))
            .returning({
                id: table.user.id,
                username: table.user.username,
                firstName: table.user.firstName,
                lastName: table.user.lastName,
                bio: table.user.bio,
                email: table.user.email,
                age: table.user.age,
                profileImage: table.user.profileImage,
                createdAt: table.user.createdAt,
                updatedAt: table.user.updatedAt
            });

        // Get updated stats
        const stats = await getUserStats(updatedUser.id);

        const privateProfile: PrivateUserProfile = {
            ...updatedUser,
            stats
        };

        console.log(`[API] Profile updated successfully for: ${updatedUser.username}`);

        return json(createSuccessResponse(privateProfile, 'Profile updated successfully'));

    } catch (error) {
        console.error('[API] Error updating user profile:', error);

        // Handle unique constraint violations
        if (error instanceof Error && error.message.includes('unique')) {
            return createErrorResponse('Email is already in use', 409);
        }

        return createErrorResponse('Failed to update profile', 500);
    }
};