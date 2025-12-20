// Standalone database connection for seed script (without SvelteKit dependencies)
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not set in .env file');
}

const client = postgres(DATABASE_URL);
export const db = drizzle(client);
export const closeConnection = () => client.end();
