<!-- src/routes/recipes/[slug]/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import {
		Clock,
		Users,
		ChefHat,
		Flame,
		Bookmark,
		Heart,
		Share2,
		MessageCircle,
		Printer,
		Star,
		ThumbsUp,
		ChevronDown,
		AlertCircle
	} from 'lucide-svelte';
	import Comments from '../../../components/Comments/Comments.svelte';
	import CookingMode from '../../../components/CookingMode/CookingMode.svelte';

	let isCookingModeActive = false;

	function enterCookingMode() {
		isCookingModeActive = true;
		document.body.style.overflow = 'hidden'; // Prevent scrolling of main page
	}

	function exitCookingMode() {
		isCookingModeActive = false;
		document.body.style.overflow = ''; // Restore scrolling
	}

	// This would come from your API in a real implementation
	const recipe = {
		id: 'classic-butter-chicken',
		title: 'Classic Butter Chicken (Murgh Makhani)',
		description:
			"A rich, creamy, and aromatic Indian curry that's beloved worldwide. This authentic butter chicken recipe features tender chicken pieces in a velvety tomato-based sauce.",
		images: [
			'/images/butter-chicken.jpg',
			'/images/butter-chicken-2.jpg',
			'/images/butter-chicken-3.jpg'
		],
		cookTime: 45,
		prepTime: 20,
		totalTime: 65,
		servings: 4,
		difficulty: 'Medium',
		cuisine: 'Indian',
		category: 'Main Course',
		rating: 4.8,
		reviewsCount: 243,
		likesCount: 1243,
		isFavorited: false,
		isLiked: false,
		isSaved: false,
		author: {
			id: 'chef-priya',
			name: 'Chef Priya',
			avatar: '/images/chef-priya.jpg',
			recipesCount: 87,
			followersCount: 12400
		},
		ingredients: [
			{
				group: 'For the Marinade',
				items: [
					'1 lb (450g) boneless, skinless chicken thighs, cut into bite-sized pieces',
					'1/2 cup plain yogurt',
					'2 tablespoons lemon juice',
					'4 cloves garlic, minced',
					'1 tablespoon ginger paste',
					'1 teaspoon garam masala',
					'1 teaspoon ground cumin',
					'1 teaspoon ground coriander',
					'1 teaspoon Kashmiri red chili powder (or mild paprika)',
					'1/2 teaspoon ground turmeric',
					'Salt to taste'
				]
			},
			{
				group: 'For the Sauce',
				items: [
					'3 tablespoons ghee or unsalted butter',
					'1 large onion, finely chopped',
					'2 green chilies, slit (optional, for heat)',
					'4 cloves garlic, minced',
					'1 tablespoon ginger paste',
					'1 cinnamon stick',
					'4 green cardamom pods, slightly crushed',
					'2 cloves',
					'1 bay leaf',
					'2 cups tomato puree (or 4 large tomatoes, pureed)',
					'1 tablespoon Kashmiri red chili powder',
					'1 teaspoon garam masala',
					'1/2 cup heavy cream',
					'2 tablespoons kasuri methi (dried fenugreek leaves)',
					'2 tablespoons honey or sugar',
					'Salt to taste'
				]
			},
			{
				group: 'For Garnish',
				items: [
					'2 tablespoons fresh cilantro, chopped',
					'1 tablespoon butter, for topping',
					'A swirl of cream, for topping'
				]
			}
		],
		steps: [
			{
				title: 'Marinate the Chicken',
				content:
					'In a large bowl, combine all marinade ingredients with the chicken pieces. Make sure all pieces are well coated. Cover and refrigerate for at least 2 hours, preferably overnight for best flavor.'
			},
			{
				title: 'Cook the Marinated Chicken',
				content:
					'Preheat your oven to 425°F (220°C). Line a baking sheet with aluminum foil and arrange the marinated chicken pieces in a single layer. Bake for 15 minutes, or until the chicken is cooked through and slightly charred on the edges. Alternatively, you can grill the chicken or cook it in a pan until done.'
			},
			{
				title: 'Prepare the Sauce',
				content:
					'Heat ghee or butter in a large, heavy-bottomed pot over medium heat. Add the cinnamon stick, cardamom pods, cloves, and bay leaf. Sauté for 30 seconds until fragrant. Add the chopped onions and green chilies (if using) and sauté until the onions are golden brown, about 5-7 minutes. Add the minced garlic and ginger paste. Sauté for another 1-2 minutes until the raw smell disappears.'
			},
			{
				title: 'Add Tomatoes and Spices',
				content:
					'Pour in the tomato puree and bring to a simmer. Add the Kashmiri red chili powder and salt. Cover and simmer for about 15 minutes, stirring occasionally, until the sauce thickens and the oil begins to separate.'
			},
			{
				title: 'Blend the Sauce',
				content:
					'Remove the cinnamon stick, cardamom pods, cloves, and bay leaf. Let the sauce cool slightly, then transfer to a blender and blend until smooth. You can also use an immersion blender directly in the pot. Return the sauce to the pot if you used a countertop blender.'
			},
			{
				title: 'Finish the Dish',
				content:
					'Bring the sauce back to a simmer over medium heat. Add the cooked chicken pieces and any accumulated juices. Stir in the heavy cream, kasuri methi (crush it between your palms before adding), garam masala, and honey or sugar. Simmer for 5-7 minutes until the flavors meld together and the sauce reaches your desired consistency.'
			},
			{
				title: 'Garnish and Serve',
				content:
					'Just before serving, stir in the remaining tablespoon of butter until melted. Transfer to a serving dish, drizzle with a little cream, and sprinkle with chopped cilantro. Serve hot with naan bread or steamed rice.'
			}
		],
		tips: [
			'For a richer flavor, use bone-in chicken pieces in the marinade and remove the bones before adding to the sauce.',
			'The longer you marinate the chicken, the more flavorful and tender it will be.',
			'If the sauce is too thick, add a little water or chicken broth to reach your desired consistency.',
			"Don't skip the kasuri methi (dried fenugreek leaves) - it gives butter chicken its distinctive flavor.",
			'For a tangier sauce, add a tablespoon of tomato paste along with the tomato puree.'
		],
		nutrition: {
			calories: 420,
			protein: 28,
			carbs: 12,
			fat: 32,
			fiber: 3,
			sugar: 8
		},
		tags: ['Indian', 'chicken', 'curry', 'creamy', 'dinner', 'comfort food'],
		relatedRecipes: [
			{
				id: 'chicken-tikka-masala',
				title: 'Chicken Tikka Masala',
				image: '/images/chicken-tikka.jpg'
			},
			{
				id: 'naan-bread',
				title: 'Homemade Naan Bread',
				image: '/images/naan.jpg'
			},
			{
				id: 'palak-paneer',
				title: 'Palak Paneer',
				image: '/images/palak-paneer.jpg'
			}
		],
		createdAt: '2023-08-15T14:30:00Z',
		updatedAt: '2023-10-03T09:15:00Z'
	};

	// These would be state variables in a real implementation
	let activeImageIndex = 0;
	let expandedSection = '';
	let showAllIngredients = false;
	let showAllTips = false;

	function toggleExpandSection(section: string) {
		expandedSection = expandedSection === section ? '' : section;
	}

	function toggleLike() {
		recipe.isLiked = !recipe.isLiked;
		recipe.likesCount += recipe.isLiked ? 1 : -1;
	}

	function toggleSave() {
		recipe.isSaved = !recipe.isSaved;
	}

	function toggleFavorite() {
		recipe.isFavorited = !recipe.isFavorited;
	}

	function handleShare() {
		// Logic for sharing would go here
		console.log('Share recipe', recipe.id);
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}

	let reviews = [
		{
			id: 1,
			author: {
				name: 'Sarah M.',
				avatar: '/images/user-1.jpg'
			},
			rating: 5,
			date: '2023-09-28T10:30:00Z',
			content:
				"This butter chicken recipe is amazing! The flavors are perfectly balanced and it tastes just like what I've had at my favorite Indian restaurant."
		},
		{
			id: 2,
			author: {
				name: 'Michael R.',
				avatar: '/images/user-2.jpg'
			},
			rating: 4,
			date: '2023-09-15T14:22:00Z',
			content:
				'Really good recipe! I reduced the cream slightly and it was still delicious. Will definitely make again.'
		},
		{
			id: 3,
			author: {
				name: 'Jessica T.',
				avatar: '/images/user-3.jpg'
			},
			rating: 5,
			date: '2023-08-30T19:45:00Z',
			content:
				'The step by step instructions were so easy to follow. My family loved it! This is now going into our regular rotation.'
		}
	];

	let showAllReviews = false;
	let currentServings = recipe.servings;
	let servingsScaleFactor = 1;

	// Parse an ingredient string to separate quantity, unit, and ingredient name
	function parseIngredient(ingredientText: string) {
		// This regex matches patterns like "2 cups flour" or "1/2 teaspoon salt"
		const regex = /^((?:\d+\/\d+|\d+(?:\.\d+)?|\d+\s*-\s*\d+)?\s*(?:[\w\-\.]+)?)?\s*(.*)/;
		const match = ingredientText.match(regex);

		if (match) {
			const quantityWithUnit = match[1] ? match[1].trim() : '';
			const rest = match[2] ? match[2].trim() : '';

			// Try to split quantityWithUnit into quantity and unit
			const quantityUnitRegex = /^((?:\d+\/\d+|\d+(?:\.\d+)?|\d+\s*-\s*\d+)?)\s*([\w\-\.]*)?/;
			const quantityUnitMatch = quantityWithUnit.match(quantityUnitRegex);

			let quantity = '';
			let unit = '';

			if (quantityUnitMatch) {
				quantity = quantityUnitMatch[1] ? quantityUnitMatch[1].trim() : '';
				unit = quantityUnitMatch[2] ? quantityUnitMatch[2].trim() : '';
			}

			return {
				quantity,
				unit,
				ingredient: rest,
				original: ingredientText
			};
		}

		return {
			quantity: '',
			unit: '',
			ingredient: ingredientText,
			original: ingredientText
		};
	}

	// Convert fractions to decimal
	function fractionToDecimal(fraction: string): number {
		if (!fraction) return 0;

		// If it's already a number, return it
		if (!isNaN(Number(fraction))) return parseFloat(fraction);

		// If it contains a dash (like "1-2"), take the average
		if (fraction.includes('-')) {
			const [min, max] = fraction.split('-').map((part) => parseFloat(part.trim()));
			return (min + max) / 2;
		}

		// If it's a fraction like 1/2
		if (fraction.includes('/')) {
			const [numerator, denominator] = fraction.split('/').map((part) => parseFloat(part.trim()));
			return parseFloat(numerator.toString()) / parseFloat(denominator.toString());
		}

		return 0;
	}

	// Scale ingredient quantity
	function scaleQuantity(quantityStr: string, scaleFactor: number): string {
		if (!quantityStr) return '';

		const quantity = fractionToDecimal(quantityStr);
		if (quantity === 0) return quantityStr;

		const scaled = quantity * scaleFactor;

		// Format the scaled quantity nicely
		if (scaled === Math.floor(scaled)) {
			return Math.floor(scaled).toString();
		} else if (scaled < 1) {
			// For small quantities, try to convert to fractions
			if (Math.abs(scaled - 0.25) < 0.01) return '1/4';
			if (Math.abs(scaled - 0.33) < 0.01) return '1/3';
			if (Math.abs(scaled - 0.5) < 0.01) return '1/2';
			if (Math.abs(scaled - 0.67) < 0.01) return '2/3';
			if (Math.abs(scaled - 0.75) < 0.01) return '3/4';
			return scaled.toFixed(2);
		}

		return scaled.toFixed(1).replace(/\.0$/, '');
	}

	// Update the function that handles serving size changes
	function updateIngredientQuantities(newServings: number) {
		const scaleFactor = newServings / recipe.servings;
		currentServings = newServings;
		servingsScaleFactor = scaleFactor;
	}

	onMount(() => {
		// You would fetch the recipe data here in a real implementation
		console.log('Recipe detail page mounted');
	});
</script>

<svelte:head>
	<title>{recipe.title} | OwnChef</title>
	<meta name="description" content={recipe.description} />
</svelte:head>

<div class="recipe-detail-container" class:dark={$theme === 'dark'}>
	<!-- Recipe Header -->
	<header class="recipe-header">
		<div class="breadcrumb">
			<a href="/" class="breadcrumb-link">Home</a>
			<span class="breadcrumb-separator">/</span>
			<a href="/recipes" class="breadcrumb-link">Recipes</a>
			<span class="breadcrumb-separator">/</span>
			<a href="/recipes/category/{recipe.cuisine.toLowerCase()}" class="breadcrumb-link"
				>{recipe.cuisine}</a
			>
		</div>

		<h1 class="recipe-title">{recipe.title}</h1>

		<div class="recipe-meta">
			<div class="recipe-rating">
				<div class="stars">
					{#each Array(5) as _, i}
						<Star
							size={18}
							class="star"
							fill={i < Math.floor(recipe.rating) ? 'currentColor' : 'none'}
						/>
					{/each}
				</div>
				<span class="rating-value">{recipe.rating}</span>
				<span class="rating-count">({recipe.reviewsCount} reviews)</span>
			</div>

			<div class="recipe-time">
				<Clock size={18} class="time-icon" />
				<span>{recipe.totalTime} mins</span>
			</div>

			<div class="recipe-difficulty">
				<ChefHat size={18} class="difficulty-icon" />
				<span>{recipe.difficulty}</span>
			</div>

			<div class="recipe-servings">
				<Users size={18} class="servings-icon" />
				<span>{recipe.servings} servings</span>
			</div>
		</div>

		<div class="author-info">
			<img src={recipe.author.avatar} alt={recipe.author.name} class="author-avatar" />
			<div class="author-details">
				<a href="/profile/{recipe.author.id}" class="author-name">{recipe.author.name}</a>
				<div class="author-stats">
					<span>{recipe.author.recipesCount} recipes</span>
					<span class="stat-separator">•</span>
					<span>{recipe.author.followersCount.toLocaleString()} followers</span>
				</div>
			</div>
			<button class="follow-button">Follow</button>
		</div>
	</header>

	<!-- Recipe Content Grid -->
	<div class="recipe-content">
		<!-- Left Column: Images and Ingredients -->
		<div class="recipe-left-column">
			<!-- Recipe Images Gallery -->
			<div class="recipe-gallery">
				<div class="main-image-container">
					<img src={recipe.images[activeImageIndex]} alt={recipe.title} class="main-image" />

					<div class="image-navigation">
						<button
							class="nav-button prev"
							on:click={() =>
								(activeImageIndex =
									(activeImageIndex - 1 + recipe.images.length) % recipe.images.length)}
							aria-label="Previous image"
						>
							&lsaquo;
						</button>
						<button
							class="nav-button next"
							on:click={() => (activeImageIndex = (activeImageIndex + 1) % recipe.images.length)}
							aria-label="Next image"
						>
							&rsaquo;
						</button>
					</div>

					<div class="image-dots">
						{#each recipe.images as _, index}
							<button
								class="dot-button"
								class:active={activeImageIndex === index}
								on:click={() => (activeImageIndex = index)}
								aria-label={`Image ${index + 1} of ${recipe.images.length}`}
							></button>
						{/each}
					</div>
				</div>

				<div class="thumbnail-container">
					{#each recipe.images as image, index}
						<button
							class="thumbnail"
							class:active={activeImageIndex === index}
							on:click={() => (activeImageIndex = index)}
						>
							<img src={image} alt={`${recipe.title} - view ${index + 1}`} />
						</button>
					{/each}
				</div>
			</div>

			<!-- Recipe Actions -->
			<div class="recipe-actions">
				<button class="action-button" class:active={recipe.isLiked} on:click={toggleLike}>
					<Heart size={20} class="action-icon" fill={recipe.isLiked ? 'currentColor' : 'none'} />
					<span>{recipe.likesCount}</span>
				</button>

				<button class="action-button" class:active={recipe.isSaved} on:click={toggleSave}>
					<Bookmark size={20} class="action-icon" fill={recipe.isSaved ? 'currentColor' : 'none'} />
					<span>Save</span>
				</button>

				<button class="action-button" class:active={recipe.isFavorited} on:click={toggleFavorite}>
					<Star size={20} class="action-icon" fill={recipe.isFavorited ? 'currentColor' : 'none'} />
					<span>Favorite</span>
				</button>

				<button class="action-button" on:click={handleShare}>
					<Share2 size={20} class="action-icon" />
					<span>Share</span>
				</button>

				<button class="action-button print">
					<Printer size={20} class="action-icon" />
					<span>Print</span>
				</button>
			</div>

			<!-- Recipe Description -->
			<div class="recipe-description">
				<p>{recipe.description}</p>
			</div>

			<!-- Servings Adjuster -->
			<div class="servings-adjuster">
				<label for="servings">Adjust servings:</label>
				<div class="servings-controls">
					<button
						class="adjust-button minus"
						on:click={() => updateIngredientQuantities(Math.max(1, currentServings - 1))}
						disabled={currentServings <= 1}>-</button
					>
					<input
						type="number"
						id="servings"
						class="servings-input"
						bind:value={currentServings}
						min="1"
						max="20"
						on:change={(e) => updateIngredientQuantities(parseInt(e.currentTarget.value))}
					/>
					<button
						class="adjust-button plus"
						on:click={() => updateIngredientQuantities(currentServings + 1)}
						disabled={currentServings >= 20}>+</button
					>
				</div>
				{#if servingsScaleFactor !== 1}
					<div class="scaling-badge">
						{servingsScaleFactor > 1
							? `${servingsScaleFactor}×`
							: `÷${Math.round(1 / servingsScaleFactor)}`}
					</div>
				{/if}
			</div>

			<!-- Ingredients -->
			<div class="recipe-ingredients">
				<h2 class="section-title">Ingredients</h2>

				{#each recipe.ingredients as group}
					<div class="ingredient-group">
						{#if group.group}
							<h3 class="ingredient-group-title">{group.group}</h3>
						{/if}

						<ul class="ingredients-list">
							{#each group.items.slice(0, showAllIngredients ? group.items.length : 5) as ingredient}
								<li class="ingredient-item">
									<div class="ingredient-checkbox">
										<input type="checkbox" id={`ingredient-${ingredient}`} />
										<label for={`ingredient-${ingredient}`}>
											{#if servingsScaleFactor !== 1 && parseIngredient(ingredient).quantity}
												<!-- Display scaled quantity -->
												<span class="scaled-quantity">
													{scaleQuantity(parseIngredient(ingredient).quantity, servingsScaleFactor)}
												</span>
												{#if parseIngredient(ingredient).unit}
													<span class="ingredient-unit">{parseIngredient(ingredient).unit}</span>
												{/if}
												<span class="ingredient-name">{parseIngredient(ingredient).ingredient}</span
												>
											{:else}
												{ingredient}
											{/if}
										</label>
									</div>
								</li>
							{/each}

							{#if !showAllIngredients && group.items.length > 5}
								<button class="show-more-button" on:click={() => (showAllIngredients = true)}>
									+ Show {group.items.length - 5} more ingredients
								</button>
							{/if}
						</ul>
					</div>
				{/each}

				{#if showAllIngredients}
					<button class="show-less-button" on:click={() => (showAllIngredients = false)}>
						- Show fewer ingredients
					</button>
				{/if}

				<div class="shopping-list-button-container">
					<button class="shopping-list-button">
						<Bookmark size={18} class="button-icon" />
						Add all to shopping list
					</button>
				</div>
			</div>

			<!-- Nutrition Information -->
			<div class="nutrition-info">
				<h2 class="section-title">Nutrition Per Serving</h2>
				<div class="nutrition-grid">
					<div class="nutrition-item">
						<span class="nutrition-value">{recipe.nutrition.calories}</span>
						<span class="nutrition-label">Calories</span>
					</div>
					<div class="nutrition-item">
						<span class="nutrition-value">{recipe.nutrition.protein}g</span>
						<span class="nutrition-label">Protein</span>
					</div>
					<div class="nutrition-item">
						<span class="nutrition-value">{recipe.nutrition.carbs}g</span>
						<span class="nutrition-label">Carbs</span>
					</div>
					<div class="nutrition-item">
						<span class="nutrition-value">{recipe.nutrition.fat}g</span>
						<span class="nutrition-label">Fat</span>
					</div>
					<div class="nutrition-item">
						<span class="nutrition-value">{recipe.nutrition.fiber}g</span>
						<span class="nutrition-label">Fiber</span>
					</div>
					<div class="nutrition-item">
						<span class="nutrition-value">{recipe.nutrition.sugar}g</span>
						<span class="nutrition-label">Sugar</span>
					</div>
				</div>
				<div class="nutrition-disclaimer">
					<AlertCircle size={16} class="disclaimer-icon" />
					<p>
						Nutrition information is automatically calculated and should be considered an estimate.
					</p>
				</div>
			</div>
		</div>

		<!-- Right Column: Instructions and More -->
		<div class="recipe-right-column">
			<!-- Recipe Instructions -->
			<div class="recipe-instructions">
				<h2 class="section-title">Instructions</h2>

				<div class="instructions-list">
					{#each recipe.steps as step, index}
						<div class="instruction-step">
							<div class="step-header">
								<div class="step-number">{index + 1}</div>
								<h3 class="step-title">{step.title}</h3>
							</div>
							<p class="step-content">{step.content}</p>
						</div>
					{/each}
				</div>

				<div class="cook-mode-button-container">
					<button class="cook-mode-button" on:click={enterCookingMode}>
						<Flame size={18} class="button-icon" />
						Enter cook mode
					</button>
				</div>
			</div>

			<!-- Tips Section -->
			<div class="recipe-tips">
				<h2 class="section-title">Tips for Success</h2>

				<ul class="tips-list">
					{#each recipe.tips.slice(0, showAllTips ? recipe.tips.length : 3) as tip, index}
						<li class="tip-item">
							<div class="tip-number">{index + 1}</div>
							<p>{tip}</p>
						</li>
					{/each}
				</ul>

				{#if !showAllTips && recipe.tips.length > 3}
					<button class="show-more-button" on:click={() => (showAllTips = true)}>
						+ Show {recipe.tips.length - 3} more tips
					</button>
				{/if}

				{#if showAllTips}
					<button class="show-less-button" on:click={() => (showAllTips = false)}>
						- Show fewer tips
					</button>
				{/if}
			</div>

			<!-- Tags Section -->
			<div class="recipe-tags">
				<h2 class="section-title">Tags</h2>
				<div class="tags-container">
					{#each recipe.tags as tag}
						<a href="/recipes/tag/{tag}" class="tag">{tag}</a>
					{/each}
				</div>
			</div>

			<!-- Reviews Section -->
			<div class="recipe-reviews">
				<div class="reviews-header">
					<h2 class="section-title">Reviews</h2>
					<div class="reviews-summary">
						<div class="reviews-rating">
							<div class="rating-large">{recipe.rating}</div>
							<div class="stars-large">
								{#each Array(5) as _, i}
									<Star
										size={16}
										class="star"
										fill={i < Math.floor(recipe.rating) ? 'currentColor' : 'none'}
									/>
								{/each}
							</div>
							<div class="rating-count-large">{recipe.reviewsCount} reviews</div>
						</div>
						<button class="write-review-button">Write a Review</button>
					</div>
				</div>

				<div class="reviews-list">
					{#each reviews.slice(0, showAllReviews ? reviews.length : 2) as review}
						<div class="review-item">
							<div class="review-header">
								<div class="reviewer-info">
									<img
										src={review.author.avatar}
										alt={review.author.name}
										class="reviewer-avatar"
									/>
									<div class="reviewer-details">
										<div class="reviewer-name">{review.author.name}</div>
										<div class="review-date">{formatDate(review.date)}</div>
									</div>
								</div>
								<div class="review-rating">
									{#each Array(5) as _, i}
										<Star
											size={14}
											class="star"
											fill={i < review.rating ? 'currentColor' : 'none'}
										/>
									{/each}
								</div>
							</div>
							<p class="review-content">{review.content}</p>
							<div class="review-actions">
								<button class="review-helpful-button">
									<ThumbsUp size={14} class="helpful-icon" />
									Helpful
								</button>
							</div>
						</div>
					{/each}
				</div>

				{#if !showAllReviews && reviews.length > 2}
					<button class="show-all-reviews-button" on:click={() => (showAllReviews = true)}>
						View all {recipe.reviewsCount} reviews
						<ChevronDown size={16} class="button-icon" />
					</button>
				{/if}

				{#if showAllReviews}
					<button class="show-less-reviews-button" on:click={() => (showAllReviews = false)}>
						Show fewer reviews
					</button>
				{/if}
			</div>

			<!-- Comments Section -->
			<div class="recipe-comments">
				<h2 class="section-title">Comments</h2>
				<Comments />
			</div>
		</div>
	</div>

	<!-- Related Recipes -->
	<div class="related-recipes">
		<h2 class="section-title">You Might Also Like</h2>
		<div class="related-recipes-grid">
			{#each recipe.relatedRecipes as relatedRecipe}
				<a href="/recipes/{relatedRecipe.id}" class="related-recipe-card">
					<div class="related-recipe-image-container">
						<img src={relatedRecipe.image} alt={relatedRecipe.title} class="related-recipe-image" />
					</div>
					<h3 class="related-recipe-title">{relatedRecipe.title}</h3>
				</a>
			{/each}
		</div>
	</div>
	{#if isCookingModeActive}
		<CookingMode steps={recipe.steps} title={recipe.title} onClose={exitCookingMode} />
	{/if}
</div>

<style lang="postcss">
	.recipe-detail-container {
		@apply mx-auto max-w-7xl px-4 pb-16 pt-8;
	}

	/* Breadcrumb Styles */
	.breadcrumb {
		@apply mb-4 flex text-sm text-gray-500 dark:text-gray-400;
	}

	.breadcrumb-link {
		@apply hover:text-orange-500 dark:hover:text-orange-400;
	}

	.breadcrumb-separator {
		@apply mx-2;
	}

	/* Recipe Header Styles */
	.recipe-header {
		@apply mb-8;
	}

	.recipe-title {
		@apply mb-4 text-4xl font-bold leading-tight text-gray-900 dark:text-white;
	}

	.recipe-meta {
		@apply mb-6 flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300;
	}

	.recipe-rating {
		@apply flex items-center gap-2;
	}

	.stars {
		@apply flex;
	}

	.star {
		@apply text-yellow-400;
	}

	.rating-value {
		@apply font-semibold;
	}

	.rating-count {
		@apply text-gray-500 dark:text-gray-400;
	}

	.recipe-time,
	.recipe-difficulty,
	.recipe-servings {
		@apply flex items-center gap-1.5;
	}

	.time-icon,
	.difficulty-icon,
	.servings-icon {
		@apply text-orange-500;
	}

	.author-info {
		@apply mt-6 flex items-center gap-4;
	}

	.author-avatar {
		@apply h-12 w-12 rounded-full object-cover;
	}

	.author-details {
		@apply flex flex-col;
	}

	.author-name {
		@apply font-medium text-gray-900 hover:text-orange-500 dark:text-white dark:hover:text-orange-400;
	}

	.author-stats {
		@apply text-sm text-gray-500 dark:text-gray-400;
	}

	.stat-separator {
		@apply mx-1.5;
	}

	.follow-button {
		@apply ml-auto rounded-full bg-orange-500 px-5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600;
	}

	/* Recipe Content Grid Styles */
	.recipe-content {
		@apply grid gap-8 lg:grid-cols-[3fr_4fr];
	}

	/* Recipe Gallery Styles */
	.recipe-gallery {
		@apply mb-6;
	}

	.main-image-container {
		@apply relative mb-2 overflow-hidden rounded-xl;
	}

	.main-image {
		@apply aspect-[4/3] w-full object-cover;
	}

	.image-navigation {
		@apply absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2;
	}

	.nav-button {
		@apply flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-2xl text-white backdrop-blur-sm transition-all hover:bg-black/40;
	}

	.image-dots {
		@apply absolute bottom-4 left-0 right-0 flex justify-center gap-2;
	}

	.dot-button {
		@apply h-2 w-2 rounded-full bg-white/40 transition-all hover:bg-white;
	}

	.dot-button.active {
		@apply bg-white;
	}

	.thumbnail-container {
		@apply grid grid-cols-3 gap-2;
	}

	.thumbnail {
		@apply overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-orange-500;
	}

	.thumbnail.active {
		@apply border-orange-500;
	}

	.thumbnail img {
		@apply aspect-[4/3] w-full object-cover;
	}

	/* Recipe Actions Styles */
	.recipe-actions {
		@apply mb-6 flex flex-wrap justify-between gap-2;
	}

	.action-button {
		@apply flex flex-1 flex-col items-center gap-1 rounded-md px-2 py-3 text-sm text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800;
	}

	.action-button.active {
		@apply text-orange-500;
	}

	.action-icon {
		@apply transition-transform duration-300 group-hover:scale-110;
	}

	.action-button:hover .action-icon {
		@apply scale-110;
	}

	.action-button.print {
		@apply border border-dashed border-gray-200 dark:border-gray-700;
	}

	/* Recipe Description Styles */
	.recipe-description {
		@apply mb-6 text-gray-700 dark:text-gray-300;
	}

	/* Servings Adjuster Styles */
	.servings-adjuster {
		@apply mb-6 flex items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800;
	}

	.servings-controls {
		@apply flex items-center;
	}

	.adjust-button {
		@apply flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-600 transition-colors hover:bg-gray-100 disabled:text-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	.servings-input {
		@apply w-10 appearance-none border-none bg-transparent p-0 text-center text-lg font-medium focus:outline-none focus:ring-0;
	}

	.scaling-badge {
		@apply ml-auto rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600 dark:bg-orange-500/20 dark:text-orange-400;
	}

	/* Ingredients Styles */
	.recipe-ingredients {
		@apply mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800;
	}

	.section-title {
		@apply mb-4 text-xl font-bold text-gray-900 dark:text-white;
	}

	.ingredient-group {
		@apply mb-4;
	}

	.ingredient-group-title {
		@apply mb-2 font-medium text-gray-700 dark:text-gray-300;
	}

	.ingredients-list {
		@apply space-y-2;
	}

	.ingredient-item {
		@apply text-gray-600 dark:text-gray-300;
	}

	.ingredient-checkbox {
		@apply flex items-center gap-2;
	}

	.ingredient-checkbox input[type='checkbox'] {
		@apply h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-700;
	}

	.scaled-quantity {
		@apply font-medium text-orange-500;
	}

	.ingredient-unit {
		@apply mr-1;
	}

	.ingredient-name {
		@apply text-gray-700 dark:text-gray-300;
	}

	.show-more-button,
	.show-less-button {
		@apply mt-2 text-sm font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500;
	}

	.shopping-list-button-container {
		@apply mt-4 border-t border-gray-100 pt-4 dark:border-gray-700;
	}

	.shopping-list-button {
		@apply flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-600;
	}

	/* Nutrition Info Styles */
	.nutrition-info {
		@apply mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800;
	}

	.nutrition-grid {
		@apply grid grid-cols-3 gap-4;
	}

	.nutrition-item {
		@apply flex flex-col items-center rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700;
	}

	.nutrition-value {
		@apply text-lg font-semibold text-gray-900 dark:text-white;
	}

	.nutrition-label {
		@apply text-sm text-gray-500 dark:text-gray-400;
	}

	.nutrition-disclaimer {
		@apply mt-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400;
	}

	.disclaimer-icon {
		@apply mt-0.5 flex-shrink-0 text-orange-500;
	}

	/* Instructions Styles */
	.recipe-instructions {
		@apply mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800;
	}

	.instructions-list {
		@apply space-y-6;
	}

	.instruction-step {
		@apply relative;
	}

	.step-header {
		@apply mb-2 flex items-center gap-4;
	}

	.step-number {
		@apply flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-bold text-white;
	}

	.step-title {
		@apply text-lg font-medium text-gray-900 dark:text-white;
	}

	.step-content {
		@apply ml-12 text-gray-600 dark:text-gray-300;
	}

	.cook-mode-button-container {
		@apply mt-8 border-t border-gray-100 pt-6 dark:border-gray-700;
	}

	.cook-mode-button {
		@apply flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-orange-500/20;
	}

	/* Tips Styles */
	.recipe-tips {
		@apply mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800;
	}

	.tips-list {
		@apply space-y-4;
	}

	.tip-item {
		@apply flex gap-3 text-gray-600 dark:text-gray-300;
	}

	.tip-number {
		@apply flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300;
	}

	/* Tags Styles */
	.recipe-tags {
		@apply mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800;
	}

	.tags-container {
		@apply flex flex-wrap gap-2;
	}

	.tag {
		@apply rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	/* Reviews Styles */
	.recipe-reviews {
		@apply mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800;
	}

	.reviews-header {
		@apply mb-6;
	}

	.reviews-summary {
		@apply flex flex-wrap items-center justify-between gap-4;
	}

	.reviews-rating {
		@apply flex flex-col items-center;
	}

	.rating-large {
		@apply text-3xl font-bold text-gray-900 dark:text-white;
	}

	.stars-large {
		@apply flex;
	}

	.rating-count-large {
		@apply text-sm text-gray-500 dark:text-gray-400;
	}

	.write-review-button {
		@apply rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600;
	}

	.reviews-list {
		@apply space-y-6;
	}

	.review-item {
		@apply border-b border-gray-100 pb-6 dark:border-gray-700;
	}

	.review-header {
		@apply mb-3 flex items-start justify-between;
	}

	.reviewer-info {
		@apply flex items-center gap-3;
	}

	.reviewer-avatar {
		@apply h-10 w-10 rounded-full object-cover;
	}

	.reviewer-details {
		@apply flex flex-col;
	}

	.reviewer-name {
		@apply font-medium text-gray-900 dark:text-white;
	}

	.review-date {
		@apply text-sm text-gray-500 dark:text-gray-400;
	}

	.review-rating {
		@apply flex;
	}

	.review-content {
		@apply text-gray-600 dark:text-gray-300;
	}

	.review-actions {
		@apply mt-3 flex justify-end;
	}

	.review-helpful-button {
		@apply flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	.helpful-icon {
		@apply text-gray-500 dark:text-gray-400;
	}

	.show-all-reviews-button {
		@apply mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700;
	}

	.show-less-reviews-button {
		@apply mt-4 text-sm font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500;
	}

	/* Related Recipes Styles */
	.related-recipes {
		@apply mt-12;
	}

	.related-recipes-grid {
		@apply grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3;
	}

	.related-recipe-card {
		@apply overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-gray-800;
	}

	.related-recipe-image-container {
		@apply overflow-hidden;
	}

	.related-recipe-image {
		@apply aspect-[16/9] w-full object-cover transition-transform duration-300;
	}

	.related-recipe-card:hover .related-recipe-image {
		@apply scale-105;
	}

	.related-recipe-title {
		@apply p-4 text-center text-lg font-medium text-gray-900 dark:text-white;
	}

	/* Media Queries */
	@media (max-width: 768px) {
		.recipe-content {
			@apply grid-cols-1;
		}

		.recipe-meta {
			@apply flex-col items-start gap-3;
		}

		.recipe-gallery {
			@apply mb-4;
		}

		.author-info {
			@apply flex-wrap;
		}

		.follow-button {
			@apply ml-0 mt-4 w-full;
		}
	}
</style>
