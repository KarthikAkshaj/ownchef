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
		AlertTriangle,
		ChevronDown,
		Search
	} from 'lucide-svelte';

	// ========================================
	// PAGE DATA
	// ========================================

	export let data;
	let editMode = false;
	let editingRecipeId: number | null = null;

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
		dietaryType: 'vegetarian' | 'vegan' | 'non-vegetarian';
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
		dietaryType: 'non-vegetarian',
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

	// Searchable dropdown state
	let categorySearchOpen = false;
	let cuisineSearchOpen = false;
	let categorySearch = '';
	let cuisineSearch = '';

	// Data
	let categories: Category[] = [];
	let cuisines: Cuisine[] = [];

	// Filtered lists for searchable dropdowns - sorted alphabetically
	$: filteredCategories = categories
		.filter((cat) => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))
		.sort((a, b) => a.name.localeCompare(b.name));
	$: filteredCuisines = cuisines
		.filter((cui) => cui.name.toLowerCase().includes(cuisineSearch.toLowerCase()))
		.sort((a, b) => a.name.localeCompare(b.name));

	// Get selected names for display
	$: selectedCategoryName =
		categories.find((c) => c.id === recipe.categoryId)?.name || 'Select a category';
	$: selectedCuisineName =
		cuisines.find((c) => c.id === recipe.cuisineId)?.name || 'Select a cuisine';

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

		// Initialize form with existing recipe data if in edit mode
		if (data.editMode && data.existingRecipe) {
			editMode = true;
			editingRecipeId = data.existingRecipe.id;

			// Pre-populate all fields
			recipe.title = data.existingRecipe.title || '';
			recipe.description = data.existingRecipe.description || '';
			recipe.content = data.existingRecipe.content || '';
			recipe.prepTime = data.existingRecipe.prepTime || 15;
			recipe.cookTime = data.existingRecipe.cookTime || 30;
			recipe.servings = data.existingRecipe.servings || 4;
			recipe.difficulty = data.existingRecipe.difficulty || 'Medium';
			recipe.dietaryType = data.existingRecipe.dietaryType || 'non-vegetarian';
			recipe.categoryId = data.existingRecipe.categoryId || null;
			recipe.cuisineId = data.existingRecipe.cuisineId || null;
			recipe.featuredImage = data.existingRecipe.featuredImage || null;
			recipe.isPublished = data.existingRecipe.isPublished || false;

			// Pre-populate ingredients
			if (data.existingRecipe.ingredients && data.existingRecipe.ingredients.length > 0) {
				const allIngredients: Ingredient[] = [];
				data.existingRecipe.ingredients.forEach((group: any) => {
					group.items.forEach((item: any) => {
						allIngredients.push({
							id: Math.random().toString(36).substring(2, 9),
							name: item.name || '',
							amount: item.amount || '',
							unit: item.unit || '',
							notes: item.notes || ''
						});
					});
				});
				recipe.ingredients = allIngredients.length > 0 ? allIngredients : [{ id: '1', name: '', amount: '', unit: '', notes: '' }];
			}

			// Pre-populate instructions
			if (data.existingRecipe.steps && data.existingRecipe.steps.length > 0) {
				recipe.instructions = data.existingRecipe.steps.map((step: any, index: number) => ({
					id: Math.random().toString(36).substring(2, 9),
					stepNumber: index + 1,
					title: step.title || '',
					content: step.content || '',
					image: step.image || undefined,
					timer: step.estimatedTime || undefined
				}));
			}

			// Pre-populate tips
			if (data.existingRecipe.tips && data.existingRecipe.tips.length > 0) {
				recipe.tips = data.existingRecipe.tips.map((tip: any) => tip.content || '');
			}

			// Pre-populate tags
			if (data.existingRecipe.tags && data.existingRecipe.tags.length > 0) {
				recipe.tags = [...data.existingRecipe.tags];
			}
		}
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
	// SEARCHABLE DROPDOWN HELPERS
	// ========================================

	function selectCategory(id: number) {
		recipe.categoryId = id;
		categorySearchOpen = false;
		categorySearch = '';
	}

	function selectCuisine(id: number) {
		recipe.cuisineId = id;
		cuisineSearchOpen = false;
		cuisineSearch = '';
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
				// Basic info - only validate if trying to move forward
				if (!recipe.title.trim()) errors.title = 'Title is required';
				if (!recipe.description.trim()) errors.description = 'Description is required';
				break;
			case 2:
				// Ingredients - at least one ingredient with a name
				const validIngredients = recipe.ingredients.filter((ing) => ing.name.trim());
				if (validIngredients.length === 0)
					errors.ingredients = 'At least one ingredient is required';
				break;
			case 3:
				// Instructions - at least one instruction with content
				const validInstructions = recipe.instructions.filter((inst) => inst.content.trim());
				if (validInstructions.length === 0)
					errors.instructions = 'At least one instruction is required';
				break;
		}

		return Object.keys(errors).length === 0;
	}

	function validateForPublish(): boolean {
		errors = {};

		// Title validation
		if (!recipe.title.trim()) {
			errors.title = 'Title is required';
		} else if (recipe.title.trim().length < 3) {
			errors.title = 'Title must be at least 3 characters';
		}

		// Description validation
		if (!recipe.description.trim()) {
			errors.description = 'Description is required';
		} else if (recipe.description.trim().length < 10) {
			errors.description = 'Description must be at least 10 characters';
		}

		// At least one ingredient
		const validIngredients = recipe.ingredients.filter((ing) => ing.name.trim());
		if (validIngredients.length === 0) {
			errors.ingredients = 'At least one ingredient is required';
		}

		// At least one instruction
		const validInstructions = recipe.instructions.filter((inst) => inst.content.trim());
		if (validInstructions.length === 0) {
			errors.instructions = 'At least one instruction is required';
		}

		return Object.keys(errors).length === 0;
	}

	// ========================================
	// FORM SUBMISSION
	// ========================================

	async function saveRecipe(publish: boolean = false) {
		// Use stricter validation when publishing
		if (publish && !validateForPublish()) {
			// If validation fails, show errors and scroll to top
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		} else if (!publish && !validateStep(currentStep)) {
			return;
		}

		isSubmitting = true;
		recipe.isPublished = publish;

		try {
			// Clean up empty items
			const validIngredients = recipe.ingredients.filter((ing) => ing.name.trim());
			const validInstructions = recipe.instructions.filter((inst) => inst.content.trim());
			const validTips = recipe.tips.filter((tip) => tip.trim());

			// Transform data to match API format
			const recipeData = {
				title: recipe.title,
				description: recipe.description,
				content: recipe.content,
				prepTime: recipe.prepTime,
				cookTime: recipe.cookTime,
				servings: recipe.servings,
				difficulty: recipe.difficulty,
				dietaryType: recipe.dietaryType,
				categoryId: recipe.categoryId,
				cuisineId: recipe.cuisineId,
				featuredImage: recipe.featuredImage,
				isPublished: recipe.isPublished,
				// Transform ingredients to grouped format
				ingredients: [
					{
						groupName: '', // Default group with no name
						items: validIngredients.map(ing => ({
							name: ing.name,
							amount: ing.amount,
							unit: ing.unit,
							notes: ing.notes || undefined
						}))
					}
				],
				// Rename instructions to steps
				steps: validInstructions.map(inst => ({
					title: inst.title || undefined,
					content: inst.content,
					estimatedTime: inst.timer || undefined
				})),
				// Add tips if any
				tips: validTips.length > 0 ? validTips.map(tip => ({ content: tip })) : undefined
			};

			// Determine API endpoint and method based on edit mode
			const apiUrl = editMode ? `/api/recipes?id=${editingRecipeId}` : '/api/recipes';
			const apiMethod = editMode ? 'PATCH' : 'POST';

			const response = await fetch(apiUrl, {
				method: apiMethod,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(recipeData)
			});

			const result = await response.json();

			if (result.success) {
				showSuccess = true;
				setTimeout(() => {
					goto(`/recipes/${result.data.slug}`);
				}, 2000);
			} else {
				errors.submit = result.error || `Failed to ${editMode ? 'update' : 'save'} recipe`;
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
			// Scroll to top of the page
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function nextStep() {
		if (validateStep(currentStep) && currentStep < 4) {
			currentStep++;
			// Scroll to top of the page
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
			// Scroll to top of the page
			window.scrollTo({ top: 0, behavior: 'smooth' });
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
				<h1>{editMode ? 'Edit Recipe' : 'Create New Recipe'}</h1>
				<p>{editMode ? 'Update your recipe details' : 'Share your culinary creation with the world'}</p>
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

						<div class="form-group">
							<label for="dietaryType" class="form-label">Dietary Type</label>
							<select id="dietaryType" bind:value={recipe.dietaryType} class="form-select">
								<option value="non-vegetarian">Non-Vegetarian</option>
								<option value="vegetarian">Vegetarian</option>
								<option value="vegan">Vegan</option>
							</select>
						</div>

						<!-- Category and Cuisine - Searchable Dropdowns -->
						<div class="form-group">
							<label for="category" class="form-label">Category</label>
							<div class="searchable-dropdown">
								<div class="searchable-dropdown-trigger">
									<input
										type="text"
										bind:value={categorySearch}
										on:focus={() => (categorySearchOpen = true)}
										on:blur={() => setTimeout(() => (categorySearchOpen = false), 200)}
										placeholder={selectedCategoryName}
										class="searchable-dropdown-input-main"
									/>
								</div>

								{#if categorySearchOpen}
									<div class="searchable-dropdown-menu" transition:scale={{ duration: 200 }}>
										<div class="searchable-dropdown-list">
											{#if filteredCategories.length > 0}
												{#each filteredCategories as category}
													<button
														type="button"
														class="searchable-dropdown-item"
														class:selected={recipe.categoryId === category.id}
														on:click={() => selectCategory(category.id)}
													>
														{category.name}
														{#if recipe.categoryId === category.id}
															<CheckCircle size={16} />
														{/if}
													</button>
												{/each}
											{:else}
												<div class="searchable-dropdown-empty">No categories found</div>
											{/if}
										</div>
									</div>
								{/if}
							</div>
						</div>

						<div class="form-group">
							<label for="cuisine" class="form-label">Cuisine</label>
							<div class="searchable-dropdown">
								<div class="searchable-dropdown-trigger">
									<input
										type="text"
										bind:value={cuisineSearch}
										on:focus={() => (cuisineSearchOpen = true)}
										on:blur={() => setTimeout(() => (cuisineSearchOpen = false), 200)}
										placeholder={selectedCuisineName}
										class="searchable-dropdown-input-main"
									/>
								</div>

								{#if cuisineSearchOpen}
									<div class="searchable-dropdown-menu" transition:scale={{ duration: 200 }}>
										<div class="searchable-dropdown-list">
											{#if filteredCuisines.length > 0}
												{#each filteredCuisines as cuisine}
													<button
														type="button"
														class="searchable-dropdown-item"
														class:selected={recipe.cuisineId === cuisine.id}
														on:click={() => selectCuisine(cuisine.id)}
													>
														{cuisine.name}
														{#if recipe.cuisineId === cuisine.id}
															<CheckCircle size={16} />
														{/if}
													</button>
												{/each}
											{:else}
												<div class="searchable-dropdown-empty">No cuisines found</div>
											{/if}
										</div>
									</div>
								{/if}
							</div>
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
								{editMode ? 'Save Changes' : 'Save Draft'}
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
								{editMode ? 'Update Recipe' : 'Publish Recipe'}
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
		@apply min-h-screen;
		background: linear-gradient(to bottom, #1A3636 0%, #1A3636 15%, #40534C 50%, #677D6A 100%);
	}

	.write-container:global(.dark) {
		background: linear-gradient(to bottom, #1A3636 0%, #1A3636 15%, #40534C 50%, #677D6A 100%);
	}

	/* Header Styles */
	.write-header {
		@apply sticky top-0 z-40 backdrop-blur-sm;
		background: #1A3636;
		box-shadow: 0 2px 8px rgba(26, 54, 54, 0.15);
	}

	.write-container:global(.dark) .write-header {
		background: #1A3636;
	}

	.header-content {
		@apply mx-auto flex max-w-7xl items-center justify-between px-4 py-4;
	}

	.back-button {
		@apply flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all;
		color: #677D6A;
	}

	.back-button:hover {
		background: rgba(143, 169, 152, 0.15);
		transform: translateX(-2px);
	}

	.header-title h1 {
		@apply text-xl font-bold;
		color: #EBE0CC;
	}

	.write-container:global(.dark) .header-title h1 {
		color: #EBE0CC;
	}

	.header-title p {
		@apply text-sm;
		color: #677D6A;
	}

	.write-container:global(.dark) .header-title p {
		color: #D6BD98;
	}

	.preview-btn {
		@apply flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all;
		background: rgba(143, 169, 152, 0.15);
		color: #677D6A;
	}

	.preview-btn:hover {
		background: rgba(143, 169, 152, 0.25);
		transform: translateY(-1px);
	}

	.preview-btn.active {
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
		box-shadow: 0 2px 8px rgba(103, 125, 106, 0.3);
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
		background: rgba(26, 54, 54, 0.6);
		border: 1px solid rgba(143, 169, 152, 0.3);
		color: #D6BD98;
	}

	.step-item:hover {
		border-color: rgba(143, 169, 152, 0.4);
		transform: translateX(2px);
	}

	.write-container:global(.dark) .step-item {
		background: rgba(26, 54, 54, 0.8);
		color: #D6BD98;
	}

	.step-item.active {
		border-color: #8FA998;
		background: rgba(143, 169, 152, 0.15);
		color: #40534C;
		box-shadow: 0 2px 8px rgba(143, 169, 152, 0.2);
	}

	.write-container:global(.dark) .step-item.active {
		color: #EBE0CC;
		background: rgba(143, 169, 152, 0.2);
	}

	.step-item.completed {
		border-color: #8FA998;
		background: rgba(143, 169, 152, 0.1);
		color: #677D6A;
	}

	.write-container:global(.dark) .step-item.completed {
		background: rgba(143, 169, 152, 0.15);
		color: #D6BD98;
	}

	.step-icon {
		@apply flex h-8 w-8 items-center justify-center rounded-full transition-all;
		background: rgba(143, 169, 152, 0.15);
		color: #677D6A;
	}

	.step-item.active .step-icon {
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
		box-shadow: 0 2px 8px rgba(103, 125, 106, 0.3);
		transform: scale(1.05);
	}

	.step-item.completed .step-icon {
		background: linear-gradient(135deg, #8FA998, #B5C9BD);
		color: #1A3636;
	}

	.step-title {
		@apply font-medium;
	}

	/* Form Container */
	.form-container {
		@apply rounded-xl p-8;
		background: rgba(26, 54, 54, 0.7);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(143, 169, 152, 0.3);
		box-shadow: 0 8px 32px rgba(26, 54, 54, 0.2);
	}

	.write-container:global(.dark) .form-container {
		background: rgba(26, 54, 54, 0.9);
		border-color: rgba(143, 169, 152, 0.15);
	}

	.form-section {
		@apply space-y-6;
	}

	.section-header h2 {
		@apply text-2xl font-bold;
		color: #EBE0CC;
	}

	.write-container:global(.dark) .section-header h2 {
		color: #EBE0CC;
	}

	.section-header p {
		color: #D6BD98;
	}

	.write-container:global(.dark) .section-header p {
		color: #D6BD98;
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
		@apply block text-sm font-medium;
		color: #E0CEAD;
	}

	.write-container:global(.dark) .form-label {
		color: #D6BD98;
	}

	.form-input {
		@apply w-full rounded-lg px-4 py-3 transition-all outline-none;
		background: rgba(235, 224, 204, 0.15);
		border: 1px solid rgba(143, 169, 152, 0.4);
		color: #EBE0CC;
	}

	.write-container:global(.dark) .form-input {
		background: rgba(26, 54, 54, 0.6);
		border-color: rgba(143, 169, 152, 0.2);
		color: #EBE0CC;
	}

	.form-input:focus {
		border-color: #8FA998;
		box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.15);
		transform: translateY(-1px);
	}

	.form-input.error {
		@apply border-red-500 focus:border-red-500 focus:ring-red-500/20;
	}

	.form-textarea {
		@apply w-full resize-none rounded-lg px-4 py-3 transition-all outline-none;
		background: rgba(235, 224, 204, 0.15);
		border: 1px solid rgba(143, 169, 152, 0.4);
		color: #EBE0CC;
	}

	.write-container:global(.dark) .form-textarea {
		background: rgba(26, 54, 54, 0.6);
		border-color: rgba(143, 169, 152, 0.2);
		color: #EBE0CC;
	}

	.form-textarea:focus {
		border-color: #8FA998;
		box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.15);
	}

	.form-select {
		@apply w-full rounded-lg px-4 py-3 transition-all outline-none;
		background: rgba(235, 224, 204, 0.15);
		border: 1px solid rgba(143, 169, 152, 0.4);
		color: #EBE0CC;
	}

	.write-container:global(.dark) .form-select {
		background: rgba(26, 54, 54, 0.6);
		border-color: rgba(143, 169, 152, 0.2);
		color: #EBE0CC;
	}

	.form-select:focus {
		border-color: #8FA998;
		box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.15);
	}

	.error-text {
		@apply text-sm text-red-600 dark:text-red-400;
	}

	/* Image Upload */
	.image-upload-area {
		@apply relative rounded-lg border-2 border-dashed p-8 text-center transition-all;
		border-color: rgba(143, 169, 152, 0.4);
		background: rgba(235, 224, 204, 0.1);
	}

	.write-container:global(.dark) .image-upload-area {
		background: rgba(26, 54, 54, 0.5);
		border-color: rgba(143, 169, 152, 0.2);
	}

	.image-upload-area:hover {
		border-color: #8FA998;
		background: rgba(143, 169, 152, 0.1);
	}

	.image-upload-area.drag-active {
		border-color: #8FA998;
		background: rgba(143, 169, 152, 0.15);
		box-shadow: 0 4px 12px rgba(143, 169, 152, 0.2);
	}

	.upload-placeholder {
		@apply space-y-2;
		color: #D6BD98;
	}

	.write-container:global(.dark) .upload-placeholder {
		color: #D6BD98;
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
		@apply rounded-lg p-4 transition-all;
		background: rgba(64, 83, 76, 0.4);
		border: 1px solid rgba(143, 169, 152, 0.3);
	}

	.write-container:global(.dark) .ingredient-item {
		background: rgba(26, 54, 54, 0.6);
		border-color: rgba(143, 169, 152, 0.15);
	}

	.ingredient-item:hover {
		box-shadow: 0 2px 8px rgba(143, 169, 152, 0.15);
	}

	.ingredient-inputs {
		@apply grid grid-cols-[100px_100px_1fr_1fr_auto] gap-3;
	}

	.ingredient-amount,
	.ingredient-unit,
	.ingredient-name,
	.ingredient-notes {
		@apply rounded-md px-3 py-2 text-sm outline-none transition-all;
		background: rgba(235, 224, 204, 0.12);
		border: 1px solid rgba(143, 169, 152, 0.35);
		color: #EBE0CC;
	}

	.write-container:global(.dark) .ingredient-amount,
	.write-container:global(.dark) .ingredient-unit,
	.write-container:global(.dark) .ingredient-name,
	.write-container:global(.dark) .ingredient-notes {
		background: rgba(26, 54, 54, 0.7);
		border-color: rgba(143, 169, 152, 0.2);
		color: #EBE0CC;
	}

	.ingredient-amount:focus,
	.ingredient-unit:focus,
	.ingredient-name:focus,
	.ingredient-notes:focus {
		border-color: #8FA998;
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.15);
	}

	.remove-ingredient {
		@apply flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20;
	}

	.add-ingredient {
		@apply flex items-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 transition-all;
		border-color: rgba(143, 169, 152, 0.4);
		color: #D6BD98;
	}

	.write-container:global(.dark) .add-ingredient {
		border-color: rgba(143, 169, 152, 0.2);
		color: #D6BD98;
	}

	.add-ingredient:hover {
		border-color: #8FA998;
		background: rgba(143, 169, 152, 0.1);
		transform: translateY(-2px);
	}

	/* Instructions */
	.instructions-container {
		@apply space-y-6;
	}

	.instruction-item {
		@apply rounded-lg p-6 transition-all;
		background: rgba(64, 83, 76, 0.4);
		border: 1px solid rgba(143, 169, 152, 0.3);
	}

	.write-container:global(.dark) .instruction-item {
		background: rgba(26, 54, 54, 0.6);
		border-color: rgba(143, 169, 152, 0.15);
	}

	.instruction-item:hover {
		box-shadow: 0 2px 8px rgba(143, 169, 152, 0.15);
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
		@apply flex-1 rounded-md px-3 py-2 outline-none transition-all;
		background: rgba(235, 224, 204, 0.12);
		border: 1px solid rgba(143, 169, 152, 0.35);
		color: #EBE0CC;
	}

	.write-container:global(.dark) .instruction-title {
		background: rgba(26, 54, 54, 0.7);
		border-color: rgba(143, 169, 152, 0.2);
		color: #EBE0CC;
	}

	.instruction-title:focus {
		border-color: #8FA998;
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.15);
	}

	.remove-instruction {
		@apply flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20;
	}

	.instruction-content {
		@apply mb-4 w-full resize-none rounded-md px-3 py-2 outline-none transition-all;
		background: rgba(235, 224, 204, 0.12);
		border: 1px solid rgba(143, 169, 152, 0.35);
		color: #EBE0CC;
	}

	.write-container:global(.dark) .instruction-content {
		background: rgba(26, 54, 54, 0.7);
		border-color: rgba(143, 169, 152, 0.2);
		color: #EBE0CC;
	}

	.instruction-content:focus {
		border-color: #8FA998;
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.15);
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
		@apply flex items-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 transition-all;
		border-color: rgba(143, 169, 152, 0.4);
		color: #D6BD98;
	}

	.write-container:global(.dark) .add-instruction {
		border-color: rgba(143, 169, 152, 0.2);
		color: #D6BD98;
	}

	.add-instruction:hover {
		border-color: #8FA998;
		background: rgba(143, 169, 152, 0.1);
		transform: translateY(-2px);
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
		@apply flex items-center gap-2 rounded-lg border-2 border-dashed px-4 py-2 transition-all;
		border-color: rgba(143, 169, 152, 0.4);
		color: #D6BD98;
	}

	.write-container:global(.dark) .add-tip {
		border-color: rgba(143, 169, 152, 0.2);
		color: #D6BD98;
	}

	.add-tip:hover {
		border-color: #8FA998;
		background: rgba(143, 169, 152, 0.1);
		transform: translateY(-2px);
	}

	/* Navigation */
	.form-navigation {
		@apply mt-8 flex items-center justify-between pt-6;
		border-top: 1px solid rgba(143, 169, 152, 0.2);
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
		@apply transition-all;
		background: rgba(143, 169, 152, 0.15);
		color: #677D6A;
	}

	.write-container:global(.dark) .nav-btn.secondary {
		background: rgba(143, 169, 152, 0.2);
		color: #D6BD98;
	}

	.nav-btn.secondary:hover {
		background: rgba(143, 169, 152, 0.25);
		transform: translateY(-1px);
	}

	.progress-indicator {
		@apply text-sm font-medium;
		color: #D6BD98;
	}

	.write-container:global(.dark) .progress-indicator {
		color: #D6BD98;
	}

	.submit-buttons {
		@apply flex gap-3;
	}

	.save-draft-btn {
		@apply flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all disabled:opacity-50;
		background: rgba(143, 169, 152, 0.25);
		color: #EBE0CC;
	}

	.write-container:global(.dark) .save-draft-btn {
		background: rgba(143, 169, 152, 0.2);
		color: #D6BD98;
	}

	.save-draft-btn:hover:not(:disabled) {
		background: rgba(143, 169, 152, 0.25);
		transform: translateY(-1px);
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

	/* ========== Searchable Dropdown Styles ========== */
	.searchable-dropdown {
		@apply relative;
	}

	.searchable-dropdown-trigger {
		@apply relative flex w-full items-center rounded-lg transition-all;
		background: rgba(235, 224, 204, 0.15);
		border: 1px solid rgba(143, 169, 152, 0.4);
	}

	.write-container:global(.dark) .searchable-dropdown-trigger {
		background: rgba(26, 54, 54, 0.6);
		border-color: rgba(143, 169, 152, 0.2);
	}

	.searchable-dropdown-trigger:hover {
		border-color: #8FA998;
	}

	.searchable-dropdown-input-main {
		@apply w-full rounded-lg px-4 py-3 outline-none transition-all;
		background: transparent;
		color: #EBE0CC;
		border: none;
	}

	.searchable-dropdown-input-main::placeholder {
		color: rgba(214, 189, 152, 0.7);
	}

	.searchable-dropdown-menu {
		@apply absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg border backdrop-blur-xl;
		background: rgba(26, 54, 54, 0.95);
		border: 1px solid rgba(143, 169, 152, 0.3);
		box-shadow: 0 8px 32px rgba(26, 54, 54, 0.3);
		max-height: 300px;
	}

	.searchable-dropdown-list {
		@apply overflow-y-auto;
		/* Show exactly 3 items at a time: 3 items * (py-2.5 top + py-2.5 bottom = 20px per item + 2px border) ≈ 126px */
		max-height: 126px;
	}

	.searchable-dropdown-item {
		@apply flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors;
		color: #D6BD98;
		min-height: 42px;
	}

	.searchable-dropdown-item:hover {
		background: rgba(103, 125, 106, 0.3);
		color: #EBE0CC;
	}

	.searchable-dropdown-item.selected {
		background: rgba(143, 169, 152, 0.25);
		color: #8FA998;
		font-weight: 500;
	}

	.searchable-dropdown-empty {
		@apply px-4 py-6 text-center text-sm;
		color: rgba(214, 189, 152, 0.6);
	}

	/* Scrollbar styling for dropdown list */
	.searchable-dropdown-list::-webkit-scrollbar {
		width: 8px;
	}

	.searchable-dropdown-list::-webkit-scrollbar-track {
		background: rgba(26, 54, 54, 0.3);
	}

	.searchable-dropdown-list::-webkit-scrollbar-thumb {
		background: rgba(143, 169, 152, 0.4);
		border-radius: 4px;
	}

	.searchable-dropdown-list::-webkit-scrollbar-thumb:hover {
		background: rgba(143, 169, 152, 0.6);
	}
</style>
