// vite.config.ts - Your existing config + Argon2 fix
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: [
			{ find: '$components', replacement: path.resolve('src/components') },
			{ find: '$lib', replacement: path.resolve('src/lib') }
		]
	},

	// ADDED: Fix for Argon2 bundling issue
	ssr: {
		external: ['@node-rs/argon2']
	},

	optimizeDeps: {
		exclude: ['@node-rs/argon2']
	},

	build: {
		rollupOptions: {
			external: ['@node-rs/argon2']
		}
	}
});