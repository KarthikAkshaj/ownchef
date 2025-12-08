<script lang="ts">
	import { onMount } from 'svelte';
	import { Clock, User, ChevronRight, ChevronLeft } from 'lucide-svelte';
	import Swiper from 'swiper';
	import { Pagination, Autoplay, EffectFade, Navigation } from 'swiper/modules';
	import 'swiper/css';
	import 'swiper/css/pagination';
	import 'swiper/css/effect-fade';
	import 'swiper/css/navigation';

	const featuredPosts = [
		{
			id: 1,
			title: 'Classic Italian Pasta Carbonara',
			description:
				'Learn the authentic way to make this creamy Roman pasta dish with eggs, cheese, and pancetta.',
			image: '/images/recipes/carbonara.jpg',
			category: 'Italian',
			author: 'Chef Maria',
			readTime: '15 min',
			difficulty: 'Medium',
			servings: 4
		},
		{
			id: 2,
			title: 'Perfect Butter Chicken',
			description:
				'Discover the secrets to making the most tender and flavorful butter chicken at home.',
			image: '/images/recipes/butter-chicken.jpg',
			category: 'Indian',
			author: 'Chef Raj',
			readTime: '25 min',
			difficulty: 'Easy',
			servings: 6
		},
		{
			id: 3,
			title: 'Sushi Rolling Masterclass',
			description:
				'Master the art of sushi rolling with our step-by-step guide to perfect rolls every time.',
			image: '/images/recipes/sushi.jpeg',
			category: 'Japanese',
			author: 'Chef Yuki',
			readTime: '30 min',
			difficulty: 'Hard',
			servings: 2
		}
	];

	let swiperInstance: Swiper;

	onMount(() => {
		swiperInstance = new Swiper('.featured-swiper', {
			modules: [Pagination, Autoplay, EffectFade, Navigation],
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			speed: 800,
			loop: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				renderBullet: function (_index, className) {
					return '<span class="' + className + '"></span>';
				}
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			}
		});

		return () => {
			if (swiperInstance) swiperInstance.destroy();
		};
	});
</script>

<section class="hero-section" aria-label="Featured Recipes">
	<div class="swiper featured-swiper">
		<div class="swiper-wrapper">
			{#each featuredPosts as post (post.id)}
				<div class="swiper-slide">
					<div class="hero-container">
						<!-- Left Content -->
						<div class="hero-content">
							<div class="content-wrapper">
								<span class="eyebrow">{post.category}</span>
								<h1 class="hero-title">{post.title}</h1>
								<p class="hero-description">{post.description}</p>

								<div class="meta-grid">
									<div class="meta-item">
										<User size={18} strokeWidth={1.5} />
										<span>{post.author}</span>
									</div>
									<div class="meta-item">
										<Clock size={18} strokeWidth={1.5} />
										<span>{post.readTime}</span>
									</div>
								</div>

								<div class="cta-wrapper">
									<a href={`/recipes/${post.id}`} class="primary-button">
										<span>View Recipe</span>
										<ChevronRight size={18} strokeWidth={2} />
									</a>
								</div>
							</div>
						</div>

						<!-- Right Recipe Card -->
						<div class="hero-visual">
							<div class="recipe-card">
								<div class="card-image-wrapper">
									<img src={post.image} alt={post.title} class="card-image" />
									<div class="card-overlay"></div>
								</div>

								<div class="card-details">
									<div class="card-header">
										<h3 class="card-category">{post.category}</h3>
										<span class="card-difficulty">{post.difficulty}</span>
									</div>

									<div class="card-stats">
										<div class="stat">
											<span class="stat-label">Servings</span>
											<span class="stat-value">{post.servings}</span>
										</div>
										<div class="stat-divider"></div>
										<div class="stat">
											<span class="stat-label">Time</span>
											<span class="stat-value">{post.readTime}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Navigation Buttons -->
		<button class="swiper-button-prev" aria-label="Previous slide">
			<ChevronLeft size={28} strokeWidth={2.5} />
		</button>
		<button class="swiper-button-next" aria-label="Next slide">
			<ChevronRight size={28} strokeWidth={2.5} />
		</button>

		<!-- Pagination -->
		<div class="swiper-pagination"></div>
	</div>
</section>

<style lang="postcss">
	/* ========== Hero Section ========== */
	.hero-section {
		@apply relative mx-auto;
		max-width: 1400px;
		padding: 80px 24px;
		overflow: visible;
	}

	.featured-swiper {
		@apply relative h-full w-full;
		overflow: visible;
	}

	/* ========== Hero Container - Split Layout ========== */
	.hero-container {
		@apply grid items-center gap-12;
		grid-template-columns: 1.2fr 0.8fr;
		min-height: 600px;
	}

	/* ========== Left Content ========== */
	.hero-content {
		@apply flex items-center;
	}

	.content-wrapper {
		max-width: 520px;
	}

	.eyebrow {
		@apply mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium uppercase tracking-wider;
		background: rgba(103, 125, 106, 0.2);
		color: #8FA998;
		border: 1px solid rgba(103, 125, 106, 0.3);
	}

	.hero-title {
		@apply mb-6 font-bold leading-tight tracking-tight;
		color: #E0CEAD;
		font-size: clamp(2.5rem, 5vw, 4rem);
		line-height: 1.1;
	}

	.hero-description {
		@apply mb-8 text-lg leading-relaxed;
		color: #D6BD98;
		max-width: 480px;
	}

	/* Meta Info */
	.meta-grid {
		@apply mb-10 flex items-center gap-6 text-sm;
		color: rgba(214, 189, 152, 0.8);
	}

	.meta-item {
		@apply flex items-center gap-2;
	}

	/* CTA Button */
	.cta-wrapper {
		@apply flex items-center gap-4;
	}

	.primary-button {
		@apply relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 font-semibold transition-all duration-300;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #1A3636;
		box-shadow: 0 4px 14px 0 rgba(103, 125, 106, 0.39);
	}

	.primary-button::before {
		@apply absolute inset-0 translate-y-full transition-transform duration-300;
		content: '';
		background: linear-gradient(135deg, #8FA998, #B5C9BD);
	}

	.primary-button:hover::before {
		@apply translate-y-0;
	}

	.primary-button span,
	.primary-button :global(svg) {
		@apply relative z-10;
	}

	.primary-button :global(svg) {
		@apply transition-transform duration-300;
	}

	.primary-button:hover :global(svg) {
		@apply translate-x-1;
	}

	/* ========== Right Recipe Card ========== */
	.hero-visual {
		@apply flex items-center justify-center;
	}

	.recipe-card {
		@apply relative w-full overflow-hidden rounded-3xl shadow-2xl transition-all duration-500;
		background: #40534C;
		border: 1px solid rgba(103, 125, 106, 0.3);
		max-width: 420px;
		transform-style: preserve-3d;
	}

	.recipe-card:hover {
		transform: translateY(-8px);
		box-shadow:
			0 30px 60px -12px rgba(26, 54, 54, 0.6),
			0 18px 36px -18px rgba(26, 54, 54, 0.4);
		border-color: rgba(143, 169, 152, 0.5);
	}

	.card-image-wrapper {
		@apply relative overflow-hidden;
		aspect-ratio: 16 / 9;
	}

	.card-image {
		@apply h-full w-full object-cover transition-transform duration-700;
	}

	.recipe-card:hover .card-image {
		transform: scale(1.05);
	}

	.card-overlay {
		@apply pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300;
		background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
	}

	.recipe-card:hover .card-overlay {
		@apply opacity-100;
	}

	/* Card Details */
	.card-details {
		@apply p-6;
	}

	.card-header {
		@apply mb-4 flex items-center justify-between;
	}

	.card-category {
		@apply text-sm font-semibold uppercase tracking-wide;
		color: #E0CEAD;
	}

	.card-difficulty {
		@apply rounded-full px-3 py-1 text-xs font-medium;
		background: rgba(143, 169, 152, 0.2);
		color: #B5C9BD;
		border: 1px solid rgba(143, 169, 152, 0.3);
	}

	.card-stats {
		@apply flex items-center justify-around border-t pt-4;
		border-color: rgba(103, 125, 106, 0.3);
	}

	.stat {
		@apply flex flex-col items-center gap-1;
	}

	.stat-label {
		@apply text-xs uppercase tracking-wide;
		color: rgba(214, 189, 152, 0.7);
	}

	.stat-value {
		@apply text-base font-semibold;
		color: #E0CEAD;
	}

	.stat-divider {
		@apply h-8 w-px;
		background: rgba(103, 125, 106, 0.3);
	}

	/* ========== Swiper Navigation Buttons ========== */
	:global(.swiper-button-prev),
	:global(.swiper-button-next) {
		@apply flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300;
		background-color: rgba(103, 125, 106, 0.8);
		color: #E0CEAD;
		border: 1px solid rgba(143, 169, 152, 0.3);
		backdrop-filter: blur(4px);
		top: 50% !important;
		transform: translateY(-50%);
		margin-top: 0 !important;
	}

	:global(.swiper-button-prev) {
		left: 0 !important;
	}

	:global(.swiper-button-next) {
		right: 0 !important;
	}

	@media (min-width: 1500px) {
		:global(.swiper-button-prev) {
			left: -60px !important;
		}

		:global(.swiper-button-next) {
			right: -60px !important;
		}
	}

	:global(.swiper-button-prev):hover,
	:global(.swiper-button-next):hover {
		background-color: rgba(143, 169, 152, 0.9);
		color: #EBE0CC;
		transform: translateY(-50%) scale(1.1);
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.4);
	}

	:global(.swiper-button-prev)::after,
	:global(.swiper-button-next)::after {
		content: '';
	}

	:global(.swiper-button-disabled) {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* ========== Swiper Pagination ========== */
	:global(.swiper-pagination) {
		@apply !bottom-8 flex items-center justify-center gap-2;
	}

	:global(.swiper-pagination-bullet) {
		@apply h-2 w-2 rounded-full opacity-100 transition-all duration-300;
		background: rgba(103, 125, 106, 0.4);
		margin: 0 4px !important;
	}

	:global(.swiper-pagination-bullet-active) {
		@apply w-8;
		background: linear-gradient(135deg, #677D6A, #8FA998);
	}

	/* ========== Responsive Design ========== */
	@media (max-width: 1024px) {
		:global(.swiper-button-prev) {
			left: 16px !important;
		}

		:global(.swiper-button-next) {
			right: 16px !important;
		}

		.hero-container {
			grid-template-columns: 1fr;
			gap: 48px;
			min-height: auto;
		}

		.hero-content {
			@apply text-center;
		}

		.content-wrapper {
			@apply mx-auto;
		}

		.hero-description {
			@apply mx-auto;
		}

		.meta-grid {
			@apply justify-center;
		}

		.cta-wrapper {
			@apply justify-center;
		}

		.hero-visual {
			@apply order-first;
		}

		.recipe-card {
			max-width: 400px;
		}
	}

	@media (max-width: 640px) {
		:global(.swiper-button-prev),
		:global(.swiper-button-next) {
			@apply h-10 w-10;
		}

		:global(.swiper-button-prev) {
			left: 8px !important;
		}

		:global(.swiper-button-next) {
			right: 8px !important;
		}

		.hero-section {
			padding: 40px 16px;
		}

		.hero-title {
			@apply mb-4;
		}

		.hero-description {
			@apply mb-6 text-base;
		}

		.meta-grid {
			@apply mb-6;
		}

		.recipe-card {
			max-width: 100%;
		}

		.card-details {
			@apply p-4;
		}

		:global(.swiper-pagination) {
			@apply !bottom-4;
		}
	}
</style>
