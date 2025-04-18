<!-- src/routes/profile/[username]/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import {
		ChefHat,
		Heart,
		Users,
		Settings,
		ExternalLink,
		MapPin,
		Calendar,
		Star,
		UtensilsCrossed,
		BookOpen,
		Clock,
		Grid,
		List
	} from 'lucide-svelte';
	import Card from '../../../components/Card/Card.svelte';

	// This would be fetched from your API in a real implementation
	const profile = {
		id: 'chef-priya',
		username: 'chef_priya',
		name: 'Chef Priya Sharma',
		avatar: '/images/chef-priya.jpg',
		bio: 'Professional chef with over 10 years of experience in Indian and fusion cuisine. Passionate about sharing authentic family recipes and teaching cooking techniques.',
		location: 'Mumbai, India',
		joined: '2022-03-15',
		website: 'https://priyaskitchen.com',
		social: {
			instagram: 'chef_priya',
			youtube: 'PriyasKitchenTV',
			tiktok: 'chefpriya_official'
		},
		stats: {
			followers: 12400,
			following: 345,
			recipes: 87,
			likes: 4523
		},
		isFollowing: false,
		isOwnProfile: false,
		verified: true
	};

	const recipes = [
		{
			id: 'butter-chicken',
			title: 'Classic Butter Chicken',
			description:
				'A rich and creamy tomato-based curry with tender chicken pieces marinated in yogurt and spices.',
			image: '/images/butter-chicken.jpg',
			cookTime: 45,
			category: 'Indian',
			difficulty: 'Medium',
			author: {
				name: profile.name,
				avatar: profile.avatar
			},
			rating: 4.8
		},
		{
			id: 'palak-paneer',
			title: 'Palak Paneer',
			description:
				'Creamy spinach curry with soft paneer cheese cubes, flavored with garlic, ginger, and aromatic spices.',
			image: '/images/palak-paneer.jpg',
			cookTime: 35,
			category: 'Indian',
			difficulty: 'Easy',
			author: {
				name: profile.name,
				avatar: profile.avatar
			},
			rating: 4.7
		},
		{
			id: 'chicken-biryani',
			title: 'Chicken Biryani',
			description:
				'Fragrant basmati rice cooked with tender chicken pieces, saffron, and a blend of traditional spices.',
			image: '/images/biryani.jpg',
			cookTime: 60,
			category: 'Indian',
			difficulty: 'Medium',
			author: {
				name: profile.name,
				avatar: profile.avatar
			},
			rating: 4.9
		},
		{
			id: 'masala-dosa',
			title: 'Masala Dosa',
			description:
				'Crispy rice and lentil crepes filled with spiced potato filling, served with coconut chutney and sambar.',
			image: '/images/masala-dosa.jpg',
			cookTime: 50,
			category: 'Indian',
			difficulty: 'Hard',
			author: {
				name: profile.name,
				avatar: profile.avatar
			},
			rating: 4.6
		},
		{
			id: 'gulab-jamun',
			title: 'Gulab Jamun',
			description:
				'Soft, spongy milk solids dumplings soaked in rose and cardamom flavored sugar syrup.',
			image: '/images/gulab-jamun.jpg',
			cookTime: 40,
			category: 'Indian',
			difficulty: 'Medium',
			author: {
				name: profile.name,
				avatar: profile.avatar
			},
			rating: 4.7
		},
		{
			id: 'vegetable-samosas',
			title: 'Vegetable Samosas',
			description:
				'Crispy pastry triangles filled with spiced potatoes and peas, deep-fried to golden perfection.',
			image: '/images/samosas.jpg',
			cookTime: 55,
			category: 'Indian',
			difficulty: 'Medium',
			author: {
				name: profile.name,
				avatar: profile.avatar
			},
			rating: 4.5
		}
	];

	const savedRecipes = recipes.slice(0, 2);
	const likedRecipes = recipes.slice(2, 4);

	let activeTab = 'recipes';
	let viewMode = 'grid';

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long'
		}).format(date);
	}

	function toggleFollow() {
		profile.isFollowing = !profile.isFollowing;
		profile.stats.followers += profile.isFollowing ? 1 : -1;
	}

	let hasScrolled = false;

	onMount(() => {
		// You would fetch the profile data here in a real implementation
		console.log('Profile page mounted');

		const handleScroll = () => {
			hasScrolled = window.scrollY > 250;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<title>{profile.name} | OwnChef</title>
	<meta name="description" content={profile.bio} />
</svelte:head>

<div class="profile-page" class:dark={$theme === 'dark'}>
	<!-- Profile Header Section -->
	<div class="profile-header">
		<div class="profile-cover">
			<div class="cover-overlay"></div>
		</div>

		<div class="profile-info-container">
			<div class="profile-info">
				<div class="profile-avatar-container">
					<img src={profile.avatar} alt={profile.name} class="profile-avatar" />
					{#if profile.verified}
						<span class="verified-badge" title="Verified Chef">
							<ChefHat size={16} class="badge-icon" />
						</span>
					{/if}
				</div>

				<div class="profile-details">
					<h1 class="profile-name">{profile.name}</h1>
					<p class="profile-username">@{profile.username}</p>

					<div class="profile-meta">
						{#if profile.location}
							<div class="meta-item">
								<MapPin size={16} class="meta-icon" />
								<span>{profile.location}</span>
							</div>
						{/if}

						<div class="meta-item">
							<Calendar size={16} class="meta-icon" />
							<span>Joined {formatDate(profile.joined)}</span>
						</div>

						{#if profile.website}
							<a
								href={profile.website}
								target="_blank"
								rel="noopener noreferrer"
								class="meta-item website"
							>
								<ExternalLink size={16} class="meta-icon" />
								<span>{profile.website.replace(/(^\w+:|^)\/\//, '')}</span>
							</a>
						{/if}
					</div>

					<p class="profile-bio">{profile.bio}</p>

					<div class="profile-stats">
						<div class="stat-item">
							<span class="stat-value">{profile.stats.recipes}</span>
							<span class="stat-label">Recipes</span>
						</div>
						<div class="stat-item">
							<span class="stat-value">{profile.stats.followers.toLocaleString()}</span>
							<span class="stat-label">Followers</span>
						</div>
						<div class="stat-item">
							<span class="stat-value">{profile.stats.following.toLocaleString()}</span>
							<span class="stat-label">Following</span>
						</div>
						<div class="stat-item">
							<span class="stat-value">{profile.stats.likes.toLocaleString()}</span>
							<span class="stat-label">Likes</span>
						</div>
					</div>
				</div>

				<div class="profile-actions">
					{#if profile.isOwnProfile}
						<a href="/settings/profile" class="edit-profile-button">
							<Settings size={18} class="button-icon" />
							Edit Profile
						</a>
					{:else}
						<button
							class="follow-button"
							class:following={profile.isFollowing}
							on:click={toggleFollow}
						>
							<Users size={18} class="button-icon" />
							{profile.isFollowing ? 'Following' : 'Follow'}
						</button>
					{/if}
				</div>
			</div>

			<div class="social-links">
				{#if profile.social.instagram}
					<a
						href={`https://instagram.com/${profile.social.instagram}`}
						target="_blank"
						rel="noopener noreferrer"
						class="social-link instagram"
						aria-label="Instagram"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="social-icon"
						>
							<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
							<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
							<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
						</svg>
					</a>
				{/if}

				{#if profile.social.youtube}
					<a
						href={`https://youtube.com/@${profile.social.youtube}`}
						target="_blank"
						rel="noopener noreferrer"
						class="social-link youtube"
						aria-label="YouTube"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="social-icon"
						>
							<path
								d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
							></path>
							<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
						</svg>
					</a>
				{/if}

				{#if profile.social.tiktok}
					<a
						href={`https://tiktok.com/@${profile.social.tiktok}`}
						target="_blank"
						rel="noopener noreferrer"
						class="social-link tiktok"
						aria-label="TikTok"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="social-icon"
						>
							<path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
							<path d="M14 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
							<path d="M8 8v8"></path>
							<path d="M16 16V8a4 4 0 0 0-4-4"></path>
							<path d="M16 8h4"></path>
						</svg>
					</a>
				{/if}
			</div>
		</div>
	</div>

	<!-- Sticky Navigation -->
	<div class="profile-navigation" class:sticky={hasScrolled}>
		<div class="navigation-tabs">
			<button
				class="nav-tab"
				class:active={activeTab === 'recipes'}
				on:click={() => (activeTab = 'recipes')}
			>
				<UtensilsCrossed size={18} class="tab-icon" />
				<span>Recipes</span>
				<span class="tab-count">{profile.stats.recipes}</span>
			</button>

			<button
				class="nav-tab"
				class:active={activeTab === 'saved'}
				on:click={() => (activeTab = 'saved')}
			>
				<BookOpen size={18} class="tab-icon" />
				<span>Saved</span>
				<span class="tab-count">{savedRecipes.length}</span>
			</button>

			<button
				class="nav-tab"
				class:active={activeTab === 'liked'}
				on:click={() => (activeTab = 'liked')}
			>
				<Heart size={18} class="tab-icon" />
				<span>Liked</span>
				<span class="tab-count">{likedRecipes.length}</span>
			</button>
		</div>

		<div class="view-toggles">
			<button
				class="view-toggle"
				class:active={viewMode === 'grid'}
				on:click={() => (viewMode = 'grid')}
				aria-label="Grid view"
			>
				<Grid size={18} />
			</button>
			<button
				class="view-toggle"
				class:active={viewMode === 'list'}
				on:click={() => (viewMode = 'list')}
				aria-label="List view"
			>
				<List size={18} />
			</button>
		</div>
	</div>

	<!-- Recipe Content -->
	<div class="profile-content">
		{#if activeTab === 'recipes'}
			<div class="tab-header">
				<h2 class="tab-title">Recipes by {profile.name}</h2>
				<div class="tab-filters">
					<select class="filter-select">
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
						<option value="popular">Most Popular</option>
					</select>
				</div>
			</div>

			{#if recipes.length > 0}
				<div class="recipes-grid" class:list-view={viewMode === 'list'}>
					{#each recipes as recipe}
						<Card {recipe} />
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<div class="empty-icon">
						<UtensilsCrossed size={48} class="text-gray-300 dark:text-gray-600" />
					</div>
					<h3 class="empty-title">No recipes yet</h3>
					<p class="empty-message">
						{profile.isOwnProfile
							? "You haven't added any recipes yet. Share your first recipe!"
							: `${profile.name} hasn't added any recipes yet.`}
					</p>
					{#if profile.isOwnProfile}
						<a href="/write" class="empty-action">Add Recipe</a>
					{/if}
				</div>
			{/if}
		{:else if activeTab === 'saved'}
			<div class="tab-header">
				<h2 class="tab-title">Saved Recipes</h2>
			</div>

			{#if savedRecipes.length > 0}
				<div class="recipes-grid" class:list-view={viewMode === 'list'}>
					{#each savedRecipes as recipe}
						<Card {recipe} />
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<div class="empty-icon">
						<BookOpen size={48} class="text-gray-300 dark:text-gray-600" />
					</div>
					<h3 class="empty-title">No saved recipes</h3>
					<p class="empty-message">
						{profile.isOwnProfile
							? "You haven't saved any recipes yet. Browse recipes and save your favorites!"
							: `${profile.name} hasn't saved any recipes yet.`}
					</p>
					{#if profile.isOwnProfile}
						<a href="/recipes" class="empty-action">Browse Recipes</a>
					{/if}
				</div>
			{/if}
		{:else if activeTab === 'liked'}
			<div class="tab-header">
				<h2 class="tab-title">Liked Recipes</h2>
			</div>

			{#if likedRecipes.length > 0}
				<div class="recipes-grid" class:list-view={viewMode === 'list'}>
					{#each likedRecipes as recipe}
						<Card {recipe} />
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<div class="empty-icon">
						<Heart size={48} class="text-gray-300 dark:text-gray-600" />
					</div>
					<h3 class="empty-title">No liked recipes</h3>
					<p class="empty-message">
						{profile.isOwnProfile
							? "You haven't liked any recipes yet. Like recipes to show your appreciation!"
							: `${profile.name} hasn't liked any recipes yet.`}
					</p>
					{#if profile.isOwnProfile}
						<a href="/recipes" class="empty-action">Browse Recipes</a>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style lang="postcss">
	.profile-page {
		@apply pb-16;
	}

	/* Profile Header Styles */
	.profile-header {
		@apply relative mb-6;
	}

	.profile-cover {
		@apply relative h-48 w-full overflow-hidden bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 sm:h-64;
	}

	.cover-overlay {
		@apply absolute inset-0 bg-black/20;
	}

	.profile-info-container {
		@apply relative mx-auto max-w-7xl px-4;
	}

	.profile-info {
		@apply -mt-16 grid grid-cols-1 gap-6 sm:-mt-24 sm:grid-cols-[auto_1fr_auto];
	}

	.profile-avatar-container {
		@apply relative;
	}

	.profile-avatar {
		@apply h-32 w-32 rounded-full border-4 border-white object-cover shadow-md sm:h-40 sm:w-40 dark:border-gray-800;
	}

	.verified-badge {
		@apply absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white;
	}

	.badge-icon {
		@apply h-4 w-4;
	}

	.profile-details {
		@apply pt-4 sm:pt-8;
	}

	.profile-name {
		@apply mb-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white;
	}

	.profile-username {
		@apply mb-4 text-gray-600 dark:text-gray-400;
	}

	.profile-meta {
		@apply mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400;
	}

	.meta-item {
		@apply flex items-center gap-1.5;
	}

	.meta-icon {
		@apply text-gray-500 dark:text-gray-500;
	}

	.meta-item.website {
		@apply text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300;
	}

	.profile-bio {
		@apply mb-4 text-gray-700 dark:text-gray-300;
	}

	.profile-stats {
		@apply flex flex-wrap gap-6;
	}

	.stat-item {
		@apply flex flex-col;
	}

	.stat-value {
		@apply font-bold text-gray-900 dark:text-white;
	}

	.stat-label {
		@apply text-sm text-gray-500 dark:text-gray-400;
	}

	.profile-actions {
		@apply flex gap-4 pt-4 sm:pt-8;
	}

	.edit-profile-button,
	.follow-button {
		@apply flex items-center gap-2 rounded-full px-6 py-2 font-medium transition-all;
	}

	.edit-profile-button {
		@apply bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700;
	}

	.follow-button {
		@apply bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/20;
	}

	.follow-button.following {
		@apply bg-gray-100 bg-none text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700;
	}

	.button-icon {
		@apply h-4 w-4;
	}

	.social-links {
		@apply mt-6 flex justify-center gap-4 border-t border-gray-200 pt-6 sm:justify-end dark:border-gray-700;
	}

	.social-link {
		@apply flex h-10 w-10 items-center justify-center rounded-full transition-all;
	}

	.social-icon {
		@apply h-5 w-5;
	}

	.social-link.instagram {
		@apply text-[#d62976] hover:bg-[#d62976]/10;
	}

	.social-link.youtube {
		@apply text-[#FF0000] hover:bg-[#FF0000]/10;
	}

	.social-link.tiktok {
		@apply text-[#000000] hover:bg-[#000000]/10 dark:text-[#ffffff] dark:hover:bg-[#ffffff]/10;
	}

	/* Navigation Styles */
	.profile-navigation {
		@apply mb-6 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800;
	}

	.profile-navigation.sticky {
		position: sticky;
		top: 0;
		z-index: 40;
		@apply shadow-sm;
	}

	.navigation-tabs {
		@apply flex overflow-x-auto;
	}

	.nav-tab {
		@apply flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white;
	}

	.nav-tab.active {
		@apply border-b-2 border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400;
	}

	.tab-icon {
		@apply h-4 w-4;
	}

	.tab-count {
		@apply ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300;
	}

	.view-toggles {
		@apply flex rounded-lg border border-gray-200 p-1 dark:border-gray-700;
	}

	.view-toggle {
		@apply rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white;
	}

	.view-toggle.active {
		@apply bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white;
	}

	/* Content Styles */
	.profile-content {
		@apply mx-auto max-w-7xl px-4;
	}

	.tab-header {
		@apply mb-6 flex flex-wrap items-center justify-between gap-4;
	}

	.tab-title {
		@apply text-xl font-bold text-gray-900 dark:text-white;
	}

	.tab-filters {
		@apply flex gap-4;
	}

	.filter-select {
		@apply rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white;
	}

	.recipes-grid {
		@apply grid gap-6 sm:grid-cols-2 lg:grid-cols-3;
	}

	.recipes-grid.list-view {
		@apply grid-cols-1;
	}

	/* Empty State Styles */
	.empty-state {
		@apply flex flex-col items-center justify-center rounded-lg bg-white py-16 text-center shadow-sm dark:bg-gray-800;
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
		@apply rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 font-medium text-white transition-all hover:shadow-lg hover:shadow-orange-500/20;
	}

	/* Media Queries */
	@media (max-width: 768px) {
		.profile-info {
			@apply grid-cols-1;
		}

		.profile-avatar {
			@apply mx-auto;
		}

		.profile-details {
			@apply text-center;
		}

		.profile-meta {
			@apply justify-center;
		}

		.profile-stats {
			@apply justify-center;
		}

		.profile-actions {
			@apply justify-center;
		}
	}
</style>
