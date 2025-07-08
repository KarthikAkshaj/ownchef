// src/routes/api/upload/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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

interface UploadResponse {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
}

// ========================================
// CONFIGURATION
// ========================================

const UPLOAD_CONFIG = {
    // File size limits (in bytes)
    maxFileSize: 5 * 1024 * 1024, // 5MB

    // Allowed file types
    allowedMimeTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif'
    ],

    // Allowed file extensions
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],

    // Upload directory (relative to static/)
    uploadDir: 'uploads',

    // Subdirectories for organization
    subDirs: {
        recipes: 'recipes',
        profiles: 'profiles',
        categories: 'categories',
        temp: 'temp'
    }
};

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

function generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(originalName).toLowerCase();
    const nameWithoutExt = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '_');

    return `${nameWithoutExt}_${timestamp}_${randomSuffix}${ext}`;
}

function validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > UPLOAD_CONFIG.maxFileSize) {
        return {
            valid: false,
            error: `File size too large. Maximum allowed: ${UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB`
        };
    }

    // Check file type
    if (!UPLOAD_CONFIG.allowedMimeTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${UPLOAD_CONFIG.allowedMimeTypes.join(', ')}`
        };
    }

    // Check file extension
    const ext = path.extname(file.name).toLowerCase();
    if (!UPLOAD_CONFIG.allowedExtensions.includes(ext)) {
        return {
            valid: false,
            error: `Invalid file extension. Allowed extensions: ${UPLOAD_CONFIG.allowedExtensions.join(', ')}`
        };
    }

    // Check if file name is provided
    if (!file.name || file.name.trim() === '') {
        return {
            valid: false,
            error: 'File name is required'
        };
    }

    return { valid: true };
}

async function ensureUploadDirectory(uploadPath: string): Promise<void> {
    try {
        if (!existsSync(uploadPath)) {
            await mkdir(uploadPath, { recursive: true });
            console.log(`[UPLOAD] Created directory: ${uploadPath}`);
        }
    } catch (error) {
        console.error('[UPLOAD] Error creating directory:', error);
        throw new Error('Failed to create upload directory');
    }
}

// ========================================
// API HANDLERS
// ========================================

/**
 * POST /api/upload
 * Handles file uploads with validation and storage
 * 
 * Body: FormData with:
 * - file: File (required)
 * - type: string (optional) - 'recipes', 'profiles', 'categories' 
 * - alt: string (optional) - alt text for accessibility
 */
export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        // Check authentication
        if (!locals.user) {
            return createErrorResponse('Authentication required', 401);
        }

        console.log('[API] POST /api/upload - Processing file upload...');

        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string || 'temp';
        const alt = formData.get('alt') as string || '';

        // Validate file exists
        if (!file) {
            return createErrorResponse('No file provided', 400);
        }

        console.log(`[UPLOAD] Processing file: ${file.name} (${file.size} bytes, ${file.type})`);

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            return createErrorResponse(validation.error!, 400);
        }

        // Determine upload subdirectory
        const subDir = UPLOAD_CONFIG.subDirs[type as keyof typeof UPLOAD_CONFIG.subDirs] || UPLOAD_CONFIG.subDirs.temp;

        // Generate unique filename
        const uniqueFilename = generateUniqueFilename(file.name);

        // Construct file paths
        const uploadDir = path.join('static', UPLOAD_CONFIG.uploadDir, subDir);
        const filePath = path.join(uploadDir, uniqueFilename);
        const publicUrl = `/${UPLOAD_CONFIG.uploadDir}/${subDir}/${uniqueFilename}`;

        // Ensure upload directory exists
        await ensureUploadDirectory(uploadDir);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await writeFile(filePath, buffer);

        console.log(`[UPLOAD] File saved successfully: ${filePath}`);

        // Prepare response data
        const uploadResponse: UploadResponse = {
            url: publicUrl,
            filename: uniqueFilename,
            originalName: file.name,
            size: file.size,
            mimeType: file.type,
            uploadedAt: new Date().toISOString()
        };

        return json(
            createSuccessResponse(uploadResponse, 'File uploaded successfully'),
            { status: 201 }
        );

    } catch (error) {
        console.error('[API] Error uploading file:', error);

        // Handle specific errors
        if (error instanceof Error) {
            if (error.message.includes('ENOSPC')) {
                return createErrorResponse('Server storage full. Please try again later.', 507);
            }
            if (error.message.includes('EACCES')) {
                return createErrorResponse('Server permission error. Please contact support.', 500);
            }
        }

        return createErrorResponse(
            'Failed to upload file. Please try again later.',
            500
        );
    }
};

/**
 * GET /api/upload
 * Returns upload configuration and limits (for frontend)
 */
export const GET: RequestHandler = async () => {
    try {
        const config = {
            maxFileSize: UPLOAD_CONFIG.maxFileSize,
            maxFileSizeMB: UPLOAD_CONFIG.maxFileSize / (1024 * 1024),
            allowedMimeTypes: UPLOAD_CONFIG.allowedMimeTypes,
            allowedExtensions: UPLOAD_CONFIG.allowedExtensions,
            supportedTypes: Object.keys(UPLOAD_CONFIG.subDirs)
        };

        return json(createSuccessResponse(config, 'Upload configuration retrieved'));

    } catch (error) {
        console.error('[API] Error getting upload config:', error);
        return createErrorResponse('Failed to get upload configuration', 500);
    }
};

/**
 * DELETE /api/upload
 * Deletes an uploaded file (Admin or file owner only)
 * 
 * Body: { url: string }
 */
export const DELETE: RequestHandler = async ({ request, locals }) => {
    try {
        // Check authentication
        if (!locals.user) {
            return createErrorResponse('Authentication required', 401);
        }

        const { url } = await request.json();

        if (!url || typeof url !== 'string') {
            return createErrorResponse('File URL is required', 400);
        }

        // TODO: Add file ownership validation
        // TODO: Add admin check
        // TODO: Implement file deletion logic

        // For now, just return success (implement later when needed)
        return json(createSuccessResponse({ deleted: true }, 'File deletion not implemented yet'));

    } catch (error) {
        console.error('[API] Error deleting file:', error);
        return createErrorResponse('Failed to delete file', 500);
    }
};