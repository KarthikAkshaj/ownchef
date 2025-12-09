<script lang="ts">
	import CardList from '$components/CardList/CardList.svelte';
	import { ChefHat } from 'lucide-svelte';
	export let data;
</script>

<div class="category-page">
	<div class="category-header">
		<div class="header-content">
			<div class="icon-wrapper">
				<ChefHat size={32} strokeWidth={2} />
			</div>
			<h1 class="category-title">
				{data.category.name} Recipes
			</h1>
			<p class="category-description">
				Discover authentic {data.category.name.toLowerCase()} recipes from our community
			</p>
		</div>
	</div>

	<div class="container mx-auto px-4 py-8">
		{#if data.posts && data.posts.length > 0}
			<CardList posts={data.posts} />
		{:else}
			<div class="empty-state">
				<div class="empty-icon">
					<ChefHat size={64} strokeWidth={1.5} />
				</div>
				<h2 class="empty-title">No recipes yet</h2>
				<p class="empty-message">
					Be the first to share a {data.category.name} recipe with our community!
				</p>
				<a href="/write" class="empty-action"> Share a Recipe </a>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.category-page {
		@apply min-h-screen;
		background: linear-gradient(135deg, #EBE0CC 0%, #E0CEAD 50%, #B5C9BD 100%);
	}

	.category-page:global(.dark) {
		background: linear-gradient(135deg, #1A3636 0%, #40534C 50%, #677D6A 100%);
	}

	.category-header {
		@apply relative overflow-hidden py-16 text-center;
		background: linear-gradient(135deg, #40534C, #677D6A, #8FA998);
	}

	.category-header::before {
		content: '';
		@apply absolute inset-0 opacity-10;
		background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
		background-size: 30px 30px;
	}

	.header-content {
		@apply relative z-10 mx-auto max-w-3xl px-4;
	}

	.icon-wrapper {
		@apply mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full;
		background: rgba(235, 224, 204, 0.2);
		border: 2px solid rgba(235, 224, 204, 0.3);
		color: #ebe0cc;
		backdrop-filter: blur(10px);
	}

	.category-title {
		@apply mb-3 text-4xl font-bold md:text-5xl;
		color: #ebe0cc;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}

	.category-description {
		@apply text-lg;
		color: rgba(214, 189, 152, 0.9);
	}

	.empty-state {
		@apply mx-auto flex max-w-md flex-col items-center rounded-2xl bg-white p-12 text-center shadow-sm;
		@apply dark:bg-gray-800;
	}

	.empty-icon {
		@apply mb-6 rounded-full p-6;
		background: rgba(103, 125, 106, 0.1);
		color: #8fa998;
	}

	.empty-title {
		@apply mb-3 text-2xl font-bold text-gray-900 dark:text-white;
	}

	.empty-message {
		@apply mb-6 text-gray-600 dark:text-gray-400;
	}

	.empty-action {
		@apply rounded-full px-6 py-3 font-semibold transition-all;
		background: linear-gradient(135deg, #677d6a, #8fa998);
		color: #1a3636;
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.3);
	}

	.empty-action:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(143, 169, 152, 0.4);
	}
</style>
