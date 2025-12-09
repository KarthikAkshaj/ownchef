import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Map of category slugs to display names
	const categoryNames: Record<string, string> = {
		indian: 'Indian',
		chinese: 'Chinese',
		italian: 'Italian',
		spanish: 'Spanish',
		thai: 'Thai',
		japanese: 'Japanese',
		mexican: 'Mexican',
		french: 'French',
		korean: 'Korean',
		vietnamese: 'Vietnamese',
		mediterranean: 'Mediterranean',
		american: 'American',
		'middle-eastern': 'Middle Eastern'
	};

	const category = {
		slug,
		name: categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)
	};

	// In a real application, you would fetch posts from a database
	// For now, return an empty array or mock data
	const posts: any[] = [];

	return {
		category,
		posts
	};
};
