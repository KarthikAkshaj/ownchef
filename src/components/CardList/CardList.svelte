<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import Card from '../Card/Card.svelte';
	import Pagination from '../Pagination/Pagination.svelte';

	export let page = 1;
	export let hasMore = true;

	const recipes = [
		{
			title: 'Homemade Margherita Pizza',
			description: 'Classic Italian pizza with fresh basil, mozzarella, and tomato sauce',
			image: '/images/recipes/margherita-pizza.jpg',
			cookTime: 45,
			category: 'Italian',
			difficulty: 'Medium',
			author: {
				name: 'Chef Maria',
				avatar: '/images/users/chef-maria.jpg'
			},
			rating: 4.5
		},
		{
			title: 'Spicy Thai Green Curry',
			description:
				'Authentic Thai green curry with coconut milk, vegetables, and your choice of protein',
			image: '/images/recipes/thai-curry.jpg',
			cookTime: 35,
			category: 'Thai',
			difficulty: 'Easy',
			author: {
				name: 'Chef Raj',
				avatar: '/images/users/chef-raj.jpg'
			},
			rating: 4.8
		},
		{
			title: 'Classic Beef Burger',
			description: 'Juicy homemade beef burger with special sauce and fresh toppings',
			image: '/images/recipes/beef-burger.jpg',
			cookTime: 25,
			category: 'American',
			difficulty: 'Easy',
			author: {
				name: 'Chef Ahmed',
				avatar: '/images/users/chef-ahmed.jpg'
			},
			rating: 4.7
		},
		{
			title: 'Sushi Roll Platter',
			description: 'Assorted fresh sushi rolls with premium grade fish and seasonal ingredients',
			image: '/images/recipes/sushi.jpeg',
			cookTime: 60,
			category: 'Japanese',
			difficulty: 'Hard',
			author: {
				name: 'Chef Yuki',
				avatar: '/images/users/chef-yuki.jpg'
			},
			rating: 4.9
		},
		{
			title: 'Mediterranean Mezze',
			description: 'A vibrant platter of hummus, falafel, baba ganoush, and fresh pita bread',
			image: '/images/recipes/mezze.jpeg',
			cookTime: 40,
			category: 'Mediterranean',
			difficulty: 'Medium',
			author: {
				name: 'Chef Giovanni',
				avatar: '/images/users/chef-giovanni.jpeg'
			},
			rating: 4.6
		},
		{
			title: 'French Onion Soup',
			description: 'Rich beef broth with caramelized onions and melted Gruyère cheese',
			image: '/images/recipes/onion-soup.jpg',
			cookTime: 55,
			category: 'French',
			difficulty: 'Medium',
			author: {
				name: 'Chef Sarah',
				avatar: '/images/users/chef-sarah.jpg'
			},
			rating: 4.7
		}
	];

	let isLoading = true;

	onMount(() => {
		setTimeout(() => {
			isLoading = false;
		}, 1500);
	});
</script>

<section class="recipe-section">
	<div class="section-header">
		<h1 class="title">
			<span class="highlight">Featured Re</span>
			<span class="regular-text" class:dark={$theme === 'dark'}>cipes</span>
		</h1>
		<p class="subtitle">Discover delicious recipes from around the world</p>
	</div>

	<div class="recipe-grid">
		{#each recipes as recipe (recipe.title)}
			<Card {recipe} />
		{/each}
	</div>

	<div class="pagination-wrapper">
		<Pagination {page} {hasMore} />
	</div>
</section>

<style lang="postcss">
	.recipe-section {
		@apply mx-auto w-full max-w-7xl px-4;
	}

	.section-header {
		@apply mb-12 text-center;
	}

	.title {
		@apply mb-4 text-4xl font-bold;
	}

	.highlight {
		color: #677D6A;
	}

	.regular-text {
		@apply text-gray-900;
	}

	.regular-text.dark {
		@apply text-white;
	}

	.subtitle {
		@apply text-lg text-gray-600 dark:text-gray-400;
	}

	.recipe-grid {
		@apply grid gap-8;
		@apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
	}

	.pagination-wrapper {
		@apply mt-12;
	}
</style>
