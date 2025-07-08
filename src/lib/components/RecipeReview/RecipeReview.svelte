<!-- src/lib/components/RecipePreview/RecipePreview.svelte -->
<script lang="ts">
	import { Clock, Users, ChefHat, Star, Heart, Share2, BookOpen, Timer } from 'lucide-svelte';
	import { formatCookingTime, formatServings } from '$lib/utils/recipeForm';
	import type { RecipeFormInput } from '$lib/types/recipe';

	// ========================================
	// PROPS
	// ========================================

	export let recipe: RecipeFormInput;
	export let author = {
		username: 'chef_preview',
		firstName: 'Preview',
		lastName: 'Chef',
		profileImage: '/images/users/default-avatar.jpg'
	};
	export let showMetrics: boolean = true;
	export let interactive: boolean = false;

	// ========================================
	// COMPUTED VALUES
	// ========================================

	$: totalTime = recipe.cookTime + recipe.prepTime;
	$: validIngredients = recipe.ingredients.filter((ing) => ing.name?.trim());
	$: validInstructions = recipe.instructions.filter((inst) => inst.content?.trim());
	$: validTips = recipe.tips.filter((tip) => tip.trim());

	// Mock data for preview
	const mockStats = {
		views: 1247,
		likes: 89,
		rating: 4.6,
		reviewsCount: 23,
		saves: 156
	};

	// ========================================
	// DIFFICULTY STYLING
	// ========================================

	function getDifficultyColor(difficulty: string) {
		switch (difficulty) {
			case 'Easy':
				return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
			case 'Medium':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
			case 'Hard':
				return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
		}
	}

	// ========================================
	// PREVIEW FUNCTIONS
	// ========================================

	function handleLike() {
		if (interactive) {
			// Handle like action
			console.log('Recipe liked!');
		}
	}

	function handleSave() {
		if (interactive) {
			// Handle save action
			console.log('Recipe saved!');
		}
	}

	function handleShare() {
		if (interactive) {
			// Handle share action
			console.log('Recipe shared!');
		}
	}
</script>

<div class="recipe-preview">
	<!-- Preview Header -->
	<div class="preview-header">
		<div class="preview-badge">
			<BookOpen size={16} />
			Preview Mode
		</div>
	</div>

	<!-- Recipe Header -->
	<header class="recipe-header">
		<!-- Featured Image -->
		{#if recipe.featuredImage}
			<div class="featured-image-container">
				<img src={recipe.featuredImage} alt={recipe.title} class="featured-image" />
				<div class="image-overlay">
					<div class="difficulty-badge {getDifficultyColor(recipe.difficulty)}">
						{recipe.difficulty}
					</div>
				</div>
			</div>
		{:else}
			<div class="featured-placeholder">
				<ChefHat size={48} class="placeholder-icon" />
				<p>Featured image will appear here</p>
			</div>
		{/if}

		<!-- Recipe Info -->
		<div class="recipe-info">
			<div class="recipe-meta">
				<div class="author-info">
					<img src={author.profileImage} alt={author.username} class="author-avatar" />
					<div>
						<p class="author-name">{author.firstName} {author.lastName}</p>
						<p class="author-username">@{author.username}</p>
					</div>
				</div>

				{#if showMetrics}
					<div class="recipe-metrics">
						<div class="metric">
							<Star size={16} fill="currentColor" class="text-yellow-500" />
							<span>{mockStats.rating}</span>
							<span class="text-gray-500">({mockStats.reviewsCount})</span>
						</div>
						<div class="metric">
							<Heart size={16} class="text-red-500" />
							<span>{mockStats.likes}</span>
						</div>
					</div>
				{/if}
			</div>

			<h1 class="recipe-title">{recipe.title || 'Recipe Title'}</h1>
			<p class="recipe-description">
				{recipe.description || 'Recipe description will appear here...'}
			</p>

			<!-- Recipe Stats -->
			<div class="recipe-stats">
				<div class="stat-item">
					<Clock size={20} class="stat-icon" />
					<div>
						<span class="stat-label">Prep Time</span>
						<span class="stat-value">{formatCookingTime(recipe.prepTime)}</span>
					</div>
				</div>
				<div class="stat-item">
					<Timer size={20} class="stat-icon" />
					<div>
						<span class="stat-label">Cook Time</span>
						<span class="stat-value">{formatCookingTime(recipe.cookTime)}</span>
					</div>
				</div>
				<div class="stat-item">
					<Users size={20} class="stat-icon" />
					<div>
						<span class="stat-label">Servings</span>
						<span class="stat-value">{recipe.servings}</span>
					</div>
				</div>
				<div class="stat-item">
					<ChefHat size={20} class="stat-icon" />
					<div>
						<span class="stat-label">Difficulty</span>
						<span class="stat-value">{recipe.difficulty}</span>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="action-buttons">
				<button class="action-btn primary" class:interactive on:click={handleLike}>
					<Heart size={18} />
					Like
				</button>
				<button class="action-btn secondary" class:interactive on:click={handleSave}>
					<BookOpen size={18} />
					Save
				</button>
				<button class="action-btn secondary" class:interactive on:click={handleShare}>
					<Share2 size={18} />
					Share
				</button>
			</div>

			<!-- Tags -->
			{#if recipe.tags.length > 0}
				<div class="recipe-tags">
					{#each recipe.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<!-- Recipe Content -->
	<div class="recipe-content">
		<!-- Rich Content -->
		{#if recipe.content?.trim()}
			<section class="content-section">
				<h2 class="section-title">About This Recipe</h2>
				<div class="rich-content">
					{@html recipe.content}
				</div>
			</section>
		{/if}

		<!-- Ingredients -->
		<section class="content-section">
			<h2 class="section-title">Ingredients</h2>
			{#if validIngredients.length > 0}
				<ul class="ingredients-list">
					{#each validIngredients as ingredient}
						<li class="ingredient-item">
							<span class="ingredient-amount">
								{ingredient.amount}
								{ingredient.unit}
							</span>
							<span class="ingredient-name">{ingredient.name}</span>
							{#if ingredient.notes}
								<span class="ingredient-notes">({ingredient.notes})</span>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="placeholder-text">Ingredients will appear here...</p>
			{/if}
		</section>

		<!-- Instructions -->
		<section class="content-section">
			<h2 class="section-title">Instructions</h2>
			{#if validInstructions.length > 0}
				<ol class="instructions-list">
					{#each validInstructions as instruction}
						<li class="instruction-item">
							<div class="instruction-header">
								<span class="step-number">{instruction.stepNumber}</span>
								{#if instruction.title}
									<h3 class="step-title">{instruction.title}</h3>
								{/if}
								{#if instruction.timer}
									<div class="step-timer">
										<Timer size={14} />
										{instruction.timer}m
									</div>
								{/if}
							</div>
							<div class="instruction-content">
								<p>{instruction.content}</p>
								{#if instruction.image}
									<img
										src={instruction.image}
										alt="Step {instruction.stepNumber}"
										class="instruction-image"
									/>
								{/if}
							</div>
						</li>
					{/each}
				</ol>
			{:else}
				<p class="placeholder-text">Instructions will appear here...</p>
			{/if}
		</section>

		<!-- Tips -->
		{#if validTips.length > 0}
			<section class="content-section">
				<h2 class="section-title">Pro Tips</h2>
				<ul class="tips-list">
					{#each validTips as tip, index}
						<li class="tip-item">
							<span class="tip-number">{index + 1}</span>
							<p>{tip}</p>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>
</div>

<style lang="postcss">
	.recipe-preview {
		@apply overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800;
	}

	/* Preview Header */
	.preview-header {
		@apply border-b border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20;
	}

	.preview-badge {
		@apply flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300;
	}

	/* Recipe Header */
	.recipe-header {
		@apply space-y-6 p-6;
	}

	.featured-image-container {
		@apply relative aspect-video overflow-hidden rounded-lg;
	}

	.featured-image {
		@apply h-full w-full object-cover;
	}

	.image-overlay {
		@apply absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/50 to-transparent p-4;
	}

	.difficulty-badge {
		@apply rounded-full px-3 py-1 text-sm font-medium;
	}

	.featured-placeholder {
		@apply flex aspect-video flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400;
	}

	.placeholder-icon {
		@apply mb-2;
	}

	.recipe-meta {
		@apply flex items-center justify-between;
	}

	.author-info {
		@apply flex items-center gap-3;
	}

	.author-avatar {
		@apply h-12 w-12 rounded-full object-cover;
	}

	.author-name {
		@apply font-semibold text-gray-900 dark:text-white;
	}

	.author-username {
		@apply text-sm text-gray-600 dark:text-gray-400;
	}

	.recipe-metrics {
		@apply flex items-center gap-4;
	}

	.metric {
		@apply flex items-center gap-1 text-sm;
	}

	.recipe-title {
		@apply text-3xl font-bold text-gray-900 dark:text-white;
	}

	.recipe-description {
		@apply text-lg leading-relaxed text-gray-600 dark:text-gray-300;
	}

	.recipe-stats {
		@apply grid grid-cols-2 gap-4 md:grid-cols-4;
	}

	.stat-item {
		@apply flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700;
	}

	.stat-icon {
		@apply text-orange-500;
	}

	.stat-label {
		@apply block text-sm text-gray-600 dark:text-gray-400;
	}

	.stat-value {
		@apply block font-semibold text-gray-900 dark:text-white;
	}

	.action-buttons {
		@apply flex gap-3;
	}

	.action-btn {
		@apply flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors;
	}

	.action-btn.primary {
		@apply bg-orange-500 text-white hover:bg-orange-600;
	}

	.action-btn.secondary {
		@apply bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	.action-btn.interactive {
		@apply cursor-pointer;
	}

	.action-btn:not(.interactive) {
		@apply cursor-default opacity-75;
	}

	.recipe-tags {
		@apply flex flex-wrap gap-2;
	}

	.tag {
		@apply rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300;
	}

	/* Content Sections */
	.recipe-content {
		@apply border-t border-gray-200 dark:border-gray-700;
	}

	.content-section {
		@apply border-b border-gray-200 p-6 last:border-b-0 dark:border-gray-700;
	}

	.section-title {
		@apply mb-4 text-2xl font-bold text-gray-900 dark:text-white;
	}

	.rich-content {
		@apply prose max-w-none dark:prose-invert;
	}

	.placeholder-text {
		@apply italic text-gray-500 dark:text-gray-400;
	}

	/* Ingredients */
	.ingredients-list {
		@apply space-y-3;
	}

	.ingredient-item {
		@apply flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-700;
	}

	.ingredient-amount {
		@apply min-w-0 font-semibold text-orange-600 dark:text-orange-400;
	}

	.ingredient-name {
		@apply flex-1 font-medium text-gray-900 dark:text-white;
	}

	.ingredient-notes {
		@apply text-sm text-gray-600 dark:text-gray-400;
	}

	/* Instructions */
	.instructions-list {
		@apply space-y-6;
	}

	.instruction-item {
		@apply rounded-lg border border-gray-200 p-4 dark:border-gray-700;
	}

	.instruction-header {
		@apply mb-3 flex items-center gap-3;
	}

	.step-number {
		@apply flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white;
	}

	.step-title {
		@apply flex-1 font-semibold text-gray-900 dark:text-white;
	}

	.step-timer {
		@apply flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400;
	}

	.instruction-content p {
		@apply mb-3 leading-relaxed text-gray-700 dark:text-gray-300;
	}

	.instruction-image {
		@apply h-32 max-w-sm rounded-lg object-cover;
	}

	/* Tips */
	.tips-list {
		@apply space-y-3;
	}

	.tip-item {
		@apply flex gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20;
	}

	.tip-number {
		@apply flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white;
	}

	.tip-item p {
		@apply leading-relaxed text-gray-700 dark:text-gray-300;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.recipe-header {
			@apply space-y-4 p-4;
		}

		.content-section {
			@apply p-4;
		}

		.recipe-title {
			@apply text-2xl;
		}

		.recipe-stats {
			@apply grid-cols-1 gap-2;
		}

		.action-buttons {
			@apply flex-col;
		}

		.ingredients-list,
		.instructions-list {
			@apply space-y-2;
		}

		.instruction-header {
			@apply flex-col items-start gap-2;
		}
	}
</style>
