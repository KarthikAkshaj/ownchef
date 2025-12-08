<!-- src/components/QuickCategories/QuickCategories.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Clock, Leaf, Coffee, Cake, Heart, Users } from 'lucide-svelte';

	const categories = [
		{
			id: 'quick',
			title: 'Quick & Easy',
			description: 'Ready in 30 minutes or less',
			icon: Clock,
			gradient: 'sage-gradient-1',
			count: 245
		},
		{
			id: 'vegetarian',
			title: 'Vegetarian',
			description: 'Plant-based delights',
			icon: Leaf,
			gradient: 'sage-gradient-2',
			count: 189
		},
		{
			id: 'breakfast',
			title: 'Breakfast',
			description: 'Start your day right',
			icon: Coffee,
			gradient: 'sage-gradient-3',
			count: 167
		},
		{
			id: 'desserts',
			title: 'Desserts',
			description: 'Sweet treats & bakes',
			icon: Cake,
			gradient: 'sage-gradient-4',
			count: 203
		},
		{
			id: 'healthy',
			title: 'Healthy',
			description: 'Nutritious & delicious',
			icon: Heart,
			gradient: 'sage-gradient-5',
			count: 178
		},
		{
			id: 'party',
			title: 'Party Food',
			description: 'Crowd-pleasing favorites',
			icon: Users,
			gradient: 'sage-gradient-6',
			count: 156
		}
	];
</script>

<section class="quick-categories" class:dark={$theme === 'dark'}>
	<div class="section-header">
		<h2 class="title">Quick Recipe Categories</h2>
		<p class="subtitle">Find recipes by meal type</p>
	</div>

	<div class="categories-grid">
		{#each categories as category}
			<a href="/category/{category.id}" class="category-card" class:dark={$theme === 'dark'}>
				<div class="card-content {category.gradient}">
					<div class="icon-wrapper">
						<svelte:component this={category.icon} size={24} class="text-white" />
					</div>
					<div class="text-content">
						<h3 class="card-title">{category.title}</h3>
						<p class="card-description">{category.description}</p>
					</div>
					<div class="recipe-count">
						<span class="count">{category.count}</span>
						<span class="label">Recipes</span>
					</div>
					<div class="shine-effect"></div>
				</div>
			</a>
		{/each}
	</div>
</section>

<style lang="postcss">
	.quick-categories {
		@apply mx-auto my-16 max-w-7xl px-4;
	}

	.section-header {
		@apply mb-8 text-center;
	}

	.title {
		@apply mb-2 text-3xl font-bold text-gray-900 dark:text-white;
	}

	.subtitle {
		@apply text-gray-600 dark:text-gray-400;
	}

	.categories-grid {
		@apply grid gap-6;
		@apply grid-cols-1 sm:grid-cols-2 lg:grid-cols-3;
	}

	.category-card {
		@apply block overflow-hidden rounded-2xl;
		@apply transform transition-all duration-500;
		@apply hover:shadow-xl hover:shadow-black/5;
		@apply dark:hover:shadow-white/5;
	}

	.category-card:hover {
		transform: translateY(-4px) scale(1.01);
	}

	.category-card:hover .shine-effect {
		transform: translateX(100%);
	}

	.card-content {
		@apply relative flex items-center gap-4 p-6;
		@apply overflow-hidden;
	}

	.sage-gradient-1 {
		background: linear-gradient(to right, #677D6A, #8FA998);
	}

	.sage-gradient-2 {
		background: linear-gradient(to right, #8FA998, #B5C9BD);
	}

	.sage-gradient-3 {
		background: linear-gradient(to right, #40534C, #677D6A);
	}

	.sage-gradient-4 {
		background: linear-gradient(to right, #D6BD98, #E0CEAD);
	}

	.sage-gradient-5 {
		background: linear-gradient(to right, #677D6A, #B5C9BD);
	}

	.sage-gradient-6 {
		background: linear-gradient(to right, #8FA998, #D6BD98);
	}

	.icon-wrapper {
		@apply flex h-12 w-12 items-center justify-center rounded-lg;
		@apply bg-white/20 backdrop-blur-sm;
	}

	.text-content {
		@apply flex-1;
	}

	.card-title {
		@apply text-lg font-semibold text-white;
	}

	.card-description {
		@apply text-sm text-white/90;
	}

	.recipe-count {
		@apply flex flex-col items-end text-white;
	}

	.count {
		@apply text-2xl font-bold;
	}

	.label {
		@apply text-xs text-white/90;
	}

	.shine-effect {
		@apply absolute inset-0;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transform: translateX(-100%);
		transition: transform 0.8s;
	}

	/* Dark mode specific styles */
	.category-card.dark {
		@apply bg-gray-800;
	}

	.category-card.dark .card-content {
		@apply shadow-lg;
	}
</style>
