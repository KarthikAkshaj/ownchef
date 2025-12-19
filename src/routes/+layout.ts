export const load = async ({ data }) => {
	return {
		...data, // Include all server data (session, user)
		title: 'Own Chef - Share Your Recipes',
		description: 'A community for sharing and discovering amazing recipes'
	};
};
