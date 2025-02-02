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
	}
});
