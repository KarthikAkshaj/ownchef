<!-- src/routes/write/+page.svelte - ENHANCED VERSION -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
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
		Loader2,
		Save,
		Eye,
		EyeOff,
		Upload,
		Trash2,
		Star,
		Info,
		ArrowLeft,
		CheckCircle,
		AlertTriangle
	} from 'lucide-svelte';

	// ========================================
	// STATE MANAGEMENT
	// ========================================

	interface Recipe {
		title: string;
		description: string;
		content: string;
		cookTime: number;
		prepTime: number;
		servings: number;
		difficulty: 'Easy' | 'Medium' | 'Hard';
		categoryId: number | null;
		cuisineId: number | null;
		ingredients: Ingredient[];
		instructions: Instruction[];
		tags: string[];
		tips: string[];
		isPublished: boolean;
		featuredImage: string | null;
	}

	interface Ingredient {
		id: string;
		name: string;
		amount: string;
		unit: string;
		notes?: string;
	}

	interface Instruction {
		id: string;
		stepNumber: number;
		title: string;
		content: string;
		image?: string;
		timer?: number;
	}

	interface Category {
		id: number;
		name: string;
		slug: string;
	}

	interface Cuisine {
		id: number;
		name: string;
		slug: string;
	}

	// Form state
	let recipe: Recipe = {
		title: '',
		description: '',
		content: '',
		cookTime: 30,
		prepTime: 15,
		servings: 4,
		difficulty: 'Medium',
		categoryId: null,
		cuisineId: null,
		ingredients: [{ id: '1', name: '', amount: '', unit: '', notes: '' }],
		instructions: [{ id: '1', stepNumber: 1, title: '', content: '' }],
		tags: [],
		tips: [''],
		isPublished: false,
		featuredImage: null
	};

	// UI state
	let isSubmitting = false;
	let currentStep = 1;
	let errors: Record<string, string> = {};
	let showPreview = false;
	let dragActive = false;
	let uploadProgress = 0;
	let showSuccess = false;
	let newTag = '';

	// Data
	let categories: Category[] = [];
	let cuisines: Cuisine[] = [];

	// Form sections
	const steps = [
		{ id: 1, title: 'Basic Info', icon: Info },
		{ id: 2, title: 'Ingredients', icon: ShoppingBasket },
		{ id: 3, title: 'Instructions', icon: ListOrdered },
		{ id: 4, title: 'Details', icon: ChefHat }
	];

	const difficultyOptions = ['Easy', 'Medium', 'Hard'];
	const timeUnits = ['minutes', 'hours'];
	const measurementUnits = [
		'cup',
		'tbsp',
		'tsp',
		'oz',
		'lb',
		'g',
		'kg',
		'ml',
		'l',
		'piece',
		'clove',
		'slice'
	];

	// ========================================
	// LIFECYCLE AND DATA FETCHING
	// ========================================

	onMount(async () => {
		await Promise.all([fetchCategories(), fetchCuisines()]);
	});

	async function fetchCategories() {
		try {
			const response = await fetch('/api/categories');
			const data = await response.json();
			if (data.success) {
				categories = data.data;
			}
		} catch (error) {
			console.error('Failed to fetch categories:', error);
		}
	}

	async function fetchCuisines() {
		try {
			const response = await fetch('/api/cuisines');
			const data = await response.json();
			if (data.success) {
				cuisines = data.data;
			}
		} catch (error) {
			console.error('Failed to fetch cuisines:', error);
		}
	}

	// ========================================
	// INGREDIENT MANAGEMENT
	// ========================================

	function addIngredient() {
		const newId = (recipe.ingredients.length + 1).toString();
		recipe.ingredients = [
			...recipe.ingredients,
			{ id: newId, name: '', amount: '', unit: '', notes: '' }
		];
	}

	function removeIngredient(id: string) {
		recipe.ingredients = recipe.ingredients.filter((ing) => ing.id !== id);
	}

	function updateIngredient(id: string, field: keyof Ingredient, value: string) {
		recipe.ingredients = recipe.ingredients.map((ing) =>
			ing.id === id ? { ...ing, [field]: value } : ing
		);
	}

	// ========================================
	// INSTRUCTION MANAGEMENT
	// ========================================

	function addInstruction() {
		const stepNumber = recipe.instructions.length + 1;
		const newId = stepNumber.toString();
		recipe.instructions = [
			...recipe.instructions,
			{
				id: newId,
				stepNumber,
				title: '',
				content: ''
			}
		];
	}

	function removeInstruction(id: string) {
		recipe.instructions = recipe.instructions.filter((inst) => inst.id !== id);
		// Reorder step numbers
		recipe.instructions = recipe.instructions.map((inst, index) => ({
			...inst,
			stepNumber: index + 1
		}));
	}

	function updateInstruction(id: string, field: keyof Instruction, value: string | number) {
		recipe.instructions = recipe.instructions.map((inst) =>
			inst.id === id ? { ...inst, [field]: value } : inst
		);
	}

	// ========================================
	// TAG MANAGEMENT
	// ========================================

	function addTag() {
		if (newTag.trim() && !recipe.tags.includes(newTag.trim())) {
			recipe.tags = [...recipe.tags, newTag.trim()];
			newTag = '';
		}
	}

	function removeTag(tag: string) {
		recipe.tags = recipe.tags.filter((t) => t !== tag);
	}

	function handleTagKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTag();
		}
	}

	// ========================================
	// TIP MANAGEMENT
	// ========================================

	function addTip() {
		recipe.tips = [...recipe.tips, ''];
	}

	function removeTip(index: number) {
		recipe.tips = recipe.tips.filter((_, i) => i !== index);
	}

	function updateTip(index: number, value: string) {
		recipe.tips = recipe.tips.map((tip, i) => (i === index ? value : tip));
	}

	// ========================================
	// FILE UPLOAD HANDLING
	// ========================================

	async function handleImageUpload(
		event: Event,
		type: 'featured' | 'instruction',
		instructionId?: string
	) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		try {
			uploadProgress = 0;
			const formData = new FormData();
			formData.append('file', file);
			formData.append('type', 'recipes');

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			if (result.success) {
				if (type === 'featured') {
					recipe.featuredImage = result.data.url;
				} else if (type === 'instruction' && instructionId) {
					updateInstruction(instructionId, 'image', result.data.url);
				}
			} else {
				errors.upload = result.error || 'Upload failed';
			}
		} catch (error) {
			errors.upload = 'Upload failed. Please try again.';
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragActive = false;
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;

		const files = event.dataTransfer?.files;
		if (files && files[0]) {
			// Create a fake event to reuse upload logic
			const fakeEvent = {
				target: { files: [files[0]] }
			} as any;
			await handleImageUpload(fakeEvent, 'featured');
		}
	}

	// ========================================
	// FORM VALIDATION
	// ========================================

	function validateStep(step: number): boolean {
		errors = {};

		switch (step) {
			case 1:
				if (!recipe.title.trim()) errors.title = 'Title is required';
				if (!recipe.description.trim()) errors.description = 'Description is required';
				if (recipe.cookTime < 1) errors.cookTime = 'Cook time must be at least 1 minute';
				if (recipe.prepTime < 1) errors.prepTime = 'Prep time must be at least 1 minute';
				if (recipe.servings < 1) errors.servings = 'Servings must be at least 1';
				break;
			case 2:
				const validIngredients = recipe.ingredients.filter((ing) => ing.name.trim());
				if (validIngredients.length === 0)
					errors.ingredients = 'At least one ingredient is required';
				break;
			case 3:
				const validInstructions = recipe.instructions.filter((inst) => inst.content.trim());
				if (validInstructions.length === 0)
					errors.instructions = 'At least one instruction is required';
				break;
		}

		return Object.keys(errors).length === 0;
	}

	// ========================================
	// FORM SUBMISSION
	// ========================================

	async function saveRecipe(publish: boolean = false) {
		if (!validateStep(currentStep)) return;

		isSubmitting = true;
		recipe.isPublished = publish;

		try {
			// Clean up empty items
			recipe.ingredients = recipe.ingredients.filter((ing) => ing.name.trim());
			recipe.instructions = recipe.instructions.filter((inst) => inst.content.trim());
			recipe.tips = recipe.tips.filter((tip) => tip.trim());

			const response = await fetch('/api/recipes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(recipe)
			});

			const result = await response.json();

			if (result.success) {
				showSuccess = true;
				setTimeout(() => {
					goto(`/recipes/${result.data.slug}`);
				}, 2000);
			} else {
				errors.submit = result.error || 'Failed to save recipe';
			}
		} catch (error) {
			errors.submit = 'Network error. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	// ========================================
	// NAVIGATION
	// ========================================

	function goToStep(step: number) {
		if (step < currentStep || validateStep(currentStep)) {
			currentStep = step;
		}
	}

	function nextStep() {
		if (validateStep(currentStep) && currentStep < 4) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}
</script>

<svelte:head>
	<title>Write Recipe - OwnChef</title>
</svelte:head>

<!-- Success Modal -->
{#if showSuccess}
	<div class="success-modal" transition:fade={{ duration: 300 }}>
		<div class="success-content" transition:scale={{ duration: 300, easing: quintOut }}>
			<CheckCircle size={48} class="success-icon" />
			<h3>Recipe {recipe.isPublished ? 'Published' : 'Saved'} Successfully!</h3>
			<p>Redirecting to your recipe...</p>
		</div>
	</div>
{/if}

<div class="write-container">
	<!-- Header -->
	<header class="write-header">
		<div class="header-content">
			<button class="back-button" on:click={() => goto('/')}>
				<ArrowLeft size={20} />
				Back to Home
			</button>

			<div class="header-title">
				<h1>Create New Recipe</h1>
				<p>Share your culinary creation with the world</p>
			</div>

			<div class="header-actions">
				<button
					class="preview-btn"
					class:active={showPreview}
					on:click={() => (showPreview = !showPreview)}
				>
					{#if showPreview}
						<EyeOff size={18} />
						Edit
					{:else}
						<Eye size={18} />
						Preview
					{/if}
				</button>
			</div>
		</div>
	</header>

	<div class="write-content">
		<!-- Step Navigator -->
		<nav class="step-navigator">
			{#each steps as step}
				<button
					class="step-item"
					class:active={currentStep === step.id}
					class:completed={currentStep > step.id}
					on:click={() => goToStep(step.id)}
				>
					<div class="step-icon">
						<svelte:component this={step.icon} size={20} />
					</div>
					<span class="step-title">{step.title}</span>
				</button>
			{/each}
		</nav>

		<!-- Main Form -->
		<main class="form-container">
			{#if currentStep === 1}
				<!-- Step 1: Basic Information -->
				<section class="form-section" transition:fly={{ x: -20, duration: 300 }}>
					<div class="section-header">
						<h2>Basic Information</h2>
						<p>Let's start with the essentials of your recipe</p>
					</div>

					<div class="form-grid">
						<!-- Recipe Title -->
						<div class="form-group full-width">
							<label for="title" class="form-label">Recipe Title *</label>
							<input
								id="title"
								type="text"
								bind:value={recipe.title}
								placeholder="What's your delicious creation called?"
								class="form-input"
								class:error={errors.title}
								maxlength="100"
							/>
							{#if errors.title}
								<span class="error-text">{errors.title}</span>
							{/if}
						</div>

						<!-- Description -->
						<div class="form-group full-width">
							<label for="description" class="form-label">Description *</label>
							<textarea
								id="description"
								bind:value={recipe.description}
								placeholder="Describe your recipe in a few sentences..."
								class="form-textarea"
								class:error={errors.description}
								rows="3"
								maxlength="500"
							></textarea>
							{#if errors.description}
								<span class="error-text">{errors.description}</span>
							{/if}
						</div>

						<!-- Featured Image Upload -->
						<div class="form-group full-width">
							<label class="form-label">Featured Image</label>
							<div
								class="image-upload-area"
								class:drag-active={dragActive}
								on:dragover={handleDragOver}
								on:dragleave={handleDragLeave}
								on:drop={handleDrop}
							>
								{#if recipe.featuredImage}
									<div class="uploaded-image">
										<img src={recipe.featuredImage} alt="Featured" />
										<button class="remove-image" on:click={() => (recipe.featuredImage = null)}>
											<X size={16} />
										</button>
									</div>
								{:else}
									<div class="upload-placeholder">
										<ImageIcon size={32} />
										<p>Drag & drop an image here, or click to select</p>
										<input
											type="file"
											accept="image/*"
											on:change={(e) => handleImageUpload(e, 'featured')}
											class="file-input"
										/>
									</div>
								{/if}
							</div>
						</div>

						<!-- Timing Information -->
						<div class="form-group">
							<label for="prepTime" class="form-label">Prep Time (minutes) *</label>
							<input
								id="prepTime"
								type="number"
								bind:value={recipe.prepTime}
								min="1"
								max="1440"
								class="form-input"
								class:error={errors.prepTime}
							/>
							{#if errors.prepTime}
								<span class="error-text">{errors.prepTime}</span>
							{/if}
						</div>

						<div class="form-group">
							<label for="cookTime" class="form-label">Cook Time (minutes) *</label>
							<input
								id="cookTime"
								type="number"
								bind:value={recipe.cookTime}
								min="1"
								max="1440"
								class="form-input"
								class:error={errors.cookTime}
							/>
							{#if errors.cookTime}
								<span class="error-text">{errors.cookTime}</span>
							{/if}
						</div>

						<!-- Servings and Difficulty -->
						<div class="form-group">
							<label for="servings" class="form-label">Servings *</label>
							<input
								id="servings"
								type="number"
								bind:value={recipe.servings}
								min="1"
								max="50"
								class="form-input"
								class:error={errors.servings}
							/>
							{#if errors.servings}
								<span class="error-text">{errors.servings}</span>
							{/if}
						</div>

						<div class="form-group">
							<label for="difficulty" class="form-label">Difficulty</label>
							<select id="difficulty" bind:value={recipe.difficulty} class="form-select">
								{#each difficultyOptions as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
						</div>

						<!-- Category and Cuisine -->
						<div class="form-group">
							<label for="category" class="form-label">Category</label>
							<select id="category" bind:value={recipe.categoryId} class="form-select">
								<option value={null}>Select a category</option>
								{#each categories as category}
									<option value={category.id}>{category.name}</option>
								{/each}
							</select>
						</div>

						<div class="form-group">
							<label for="cuisine" class="form-label">Cuisine</label>
							<select id="cuisine" bind:value={recipe.cuisineId} class="form-select">
								<option value={null}>Select a cuisine</option>
								{#each cuisines as cuisine}
									<option value={cuisine.id}>{cuisine.name}</option>
								{/each}
							</select>
						</div>
					</div>
				</section>
			{:else if currentStep === 2}
				<!-- Step 2: Ingredients -->
				<section class="form-section" transition:fly={{ x: -20, duration: 300 }}>
					<div class="section-header">
						<h2>Ingredients</h2>
						<p>List all the ingredients needed for your recipe</p>
					</div>

					<div class="ingredients-container">
						{#each recipe.ingredients as ingredient, index (ingredient.id)}
							<div class="ingredient-item" transition:fly={{ y: -10, duration: 200 }}>
								<div class="ingredient-inputs">
									<input
										type="text"
										bind:value={ingredient.amount}
										placeholder="Amount"
										class="ingredient-amount"
									/>
									<select bind:value={ingredient.unit} class="ingredient-unit">
										<option value="">Unit</option>
										{#each measurementUnits as unit}
											<option value={unit}>{unit}</option>
										{/each}
									</select>
									<input
										type="text"
										bind:value={ingredient.name}
										placeholder="Ingredient name *"
										class="ingredient-name"
									/>
									<input
										type="text"
										bind:value={ingredient.notes}
										placeholder="Notes (optional)"
										class="ingredient-notes"
									/>
									<button
										type="button"
										class="remove-ingredient"
										on:click={() => removeIngredient(ingredient.id)}
										disabled={recipe.ingredients.length === 1}
									>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
						{/each}

						<button type="button" class="add-ingredient" on:click={addIngredient}>
							<Plus size={16} />
							Add Ingredient
						</button>

						{#if errors.ingredients}
							<span class="error-text">{errors.ingredients}</span>
						{/if}
					</div>
				</section>
			{:else if currentStep === 3}
				<!-- Step 3: Instructions -->
				<section class="form-section" transition:fly={{ x: -20, duration: 300 }}>
					<div class="section-header">
						<h2>Instructions</h2>
						<p>Break down your recipe into clear, easy-to-follow steps</p>
					</div>

					<div class="instructions-container">
						{#each recipe.instructions as instruction, index (instruction.id)}
							<div class="instruction-item" transition:fly={{ y: -10, duration: 200 }}>
								<div class="instruction-header">
									<div class="step-number-large">{instruction.stepNumber}</div>
									<input
										type="text"
										bind:value={instruction.title}
										placeholder="Step title (optional)"
										class="instruction-title"
									/>
									<button
										type="button"
										class="remove-instruction"
										on:click={() => removeInstruction(instruction.id)}
										disabled={recipe.instructions.length === 1}
									>
										<Trash2 size={16} />
									</button>
								</div>

								<textarea
									bind:value={instruction.content}
									placeholder="Describe this step in detail..."
									class="instruction-content"
									rows="3"
								></textarea>

								<div class="instruction-extras">
									<div class="timer-input">
										<Clock size={16} />
										<input
											type="number"
											bind:value={instruction.timer}
											placeholder="Timer (min)"
											class="timer-field"
											min="0"
										/>
									</div>

									<div class="image-upload-small">
										<input
											type="file"
											accept="image/*"
											on:change={(e) => handleImageUpload(e, 'instruction', instruction.id)}
											class="file-input-small"
											id="instruction-image-{instruction.id}"
										/>
										<label for="instruction-image-{instruction.id}" class="upload-label">
											<ImageIcon size={16} />
											Add Photo
										</label>
									</div>
								</div>

								{#if instruction.image}
									<div class="instruction-image">
										<img src={instruction.image} alt="Step {instruction.stepNumber}" />
										<button
											class="remove-image-small"
											on:click={() => updateInstruction(instruction.id, 'image', '')}
										>
											<X size={14} />
										</button>
									</div>
								{/if}
							</div>
						{/each}

						<button type="button" class="add-instruction" on:click={addInstruction}>
							<Plus size={16} />
							Add Step
						</button>

						{#if errors.instructions}
							<span class="error-text">{errors.instructions}</span>
						{/if}
					</div>
				</section>
			{:else if currentStep === 4}
				<!-- Step 4: Additional Details -->
				<section class="form-section" transition:fly={{ x: -20, duration: 300 }}>
					<div class="section-header">
						<h2>Additional Details</h2>
						<p>Add tags, tips, and detailed description to make your recipe stand out</p>
					</div>

					<div class="form-grid">
						<!-- Rich Text Editor for detailed description -->
						<div class="form-group full-width">
							<label class="form-label">Detailed Recipe Description</label>
							<div class="rich-editor-container">
								<RichTextEditor bind:value={recipe.content} />
							</div>
						</div>

						<!-- Tags -->
						<div class="form-group full-width">
							<label class="form-label">Tags</label>
							<div class="tags-input-container">
								<div class="tags-list">
									{#each recipe.tags as tag}
										<span class="tag-item" transition:scale={{ duration: 200 }}>
											{tag}
											<button on:click={() => removeTag(tag)}>
												<X size={14} />
											</button>
										</span>
									{/each}
								</div>
								<div class="tag-input-wrapper">
									<input
										type="text"
										bind:value={newTag}
										on:keydown={handleTagKeydown}
										placeholder="Add a tag..."
										class="tag-input"
									/>
									<button
										type="button"
										class="add-tag-btn"
										on:click={addTag}
										disabled={!newTag.trim()}
									>
										<Plus size={16} />
									</button>
								</div>
							</div>
						</div>

						<!-- Tips -->
						<div class="form-group full-width">
							<label class="form-label">Cooking Tips</label>
							<div class="tips-container">
								{#each recipe.tips as tip, index}
									<div class="tip-item" transition:fly={{ y: -10, duration: 200 }}>
										<input
											type="text"
											bind:value={tip}
											placeholder="Share a helpful tip..."
											class="tip-input"
										/>
										<button
											type="button"
											class="remove-tip"
											on:click={() => removeTip(index)}
											disabled={recipe.tips.length === 1}
										>
											<X size={16} />
										</button>
									</div>
								{/each}
								<button type="button" class="add-tip" on:click={addTip}>
									<Plus size={16} />
									Add Tip
								</button>
							</div>
						</div>
					</div>
				</section>
			{/if}

			<!-- Navigation and Submit -->
			<div class="form-navigation">
				<div class="nav-left">
					{#if currentStep > 1}
						<button type="button" class="nav-btn secondary" on:click={prevStep}> Previous </button>
					{/if}
				</div>

				<div class="nav-center">
					<div class="progress-indicator">
						{currentStep} of {steps.length}
					</div>
				</div>

				<div class="nav-right">
					{#if currentStep < 4}
						<button type="button" class="nav-btn primary" on:click={nextStep}> Next </button>
					{:else}
						<div class="submit-buttons">
							<button
								type="button"
								class="save-draft-btn"
								on:click={() => saveRecipe(false)}
								disabled={isSubmitting}
							>
								{#if isSubmitting}
									<Loader2 size={18} class="spinning" />
								{:else}
									<Save size={18} />
								{/if}
								Save Draft
							</button>

							<button
								type="button"
								class="publish-btn"
								on:click={() => saveRecipe(true)}
								disabled={isSubmitting}
							>
								{#if isSubmitting}
									<Loader2 size={18} class="spinning" />
								{:else}
									<ChefHat size={18} />
								{/if}
								Publish Recipe
							</button>
						</div>
					{/if}
				</div>
			</div>

			<!-- Error Display -->
			{#if errors.submit}
				<div class="error-banner" transition:fly={{ y: 20, duration: 300 }}>
					<AlertTriangle size={20} />
					{errors.submit}
				</div>
			{/if}
		</main>
	</div>
</div>

<style lang="postcss">
	.write-container {
		@apply min-h-screen bg-gray-50 dark:bg-gray-900;
	}

	/* Header Styles */
	.write-header {
		@apply sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80;
	}

	.header-content {
		@apply mx-auto flex max-w-7xl items-center justify-between px-4 py-4;
	}

	.back-button {
		@apply flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700;
	}

	.header-title h1 {
		@apply text-xl font-bold text-gray-900 dark:text-white;
	}

	.header-title p {
		@apply text-sm text-gray-600 dark:text-gray-400;
	}

	.preview-btn {
		@apply flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors;
		@apply bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	.preview-btn.active {
		@apply bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300;
	}

	/* Main Content */
	.write-content {
		@apply mx-auto max-w-7xl px-4 py-8;
		@apply grid gap-8 lg:grid-cols-[300px_1fr];
	}

	/* Step Navigator */
	.step-navigator {
		@apply space-y-2;
	}

	.step-item {
		@apply flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all;
		@apply border border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600;
	}

	.step-item.active {
		border-color: #8FA998;
		background: rgba(143, 169, 152, 0.1);
		color: #677D6A;
	}

	.step-item.completed {
		@apply border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300;
	}

	.step-icon {
		@apply flex h-8 w-8 items-center justify-center rounded-full;
		@apply bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400;
	}

	.step-item.active .step-icon {
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
	}

	.step-item.completed .step-icon {
		@apply bg-green-500 text-white;
	}

	.step-title {
		@apply font-medium;
	}

	/* Form Container */
	.form-container {
		@apply rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800;
	}

	.form-section {
		@apply space-y-6;
	}

	.section-header h2 {
		@apply text-2xl font-bold text-gray-900 dark:text-white;
	}

	.section-header p {
		@apply text-gray-600 dark:text-gray-400;
	}

	/* Form Elements */
	.form-grid {
		@apply grid gap-6 md:grid-cols-2;
	}

	.form-group {
		@apply space-y-2;
	}

	.form-group.full-width {
		@apply md:col-span-2;
	}

	.form-label {
		@apply block text-sm font-medium text-gray-700 dark:text-gray-300;
	}

	.form-input {
		@apply w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors outline-none;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.form-input:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.1);
	}

	.form-input.error {
		@apply border-red-500 focus:border-red-500 focus:ring-red-500/20;
	}

	.form-textarea {
		@apply w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-colors outline-none;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.form-textarea:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.1);
	}

	.form-select {
		@apply w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors outline-none;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.form-select:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.1);
	}

	.error-text {
		@apply text-sm text-red-600 dark:text-red-400;
	}

	/* Image Upload */
	.image-upload-area {
		@apply relative rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors;
		@apply hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500;
	}

	.image-upload-area.drag-active {
		border-color: #8FA998;
		background: rgba(143, 169, 152, 0.1);
	}

	.upload-placeholder {
		@apply space-y-2 text-gray-600 dark:text-gray-400;
	}

	.file-input {
		@apply absolute inset-0 cursor-pointer opacity-0;
	}

	.uploaded-image {
		@apply relative inline-block;
	}

	.uploaded-image img {
		@apply h-32 w-full rounded-lg object-cover;
	}

	.remove-image {
		@apply absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors;
		background: #EF4444;
	}

	.remove-image:hover {
		background: #DC2626;
	}

	/* Ingredients */
	.ingredients-container {
		@apply space-y-4;
	}

	.ingredient-item {
		@apply rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800;
	}

	.ingredient-inputs {
		@apply grid grid-cols-[100px_100px_1fr_1fr_auto] gap-3;
	}

	.ingredient-amount,
	.ingredient-unit,
	.ingredient-name,
	.ingredient-notes {
		@apply rounded-md border border-gray-300 px-3 py-2 text-sm outline-none;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.ingredient-amount:focus,
	.ingredient-unit:focus,
	.ingredient-name:focus,
	.ingredient-notes:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.1);
	}

	.remove-ingredient {
		@apply flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20;
	}

	.add-ingredient {
		@apply flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-gray-600 transition-colors hover:border-gray-400 dark:border-gray-600 dark:text-gray-400;
	}

	/* Instructions */
	.instructions-container {
		@apply space-y-6;
	}

	.instruction-item {
		@apply rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800;
	}

	.instruction-header {
		@apply mb-4 flex items-center gap-4;
	}

	.step-number-large {
		@apply flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
	}

	.instruction-title {
		@apply flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.instruction-title:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.1);
	}

	.remove-instruction {
		@apply flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20;
	}

	.instruction-content {
		@apply mb-4 w-full resize-none rounded-md border border-gray-300 px-3 py-2 outline-none;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.instruction-content:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.1);
	}

	.instruction-extras {
		@apply flex items-center gap-4;
	}

	.timer-input {
		@apply flex items-center gap-2;
	}

	.timer-field {
		@apply w-24 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.timer-field:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.1);
	}

	.file-input-small {
		@apply hidden;
	}

	.upload-label {
		@apply flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600;
	}

	.instruction-image {
		@apply relative mt-4 inline-block;
	}

	.instruction-image img {
		@apply h-24 w-32 rounded-lg object-cover;
	}

	.remove-image-small {
		@apply absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-white transition-colors;
		background: #EF4444;
	}

	.remove-image-small:hover {
		background: #DC2626;
	}

	.add-instruction {
		@apply flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-gray-600 transition-colors hover:border-gray-400 dark:border-gray-600 dark:text-gray-400;
	}

	/* Rich Text Editor */
	.rich-editor-container {
		@apply rounded-lg border border-gray-300 dark:border-gray-600;
	}

	/* Tags */
	.tags-input-container {
		@apply space-y-3;
	}

	.tags-list {
		@apply flex flex-wrap gap-2;
	}

	.tag-item {
		@apply flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium;
		background: rgba(143, 169, 152, 0.15);
		color: #677D6A;
	}

	.tag-item button {
		@apply ml-1 rounded-full p-0.5 transition-colors;
	}

	.tag-item button:hover {
		background: rgba(103, 125, 106, 0.2);
	}

	.tag-input-wrapper {
		@apply flex gap-2;
	}

	.tag-input {
		@apply flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.tag-input:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.1);
	}

	.add-tag-btn {
		@apply flex h-10 w-10 items-center justify-center rounded-md transition-all disabled:opacity-50;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
	}

	.add-tag-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #8FA998, #B5C9BD);
		transform: translateY(-2px);
	}

	/* Tips */
	.tips-container {
		@apply space-y-3;
	}

	.tip-item {
		@apply flex gap-3;
	}

	.tip-input {
		@apply flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.tip-input:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.1);
	}

	.remove-tip {
		@apply flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20;
	}

	.add-tip {
		@apply flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:border-gray-400 dark:border-gray-600 dark:text-gray-400;
	}

	/* Navigation */
	.form-navigation {
		@apply mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700;
	}

	.nav-btn {
		@apply rounded-lg px-6 py-3 font-medium transition-colors;
	}

	.nav-btn.primary {
		@apply transition-all;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.3);
	}

	.nav-btn.primary:hover {
		background: linear-gradient(135deg, #8FA998, #B5C9BD);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(143, 169, 152, 0.4);
	}

	.nav-btn.primary:active {
		transform: translateY(0);
	}

	.nav-btn.secondary {
		@apply bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	.progress-indicator {
		@apply text-sm font-medium text-gray-600 dark:text-gray-400;
	}

	.submit-buttons {
		@apply flex gap-3;
	}

	.save-draft-btn {
		@apply flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	.publish-btn {
		@apply flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all disabled:opacity-50;
		background: linear-gradient(135deg, #677D6A, #8FA998, #B5C9BD);
		color: #EBE0CC;
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.3);
	}

	.publish-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(143, 169, 152, 0.5);
	}

	.publish-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	/* Success Modal */
	.success-modal {
		@apply fixed inset-0 z-50 flex items-center justify-center bg-black/50;
	}

	.success-content {
		@apply rounded-xl bg-white p-8 text-center shadow-xl dark:bg-gray-800;
	}

	.success-icon {
		@apply mx-auto mb-4 text-green-500;
	}

	.success-content h3 {
		@apply mb-2 text-xl font-bold text-gray-900 dark:text-white;
	}

	.success-content p {
		@apply text-gray-600 dark:text-gray-400;
	}

	/* Error Banner */
	.error-banner {
		@apply mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400;
	}

	/* Animations */
	.spinning {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.write-content {
			@apply grid-cols-1;
		}

		.step-navigator {
			@apply grid grid-cols-4 gap-2;
		}

		.step-item {
			@apply flex-col gap-1 p-2 text-center;
		}

		.step-title {
			@apply text-xs;
		}
	}

	@media (max-width: 768px) {
		.header-content {
			@apply flex-col gap-4;
		}

		.form-grid {
			@apply grid-cols-1;
		}

		.ingredient-inputs {
			@apply grid-cols-1 gap-2;
		}

		.submit-buttons {
			@apply flex-col;
		}

		.form-navigation {
			@apply flex-col gap-4;
		}
	}
</style>
