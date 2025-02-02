<!-- src/components/CategoryList/CategoryList.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import {
		Utensils,
		Coffee,
		Pizza,
		Soup,
		Beef,
		Sandwich,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte';

	const categories = [
		{
			name: 'Indian',
			icon: Soup,
			color: 'bg-orange-500',
			bgLight: 'bg-orange-50',
			bgDark: 'dark:bg-orange-500/10'
		},
		{
			name: 'Chinese',
			icon: Utensils,
			color: 'bg-red-500',
			bgLight: 'bg-red-50',
			bgDark: 'dark:bg-red-500/10'
		},
		{
			name: 'Italian',
			icon: Pizza,
			color: 'bg-emerald-500',
			bgLight: 'bg-emerald-50',
			bgDark: 'dark:bg-emerald-500/10'
		},
		{
			name: 'Spanish',
			icon: Coffee,
			color: 'bg-amber-500',
			bgLight: 'bg-amber-50',
			bgDark: 'dark:bg-amber-500/10'
		},
		{
			name: 'Thai',
			icon: Soup,
			color: 'bg-purple-500',
			bgLight: 'bg-purple-50',
			bgDark: 'dark:bg-purple-500/10'
		},
		{
			name: 'Japanese',
			icon: Beef,
			color: 'bg-rose-500',
			bgLight: 'bg-rose-50',
			bgDark: 'dark:bg-rose-500/10'
		}
	];
</script>

<section class="categories-section" class:dark={$theme === 'dark'}>
	<div class="header">
		<h2 class="title">
			<span class="highlight">Categories</span>
		</h2>
		<p class="subtitle">Explore recipes by cuisine type</p>
	</div>

	<div class="categories-container">
		<div class="scroll-area" class:dark={$theme === 'dark'}>
			{#each categories as category}
				<a
					href="/category/{category.name.toLowerCase()}"
					class="category-card {category.bgLight} {category.bgDark}"
					data-sveltekit-noscroll
					on:click|preventDefault
				>
					<div class="icon-wrapper {category.color}">
						<svelte:component this={category.icon} size={20} class="text-white" />
					</div>
					<span class="category-name">{category.name}</span>
				</a>
			{/each}
		</div>

		<!-- Navigation Arrows -->
		<button class="nav-button left">
			<ChevronLeft size={20} />
		</button>
		<button class="nav-button right">
			<ChevronRight size={20} />
		</button>
	</div>
</section>

<style lang="postcss">
	.categories-section {
		@apply py-8;
	}

	.header {
		@apply mb-8 text-center;
	}

	.title {
		@apply text-3xl font-bold text-gray-900 dark:text-white;
	}

	.highlight {
		@apply text-orange-500;
	}

	.subtitle {
		@apply mt-2 text-gray-600 dark:text-gray-400;
	}

	.categories-container {
		@apply relative mx-auto max-w-7xl px-8;
	}

	.scroll-area {
		@apply flex gap-6 overflow-x-auto py-4;
		/* Hide scrollbar */
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.scroll-area::-webkit-scrollbar {
		display: none;
	}

	.category-card {
		@apply flex min-w-[160px] flex-col items-center gap-4 rounded-xl p-6;
		@apply transform transition-all duration-300;
		@apply will-change-transform;
		@apply border border-gray-100 dark:border-gray-700;
	}

	/* Prevent jumping by setting explicit height */
	.category-card::before {
		content: '';
		@apply block;
		padding-bottom: 100%;
	}

	.icon-wrapper {
		@apply flex h-12 w-12 items-center justify-center rounded-full;
		@apply shadow-lg;
	}

	.category-name {
		@apply text-base font-medium text-gray-800 dark:text-gray-200;
	}

	.nav-button {
		@apply absolute top-1/2 hidden -translate-y-1/2 items-center justify-center;
		@apply h-10 w-10 rounded-full bg-white shadow-lg dark:bg-gray-800;
		@apply text-gray-600 dark:text-gray-300;
		@apply transition-all duration-300;
		@apply hover:bg-gray-50 hover:text-gray-900;
		@apply dark:hover:bg-gray-700 dark:hover:text-white;
		@apply lg:flex;
	}

	.nav-button.left {
		@apply -left-5;
	}

	.nav-button.right {
		@apply -right-5;
	}

	/* Add smooth hover effect */
	.category-card {
		@apply hover:-translate-y-1 hover:shadow-lg;
	}
</style>
