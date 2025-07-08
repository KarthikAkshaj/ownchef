<!-- src/components/Menu/Menu.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Flame, Award, Hash } from 'lucide-svelte';

	// Sample data - replace with actual data later
	const popularPosts = [
		{
			id: 1,
			title: 'Classic Italian Pasta Carbonara',
			views: 12543,
			image: '/images/recipes/carbonara.jpg',
			author: 'Chef Maria',
			date: '2024-01-15'
		},
		{
			id: 2,
			title: 'Authentic Thai Green Curry',
			views: 10234,
			image: '/images/recipes/thai-curry.jpg',
			author: 'Chef Sorn',
			date: '2024-01-18'
		},
		{
			id: 3,
			title: 'Perfect Homemade Pizza',
			views: 9876,
			image: '/images/recipes/margherita-pizza.jpg',
			author: 'Chef Marco',
			date: '2024-01-20'
		}
	];

	const editorsPicks = [
		{
			id: 1,
			title: 'Japanese Ramen from Scratch',
			rating: 4.9,
			image: '/images/recipes/ramen.jpg',
			author: 'Chef Yuki',
			date: '2024-01-22'
		},
		{
			id: 2,
			title: 'French Croissants Masterclass',
			rating: 4.8,
			image: '/images/recipes/croissant.jpg',
			author: 'Chef Pierre',
			date: '2024-01-25'
		}
	];

	const categories = [
		{ name: 'Indian', count: 128, color: 'bg-orange-500' },
		{ name: 'Italian', count: 156, color: 'bg-green-500' },
		{ name: 'Chinese', count: 142, color: 'bg-red-500' },
		{ name: 'Japanese', count: 98, color: 'bg-blue-500' },
		{ name: 'Mexican', count: 87, color: 'bg-yellow-500' },
		{ name: 'Thai', count: 76, color: 'bg-purple-500' }
	];

	function formatNumber(num: number): string {
		return num > 999 ? (num / 1000).toFixed(1) + 'k' : num.toString();
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<aside class="sidebar" class:dark={$theme === 'dark'}>
	<!-- Most Popular Section -->
	<section class="section">
		<div class="section-header">
			<Flame class="icon text-orange-500" size={20} />
			<h2 class="section-title">Most Popular</h2>
		</div>
		<div class="posts-grid">
			{#each popularPosts as post}
				<article class="post-card">
					<div class="post-image-wrapper">
						<img src={post.image} alt={post.title} class="post-image" />
						<span class="views-badge">{formatNumber(post.views)} views</span>
					</div>
					<div class="post-content">
						<h3 class="post-title">{post.title}</h3>
						<div class="post-meta">
							<span class="author">{post.author}</span>
							<span class="date">{formatDate(post.date)}</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- Categories Section -->
	<section class="section">
		<div class="section-header">
			<Hash class="icon text-blue-500" size={20} />
			<h2 class="section-title">Categories</h2>
		</div>
		<div class="categories-grid">
			{#each categories as category}
				<a href="/category/{category.name.toLowerCase()}" class="category-card">
					<div class="category-info">
						<span class="category-name">{category.name}</span>
						<span class="category-count">{category.count} recipes</span>
					</div>
					<div class="category-indicator {category.color}"></div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Editor's Picks Section -->
	<section class="section">
		<div class="section-header">
			<Award class="icon text-yellow-500" size={20} />
			<h2 class="section-title">Editor's Picks</h2>
		</div>
		<div class="picks-grid">
			{#each editorsPicks as pick}
				<article class="pick-card">
					<div class="pick-image-wrapper">
						<img src={pick.image} alt={pick.title} class="pick-image" />
						<span class="rating-badge">⭐ {pick.rating}</span>
					</div>
					<div class="pick-content">
						<h3 class="pick-title">{pick.title}</h3>
						<div class="pick-meta">
							<span class="author">{pick.author}</span>
							<span class="date">{formatDate(pick.date)}</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>
</aside>

<style lang="postcss">
	.sidebar {
		@apply flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800;
	}

	.section {
		@apply flex flex-col gap-6;
	}

	.section-header {
		@apply flex items-center gap-3;
	}

	.section-title {
		@apply text-xl font-bold text-gray-900 dark:text-white;
	}

	.posts-grid {
		@apply flex flex-col gap-6;
	}

	.post-card {
		@apply flex gap-4 rounded-lg p-2 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700;
	}

	.post-image-wrapper {
		@apply relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg;
	}

	.post-image {
		@apply h-full w-full object-cover;
	}

	.views-badge {
		@apply absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white;
	}

	.post-content {
		@apply flex flex-col justify-center;
	}

	.post-title {
		@apply mb-1 line-clamp-2 text-sm font-medium text-gray-900 dark:text-white;
	}

	.post-meta {
		@apply flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400;
	}

	.categories-grid {
		@apply grid gap-3 sm:grid-cols-2;
	}

	.category-card {
		@apply flex items-center justify-between rounded-lg border p-3 transition-all duration-300 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600;
	}

	.category-info {
		@apply flex flex-col;
	}

	.category-name {
		@apply text-sm font-medium text-gray-900 dark:text-white;
	}

	.category-count {
		@apply text-xs text-gray-500 dark:text-gray-400;
	}

	.category-indicator {
		@apply h-2 w-2 rounded-full;
	}

	.picks-grid {
		@apply flex flex-col gap-6;
	}

	.pick-card {
		@apply flex gap-4 rounded-lg p-2 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700;
	}

	.pick-image-wrapper {
		@apply relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg;
	}

	.pick-image {
		@apply h-full w-full object-cover;
	}

	.rating-badge {
		@apply absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white;
	}

	.pick-content {
		@apply flex flex-col justify-center;
	}

	.pick-title {
		@apply mb-1 line-clamp-2 text-sm font-medium text-gray-900 dark:text-white;
	}

	.pick-meta {
		@apply flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400;
	}

	.author {
		@apply font-medium;
	}

	.date {
		@apply before:mx-1 before:content-['•'];
	}
</style>
