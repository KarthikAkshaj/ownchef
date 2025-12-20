// src/lib/server/storage.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
	R2_ACCOUNT_ID,
	R2_ACCESS_KEY_ID,
	R2_SECRET_ACCESS_KEY,
	R2_BUCKET_NAME,
	R2_PUBLIC_URL
} from '$env/static/private';

// ========================================
// R2 CLIENT CONFIGURATION
// ========================================

const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

// ========================================
// TYPES & INTERFACES
// ========================================

export interface UploadResult {
	url: string;
	key: string;
	filename: string;
	size: number;
	mimeType: string;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Generate a unique filename with timestamp and random suffix
 */
export function generateUniqueFilename(originalName: string): string {
	const timestamp = Date.now();
	const randomSuffix = Math.random().toString(36).substring(2, 8);
	const ext = originalName.substring(originalName.lastIndexOf('.'));
	const nameWithoutExt = originalName
		.substring(0, originalName.lastIndexOf('.'))
		.replace(/[^a-zA-Z0-9]/g, '_');

	return `${nameWithoutExt}_${timestamp}_${randomSuffix}${ext}`;
}

/**
 * Get the file path/key based on upload type
 */
export function getFilePath(type: string, filename: string): string {
	const validTypes = ['recipes', 'profiles', 'categories'];
	const folder = validTypes.includes(type) ? type : 'temp';
	return `${folder}/${filename}`;
}

// ========================================
// MAIN FUNCTIONS
// ========================================

/**
 * Upload a file to Cloudflare R2
 * @param file - File to upload
 * @param type - Upload type (recipes, profiles, categories, temp)
 * @returns Upload result with URL and metadata
 */
export async function uploadToR2(file: File, type: string = 'temp'): Promise<UploadResult> {
	try {
		// Generate unique filename
		const uniqueFilename = generateUniqueFilename(file.name);
		const key = getFilePath(type, uniqueFilename);

		// Convert file to buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to R2
		const command = new PutObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key,
			Body: buffer,
			ContentType: file.type,
			ContentLength: file.size
		});

		await r2Client.send(command);

		// Construct public URL
		const publicUrl = `${R2_PUBLIC_URL}/${key}`;

		console.log(`[R2] File uploaded successfully: ${key}`);

		return {
			url: publicUrl,
			key: key,
			filename: uniqueFilename,
			size: file.size,
			mimeType: file.type
		};
	} catch (error) {
		console.error('[R2] Upload error:', error);
		throw new Error('Failed to upload file to R2');
	}
}

/**
 * Delete a file from Cloudflare R2
 * @param key - File key/path in R2
 */
export async function deleteFromR2(key: string): Promise<void> {
	try {
		const command = new DeleteObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key
		});

		await r2Client.send(command);
		console.log(`[R2] File deleted successfully: ${key}`);
	} catch (error) {
		console.error('[R2] Delete error:', error);
		throw new Error('Failed to delete file from R2');
	}
}

/**
 * Generate a pre-signed URL for temporary access (optional, for private files)
 * @param key - File key/path in R2
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
	try {
		const command = new PutObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key
		});

		const url = await getSignedUrl(r2Client, command, { expiresIn });
		return url;
	} catch (error) {
		console.error('[R2] Presigned URL error:', error);
		throw new Error('Failed to generate presigned URL');
	}
}

/**
 * Extract R2 key from public URL
 * @param url - Public R2 URL
 * @returns File key/path
 */
export function extractKeyFromUrl(url: string): string | null {
	try {
		const publicUrlBase = R2_PUBLIC_URL;
		if (!url.startsWith(publicUrlBase)) {
			return null;
		}
		return url.replace(`${publicUrlBase}/`, '');
	} catch (error) {
		console.error('[R2] Key extraction error:', error);
		return null;
	}
}
