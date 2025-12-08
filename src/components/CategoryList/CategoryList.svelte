<script lang="ts">
	import { Soup, Pizza, Coffee, Flame, UtensilsCrossed, Fish, Salad, Drumstick } from 'lucide-svelte';

	const categories = [
		{ name: 'Indian', icon: Soup, recipeCount: 128, quote: 'Spice up your life' },
		{ name: 'Italian', icon: Pizza, recipeCount: 156, quote: 'La dolce vita' },
		{ name: 'Chinese', icon: UtensilsCrossed, recipeCount: 142, quote: 'Harmony in every bite' },
		{ name: 'Japanese', icon: Fish, recipeCount: 98, quote: 'Art meets flavor' },
		{ name: 'Mexican', icon: Flame, recipeCount: 87, quote: 'Bold & vibrant' },
		{ name: 'Thai', icon: Coffee, recipeCount: 76, quote: 'Sweet, sour, spicy' },
		{ name: 'French', icon: Salad, recipeCount: 112, quote: 'Elegance on a plate' },
		{ name: 'Korean', icon: Drumstick, recipeCount: 65, quote: 'Fermented & flavorful' }
	];

	let isPaused = false;
</script>

<section class="categories-section">
	<div class="section-header">
		<h2 class="title">Explore World Cuisines</h2>
		<p class="subtitle">Click any cuisine to discover authentic recipes</p>
	</div>

	<!-- Scrolling Marquee Container -->
	<div class="marquee-wrapper">
		<!-- First Row - Left to Right -->
		<div
			class="marquee-track"
			class:paused={isPaused}
			on:mouseenter={() => (isPaused = true)}
			on:mouseleave={() => (isPaused = false)}
			role="region"
			aria-label="Scrolling cuisines row 1"
		>
			{#each [...categories, ...categories] as category}
				<a
					href="/category/{category.name.toLowerCase()}"
					class="cuisine-item"
				>
					<div class="cuisine-content">
						<div class="icon-circle">
							<svelte:component this={category.icon} size={24} strokeWidth={2.5} />
						</div>
						<div class="text-content">
							<h3 class="cuisine-name">{category.name}</h3>
							<p class="cuisine-quote">"{category.quote}"</p>
							<span class="recipe-badge">{category.recipeCount} recipes</span>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Second Row - Right to Left -->
		<div
			class="marquee-track reverse"
			class:paused={isPaused}
			on:mouseenter={() => (isPaused = true)}
			on:mouseleave={() => (isPaused = false)}
			role="region"
			aria-label="Scrolling cuisines row 2"
		>
			{#each [...categories, ...categories] as category}
				<a
					href="/category/{category.name.toLowerCase()}"
					class="cuisine-item"
				>
					<div class="cuisine-content">
						<div class="icon-circle">
							<svelte:component this={category.icon} size={24} strokeWidth={2.5} />
						</div>
						<div class="text-content">
							<h3 class="cuisine-name">{category.name}</h3>
							<p class="cuisine-quote">"{category.quote}"</p>
							<span class="recipe-badge">{category.recipeCount} recipes</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- Gradient Overlays for Fade Effect -->
	<div class="fade-left"></div>
	<div class="fade-right"></div>
</section>

<style lang="postcss">
	/* ========== Section Layout ========== */
	.categories-section {
		@apply relative py-20;
		overflow: hidden;
	}

	/* ========== Header Styling ========== */
	.section-header {
		@apply mb-16 text-center;
	}

	.title {
		@apply mb-3 text-5xl font-black tracking-tight;
		color: #E0CEAD;
		text-shadow: 0 2px 20px rgba(224, 206, 173, 0.3);
		letter-spacing: -0.02em;
	}

	.subtitle {
		@apply text-lg;
		color: rgba(214, 189, 152, 0.7);
	}

	/* ========== Marquee Wrapper ========== */
	.marquee-wrapper {
		@apply relative flex flex-col gap-6;
	}

	/* ========== Marquee Track ========== */
	.marquee-track {
		@apply flex gap-6;
		animation: scroll-left 25s linear infinite;
		will-change: transform;
	}

	.marquee-track.reverse {
		animation: scroll-right 25s linear infinite;
	}

	.marquee-track.paused {
		animation-play-state: paused;
	}

	/* ========== Marquee Animations ========== */
	@keyframes scroll-left {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	@keyframes scroll-right {
		0% {
			transform: translateX(-50%);
		}
		100% {
			transform: translateX(0);
		}
	}

	/* ========== Cuisine Item ========== */
	.cuisine-item {
		@apply block flex-shrink-0;
		@apply transition-all duration-300;
		width: 240px;
	}

	.cuisine-item:hover {
		transform: translateY(-4px);
	}

	.cuisine-content {
		@apply relative flex items-center gap-4 overflow-hidden rounded-xl p-4;
		border: 1px solid rgba(103, 125, 106, 0.3);
		background: rgba(40, 83, 76, 0.3);
		backdrop-filter: blur(10px);
		min-height: 100px;
	}

	.cuisine-item:hover .cuisine-content {
		border-color: rgba(143, 169, 152, 0.6);
		box-shadow: 0 8px 20px rgba(26, 54, 54, 0.4);
	}

	/* ========== Icon Circle ========== */
	.icon-circle {
		@apply flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full;
		@apply transition-all duration-500;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.4);
	}

	.cuisine-item:hover .icon-circle {
		transform: rotate(10deg) scale(1.1);
		box-shadow: 0 6px 20px rgba(143, 169, 152, 0.6);
	}

	/* ========== Text Content ========== */
	.text-content {
		@apply flex flex-1 flex-col gap-1;
	}

	.cuisine-name {
		@apply text-lg font-bold;
		@apply transition-colors duration-300;
		color: #E0CEAD;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.cuisine-item:hover .cuisine-name {
		color: #EBE0CC;
	}

	.cuisine-quote {
		@apply text-xs italic;
		color: rgba(214, 189, 152, 0.6);
		@apply transition-colors duration-300;
	}

	.cuisine-item:hover .cuisine-quote {
		color: rgba(224, 206, 173, 0.8);
	}

	.recipe-badge {
		@apply text-xs font-medium;
		color: rgba(143, 169, 152, 0.8);
		@apply transition-colors duration-300;
	}

	.cuisine-item:hover .recipe-badge {
		color: rgba(181, 201, 189, 1);
	}

	/* ========== Fade Overlays ========== */
	.fade-left,
	.fade-right {
		@apply pointer-events-none absolute top-0 z-10 h-full w-32;
	}

	.fade-left {
		left: 0;
		background: linear-gradient(90deg, #1a3636 0%, transparent 100%);
	}

	.fade-right {
		right: 0;
		background: linear-gradient(90deg, transparent 0%, #1a3636 100%);
	}

	/* ========== Responsive Design ========== */
	@media (max-width: 768px) {
		.title {
			@apply text-4xl;
		}

		.subtitle {
			@apply text-base;
		}

		.cuisine-item {
			width: 200px;
		}

		.cuisine-content {
			@apply p-3;
			min-height: 90px;
		}

		.cuisine-name {
			@apply text-base;
		}

		.cuisine-quote {
			@apply text-xs;
		}

		.icon-circle {
			@apply h-10 w-10;
		}

		.fade-left,
		.fade-right {
			@apply w-16;
		}
	}

	@media (max-width: 640px) {
		.marquee-wrapper {
			@apply gap-4;
		}

		.marquee-track {
			@apply gap-4;
		}

		.cuisine-item {
			width: 180px;
		}

		.cuisine-content {
			@apply flex-col items-start gap-2 p-3;
			min-height: 110px;
		}

		.icon-circle {
			@apply h-8 w-8;
		}

		.cuisine-name {
			@apply text-sm;
		}

		.cuisine-quote {
			@apply text-xs;
		}

		.recipe-badge {
			@apply text-xs;
		}
	}

	/* ========== Accessibility ========== */
	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}

		.cuisine-item:hover {
			transform: none;
		}
	}
</style>
