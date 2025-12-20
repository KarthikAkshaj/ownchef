<!-- src/components/Navbar/Navbar.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';
	import { clickOutside } from '$lib/utils/clickOutside';
	import {
		Menu,
		X,
		Search,
		ChevronDown
	} from 'lucide-svelte';
	import AuthLinks from '../AuthLinks/AuthLinks.svelte';

	let isScrolled = false;
	let isMobileMenuOpen = false;
	let isDropdownOpen = false;
	let isSearchOpen = false;
	let searchQuery = '';
	let suppressHover = false;

	// Handle scroll effect
	if (browser) {
		window.addEventListener('scroll', () => {
			isScrolled = window.scrollY > 20;
		});
	}

	const categories = [
		{ id: 'indian', name: 'Indian', path: '/category/indian' },
		{ id: 'chinese', name: 'Chinese', path: '/category/chinese' },
		{ id: 'italian', name: 'Italian', path: '/category/italian' },
		{ id: 'spanish', name: 'Spanish', path: '/category/spanish' },
		{ id: 'thai', name: 'Thai', path: '/category/thai' },
		{ id: 'japanese', name: 'Japanese', path: '/category/japanese' },
		{ id: 'divider', name: '---', path: '' },
		{ id: 'find-ingredients', name: '🔍 Find by Ingredients', path: '/find-by-ingredients' }
	];

	function closeMenu() {
		isMobileMenuOpen = false;
		isDropdownOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (isDropdownOpen && event.key === 'Escape') {
			isDropdownOpen = false;
		}
	}

	function handleSearch() {
		if (searchQuery.trim()) {
			// Navigate to search page with query parameter
			window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
		// Temporarily suppress hover interactions
		suppressHover = true;
		setTimeout(() => (suppressHover = false), 300);
	}

	function handleMouseEnter() {
		if (!suppressHover) isDropdownOpen = true;
	}

	function handleMouseLeave() {
		if (!suppressHover) isDropdownOpen = false;
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<nav
	class="fixed left-0 right-0 z-[100] mx-auto mt-4 max-w-[calc(100%-2rem)] rounded-2xl transition-all duration-300"
	class:scrolled={isScrolled}
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="logo" on:click={closeMenu}>
				<div class="logo-wrapper">
					<span class="own">Own</span>
					<div class="chef-wrapper">
						<span class="chef">CHEF</span>
						<div class="utensils">
							<span class="knife">🔪</span>
							<span class="fork">🍴</span>
						</div>
					</div>
				</div>
			</a>

			<!-- Desktop Navigation -->
			<div
				class="group relative"
				role="navigation"
				on:mouseenter={handleMouseEnter}
				on:mouseleave={handleMouseLeave}
			>
				<button
					class="nav-link flex items-center gap-1"
					aria-expanded={isDropdownOpen}
					aria-controls="categories-menu"
					aria-haspopup="true"
					on:click={toggleDropdown}
				>
					<span>Recipes</span>
					<ChevronDown
						size={16}
						class={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
					/>
				</button>

				{#if isDropdownOpen}
					<div
						id="categories-menu"
						class="dropdown-menu"
						role="menu"
						tabindex="0"
						on:mouseenter={handleMouseEnter}
						on:mouseleave={handleMouseLeave}
						transition:slide={{ duration: 200 }}
						use:clickOutside={() => {
							if (!suppressHover) isDropdownOpen = false;
						}}
					>
						{#each categories as category (category.id)}
							{#if category.id === 'divider'}
								<div class="dropdown-divider"></div>
							{:else}
								<a
									href={category.path}
									class="dropdown-item"
									class:active={$page.url.pathname === category.path}
									class:featured={category.id === 'find-ingredients'}
									role="menuitem"
									tabindex="0"
									on:click={() => (isDropdownOpen = false)}
								>
									{category.name}
								</a>
							{/if}
						{/each}
					</div>
				{/if}
			</div>

			<!-- Search Bar -->
			<div class="search-container" class:open={isSearchOpen}>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search recipes..."
					class="search-input"
					on:keydown={(e) => e.key === 'Enter' && handleSearch()}
				/>
				<button
					class="search-toggle"
					aria-label={isSearchOpen ? 'Close search' : 'Open search'}
					on:click={() => (isSearchOpen = !isSearchOpen)}
				>
					{#if isSearchOpen}
						<X size={20} />
					{:else}
						<Search size={20} />
					{/if}
				</button>
			</div>

			<!-- Auth Links -->
			<div class="flex items-center">
				<AuthLinks />
			</div>
		</div>

		<!-- Mobile Menu Button -->
		<button
			class="mobile-menu-button"
			on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			aria-expanded={isMobileMenuOpen}
			aria-controls="mobile-menu"
			aria-label="Toggle menu"
		>
			{#if isMobileMenuOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if isMobileMenuOpen}
		<div
			class="mobile-menu"
			id="mobile-menu"
			role="navigation"
			transition:slide={{ duration: 200 }}
		>
			<div class="mobile-search">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search recipes..."
					class="mobile-search-input"
					on:keydown={(e) => e.key === 'Enter' && handleSearch()}
				/>
			</div>
			{#each categories as category (category.id)}
				<a
					href={category.path}
					class="mobile-nav-item"
					class:active={$page.url.pathname === category.path}
					on:click={closeMenu}
				>
					{category.name}
				</a>
			{/each}
			<!-- Mobile Auth Links -->
			<div class="mobile-auth-wrapper">
				<AuthLinks />
			</div>
		</div>
	{/if}
</nav>

<style lang="postcss">
	nav {
		@apply backdrop-blur-xl;
		background: rgba(64, 83, 76, 0.3);
		border: 1px solid rgba(143, 169, 152, 0.3);
		box-shadow:
			0 8px 32px rgba(26, 54, 54, 0.15),
			0 2px 8px rgba(26, 54, 54, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		left: 50%;
		transform: translateX(-50%);
	}

	nav::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(
			135deg,
			rgba(143, 169, 152, 0.1) 0%,
			rgba(103, 125, 106, 0.05) 50%,
			rgba(64, 83, 76, 0.1) 100%
		);
		pointer-events: none;
	}

	nav.scrolled {
		@apply backdrop-blur-2xl;
		background: rgba(64, 83, 76, 0.5);
		box-shadow:
			0 12px 40px rgba(26, 54, 54, 0.25),
			0 4px 12px rgba(26, 54, 54, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
		border-color: rgba(143, 169, 152, 0.4);
	}

	.logo {
		@apply relative z-50 transition-all duration-300 hover:-translate-y-0.5;
	}

	.logo-wrapper {
		@apply flex flex-col items-start;
	}

	.own {
		background: linear-gradient(to bottom right, #D6BD98, #E0CEAD, #EBE0CC);
		-webkit-background-clip: text;
		background-clip: text;
		@apply text-3xl font-black text-transparent;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
	}

	.chef-wrapper {
		@apply relative flex items-center;
	}

	.chef {
		@apply -mt-2 text-xl font-bold tracking-widest transition-colors duration-300;
		color: #D6BD98;
	}

	.utensils {
		@apply absolute -right-10 -top-1 flex space-x-2;
	}

	.knife,
	.fork {
		@apply text-lg transition-transform duration-300;
	}

	.logo:hover .knife {
		transform: rotate(-15deg) translateX(-2px);
	}

	.logo:hover .fork {
		transform: rotate(15deg) translateX(2px);
	}

	.nav-link {
		@apply relative px-3 py-2 text-sm font-medium;
		color: #D6BD98;
		transition: color 0.3s ease;
	}

	.nav-link:hover {
		color: #8FA998;
	}

	.dropdown-menu {
		@apply absolute left-0 top-full z-[101] mt-1 w-48 rounded-lg border py-1 backdrop-blur-xl;
		background: rgba(64, 83, 76, 0.85);
		border: 1px solid rgba(143, 169, 152, 0.3);
		box-shadow:
			0 8px 32px rgba(26, 54, 54, 0.2),
			0 2px 8px rgba(26, 54, 54, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		margin-top: 2px;
	}

	.dropdown-menu::before {
		content: '';
		@apply absolute -top-2 left-0 h-2 w-full;
	}

	.group:hover .dropdown-menu {
		display: block;
	}

	.relative {
		@apply z-40;
	}

	.dropdown-item {
		@apply block w-full px-4 py-2 text-left text-sm transition-colors duration-200;
		color: #D6BD98;
	}

	.dropdown-item:hover {
		background-color: #677D6A;
		color: #E0CEAD;
	}

	.dropdown-item:focus {
		@apply outline-none ring-2;
		ring-color: #677D6A;
	}

	.dropdown-item.featured {
		@apply font-semibold;
		background: linear-gradient(135deg, rgba(143, 169, 152, 0.15) 0%, rgba(103, 125, 106, 0.1) 100%);
		border-left: 3px solid #8FA998;
		padding-left: 13px;
	}

	.dropdown-item.featured:hover {
		background: linear-gradient(135deg, rgba(143, 169, 152, 0.25) 0%, rgba(103, 125, 106, 0.2) 100%);
	}

	.dropdown-divider {
		@apply my-1;
		height: 1px;
		background: rgba(143, 169, 152, 0.2);
	}

	.search-container {
		@apply relative flex items-center;
		width: 40px;
		transition: width 0.3s ease;
	}

	.search-container.open {
		width: 220px;
	}

	.search-input {
		@apply h-8 w-full rounded-full pl-4 pr-10 text-sm outline-none transition-all duration-300 backdrop-blur-md;
		background: rgba(26, 54, 54, 0.8);
		border: 1px solid rgba(143, 169, 152, 0.2);
		color: #D6BD98;
		opacity: 0;
		pointer-events: none;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.search-input::placeholder {
		color: rgba(214, 189, 152, 0.5);
	}

	.search-input:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.1),
			0 0 0 3px rgba(143, 169, 152, 0.15);
	}

	.search-container.open .search-input {
		opacity: 1;
		pointer-events: auto;
	}

	.search-toggle {
		@apply absolute right-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300;
		color: #D6BD98;
	}

	.search-toggle:hover {
		background-color: #677D6A;
	}

	.mobile-menu-button {
		@apply flex items-center rounded-lg p-2 transition-colors duration-300 lg:hidden;
		color: #D6BD98;
	}

	.mobile-menu-button:hover {
		background-color: #677D6A;
	}

	.mobile-menu {
		@apply px-4 pb-3 pt-2 backdrop-blur-xl lg:hidden;
		background: rgba(64, 83, 76, 0.9);
		border-top: 1px solid rgba(143, 169, 152, 0.2);
		box-shadow:
			0 8px 32px rgba(26, 54, 54, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.mobile-search {
		@apply px-3 py-2;
	}

	.mobile-search-input {
		@apply w-full rounded-full px-4 py-2 backdrop-blur-md;
		background: rgba(26, 54, 54, 0.8);
		border: 1px solid rgba(143, 169, 152, 0.2);
		color: #D6BD98;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.mobile-search-input::placeholder {
		color: rgba(214, 189, 152, 0.5);
	}

	.mobile-search-input:focus {
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.1),
			0 0 0 3px rgba(143, 169, 152, 0.15);
		outline: none;
	}

	.mobile-nav-item {
		@apply block px-3 py-2 text-base font-medium transition-colors duration-200;
		color: #D6BD98;
	}

	.mobile-nav-item:hover {
		background-color: #677D6A;
	}

	.mobile-auth-wrapper {
		@apply border-t px-3 py-4;
		border-color: #677D6A;
	}
</style>
