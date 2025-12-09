<script lang="ts">
	import CardList from '$components/CardList/CardList.svelte';
	import { ChefHat, Sparkles } from 'lucide-svelte';
	export let data;

	$: recipeCount = data.posts?.length || 0;
</script>

<div class="category-page">
	<!-- Hero Header -->
	<div class="category-header">
		<div class="header-background"></div>
		<div class="header-content">
			<div class="icon-wrapper">
				<ChefHat size={28} strokeWidth={2.5} />
			</div>
			<h1 class="category-title">
				{data.category.name}
				<span class="highlight">Recipes</span>
			</h1>
			<p class="category-description">
				Discover authentic {data.category.name.toLowerCase()} recipes from our community
			</p>
			{#if recipeCount > 0}
				<div class="recipe-count-badge">
					<Sparkles size={16} strokeWidth={2.5} />
					<span>{recipeCount} {recipeCount === 1 ? 'Recipe' : 'Recipes'} Available</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Main Content -->
	<div class="content-wrapper">
		<div class="container mx-auto px-4 py-12">
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
</div>

<style lang="postcss">
	.category-page {
		@apply min-h-screen;
		background: #EBE0CC;
	}

	/* Hero Header Section */
	.category-header {
		@apply relative overflow-hidden py-12 text-center;
		background: #1A3636;
		position: relative;
	}

	.header-background {
		@apply absolute inset-0;
		background: #1A3636;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-10px); }
	}

	.header-content {
		@apply relative z-10 mx-auto max-w-4xl px-4;
		animation: fadeIn 0.8s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.icon-wrapper {
		@apply mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full;
		background: rgba(235, 224, 204, 0.15);
		border: 2px solid rgba(235, 224, 204, 0.3);
		color: #EBE0CC;
		backdrop-filter: blur(10px);
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.1),
			inset 0 0 10px rgba(255, 255, 255, 0.1);
		transition: all 0.3s ease;
	}

	.icon-wrapper:hover {
		transform: scale(1.05) rotate(5deg);
		box-shadow:
			0 6px 24px rgba(0, 0, 0, 0.15),
			inset 0 0 15px rgba(255, 255, 255, 0.15);
	}

	.category-title {
		@apply mb-3 text-3xl font-bold md:text-4xl;
		color: #EBE0CC;
		text-shadow:
			0 2px 10px rgba(0, 0, 0, 0.3),
			0 0 40px rgba(235, 224, 204, 0.2);
		letter-spacing: -0.01em;
		line-height: 1.2;
	}

	.category-title .highlight {
		display: block;
		background: linear-gradient(135deg, #D6BD98 0%, #EBE0CC 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		@apply mt-1;
	}

	.category-description {
		@apply text-sm md:text-base mb-4;
		color: rgba(214, 189, 152, 0.9);
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	.recipe-count-badge {
		@apply inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold;
		background: rgba(235, 224, 204, 0.2);
		border: 1px solid rgba(235, 224, 204, 0.3);
		color: #EBE0CC;
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	/* Content Section */
	.content-wrapper {
		@apply relative;
		background: linear-gradient(
			to bottom,
			#1A3636 0%,
			#EBE0CC 100%
		);
	}

	/* Empty State */
	.empty-state {
		@apply mx-auto flex max-w-md flex-col items-center rounded-2xl p-12 text-center;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(103, 125, 106, 0.1);
		box-shadow: 0 8px 32px rgba(64, 83, 76, 0.08);
	}

	.empty-icon {
		@apply mb-6 rounded-full p-6;
		background: linear-gradient(135deg, rgba(103, 125, 106, 0.1), rgba(143, 169, 152, 0.15));
		color: #677D6A;
		box-shadow: 0 4px 16px rgba(103, 125, 106, 0.1);
	}

	.empty-title {
		@apply mb-3 text-2xl font-bold;
		color: #40534C;
	}

	.empty-message {
		@apply mb-6 text-base;
		color: #677D6A;
	}

	.empty-action {
		@apply rounded-full px-8 py-3.5 font-semibold text-white transition-all no-underline;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		box-shadow: 0 4px 16px rgba(103, 125, 106, 0.3);
	}

	.empty-action:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(103, 125, 106, 0.4);
		background: linear-gradient(135deg, #8FA998, #677D6A);
	}

	.empty-action:active {
		transform: translateY(0);
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.3);
	}
</style>
