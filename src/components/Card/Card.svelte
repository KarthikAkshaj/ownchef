<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Clock, Star } from 'lucide-svelte';

	export let recipe: {
		title: string;
		slug?: string;
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
						class={filled ? 'star-filled' : 'star-empty'}
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
		<a href="/recipes/{recipe.slug || '#'}" class="view-recipe" aria-label={`View recipe for ${recipe.title}`}>
			<span>View Recipe</span>
			<div class="button-shine" aria-hidden="true"></div>
		</a>
	</div>
</article>

<style lang="postcss">
	.recipe-card {
		@apply relative overflow-hidden rounded-2xl;
		background-color: #40534C;
		@apply transform transition-all duration-500 ease-out;
		@apply hover:shadow-xl;
		border: 1px solid rgba(103, 125, 106, 0.3);
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
		background-color: rgba(103, 125, 106, 0.8);
		color: #E0CEAD;
		@apply backdrop-blur-sm;
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
		background-color: rgba(143, 169, 152, 0.9);
		@apply text-white;
	}

	.difficulty-badge.medium {
		background-color: rgba(181, 201, 189, 0.9);
		@apply text-white;
	}

	.difficulty-badge.hard {
		background-color: rgba(103, 125, 106, 0.9);
		@apply text-white;
	}

	.content {
		@apply flex flex-col gap-4 p-6;
	}

	.title {
		@apply text-lg font-bold leading-tight tracking-tight;
		color: #E0CEAD;
		@apply line-clamp-1;
	}

	.description {
		@apply text-sm leading-relaxed;
		color: #D6BD98;
		@apply line-clamp-2;
	}

	.meta {
		@apply flex items-center justify-between;
	}

	.cook-time {
		@apply flex items-center gap-1.5 text-sm;
		color: rgba(214, 189, 152, 0.8);
	}

	.rating {
		@apply flex gap-0.5;
	}

	:global(.star-filled) {
		color: #D6BD98;
	}

	:global(.star-empty) {
		color: rgba(103, 125, 106, 0.3);
	}

	.author {
		@apply flex items-center gap-3 pt-4;
		border-top: 1px solid rgba(103, 125, 106, 0.3);
	}

	.author-avatar {
		@apply h-8 w-8 rounded-full object-cover ring-2;
		ring-color: rgba(103, 125, 106, 0.5);
	}

	.author-name {
		@apply text-sm font-medium;
		color: rgba(214, 189, 152, 0.8);
	}

	.view-recipe {
		@apply relative mt-2 w-full overflow-hidden rounded-lg px-6 py-2.5;
		@apply text-sm font-semibold tracking-wide;
		@apply flex items-center justify-center;
		background: linear-gradient(to right, #677D6A, #8FA998);
		@apply text-white transition-all duration-300 no-underline;
	}

	.view-recipe:hover {
		@apply -translate-y-0.5;
		box-shadow: 0 10px 15px -3px rgba(103, 125, 106, 0.25);
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
