import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json({
		categories: [
			{ id: 1, name: 'Indian', slug: 'indian' },
			{ id: 2, name: 'Chinese', slug: 'chinese' },
			{ id: 3, name: 'Italian', slug: 'italian' },
			{ id: 4, name: 'Spanish', slug: 'spanish' },
			{ id: 5, name: 'Thai', slug: 'thai' },
			{ id: 6, name: 'Japanese', slug: 'japanese' }
		]
	});
};
