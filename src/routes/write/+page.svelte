<!-- src/routes/write/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import {
		Image as ImageIcon,
		Plus,
		X,
		Clock,
		Users,
		ChefHat,
		Tag,
		ListOrdered,
		ShoppingBasket,
		AlertCircle,
		Link,
		Video,
		Info
	} from 'lucide-svelte';

	// Form state
	let recipe = {
		title: '',
		description: '',
		content: '',
		cookTime: 30,
		prepTime: 15,
		servings: 4,
		difficulty: 'Medium',
		cuisine: '',
		category: '',
		images: ['', '', ''],
		ingredients: [{ group: '', items: ['', ''] }],
		steps: [{ title: '', content: '' }],
		tips: [''],
		tags: ['']
	};

	// UI state
	let activeTab = 'basic';
	let hasUnsavedChanges = false;
	let isSubmitting = false;
	let errors: Record<string, string> = {};
	let uploadedImages: string[] = [];
	let imgPreviewUrls: string[] = [];

	// Available options
	const difficultyOptions = ['Easy', 'Medium', 'Hard'];
	const cuisineOptions = [
		'Indian',
		'Chinese',
		'Italian',
		'Japanese',
		'Thai',
		'Mexican',
		'French',
		'Spanish',
		'American',
		'Mediterranean',
		'Other'
	];
	const categoryOptions = [
		'Appetizer',
		'Main Course',
		'Side Dish',
		'Dessert',
		'Breakfast',
		'Lunch',
		'Dinner',
		'Snack',
		'Soup',
		'Salad',
		'Beverage',
		'Other'
	];

	// Client-side redirect if no session
	// $: if (!$page.data.session) {
	// 	goto('/login');
	// }

	// Track form changes
	$: {
		const { title, description, content, cookTime, prepTime, servings } = recipe;
		hasUnsavedChanges = Boolean(
			title || description || content || cookTime !== 30 || prepTime !== 15 || servings !== 4
		);
	}

	function validateForm() {
		errors = {};

		if (!recipe.title.trim()) {
			errors.title = 'Recipe title is required';
		}

		if (!recipe.description.trim()) {
			errors.description = 'Recipe description is required';
		}

		if (recipe.prepTime <= 0) {
			errors.prepTime = 'Prep time must be greater than 0';
		}

		if (recipe.cookTime <= 0) {
			errors.cookTime = 'Cook time must be greater than 0';
		}

		if (recipe.servings <= 0) {
			errors.servings = 'Number of servings must be greater than 0';
		}

		if (!recipe.cuisine) {
			errors.cuisine = 'Please select a cuisine';
		}

		if (!recipe.category) {
			errors.category = 'Please select a category';
		}

		let hasIngredients = false;
		recipe.ingredients.forEach((group, groupIndex) => {
			group.items.forEach((item, itemIndex) => {
				if (item.trim()) hasIngredients = true;
			});
		});

		if (!hasIngredients) {
			errors.ingredients = 'At least one ingredient is required';
		}

		let hasSteps = false;
		recipe.steps.forEach((step, index) => {
			if (step.content.trim()) hasSteps = true;
		});

		if (!hasSteps) {
			errors.steps = 'At least one instruction step is required';
		}

		return Object.keys(errors).length === 0;
	}

	// Ingredient management
	function addIngredientGroup() {
		recipe.ingredients = [...recipe.ingredients, { group: '', items: [''] }];
	}

	function removeIngredientGroup(groupIndex: number) {
		recipe.ingredients = recipe.ingredients.filter((_, i) => i !== groupIndex);
		if (recipe.ingredients.length === 0) {
			recipe.ingredients = [{ group: '', items: [''] }];
		}
	}

	function addIngredientItem(groupIndex: number) {
		recipe.ingredients = recipe.ingredients.map((group, i) => {
			if (i === groupIndex) {
				return { ...group, items: [...group.items, ''] };
			}
			return group;
		});
	}

	function removeIngredientItem(groupIndex: number, itemIndex: number) {
		recipe.ingredients = recipe.ingredients.map((group, i) => {
			if (i === groupIndex) {
				return {
					...group,
					items: group.items.filter((_, j) => j !== itemIndex)
				};
			}
			return group;
		});

		// If the last item is removed, add a new empty one
		if (recipe.ingredients[groupIndex].items.length === 0) {
			recipe.ingredients[groupIndex].items = [''];
		}
	}

	// Instruction steps management
	function addStep() {
		recipe.steps = [...recipe.steps, { title: '', content: '' }];
	}

	function removeStep(index: number) {
		recipe.steps = recipe.steps.filter((_, i) => i !== index);
		if (recipe.steps.length === 0) {
			recipe.steps = [{ title: '', content: '' }];
		}
	}

	// Tips management
	function addTip() {
		recipe.tips = [...recipe.tips, ''];
	}

	function removeTip(index: number) {
		recipe.tips = recipe.tips.filter((_, i) => i !== index);
		if (recipe.tips.length === 0) {
			recipe.tips = [''];
		}
	}

	// Tags management
	function addTag() {
		recipe.tags = [...recipe.tags, ''];
	}

	function removeTag(index: number) {
		recipe.tags = recipe.tags.filter((_, i) => i !== index);
		if (recipe.tags.length === 0) {
			recipe.tags = [''];
		}
	}

	// Image management
	function handleImageUpload(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			// In a real implementation, you would upload the file to your server or cloud storage
			// For now, we'll just create a local object URL for preview
			const reader = new FileReader();
			reader.onload = (e) => {
				imgPreviewUrls[index] = e.target?.result as string;
				recipe.images[index] = file.name; // In real implementation, this would be the URL from your server
			};
			reader.readAsDataURL(file);
		}
	}

	function removeImage(index: number) {
		imgPreviewUrls[index] = '';
		recipe.images[index] = '';
	}

	// Form submission
	async function handleSubmit() {
		if (!validateForm()) {
			// Scroll to the first error
			const firstErrorKey = Object.keys(errors)[0];
			const element = document.querySelector(`[data-error="${firstErrorKey}"]`);
			element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}

		isSubmitting = true;

		try {
			// In a real implementation, you would submit the form data to your API
			const response = await fetch('/api/recipes', {
				method: 'POST',
				body: JSON.stringify(recipe),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				// Navigate to the new recipe
				const data = await response.json();
				goto(`/recipes/${data.slug}`);
			} else {
				// Handle errors from the API
				const errorData = await response.json();
				errors = errorData.errors || { form: 'Failed to save recipe' };
			}
		} catch (error) {
			console.error('Error saving recipe:', error);
			errors = { form: 'An unexpected error occurred' };
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		if (
			hasUnsavedChanges &&
			!confirm('You have unsaved changes. Are you sure you want to leave this page?')
		) {
			return;
		}

		goto('/');
	}

	onMount(() => {
		// If we want to load a draft or edit an existing recipe, we would do it here
		console.log('Recipe form mounted');

		// Set up confirmation before leaving the page
		const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = '';
				return '';
			}
		};

		window.addEventListener('beforeunload', beforeUnloadHandler);

		return () => {
			window.removeEventListener('beforeunload', beforeUnloadHandler);
		};
	});
</script>

<svelte:head>
	<title>Create New Recipe | OwnChef</title>
</svelte:head>

<div class="recipe-form-container" class:dark={$theme === 'dark'}>
	<div class="form-header">
		<h1 class="form-title">Create New Recipe</h1>
		<p class="form-subtitle">Share your culinary masterpiece with the world</p>
	</div>

	{#if errors.form}
		<div class="form-error" role="alert">
			<AlertCircle size={18} class="error-icon" />
			<span>{errors.form}</span>
		</div>
	{/if}

	<div class="form-tabs">
		<button
			class="tab-button"
			class:active={activeTab === 'basic'}
			on:click={() => (activeTab = 'basic')}
		>
			Basic Info
		</button>
		<button
			class="tab-button"
			class:active={activeTab === 'ingredients'}
			on:click={() => (activeTab = 'ingredients')}
		>
			Ingredients
		</button>
		<button
			class="tab-button"
			class:active={activeTab === 'instructions'}
			on:click={() => (activeTab = 'instructions')}
		>
			Instructions
		</button>
		<button
			class="tab-button"
			class:active={activeTab === 'media'}
			on:click={() => (activeTab = 'media')}
		>
			Media
		</button>
		<button
			class="tab-button"
			class:active={activeTab === 'tips'}
			on:click={() => (activeTab = 'tips')}
		>
			Tips & Tags
		</button>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="recipe-form">
		<!-- Basic Info Tab -->
		<div class="form-tab-content" class:active={activeTab === 'basic'}>
			<div class="form-section">
				<div class="form-group" data-error="title">
					<label for="title" class="form-label">Recipe Title*</label>
					<input
						type="text"
						id="title"
						class="form-input"
						class:error={errors.title}
						bind:value={recipe.title}
						placeholder="E.g., Classic Chocolate Chip Cookies"
					/>
					{#if errors.title}
						<span class="error-message">{errors.title}</span>
					{/if}
				</div>

				<div class="form-group" data-error="description">
					<label for="description" class="form-label">Description*</label>
					<textarea
						id="description"
						class="form-textarea"
						class:error={errors.description}
						bind:value={recipe.description}
						placeholder="Briefly describe your recipe in 2-3 sentences"
						rows="3"
					></textarea>
					{#if errors.description}
						<span class="error-message">{errors.description}</span>
					{/if}
				</div>

				<div class="form-row">
					<div class="form-group" data-error="prepTime">
						<label for="prepTime" class="form-label">Prep Time (mins)*</label>
						<input
							type="number"
							id="prepTime"
							class="form-input"
							class:error={errors.prepTime}
							bind:value={recipe.prepTime}
							min="1"
						/>
						{#if errors.prepTime}
							<span class="error-message">{errors.prepTime}</span>
						{/if}
					</div>

					<div class="form-group" data-error="cookTime">
						<label for="cookTime" class="form-label">Cook Time (mins)*</label>
						<input
							type="number"
							id="cookTime"
							class="form-input"
							class:error={errors.cookTime}
							bind:value={recipe.cookTime}
							min="0"
						/>
						{#if errors.cookTime}
							<span class="error-message">{errors.cookTime}</span>
						{/if}
					</div>

					<div class="form-group" data-error="servings">
						<label for="servings" class="form-label">Servings*</label>
						<input
							type="number"
							id="servings"
							class="form-input"
							class:error={errors.servings}
							bind:value={recipe.servings}
							min="1"
						/>
						{#if errors.servings}
							<span class="error-message">{errors.servings}</span>
						{/if}
					</div>
				</div>

				<div class="form-row">
					<div class="form-group" data-error="difficulty">
						<label for="difficulty" class="form-label">Difficulty*</label>
						<select
							id="difficulty"
							class="form-select"
							class:error={errors.difficulty}
							bind:value={recipe.difficulty}
						>
							{#each difficultyOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						{#if errors.difficulty}
							<span class="error-message">{errors.difficulty}</span>
						{/if}
					</div>

					<div class="form-group" data-error="cuisine">
						<label for="cuisine" class="form-label">Cuisine*</label>
						<select
							id="cuisine"
							class="form-select"
							class:error={errors.cuisine}
							bind:value={recipe.cuisine}
						>
							<option value="">Select Cuisine</option>
							{#each cuisineOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						{#if errors.cuisine}
							<span class="error-message">{errors.cuisine}</span>
						{/if}
					</div>

					<div class="form-group" data-error="category">
						<label for="category" class="form-label">Category*</label>
						<select
							id="category"
							class="form-select"
							class:error={errors.category}
							bind:value={recipe.category}
						>
							<option value="">Select Category</option>
							{#each categoryOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						{#if errors.category}
							<span class="error-message">{errors.category}</span>
						{/if}
					</div>
				</div>
			</div>

			<div class="form-nav">
				<button type="button" class="form-button secondary" on:click={handleCancel}>
					Cancel
				</button>
				<button
					type="button"
					class="form-button primary"
					on:click={() => (activeTab = 'ingredients')}
				>
					Next: Ingredients
				</button>
			</div>
		</div>

		<!-- Ingredients Tab -->
		<div class="form-tab-content" class:active={activeTab === 'ingredients'}>
			<div class="form-section">
				<div class="form-group-header">
					<h2 class="form-section-title">
						<ShoppingBasket size={20} class="section-icon" />
						Ingredients
					</h2>
					<p class="form-section-help">
						List all ingredients needed for your recipe, with measurements
					</p>
				</div>

				{#if errors.ingredients}
					<div class="section-error" role="alert">
						<AlertCircle size={18} class="error-icon" />
						<span>{errors.ingredients}</span>
					</div>
				{/if}

				{#each recipe.ingredients as group, groupIndex}
					<div class="ingredient-group" data-error="ingredients">
						<div class="group-header">
							<div class="form-group">
								<label for={`group-${groupIndex}`} class="form-label">Group Name (optional)</label>
								<input
									type="text"
									id={`group-${groupIndex}`}
									class="form-input"
									bind:value={group.group}
									placeholder="E.g., For the marinade, For the sauce, etc."
								/>
							</div>

							{#if recipe.ingredients.length > 1}
								<button
									type="button"
									class="remove-button"
									on:click={() => removeIngredientGroup(groupIndex)}
									aria-label="Remove ingredient group"
								>
									<X size={18} />
								</button>
							{/if}
						</div>

						<div class="ingredients-list">
							{#each group.items as item, itemIndex}
								<div class="ingredient-item">
									<input
										type="text"
										class="form-input"
										bind:value={group.items[itemIndex]}
										placeholder="E.g., 2 cups all-purpose flour"
									/>

									<button
										type="button"
										class="remove-button"
										on:click={() => removeIngredientItem(groupIndex, itemIndex)}
										aria-label="Remove ingredient"
										disabled={group.items.length === 1}
									>
										<X size={18} />
									</button>
								</div>
							{/each}

							<button
								type="button"
								class="add-button"
								on:click={() => addIngredientItem(groupIndex)}
							>
								<Plus size={16} />
								Add Ingredient
							</button>
						</div>
					</div>
				{/each}

				<button type="button" class="add-group-button" on:click={addIngredientGroup}>
					<Plus size={16} />
					Add Ingredient Group
				</button>
			</div>

			<div class="form-nav">
				<button type="button" class="form-button secondary" on:click={() => (activeTab = 'basic')}>
					Previous: Basic Info
				</button>
				<button
					type="button"
					class="form-button primary"
					on:click={() => (activeTab = 'instructions')}
				>
					Next: Instructions
				</button>
			</div>
		</div>

		<!-- Instructions Tab -->
		<div class="form-tab-content" class:active={activeTab === 'instructions'}>
			<div class="form-section">
				<div class="form-group-header">
					<h2 class="form-section-title">
						<ListOrdered size={20} class="section-icon" />
						Instructions
					</h2>
					<p class="form-section-help">
						Provide step-by-step instructions for preparing your recipe
					</p>
				</div>

				{#if errors.steps}
					<div class="section-error" role="alert">
						<AlertCircle size={18} class="error-icon" />
						<span>{errors.steps}</span>
					</div>
				{/if}

				{#each recipe.steps as step, index}
					<div class="instruction-step" data-error="steps">
						<div class="step-header">
							<div class="step-number">{index + 1}</div>
							<div class="form-group step-title-group">
								<label for={`step-title-${index}`} class="form-label">Step Title (optional)</label>
								<input
									type="text"
									id={`step-title-${index}`}
									class="form-input"
									bind:value={step.title}
									placeholder="E.g., Prepare the dough, Marinate the chicken, etc."
								/>
							</div>

							{#if recipe.steps.length > 1}
								<button
									type="button"
									class="remove-button"
									on:click={() => removeStep(index)}
									aria-label="Remove step"
								>
									<X size={18} />
								</button>
							{/if}
						</div>

						<div class="form-group">
							<label for={`step-content-${index}`} class="form-label">Step Instructions*</label>
							<textarea
								id={`step-content-${index}`}
								class="form-textarea"
								bind:value={step.content}
								placeholder="Describe this step in detail"
								rows="3"
							></textarea>
						</div>
					</div>
				{/each}

				<button type="button" class="add-button" on:click={addStep}>
					<Plus size={16} />
					Add Step
				</button>
			</div>

			<div class="form-nav">
				<button
					type="button"
					class="form-button secondary"
					on:click={() => (activeTab = 'ingredients')}
				>
					Previous: Ingredients
				</button>
				<button type="button" class="form-button primary" on:click={() => (activeTab = 'media')}>
					Next: Media
				</button>
			</div>
		</div>

		<!-- Media Tab -->
		<div class="form-tab-content" class:active={activeTab === 'media'}>
			<div class="form-section">
				<div class="form-group-header">
					<h2 class="form-section-title">
						<ImageIcon size={20} class="section-icon" />
						Recipe Images
					</h2>
					<p class="form-section-help">Upload high-quality images of your finished dish</p>
				</div>

				<div class="images-grid">
					{#each recipe.images as _, index}
						<div class="image-upload-container">
							{#if imgPreviewUrls[index]}
								<div class="image-preview">
									<img src={imgPreviewUrls[index]} alt="Recipe preview" />
									<button
										type="button"
										class="remove-image-button"
										on:click={() => removeImage(index)}
										aria-label="Remove image"
									>
										<X size={18} />
									</button>
								</div>
							{:else}
								<label for={`image-upload-${index}`} class="image-upload-label">
									<div class="upload-placeholder">
										<ImageIcon size={24} class="placeholder-icon" />
										<span>Upload Image</span>
										<span class="upload-hint">Click to browse</span>
									</div>
									<input
										type="file"
										id={`image-upload-${index}`}
										class="image-upload-input"
										accept="image/*"
										on:change={(e) => handleImageUpload(e, index)}
									/>
								</label>
							{/if}
						</div>
					{/each}
				</div>

				<div class="form-group">
					<label class="form-label">Video URL (optional)</label>
					<div class="input-with-icon">
						<Video size={18} class="input-icon" />
						<input
							type="url"
							class="with-icon form-input"
							placeholder="E.g., https://youtube.com/watch?v=..."
						/>
					</div>
					<p class="input-help">You can link to YouTube, Vimeo, or other video platforms</p>
				</div>

				<div class="form-group">
					<label class="form-label">External Source URL (optional)</label>
					<div class="input-with-icon">
						<Link size={18} class="input-icon" />
						<input
							type="url"
							class="with-icon form-input"
							placeholder="E.g., https://myrecipeblog.com/pasta-recipe"
						/>
					</div>
					<p class="input-help">
						If this recipe is from another source, please provide credit by linking to it
					</p>
				</div>
			</div>

			<div class="form-nav">
				<button
					type="button"
					class="form-button secondary"
					on:click={() => (activeTab = 'instructions')}
				>
					Previous: Instructions
				</button>
				<button type="button" class="form-button primary" on:click={() => (activeTab = 'tips')}>
					Next: Tips & Tags
				</button>
			</div>
		</div>

		<!-- Tips & Tags Tab -->
		<div class="form-tab-content" class:active={activeTab === 'tips'}>
			<div class="form-section">
				<div class="form-group-header">
					<h2 class="form-section-title">
						<Info size={20} class="section-icon" />
						Tips for Success
					</h2>
					<p class="form-section-help">
						Share tips, variations, or helpful advice for making this recipe
					</p>
				</div>

				{#each recipe.tips as tip, index}
					<div class="tip-item">
						<div class="form-group">
							<label for={`tip-${index}`} class="form-label">Tip {index + 1}</label>
							<textarea
								id={`tip-${index}`}
								class="form-textarea"
								bind:value={recipe.tips[index]}
								placeholder="E.g., For a crispier crust, preheat the baking sheet"
								rows="2"
							></textarea>
						</div>

						{#if recipe.tips.length > 1}
							<button
								type="button"
								class="remove-button"
								on:click={() => removeTip(index)}
								aria-label="Remove tip"
							>
								<X size={18} />
							</button>
						{/if}
					</div>
				{/each}

				<button type="button" class="add-button" on:click={addTip}>
					<Plus size={16} />
					Add Tip
				</button>

				<div class="form-divider"></div>

				<div class="form-group-header">
					<h2 class="form-section-title">
						<Tag size={20} class="section-icon" />
						Recipe Tags
					</h2>
					<p class="form-section-help">Add tags to help others discover your recipe</p>
				</div>

				<div class="tags-container">
					{#each recipe.tags as tag, index}
						<div class="tag-item">
							<input
								type="text"
								class="tag-input form-input"
								bind:value={recipe.tags[index]}
								placeholder="E.g., vegetarian, gluten-free, dessert, etc."
							/>

							{#if recipe.tags.length > 1}
								<button
									type="button"
									class="remove-button"
									on:click={() => removeTag(index)}
									aria-label="Remove tag"
								>
									<X size={18} />
								</button>
							{/if}
						</div>
					{/each}
				</div>

				<button type="button" class="add-button" on:click={addTag}>
					<Plus size={16} />
					Add Tag
				</button>
			</div>

			<div class="form-nav">
				<button type="button" class="form-button secondary" on:click={() => (activeTab = 'media')}>
					Previous: Media
				</button>
				<button type="submit" class="form-button submit" disabled={isSubmitting}>
					{isSubmitting ? 'Publishing...' : 'Publish Recipe'}
				</button>
			</div>
		</div>
	</form>
</div>

<style lang="postcss">
	.recipe-form-container {
		@apply mx-auto max-w-3xl px-4 pb-16 pt-8;
	}

	.form-header {
		@apply mb-8 text-center;
	}

	.form-title {
		@apply mb-2 text-3xl font-bold text-gray-900 dark:text-white;
	}

	.form-subtitle {
		@apply text-gray-600 dark:text-gray-400;
	}

	.form-error {
		@apply mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400;
	}

	.error-icon {
		@apply flex-shrink-0;
	}

	.form-tabs {
		@apply mb-6 flex flex-wrap rounded-lg bg-gray-100 p-1 dark:bg-gray-800;
	}

	.tab-button {
		@apply flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all;
		@apply text-gray-600 hover:bg-white hover:text-gray-900;
		@apply dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white;
	}

	.tab-button.active {
		@apply bg-white text-gray-900 shadow-sm;
		@apply dark:bg-gray-700 dark:text-white;
	}

	.form-tab-content {
		@apply hidden;
	}

	.form-tab-content.active {
		@apply block;
	}

	.form-section {
		@apply mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800;
	}

	.form-group {
		@apply mb-4;
	}

	.form-group-header {
		@apply mb-4;
	}

	.form-section-title {
		@apply mb-1 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white;
	}

	.section-icon {
		@apply text-orange-500;
	}

	.form-section-help {
		@apply text-sm text-gray-500 dark:text-gray-400;
	}

	.form-label {
		@apply mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300;
	}

	.form-input,
	.form-textarea,
	.form-select {
		@apply w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700;
		@apply focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.form-input.with-icon {
		@apply pl-10;
	}

	.form-input.error,
	.form-textarea.error,
	.form-select.error {
		@apply border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/20;
	}

	.input-with-icon {
		@apply relative;
	}

	.input-icon {
		@apply absolute left-3 top-1/2 -translate-y-1/2 text-gray-400;
	}

	.input-help {
		@apply mt-1 text-xs text-gray-500 dark:text-gray-400;
	}

	.error-message {
		@apply mt-1 text-sm text-red-500 dark:text-red-400;
	}

	.section-error {
		@apply mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400;
	}

	.form-row {
		@apply mb-4 grid gap-4 sm:grid-cols-3;
	}

	.form-nav {
		@apply mt-8 flex justify-between;
	}

	.form-button {
		@apply rounded-lg px-6 py-2 text-sm font-medium transition-all;
	}

	.form-button.primary {
		@apply bg-gray-100 text-gray-900 hover:bg-gray-200;
		@apply dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600;
	}

	.form-button.secondary {
		@apply text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800;
	}

	.form-button.submit {
		@apply bg-gradient-to-r from-orange-500 to-red-500 text-white;
		@apply hover:shadow-lg hover:shadow-orange-500/20;
		@apply disabled:opacity-70;
	}

	/* Ingredient Styles */
	.ingredient-group {
		@apply mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700;
	}

	.group-header {
		@apply mb-4 flex gap-4;
	}

	.ingredients-list {
		@apply space-y-2;
	}

	.ingredient-item {
		@apply flex items-center gap-2;
	}

	.remove-button {
		@apply flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors;
		@apply hover:bg-gray-100 hover:text-red-500;
		@apply dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
	}

	.add-button {
		@apply mt-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors;
		@apply hover:bg-gray-100 hover:text-gray-900;
		@apply dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white;
	}

	.add-group-button {
		@apply flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm;
		@apply text-gray-600 transition-colors hover:border-orange-500 hover:text-orange-500;
		@apply dark:border-gray-600 dark:text-gray-400 dark:hover:border-orange-500 dark:hover:text-orange-500;
	}

	/* Instructions Styles */
	.instruction-step {
		@apply mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700;
	}

	.step-header {
		@apply mb-4 flex items-start gap-4;
	}

	.step-number {
		@apply flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 font-semibold text-white;
	}

	.step-title-group {
		@apply flex-1;
	}

	/* Media Styles */
	.images-grid {
		@apply mb-6 grid gap-4 sm:grid-cols-3;
	}

	.image-upload-container {
		@apply aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700;
	}

	.image-upload-label {
		@apply flex h-full w-full cursor-pointer items-center justify-center;
	}

	.upload-placeholder {
		@apply flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400;
	}

	.placeholder-icon {
		@apply mb-2;
	}

	.upload-hint {
		@apply mt-1 text-xs text-gray-400 dark:text-gray-500;
	}

	.image-upload-input {
		@apply hidden;
	}

	.image-preview {
		@apply relative h-full;
	}

	.image-preview img {
		@apply h-full w-full object-cover;
	}

	.remove-image-button {
		@apply absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70;
	}

	/* Tips Styles */
	.tip-item {
		@apply mb-4 flex items-start gap-2;
	}

	.form-divider {
		@apply my-8 border-t border-gray-200 dark:border-gray-700;
	}

	/* Tags Styles */
	.tags-container {
		@apply mb-4 space-y-2;
	}

	.tag-item {
		@apply flex items-center gap-2;
	}
</style>
