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
	import type { PageData } from './$types';

	// Get data from server
	export let data: PageData;

	// Destructure data from server
	const { profile, recipes, savedRecipes, likedRecipes } = data;

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
						<a href="/profile/edit" class="edit-profile-button">
							<Settings size={14} class="button-icon" />
							Edit Profile
						</a>
					{:else}
						<button
							class="follow-button"
							class:following={profile.isFollowing}
							on:click={toggleFollow}
						>
							<Users size={14} class="button-icon" />
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
		@apply pb-16 min-h-screen;
		background: linear-gradient(
			to bottom,
			#2A4A47 0%,
			#1A3636 100%
		);
	}

	/* Profile Header Styles */
	.profile-header {
		@apply relative mb-6;
		background: linear-gradient(
			to bottom,
			#1A3636 0%,
			#1A3636 45%,
			#2A4A47 100%
		);
		padding-bottom: 2rem;
	}

	.profile-cover {
		@apply relative h-48 w-full overflow-hidden sm:h-64;
		background: #1A3636;
		position: relative;
	}

	.cover-overlay {
		@apply absolute inset-0;
		background: #1A3636;
	}

	.profile-info-container {
		@apply relative mx-auto max-w-7xl px-4;
		background: linear-gradient(
			to bottom,
			#1A3636 0%,
			#2A4A47 100%
		);
		padding-top: 2rem;
		padding-bottom: 2rem;
	}

	.profile-info {
		@apply -mt-16 grid grid-cols-1 gap-6 sm:-mt-24 sm:grid-cols-[auto_1fr_auto];
	}

	.profile-avatar-container {
		@apply relative;
	}

	.profile-avatar {
		@apply h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40;
		border: 5px solid #EBE0CC;
		box-shadow:
			0 10px 40px rgba(0, 0, 0, 0.3),
			0 0 0 2px rgba(103, 125, 106, 0.2),
			inset 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.profile-avatar:hover {
		transform: scale(1.05);
		box-shadow:
			0 15px 50px rgba(0, 0, 0, 0.4),
			0 0 0 2px rgba(143, 169, 152, 0.4),
			inset 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.verified-badge {
		@apply absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.4);
		border: 2px solid #EBE0CC;
		animation: pulse-glow 2s ease-in-out infinite;
	}

	@keyframes pulse-glow {
		0%, 100% {
			box-shadow: 0 4px 12px rgba(103, 125, 106, 0.4), 0 0 0 0 rgba(143, 169, 152, 0.4);
		}
		50% {
			box-shadow: 0 4px 16px rgba(103, 125, 106, 0.6), 0 0 12px 4px rgba(143, 169, 152, 0.3);
		}
	}

	.badge-icon {
		@apply h-4 w-4;
	}

	.profile-details {
		@apply pt-4 sm:pt-8;
	}

	.profile-name {
		@apply mb-1 text-2xl font-bold sm:text-3xl;
		color: #EBE0CC;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		letter-spacing: -0.02em;
	}

	.profile-username {
		@apply mb-4 text-base;
		color: #D6BD98;
		font-weight: 500;
		opacity: 0.9;
	}

	.profile-meta {
		@apply mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm;
		color: #D6BD98;
	}

	.meta-item {
		@apply flex items-center gap-1.5;
	}

	.meta-icon {
		color: #EBE0CC;
	}

	.meta-item.website {
		color: #D6BD98;
		text-decoration: none;
	}

	.meta-item.website:hover {
		color: #EBE0CC;
	}

	.profile-bio {
		@apply mb-4 text-base leading-relaxed;
		color: rgba(235, 224, 204, 0.95);
		max-width: 600px;
		line-height: 1.6;
	}

	.profile-stats {
		@apply flex flex-wrap gap-6;
	}

	.stat-item {
		@apply flex flex-col;
		transition: transform 0.2s ease;
		cursor: pointer;
	}

	.stat-item:hover {
		transform: translateY(-2px);
	}

	.stat-value {
		@apply text-xl font-bold sm:text-2xl;
		color: #EBE0CC;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
		background: linear-gradient(135deg, #EBE0CC, #D6BD98);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.stat-label {
		@apply text-sm font-medium;
		color: rgba(214, 189, 152, 0.8);
		letter-spacing: 0.02em;
	}

	.profile-actions {
		@apply flex gap-4 pt-4 sm:pt-8;
	}

	.edit-profile-button,
	.follow-button {
		@apply flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium transition-all;
		line-height: 1;
	}

	.edit-profile-button {
		background: rgba(235, 224, 204, 0.15);
		color: #EBE0CC;
		border: 1px solid rgba(235, 224, 204, 0.3);
	}

	.edit-profile-button:hover {
		background: rgba(235, 224, 204, 0.25);
	}

	.follow-button {
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
		box-shadow: 0 4px 16px rgba(103, 125, 106, 0.4);
		position: relative;
		overflow: hidden;
	}

	.follow-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s ease;
	}

	.follow-button:hover::before {
		left: 100%;
	}

	.follow-button:hover {
		box-shadow: 0 8px 24px rgba(143, 169, 152, 0.5);
		transform: translateY(-2px);
	}

	.follow-button.following {
		background: rgba(235, 224, 204, 0.15);
		color: #EBE0CC;
		border: 2px solid rgba(235, 224, 204, 0.4);
	}

	.follow-button.following:hover {
		background: rgba(235, 224, 204, 0.25);
		border-color: rgba(235, 224, 204, 0.6);
	}

	.button-icon {
		@apply h-3.5 w-3.5;
	}

	.social-links {
		@apply mt-6 flex justify-center gap-4 pt-6 sm:justify-end;
		border-top: 1px solid rgba(103, 125, 106, 0.2);
	}

	.social-link {
		@apply flex h-10 w-10 items-center justify-center rounded-full transition-all;
		background: rgba(235, 224, 204, 0.1);
		border: 1px solid rgba(235, 224, 204, 0.2);
	}

	.social-link:hover {
		transform: translateY(-3px) scale(1.1);
		box-shadow: 0 6px 20px rgba(103, 125, 106, 0.3);
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
		@apply mb-6 flex items-center justify-between px-4 py-2;
		background: #1A3636;
		backdrop-filter: blur(10px);
		border-bottom: 2px solid rgba(143, 169, 152, 0.2);
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
	}

	.profile-navigation.sticky {
		position: sticky;
		top: 0;
		z-index: 40;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
	}

	.navigation-tabs {
		@apply flex overflow-x-auto;
	}

	.nav-tab {
		@apply flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors;
		color: rgba(214, 189, 152, 0.7);
	}

	.nav-tab:hover {
		color: #EBE0CC;
	}

	.nav-tab.active {
		@apply border-b-2;
		border-color: #8FA998;
		color: #EBE0CC;
	}

	.tab-icon {
		@apply h-4 w-4;
	}

	.tab-count {
		@apply ml-1 rounded-full px-2 py-0.5 text-xs;
		background: rgba(143, 169, 152, 0.2);
		color: #D6BD98;
	}

	.view-toggles {
		@apply flex rounded-lg p-1;
		border: 1px solid rgba(143, 169, 152, 0.3);
		background: rgba(26, 54, 54, 0.5);
	}

	.view-toggle {
		@apply rounded-md p-1.5 transition-colors;
		color: rgba(214, 189, 152, 0.7);
	}

	.view-toggle:hover {
		background: rgba(143, 169, 152, 0.2);
		color: #EBE0CC;
	}

	.view-toggle.active {
		background: rgba(143, 169, 152, 0.3);
		color: #EBE0CC;
	}

	/* Content Styles */
	.profile-content {
		@apply mx-auto max-w-7xl px-4;
	}

	.tab-header {
		@apply mb-6 flex flex-wrap items-center justify-between gap-4;
	}

	.tab-title {
		@apply text-xl font-bold;
		color: #EBE0CC;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.tab-filters {
		@apply flex gap-4;
	}

	.filter-select {
		@apply rounded-lg px-3 py-2 text-sm focus:outline-none;
		background: rgba(26, 54, 54, 0.6);
		border: 1px solid rgba(143, 169, 152, 0.3);
		color: #EBE0CC;
	}

	.filter-select:focus {
		border-color: #8FA998;
		box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.25);
		background: rgba(26, 54, 54, 0.8);
	}

	.recipes-grid {
		@apply grid gap-6 sm:grid-cols-2 lg:grid-cols-3;
	}

	.recipes-grid.list-view {
		@apply grid-cols-1;
	}

	/* Empty State Styles */
	.empty-state {
		@apply flex flex-col items-center justify-center rounded-2xl py-16 text-center;
		background: rgba(26, 54, 54, 0.6);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(143, 169, 152, 0.2);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.empty-icon {
		@apply mb-4;
		color: #8FA998;
	}

	.empty-title {
		@apply mb-2 text-xl font-semibold;
		color: #EBE0CC;
	}

	.empty-message {
		@apply mb-6 max-w-md;
		color: rgba(214, 189, 152, 0.9);
	}

	.empty-action {
		@apply rounded-full px-6 py-2 font-medium transition-all no-underline;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.4);
	}

	.empty-action:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(143, 169, 152, 0.6);
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
