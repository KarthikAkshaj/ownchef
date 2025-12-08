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
		{ name: 'Indian', count: 128, color: 'sage-1' },
		{ name: 'Italian', count: 156, color: 'sage-2' },
		{ name: 'Chinese', count: 142, color: 'sage-3' },
		{ name: 'Japanese', count: 98, color: 'sage-4' },
		{ name: 'Mexican', count: 87, color: 'sage-5' },
		{ name: 'Thai', count: 76, color: 'sage-6' }
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
			<Flame class="icon sage-icon" size={20} />
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
			<Hash class="icon sage-icon" size={20} />
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
			<Award class="icon sage-icon" size={20} />
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
		@apply flex flex-col gap-8 rounded-2xl p-6 shadow-sm;
		background-color: #40534C;
		border: 1px solid rgba(103, 125, 106, 0.3);
	}

	.section {
		@apply flex flex-col gap-6;
	}

	.section-header {
		@apply flex items-center gap-3;
	}

	.section-title {
		@apply text-xl font-bold;
		color: #E0CEAD;
	}

	.posts-grid {
		@apply flex flex-col gap-6;
	}

	.post-card {
		@apply flex gap-4 rounded-lg p-2 transition-all duration-300;
	}

	.post-card:hover {
		background-color: rgba(103, 125, 106, 0.2);
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
		@apply mb-1 line-clamp-2 text-sm font-medium;
		color: #E0CEAD;
	}

	.post-meta {
		@apply flex items-center gap-2 text-xs;
		color: rgba(214, 189, 152, 0.7);
	}

	.categories-grid {
		@apply grid gap-3 sm:grid-cols-2;
	}

	.category-card {
		@apply flex items-center justify-between rounded-lg p-3 transition-all duration-300;
		border: 1px solid rgba(103, 125, 106, 0.3);
	}

	.category-card:hover {
		border-color: rgba(143, 169, 152, 0.5);
	}

	.category-info {
		@apply flex flex-col;
	}

	.category-name {
		@apply text-sm font-medium;
		color: #E0CEAD;
	}

	.category-count {
		@apply text-xs;
		color: rgba(214, 189, 152, 0.7);
	}

	.category-indicator {
		@apply h-2 w-2 rounded-full;
	}

	.sage-icon {
		color: #8FA998;
	}

	.category-indicator.sage-1 {
		background-color: #677D6A;
	}

	.category-indicator.sage-2 {
		background-color: #8FA998;
	}

	.category-indicator.sage-3 {
		background-color: #B5C9BD;
	}

	.category-indicator.sage-4 {
		background-color: #D6BD98;
	}

	.category-indicator.sage-5 {
		background-color: #E0CEAD;
	}

	.category-indicator.sage-6 {
		background-color: #677D6A;
	}

	.picks-grid {
		@apply flex flex-col gap-6;
	}

	.pick-card {
		@apply flex gap-4 rounded-lg p-2 transition-all duration-300;
	}

	.pick-card:hover {
		background-color: rgba(103, 125, 106, 0.2);
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
		@apply mb-1 line-clamp-2 text-sm font-medium;
		color: #E0CEAD;
	}

	.pick-meta {
		@apply flex items-center gap-2 text-xs;
		color: rgba(214, 189, 152, 0.7);
	}

	.author {
		@apply font-medium;
	}

	.date {
		@apply before:mx-1 before:content-['•'];
	}
</style>
