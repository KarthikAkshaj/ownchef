<script lang="ts">
	import Featured from '../components/Featured/Featured.svelte';
	import CardList from '../components/CardList/CardList.svelte';
	import CategoryList from '../components/CategoryList/CategoryList.svelte';
	import Menu from '../components/Menu/Menu.svelte';
	import QuickCategories from '../components/QuickCategories/QuickCategories.svelte';
</script>

<!-- This should be the first section -->
<Featured />
<QuickCategories />

<div class="home-content">
	<!-- Popular Categories -->
	<CategoryList />

	<!-- Main Grid Layout -->
	<div class="content-grid">
		<!-- Card List Section -->
		<div class="main-content">
			<CardList />
		</div>

		<!-- Sidebar/Menu Section -->
		<aside class="sidebar">
			<Menu />
		</aside>
	</div>
</div>

<style lang="postcss">
	.home-content {
		@apply mx-auto max-w-7xl px-4 py-8;
	}

	.content-grid {
		@apply mt-8 grid gap-8;
		@apply lg:grid-cols-[1fr_300px];
	}

	.main-content {
		@apply w-full;
	}

	.sidebar {
		@apply w-full lg:w-[300px];
	}
</style>
