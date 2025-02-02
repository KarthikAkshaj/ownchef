<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Search, Filter, ArrowRight } from 'lucide-svelte';

	// Sample blog data - replace with actual data from your backend
	const blogPosts = [
		{
			id: 1,
			title: 'The Art of Making Perfect Sourdough Bread',
			excerpt:
				'Master the ancient technique of sourdough bread making with our comprehensive guide...',
			category: 'Baking',
			image: '/images/sourdough.jpg',
			author: {
				name: 'Chef Maria',
				avatar: '/images/chef-maria.jpg'
			},
			readTime: '8 min read',
			date: '2024-01-25',
			tags: ['bread', 'baking', 'sourdough']
		},
		{
			id: 2,
			title: 'Essential Kitchen Tools Every Home Chef Needs',
			excerpt:
				'Discover the must-have kitchen tools that will elevate your cooking game to the next level...',
			category: 'Kitchen Tips',
			image: '/images/kitchen-tools.jpg',
			author: {
				name: 'Chef John',
				avatar: '/images/chef-john.jpg'
			},
			readTime: '6 min read',
			date: '2024-01-23',
			tags: ['tools', 'kitchen', 'equipment']
		}
		// Add more blog posts...
	];

	const categories = [
		'All',
		'Recipes',
		'Kitchen Tips',
		'Cooking Techniques',
		'Food Stories',
		'Health & Nutrition'
	];

	let selectedCategory = 'All';
	let searchQuery = '';
	let activeSort = 'latest'; // latest, popular, trending

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="blog-container" class:dark={$theme === 'dark'}>
	<!-- Hero Section -->
	<section class="hero">
		<h1 class="hero-title">Culinary Stories & Insights</h1>
		<p class="hero-subtitle">
			Discover recipes, tips, and stories from our community of passionate chefs
		</p>
	</section>

	<!-- Filters and Search -->
	<section class="filters-section">
		<div class="search-bar">
			<Search size={20} class="search-icon" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search articles..."
				class="search-input"
			/>
		</div>

		<div class="categories-filter">
			{#each categories as category}
				<button
					class="category-btn"
					class:active={selectedCategory === category}
					on:click={() => (selectedCategory = category)}
				>
					{category}
				</button>
			{/each}
		</div>

		<div class="sort-options">
			<button
				class="sort-btn"
				class:active={activeSort === 'latest'}
				on:click={() => (activeSort = 'latest')}
			>
				Latest
			</button>
			<button
				class="sort-btn"
				class:active={activeSort === 'popular'}
				on:click={() => (activeSort = 'popular')}
			>
				Popular
			</button>
			<button
				class="sort-btn"
				class:active={activeSort === 'trending'}
				on:click={() => (activeSort = 'trending')}
			>
				Trending
			</button>
		</div>
	</section>

	<!-- Blog Posts Grid -->
	<section class="posts-grid">
		{#each blogPosts as post}
			<article class="blog-card">
				<div class="card-image-wrapper">
					<img src={post.image} alt={post.title} class="card-image" />
					<span class="category-tag">{post.category}</span>
				</div>

				<div class="card-content">
					<div class="card-meta">
						<div class="author-info">
							<img src={post.author.avatar} alt={post.author.name} class="author-avatar" />
							<span class="author-name">{post.author.name}</span>
						</div>
						<span class="read-time">{post.readTime}</span>
					</div>

					<h2 class="card-title">{post.title}</h2>
					<p class="card-excerpt">{post.excerpt}</p>

					<div class="card-footer">
						<span class="post-date">{formatDate(post.date)}</span>
						<a href="/blog/{post.id}" class="read-more">
							Read More
							<ArrowRight size={16} class="arrow-icon" />
						</a>
					</div>
				</div>
			</article>
		{/each}
	</section>

	<!-- Newsletter Section -->
	<section class="newsletter">
		<div class="newsletter-content">
			<h2 class="newsletter-title">Subscribe to Our Newsletter</h2>
			<p class="newsletter-description">
				Get weekly recipes, cooking tips, and food stories delivered to your inbox
			</p>
			<form class="newsletter-form">
				<input type="email" placeholder="Enter your email" class="newsletter-input" />
				<button type="submit" class="newsletter-button">Subscribe</button>
			</form>
		</div>
	</section>
</div>

<style lang="postcss">
	.blog-container {
		@apply mx-auto max-w-7xl px-4 py-8;
	}

	.hero {
		@apply mb-12 text-center;
	}

	.hero-title {
		@apply mb-4 text-5xl font-bold text-gray-900 dark:text-white;
		@apply bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent;
	}

	.hero-subtitle {
		@apply text-xl text-gray-600 dark:text-gray-400;
	}

	.filters-section {
		@apply mb-12 flex flex-col items-center gap-8;
	}

	.search-bar {
		@apply relative mx-auto w-full max-w-2xl px-4;
	}

	.search-icon {
		@apply pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-gray-400;
	}

	.search-input {
		@apply w-full rounded-full border border-gray-200 bg-white px-12 py-3 text-gray-900 outline-none transition-all;
		@apply focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20;
		@apply dark:border-gray-700 dark:bg-gray-800 dark:text-white;
	}

	.categories-filter {
		@apply flex flex-wrap items-center justify-center gap-3;
		@apply w-full max-w-4xl px-4;
	}

	.category-btn {
		@apply rounded-full px-4 py-2 text-sm font-medium transition-all;
		@apply text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800;
	}

	.category-btn.active {
		@apply bg-orange-500 text-white hover:bg-orange-600;
	}

	.sort-options {
		@apply flex items-center justify-center gap-2;
		@apply border-t border-gray-200 pt-6 dark:border-gray-700;
		@apply w-full max-w-4xl;
	}

	.sort-btn {
		@apply rounded-md px-4 py-2 text-sm font-medium transition-all;
		@apply text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800;
	}

	.sort-btn.active {
		@apply bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white;
	}

	.posts-grid {
		@apply grid gap-8;
		@apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
	}

	.blog-card {
		@apply overflow-hidden rounded-2xl bg-white shadow-sm transition-all;
		@apply hover:shadow-xl hover:shadow-black/5;
		@apply dark:bg-gray-800 dark:hover:shadow-white/5;
	}

	.card-image-wrapper {
		@apply relative aspect-[16/9] w-full overflow-hidden;
	}

	.card-image {
		@apply h-full w-full object-cover transition-transform duration-500;
	}

	.blog-card:hover .card-image {
		@apply scale-110;
	}

	.category-tag {
		@apply absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium backdrop-blur-sm;
		@apply dark:bg-black/50;
	}

	.card-content {
		@apply p-6;
	}

	.card-meta {
		@apply mb-4 flex items-center justify-between;
	}

	.author-info {
		@apply flex items-center gap-2;
	}

	.author-avatar {
		@apply h-8 w-8 rounded-full;
	}

	.author-name {
		@apply text-sm font-medium text-gray-900 dark:text-white;
	}

	.read-time {
		@apply text-sm text-gray-500 dark:text-gray-400;
	}

	.card-title {
		@apply mb-2 text-xl font-bold text-gray-900 dark:text-white;
	}

	.card-excerpt {
		@apply mb-4 line-clamp-2 text-gray-600 dark:text-gray-400;
	}

	.card-footer {
		@apply flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700;
	}

	.post-date {
		@apply text-sm text-gray-500 dark:text-gray-400;
	}

	.read-more {
		@apply flex items-center gap-1 text-sm font-medium text-orange-500 transition-colors;
		@apply hover:text-orange-600;
	}

	.newsletter {
		@apply mt-24 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-16 text-center text-white;
	}

	.newsletter-content {
		@apply mx-auto max-w-2xl;
	}

	.newsletter-title {
		@apply mb-4 text-3xl font-bold;
	}

	.newsletter-description {
		@apply mb-8 text-lg text-white/90;
	}

	.newsletter-form {
		@apply flex gap-4;
	}

	.newsletter-input {
		@apply flex-1 rounded-lg border-2 border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/60 backdrop-blur-sm;
		@apply focus:border-white/40 focus:outline-none;
	}

	.newsletter-button {
		@apply rounded-lg bg-white px-6 py-3 font-medium text-orange-500 transition-all;
		@apply hover:bg-orange-50;
	}
</style>
