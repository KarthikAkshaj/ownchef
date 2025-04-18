<!-- src/routes/search/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import {
		Search,
		Filter,
		Clock,
		X,
		ChefHat,
		Users,
		Flame,
		AlertCircle,
		Star,
		ChevronDown,
		ChevronUp
	} from 'lucide-svelte';
	import Card from '../../components/Card/Card.svelte';

	// Search parameters (would come from URL in a real implementation)
	let searchQuery = $page.url.searchParams.get('q') || '';
	let cuisineFilter = $page.url.searchParams.get('cuisine') || '';
	let categoryFilter = $page.url.searchParams.get('category') || '';
	let timeFilter = $page.url.searchParams.get('time') || '';
	let difficultyFilter = $page.url.searchParams.get('difficulty') || '';
	let dietaryFilter = $page.url.searchParams.get('dietary') || '';

	// UI state
	let showFilters = false;
	let isLoading = true;
	let resultsCount = 0;
	let currentPage = parseInt($page.url.searchParams.get('page') || '1');
	let sortOrder = $page.url.searchParams.get('sort') || 'relevance';

	// Filter options
	const cuisineOptions = [
		'Indian',
		'Chinese',
		'Italian',
		'Thai',
		'Mexican',
		'Japanese',
		'French',
		'Spanish',
		'Middle Eastern',
		'American',
		'Korean',
		'Vietnamese',
		'Mediterranean'
	];

	const categoryOptions = [
		'Breakfast',
		'Lunch',
		'Dinner',
		'Appetizer',
		'Main Course',
		'Side Dish',
		'Dessert',
		'Snack',
		'Soup',
		'Salad',
		'Beverage'
	];

	const timeOptions = [
		{ value: 'under15', label: 'Under 15 minutes' },
		{ value: 'under30', label: 'Under 30 minutes' },
		{ value: 'under60', label: 'Under 1 hour' },
		{ value: 'over60', label: 'Over 1 hour' }
	];

	const difficultyOptions = ['Easy', 'Medium', 'Hard'];

	const dietaryOptions = [
		'Vegetarian',
		'Vegan',
		'Gluten-Free',
		'Dairy-Free',
		'Nut-Free',
		'Low-Carb',
		'Keto',
		'Paleo',
		'Whole30'
	];

	const sortOptions = [
		{ value: 'relevance', label: 'Relevance' },
		{ value: 'rating', label: 'Highest Rated' },
		{ value: 'newest', label: 'Newest First' },
		{ value: 'popular', label: 'Most Popular' },
		{ value: 'time_asc', label: 'Quickest First' },
		{ value: 'time_desc', label: 'Longest First' }
	];

	// Mock search results for demo (this would be fetched from API)
	let results = [
		{
			title: 'Classic Butter Chicken',
			description:
				'A rich and creamy tomato-based curry with tender chicken pieces marinated in yogurt and spices.',
			image: '/images/butter-chicken.jpg',
			cookTime: 45,
			category: 'Indian',
			difficulty: 'Medium',
			author: {
				name: 'Chef Priya',
				avatar: '/images/chef-priya.jpg'
			},
			rating: 4.8
		},
		{
			title: 'Palak Paneer',
			description:
				'Creamy spinach curry with soft paneer cheese cubes, flavored with garlic, ginger, and aromatic spices.',
			image: '/images/palak-paneer.jpg',
			cookTime: 35,
			category: 'Indian',
			difficulty: 'Easy',
			author: {
				name: 'Chef Raj',
				avatar: '/images/chef-raj.jpg'
			},
			rating: 4.7
		},
		{
			title: 'Chicken Biryani',
			description:
				'Fragrant basmati rice cooked with tender chicken pieces, saffron, and a blend of traditional spices.',
			image: '/images/biryani.jpg',
			cookTime: 60,
			category: 'Indian',
			difficulty: 'Medium',
			author: {
				name: 'Chef Priya',
				avatar: '/images/chef-priya.jpg'
			},
			rating: 4.9
		},
		{
			title: 'Masala Dosa',
			description:
				'Crispy rice and lentil crepes filled with spiced potato filling, served with coconut chutney and sambar.',
			image: '/images/masala-dosa.jpg',
			cookTime: 50,
			category: 'Indian',
			difficulty: 'Hard',
			author: {
				name: 'Chef Raj',
				avatar: '/images/chef-raj.jpg'
			},
			rating: 4.6
		},
		{
			title: 'Pad Thai',
			description:
				'Stir-fried rice noodles with eggs, tofu, bean sprouts, peanuts, and a tangy sauce.',
			image: '/images/pad-thai.jpg',
			cookTime: 25,
			category: 'Thai',
			difficulty: 'Medium',
			author: {
				name: 'Chef Sorn',
				avatar: '/images/chef-sorn.jpg'
			},
			rating: 4.5
		},
		{
			title: 'Spaghetti Carbonara',
			description: 'Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
			image: '/images/carbonara.jpg',
			cookTime: 20,
			category: 'Italian',
			difficulty: 'Easy',
			author: {
				name: 'Chef Marco',
				avatar: '/images/chef-marco.jpg'
			},
			rating: 4.7
		},
		{
			title: 'Vegetable Stir Fry',
			description:
				'Quick and healthy stir-fried vegetables with a savory sauce, perfect as a side dish or main course.',
			image: '/images/stir-fry.jpg',
			cookTime: 15,
			category: 'Chinese',
			difficulty: 'Easy',
			author: {
				name: 'Chef Li',
				avatar: '/images/chef-li.jpg'
			},
			rating: 4.3
		},
		{
			title: 'Chocolate Lava Cake',
			description:
				'Decadent chocolate dessert with a molten center, served with vanilla ice cream.',
			image: '/images/lava-cake.jpg',
			cookTime: 25,
			category: 'Dessert',
			difficulty: 'Medium',
			author: {
				name: 'Chef Pierre',
				avatar: '/images/chef-pierre.jpg'
			},
			rating: 4.9
		},
		{
			title: 'Greek Salad',
			description:
				'Fresh Mediterranean salad with cucumber, tomato, olives, feta cheese, and a zesty dressing.',
			image: '/images/greek-salad.jpg',
			cookTime: 10,
			category: 'Salad',
			difficulty: 'Easy',
			author: {
				name: 'Chef Helena',
				avatar: '/images/chef-helena.jpg'
			},
			rating: 4.4
		}
	];

	// Filter results based on selected criteria
	$: filteredResults = filterResults(results);
	$: resultsCount = filteredResults.length;

	// Function to filter results based on selected criteria
	function filterResults(recipes) {
		return recipes.filter((recipe) => {
			let matchesQuery =
				!searchQuery ||
				recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

			let matchesCuisine = !cuisineFilter || recipe.category === cuisineFilter;

			let matchesCategory = !categoryFilter || recipe.category === categoryFilter;

			let matchesTime = !timeFilter;
			if (timeFilter === 'under15') matchesTime = recipe.cookTime < 15;
			if (timeFilter === 'under30') matchesTime = recipe.cookTime < 30;
			if (timeFilter === 'under60') matchesTime = recipe.cookTime < 60;
			if (timeFilter === 'over60') matchesTime = recipe.cookTime >= 60;

			let matchesDifficulty = !difficultyFilter || recipe.difficulty === difficultyFilter;

			// For dietary restrictions, we'd need more data in the recipe model
			// This is a simplified example
			let matchesDietary = !dietaryFilter;

			return (
				matchesQuery &&
				matchesCuisine &&
				matchesCategory &&
				matchesTime &&
				matchesDifficulty &&
				matchesDietary
			);
		});
	}

	// Function to handle search form submission
	function handleSearch() {
		// In a real implementation, we'd update the URL and fetch results
		isLoading = true;

		// Simulate API call
		setTimeout(() => {
			isLoading = false;
		}, 800);
	}

	// Function to clear all filters
	function clearFilters() {
		searchQuery = '';
		cuisineFilter = '';
		categoryFilter = '';
		timeFilter = '';
		difficultyFilter = '';
		dietaryFilter = '';
		handleSearch();
	}

	// Function to handle pagination
	function changePage(newPage) {
		if (newPage < 1 || newPage > Math.ceil(resultsCount / 9)) return;
		currentPage = newPage;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Function to handle sort order change
	function handleSortChange(event) {
		sortOrder = event.target.value;
		handleSearch();
	}

	// Generate pagination range
	$: totalPages = Math.ceil(resultsCount / 9);
	$: paginationRange = generatePaginationRange(currentPage, totalPages);

	function generatePaginationRange(current, total) {
		const range = [];
		const delta = 2; // Pages to show before and after current page

		for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
			range.push(i);
		}

		// Always include first and last page
		if (current - delta > 2) range.unshift('...');
		if (current + delta < total - 1) range.push('...');

		if (total > 1) {
			range.unshift(1);
			if (total > 1) range.push(total);
		}

		return range;
	}

	// Get active filter count
	$: activeFilterCount = [
		cuisineFilter,
		categoryFilter,
		timeFilter,
		difficultyFilter,
		dietaryFilter
	].filter(Boolean).length;

	onMount(() => {
		// Simulate API call
		setTimeout(() => {
			isLoading = false;
		}, 1200);
	});
</script>

<svelte:head>
	<title>{searchQuery ? `Search: ${searchQuery}` : 'Search Recipes'} | OwnChef</title>
</svelte:head>

<div class="search-results-container" class:dark={$theme === 'dark'}>
	<!-- Search Header -->
	<div class="search-header">
		<div class="search-bar-container">
			<form on:submit|preventDefault={handleSearch} class="search-form">
				<div class="search-bar">
					<Search size={20} class="search-icon" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search recipes, ingredients, or cuisines"
						class="search-input"
						aria-label="Search recipes"
					/>
					{#if searchQuery}
						<button type="button" class="clear-search" on:click={() => (searchQuery = '')}>
							<X size={18} />
						</button>
					{/if}
				</div>

				<button type="submit" class="search-button"> Search </button>

				<button
					type="button"
					class="filter-toggle-button"
					class:active={showFilters}
					on:click={() => (showFilters = !showFilters)}
					aria-expanded={showFilters}
					aria-controls="search-filters"
				>
					<Filter size={20} class="filter-icon" />
					<span>Filters</span>
					{#if activeFilterCount > 0}
						<span class="filter-count">{activeFilterCount}</span>
					{/if}
				</button>
			</form>

			{#if searchQuery || activeFilterCount > 0}
				<div class="search-info">
					{#if isLoading}
						<span>Searching...</span>
					{:else}
						<span class="results-count"
							>{resultsCount} {resultsCount === 1 ? 'recipe' : 'recipes'} found</span
						>

						{#if activeFilterCount > 0}
							<button type="button" class="clear-filters" on:click={clearFilters}>
								Clear all filters
							</button>
						{/if}
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Advanced Search Filters -->
	{#if showFilters}
		<div id="search-filters" class="search-filters" transition:slide={{ duration: 300 }}>
			<div class="filters-content">
				<div class="filter-section">
					<h3 class="filter-section-title">Cuisine</h3>
					<div class="filter-options">
						{#each cuisineOptions as cuisine}
							<label class="filter-option">
								<input
									type="radio"
									name="cuisine"
									value={cuisine}
									bind:group={cuisineFilter}
									on:change={handleSearch}
								/>
								<span class="option-label">{cuisine}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="filter-section">
					<h3 class="filter-section-title">Category</h3>
					<div class="filter-options">
						{#each categoryOptions as category}
							<label class="filter-option">
								<input
									type="radio"
									name="category"
									value={category}
									bind:group={categoryFilter}
									on:change={handleSearch}
								/>
								<span class="option-label">{category}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="filter-section">
					<h3 class="filter-section-title">Cooking Time</h3>
					<div class="filter-options">
						{#each timeOptions as option}
							<label class="filter-option">
								<input
									type="radio"
									name="time"
									value={option.value}
									bind:group={timeFilter}
									on:change={handleSearch}
								/>
								<span class="option-label">{option.label}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="filter-section">
					<h3 class="filter-section-title">Difficulty</h3>
					<div class="filter-options">
						{#each difficultyOptions as difficulty}
							<label class="filter-option">
								<input
									type="radio"
									name="difficulty"
									value={difficulty}
									bind:group={difficultyFilter}
									on:change={handleSearch}
								/>
								<span class="option-label">{difficulty}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="filter-section">
					<h3 class="filter-section-title">Dietary Restrictions</h3>
					<div class="filter-options">
						{#each dietaryOptions as dietary}
							<label class="filter-option">
								<input
									type="radio"
									name="dietary"
									value={dietary}
									bind:group={dietaryFilter}
									on:change={handleSearch}
								/>
								<span class="option-label">{dietary}</span>
							</label>
						{/each}
					</div>
				</div>
			</div>

			<div class="filters-footer">
				<button type="button" class="clear-all-button" on:click={clearFilters}>
					Clear All Filters
				</button>
				<button type="button" class="apply-filters-button" on:click={() => (showFilters = false)}>
					Apply Filters
				</button>
			</div>
		</div>
	{/if}

	<!-- Results and Sidebar Layout -->
	<div class="search-results-layout">
		<!-- Sidebar Filters (desktop only) -->
		<div class="filters-sidebar">
			<div class="sidebar-section">
				<h3 class="sidebar-title">Sort Results</h3>
				<select class="sort-select" bind:value={sortOrder} on:change={handleSortChange}>
					{#each sortOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<div class="sidebar-section">
				<div class="sidebar-header">
					<h3 class="sidebar-title">Filters</h3>
					{#if activeFilterCount > 0}
						<button type="button" class="clear-sidebar-filters" on:click={clearFilters}>
							Clear All
						</button>
					{/if}
				</div>

				<div class="sidebar-filter">
					<h4 class="filter-title">Cuisine</h4>
					<div class="sidebar-options">
						{#each cuisineOptions.slice(0, 6) as cuisine}
							<label class="sidebar-option">
								<input
									type="radio"
									name="sidebar-cuisine"
									value={cuisine}
									bind:group={cuisineFilter}
									on:change={handleSearch}
								/>
								<span class="option-label">{cuisine}</span>
							</label>
						{/each}
						{#if cuisineOptions.length > 6}
							<button type="button" class="show-more-button"> Show more cuisines </button>
						{/if}
					</div>
				</div>

				<div class="sidebar-filter">
					<h4 class="filter-title">Cooking Time</h4>
					<div class="sidebar-options">
						{#each timeOptions as option}
							<label class="sidebar-option">
								<input
									type="radio"
									name="sidebar-time"
									value={option.value}
									bind:group={timeFilter}
									on:change={handleSearch}
								/>
								<span class="option-label">{option.label}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="sidebar-filter">
					<h4 class="filter-title">Difficulty</h4>
					<div class="sidebar-options">
						{#each difficultyOptions as difficulty}
							<label class="sidebar-option">
								<input
									type="radio"
									name="sidebar-difficulty"
									value={difficulty}
									bind:group={difficultyFilter}
									on:change={handleSearch}
								/>
								<span class="option-label">{difficulty}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="sidebar-filter">
					<h4 class="filter-title">Dietary Restrictions</h4>
					<div class="sidebar-options">
						{#each dietaryOptions.slice(0, 5) as dietary}
							<label class="sidebar-option">
								<input
									type="radio"
									name="sidebar-dietary"
									value={dietary}
									bind:group={dietaryFilter}
									on:change={handleSearch}
								/>
								<span class="option-label">{dietary}</span>
							</label>
						{/each}
						{#if dietaryOptions.length > 5}
							<button type="button" class="show-more-button"> Show more options </button>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Search Results -->
		<div class="search-results">
			{#if isLoading}
				<div class="loading-state">
					<div class="spinner"></div>
					<p>Searching for recipes...</p>
				</div>
			{:else if filteredResults.length === 0}
				<div class="empty-state">
					<div class="empty-icon">
						<SlashedZero size={48} class="text-gray-300 dark:text-gray-600" />
					</div>
					<h2 class="empty-title">No recipes found</h2>
					<p class="empty-message">
						We couldn't find any recipes matching your search criteria. Try adjusting your filters
						or search terms.
					</p>
					<button type="button" class="empty-action" on:click={clearFilters}>
						Clear All Filters
					</button>
				</div>
			{:else}
				<div class="results-grid">
					{#each filteredResults.slice((currentPage - 1) * 9, currentPage * 9) as recipe}
						<Card {recipe} />
					{/each}
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="pagination">
						<button
							class="page-button prev"
							on:click={() => changePage(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Previous
						</button>

						<div class="page-numbers">
							{#each paginationRange as pageNum}
								{#if pageNum === '...'}
									<span class="page-ellipsis">...</span>
								{:else}
									<button
										class="page-number"
										class:active={pageNum === currentPage}
										on:click={() => changePage(pageNum)}
									>
										{pageNum}
									</button>
								{/if}
							{/each}
						</div>

						<button
							class="page-button next"
							on:click={() => changePage(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.search-results-container {
		@apply mx-auto max-w-7xl px-4 pb-16 pt-8;
	}

	/* Search Header Styles */
	.search-header {
		@apply mb-6;
	}

	.search-bar-container {
		@apply mx-auto max-w-4xl;
	}

	.search-form {
		@apply flex flex-wrap gap-2;
	}

	.search-bar {
		@apply relative flex-1;
	}

	.search-icon {
		@apply absolute left-4 top-1/2 -translate-y-1/2 text-gray-400;
	}

	.search-input {
		@apply w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none;
		@apply focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20;
		@apply dark:border-gray-600 dark:bg-gray-800 dark:text-white;
	}

	.clear-search {
		@apply absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600;
		@apply dark:hover:text-gray-300;
	}

	.search-button {
		@apply rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-medium text-white;
		@apply transition-all hover:shadow-lg hover:shadow-orange-500/20;
	}

	.filter-toggle-button {
		@apply flex items-center gap-2 rounded-full border border-gray-300 px-4 py-3 text-gray-700;
		@apply transition-all hover:bg-gray-50;
		@apply dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700;
	}

	.filter-toggle-button.active {
		@apply border-orange-500 bg-orange-50 text-orange-500;
		@apply dark:border-orange-500 dark:bg-orange-900/20 dark:text-orange-400;
	}

	.filter-count {
		@apply ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white;
	}

	.search-info {
		@apply mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400;
	}

	.results-count {
		@apply font-medium;
	}

	.clear-filters {
		@apply text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500;
	}

	/* Search Filters Styles */
	.search-filters {
		@apply mb-8 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800;
	}

	.filters-content {
		@apply grid gap-6 sm:grid-cols-2 lg:grid-cols-3;
	}

	.filter-section {
		@apply space-y-3;
	}

	.filter-section-title {
		@apply text-sm font-semibold text-gray-900 dark:text-white;
	}

	.filter-options {
		@apply grid grid-cols-2 gap-2;
	}

	.filter-option {
		@apply flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700;
		@apply transition-colors hover:bg-gray-100;
		@apply dark:text-gray-300 dark:hover:bg-gray-700;
	}

	.filter-option input[type='radio'] {
		@apply h-4 w-4 rounded-full border-gray-300 text-orange-500;
		@apply focus:ring-orange-500/20;
		@apply dark:border-gray-600 dark:bg-gray-700;
	}

	.option-label {
		@apply select-none;
	}

	.filters-footer {
		@apply mt-6 flex justify-end gap-4 border-t border-gray-100 pt-4 dark:border-gray-700;
	}

	.clear-all-button {
		@apply rounded-lg px-4 py-2 text-sm font-medium text-gray-600;
		@apply hover:bg-gray-100 hover:text-gray-900;
		@apply dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white;
	}

	.apply-filters-button {
		@apply rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 text-sm font-medium text-white;
		@apply transition-all hover:shadow-lg hover:shadow-orange-500/20;
	}

	/* Layout Styles */
	.search-results-layout {
		@apply grid gap-8 lg:grid-cols-[280px_1fr];
	}

	/* Sidebar Styles */
	.filters-sidebar {
		@apply hidden space-y-6 lg:block;
	}

	.sidebar-section {
		@apply rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800;
	}

	.sidebar-header {
		@apply mb-4 flex items-center justify-between;
	}

	.sidebar-title {
		@apply text-lg font-semibold text-gray-900 dark:text-white;
	}

	.clear-sidebar-filters {
		@apply text-xs text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500;
	}

	.sort-select {
		@apply mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700;
		@apply focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.sidebar-filter {
		@apply mt-6 first:mt-0;
	}

	.filter-title {
		@apply mb-3 text-sm font-medium text-gray-900 dark:text-white;
	}

	.sidebar-options {
		@apply space-y-2;
	}

	.sidebar-option {
		@apply flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700;
		@apply transition-colors hover:bg-gray-100;
		@apply dark:text-gray-300 dark:hover:bg-gray-700;
	}

	.show-more-button {
		@apply mt-2 text-xs text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500;
	}

	/* Results Styles */
	.search-results {
		@apply min-h-[500px];
	}

	.results-grid {
		@apply grid gap-6 sm:grid-cols-2 lg:grid-cols-3;
	}

	/* Loading State */
	.loading-state {
		@apply flex flex-col items-center justify-center py-12 text-center;
	}

	.spinner {
		@apply mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500;
	}

	/* Empty State */
	.empty-state {
		@apply flex flex-col items-center justify-center rounded-xl bg-white py-16 text-center shadow-sm dark:bg-gray-800;
	}

	.empty-icon {
		@apply mb-4;
	}

	.empty-title {
		@apply mb-2 text-xl font-semibold text-gray-900 dark:text-white;
	}

	.empty-message {
		@apply mb-6 max-w-md text-gray-600 dark:text-gray-400;
	}

	.empty-action {
		@apply rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 font-medium text-white;
		@apply transition-all hover:shadow-lg hover:shadow-orange-500/20;
	}

	/* Pagination */
	.pagination {
		@apply mt-12 flex items-center justify-center;
	}

	.page-button {
		@apply rounded-lg px-4 py-2 text-sm font-medium;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
	}

	.page-button.prev {
		@apply mr-2 bg-gray-100 text-gray-700 hover:bg-gray-200;
		@apply dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	.page-button.next {
		@apply ml-2 bg-gray-100 text-gray-700 hover:bg-gray-200;
		@apply dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	.page-numbers {
		@apply flex items-center;
	}

	.page-number {
		@apply mx-1 flex h-8 w-8 items-center justify-center rounded-full text-sm;
		@apply text-gray-700 hover:bg-gray-100;
		@apply dark:text-gray-300 dark:hover:bg-gray-700;
	}

	.page-number.active {
		@apply bg-orange-500 text-white;
	}

	.page-ellipsis {
		@apply mx-1 text-gray-500 dark:text-gray-400;
	}
</style>
