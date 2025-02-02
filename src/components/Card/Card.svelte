<!-- src/components/Card/Card.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Clock, Star } from 'lucide-svelte';

	export let recipe: {
		title: string;
		description: string;
		image: string;
		cookTime: number;
		category: string;
		difficulty: string;
		author: {
			name: string;
			avatar: string;
		};
		rating: number;
	};

	// Create an array for star rating
	$: stars = Array(5)
		.fill(null)
		.map((_, i) => i < Math.floor(recipe.rating));
</script>

<article
	class="recipe-card"
	class:dark={$theme === 'dark'}
	on:mousemove={(e) => {
		const { currentTarget: card } = e;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = (y - centerY) / 20;
		const rotateY = (centerX - x) / 20;

		card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
	}}
	on:mouseleave={(e) => {
		e.currentTarget.style.transform =
			'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
	}}
>
	<!-- Image Section -->
	<div class="image-wrapper">
		<img src={recipe.image} alt={recipe.title} class="recipe-image" loading="lazy" />
		<div class="badges">
			<span class="category-badge">{recipe.category}</span>
			<span
				class="difficulty-badge"
				class:easy={recipe.difficulty === 'Easy'}
				class:medium={recipe.difficulty === 'Medium'}
				class:hard={recipe.difficulty === 'Hard'}
			>
				{recipe.difficulty}
			</span>
		</div>
	</div>

	<!-- Content Section -->
	<div class="content">
		<h3 class="title">{recipe.title}</h3>
		<p class="description">{recipe.description}</p>

		<!-- Meta Information -->
		<div class="meta">
			<div class="cook-time">
				<Clock size={16} strokeWidth={2.5} />
				<span>{recipe.cookTime} mins</span>
			</div>
			<div class="rating" title={`Rating: ${recipe.rating} out of 5`}>
				{#each stars as filled}
					<Star
						size={16}
						fill={filled ? 'currentColor' : 'none'}
						class={filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
					/>
				{/each}
			</div>
		</div>

		<!-- Author Info -->
		<div class="author">
			<img src={recipe.author.avatar} alt={`Chef ${recipe.author.name}`} class="author-avatar" />
			<span class="author-name">by {recipe.author.name}</span>
		</div>

		<!-- Action Button -->
		<button class="view-recipe" aria-label={`View recipe for ${recipe.title}`}>
			<span>View Recipe</span>
			<div class="button-shine" aria-hidden="true" />
		</button>
	</div>
</article>

<style lang="postcss">
	.recipe-card {
		@apply relative overflow-hidden rounded-2xl bg-white;
		@apply transform transition-all duration-500 ease-out;
		@apply hover:shadow-xl dark:bg-gray-800;
		@apply border border-gray-100 dark:border-gray-700;
		@apply will-change-transform;
		max-width: 380px;
		height: fit-content;
	}

	.image-wrapper {
		@apply relative aspect-[16/9] w-full overflow-hidden;
	}

	.recipe-image {
		@apply h-full w-full object-cover;
		@apply transition-transform duration-700 ease-out;
	}

	.recipe-card:hover .recipe-image {
		@apply scale-110;
	}

	.badges {
		@apply absolute inset-x-0 top-0 flex items-center justify-between p-4;
	}

	.category-badge {
		@apply rounded-full px-3 py-1 text-xs font-semibold;
		@apply bg-white/90 text-gray-800 backdrop-blur-sm;
		@apply dark:bg-gray-800/90 dark:text-white;
		@apply transition-transform duration-300;
	}

	.recipe-card:hover .category-badge {
		@apply -translate-y-0.5;
	}

	.difficulty-badge {
		@apply rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm;
		@apply transition-transform duration-300;
	}

	.recipe-card:hover .difficulty-badge {
		@apply translate-y-0.5;
	}

	.difficulty-badge.easy {
		@apply bg-emerald-500/90 text-white;
	}

	.difficulty-badge.medium {
		@apply bg-amber-500/90 text-white;
	}

	.difficulty-badge.hard {
		@apply bg-rose-500/90 text-white;
	}

	.content {
		@apply flex flex-col gap-4 p-6;
	}

	.title {
		@apply text-lg font-bold leading-tight tracking-tight;
		@apply text-gray-800 dark:text-white;
		@apply line-clamp-1;
	}

	.description {
		@apply text-sm leading-relaxed;
		@apply text-gray-600 dark:text-gray-300;
		@apply line-clamp-2;
	}

	.meta {
		@apply flex items-center justify-between;
	}

	.cook-time {
		@apply flex items-center gap-1.5 text-sm;
		@apply text-gray-600 dark:text-gray-400;
	}

	.rating {
		@apply flex gap-0.5;
	}

	.author {
		@apply flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700;
	}

	.author-avatar {
		@apply h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-700;
	}

	.author-name {
		@apply text-sm font-medium;
		@apply text-gray-600 dark:text-gray-400;
	}

	.view-recipe {
		@apply relative mt-2 w-full overflow-hidden rounded-lg px-6 py-2.5;
		@apply text-sm font-semibold tracking-wide;
		@apply bg-gradient-to-r from-orange-500 to-red-500;
		@apply text-white transition-all duration-300;
	}

	.view-recipe:hover {
		@apply -translate-y-0.5 shadow-lg shadow-orange-500/25;
	}

	.view-recipe:active {
		@apply translate-y-0;
	}

	.button-shine {
		@apply absolute inset-0;
		background: linear-gradient(
			45deg,
			transparent 0%,
			rgba(255, 255, 255, 0.25) 50%,
			transparent 100%
		);
		transform: translateX(-100%) skewX(-15deg);
		transition: transform 0.75s ease;
	}

	.view-recipe:hover .button-shine {
		transform: translateX(100%) skewX(-15deg);
	}
</style>
