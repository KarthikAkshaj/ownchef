<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-svelte';

	// Sample data - later we can fetch this from an API
	const featuredPosts = [
		{
			id: 1,
			title: 'Classic Italian Pasta Carbonara',
			description:
				'Learn the authentic way to make this creamy Roman pasta dish with eggs, cheese, and pancetta.',
			image: '/images/carbonara.jpg',
			category: 'Italian',
			author: 'Chef Maria',
			readTime: '15 min'
		},
		{
			id: 2,
			title: 'Perfect Butter Chicken',
			description:
				'Discover the secrets to making the most tender and flavorful butter chicken at home.',
			image: '/images/butter-chicken.jpg',
			category: 'Indian',
			author: 'Chef Raj',
			readTime: '25 min'
		},
		{
			id: 3,
			title: 'Sushi Rolling Masterclass',
			description:
				'Master the art of sushi rolling with our step-by-step guide to perfect rolls every time.',
			image: '/images/sushi.jpg',
			category: 'Japanese',
			author: 'Chef Yuki',
			readTime: '30 min'
		}
	];

	let currentIndex = 0;
	let intervalId: NodeJS.Timeout;
	let isHovered = false;

	function nextSlide() {
		currentIndex = (currentIndex + 1) % featuredPosts.length;
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + featuredPosts.length) % featuredPosts.length;
	}

	function startAutoPlay() {
		intervalId = setInterval(nextSlide, 5000);
		isHovered = false;
	}

	function stopAutoPlay() {
		if (intervalId) clearInterval(intervalId);
		isHovered = true;
	}

	onMount(() => {
		startAutoPlay();
		return () => stopAutoPlay();
	});
</script>

<div
	class="featured-section"
	role="region"
	aria-label="Featured Recipes Carousel"
	on:mouseenter={stopAutoPlay}
	on:mouseleave={startAutoPlay}
>
	<div class="featured-content" role="group">
		{#key currentIndex}
			<div
				class="slide"
				role="group"
				aria-roledescription="slide"
				aria-label={`Slide ${currentIndex + 1} of ${featuredPosts.length}`}
				in:fade={{ duration: 400 }}
				out:fade={{ duration: 400 }}
			>
				<div class="image-wrapper">
					<img
						src={featuredPosts[currentIndex].image}
						alt={featuredPosts[currentIndex].title}
						class="slide-image"
					/>
					<div class="overlay" aria-hidden="true" ></div>
				</div>

				<div class="text-content" in:fly={{ x: 50, duration: 500, delay: 200 }}>
					<span class="category" in:scale={{ duration: 300, delay: 300 }}>
						{featuredPosts[currentIndex].category}
					</span>
					<h1 class="title">{featuredPosts[currentIndex].title}</h1>
					<p class="description">{featuredPosts[currentIndex].description}</p>
					<div class="meta" role="contentinfo">
						<div class="meta-item">
							<User size={16} aria-hidden="true" />
							<span>{featuredPosts[currentIndex].author}</span>
						</div>
						<div class="divider" aria-hidden="true"></div>
						<div class="meta-item">
							<Clock size={16} aria-hidden="true" />
							<span>{featuredPosts[currentIndex].readTime} read</span>
						</div>
					</div>
					<button class="read-more" aria-label={`Read ${featuredPosts[currentIndex].title}`}>
						Read Recipe
						<div class="btn-shine" aria-hidden="true"></div>
					</button>
				</div>
			</div>
		{/key}

		<!-- Navigation -->
		<div
			class="navigation-wrapper"
			class:show={isHovered}
			role="group"
			aria-label="Carousel Navigation"
		>
			<button class="nav-button prev" on:click={prevSlide} aria-label="Previous slide">
				<ChevronLeft size={24} aria-hidden="true" />
			</button>

			<button class="nav-button next" on:click={nextSlide} aria-label="Next slide">
				<ChevronRight size={24} aria-hidden="true" />
			</button>
		</div>

		<div class="dots" role="tablist" aria-label="Slide dots">
			{#each featuredPosts as _, index}
				<button
					class="dot"
					role="tab"
					aria-selected={currentIndex === index}
					aria-label={`Go to slide ${index + 1}`}
					class:active={currentIndex === index}
					on:click={() => (currentIndex = index)}
				></button>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	.featured-section {
		@apply relative mx-auto mt-8 overflow-hidden rounded-3xl;
		@apply z-[1];
		height: min(70vh, 600px);
	}

	.featured-content {
		@apply relative h-full w-full;
	}

	.slide {
		@apply relative flex h-full w-full items-center;
	}

	.image-wrapper {
		@apply absolute inset-0 overflow-hidden;
	}

	.slide-image {
		@apply h-full w-full object-cover;
		transform: scale(1);
		transition: transform 6s ease;
	}

	.slide:hover .slide-image {
		transform: scale(1.1);
	}

	.overlay {
		@apply absolute inset-0;
		background: linear-gradient(
			90deg,
			rgba(0, 0, 0, 0.8) 0%,
			rgba(0, 0, 0, 0.6) 50%,
			rgba(0, 0, 0, 0.2) 100%
		);
	}

	.text-content {
		@apply relative z-[2] ml-16 max-w-2xl text-white;
	}

	.category {
		@apply mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold;
		background: linear-gradient(135deg, #ff6b6b, #ffa07a);
	}

	.title {
		@apply mb-4 text-5xl font-bold leading-tight;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.description {
		@apply mb-6 text-lg text-gray-200;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.meta {
		@apply mb-8 flex items-center space-x-4 text-sm text-gray-300;
	}

	.meta-item {
		@apply flex items-center gap-2;
	}

	.divider {
		@apply h-4 w-px bg-gray-400/30;
	}

	.read-more {
		@apply relative overflow-hidden rounded-lg px-6 py-3 text-sm font-semibold;
		background: linear-gradient(135deg, #ff6b6b, #ffa07a);
		transition: all 0.3s ease;
	}

	.read-more:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(255, 107, 107, 0.2);
	}

	.btn-shine {
		@apply absolute inset-0;
		background: linear-gradient(
			45deg,
			transparent 0%,
			rgba(255, 255, 255, 0.2) 50%,
			transparent 100%
		);
		transform: translateX(-100%);
		transition: transform 0.5s ease;
	}

	.read-more:hover .btn-shine {
		transform: translateX(100%);
	}

	.navigation-wrapper {
		@apply absolute inset-y-0 left-0 right-0 z-[3] flex items-center justify-between px-4;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.navigation-wrapper.show {
		opacity: 1;
	}

	.nav-button {
		@apply flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm;
		@apply transition-all duration-300;
		@apply hover:scale-110 hover:bg-black/50;
	}

	.dots {
		@apply absolute bottom-6 left-1/2 z-[3] flex -translate-x-1/2 space-x-2;
	}

	.dot {
		@apply h-2 w-2 rounded-full transition-all duration-300;
		background: rgba(255, 255, 255, 0.3);
	}

	.dot.active {
		@apply w-8;
		background: linear-gradient(135deg, #ff6b6b, #ffa07a);
	}
</style>
