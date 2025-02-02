<!-- src/components/Navbar/Navbar.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';
	import { clickOutside } from '$lib/utils/clickOutside';
	import {
		Menu,
		X,
		Search,
		ChevronDown,
		Facebook,
		Instagram,
		Twitter,
		Youtube
	} from 'lucide-svelte';
	import ThemeToggle from '../ThemeToggle/ThemeToggle.svelte';
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
		{ id: 'japanese', name: 'Japanese', path: '/category/japanese' }
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
			console.log('Searching for:', searchQuery);
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
	class="fixed z-[100] left-0 right-0 mx-auto mt-4 max-w-[calc(100%-2rem)] rounded-2xl transition-all duration-300"
	class:scrolled={isScrolled}
	class:dark={$theme === 'dark'}
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="logo" on:click={closeMenu}>
				<div class="logo-wrapper">
					<span class="own">Own</span>
					<div class="chef-wrapper">
						<span class="chef" class:dark={$theme === 'dark'}>CHEF</span>
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
				class:dark={$theme === 'dark'}
			>
				<button
					class="nav-link flex items-center gap-1"
					class:dark={$theme === 'dark'}
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
							<a
								href={category.path}
								class="dropdown-item"
								class:active={$page.url.pathname === category.path}
								role="menuitem"
								tabindex="0"
								on:click={() => (isDropdownOpen = false)}
							>
								{category.name}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<a
				href="/blog"
				class="nav-link"
				class:dark={$theme === 'dark'}
				class:active={$page.url.pathname === '/blog'}
			>
				Blog
			</a>
			<a
				href="/about"
				class="nav-link"
				class:dark={$theme === 'dark'}
				class:active={$page.url.pathname === '/about'}
			>
				About
			</a>

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

			<!-- Social Links -->
			<div class="social-links">
				<a href="/" class="social-icon facebook" aria-label="Facebook">
					<Facebook size={18} />
				</a>
				<a href="/" class="social-icon instagram" aria-label="Instagram">
					<Instagram size={18} />
				</a>
				<a href="/" class="social-icon twitter" aria-label="Twitter">
					<Twitter size={18} />
				</a>
				<a href="/" class="social-icon youtube" aria-label="YouTube">
					<Youtube size={18} />
				</a>
			</div>

			<!-- Theme Toggle and Auth -->
			<div class="flex items-center space-x-4">
				<ThemeToggle />
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
			<!-- Mobile Social Links -->
			<div class="mobile-social-links">
				<a href="/" class="social-icon facebook" aria-label="Facebook">
					<Facebook size={20} />
				</a>
				<a href="/" class="social-icon instagram" aria-label="Instagram">
					<Instagram size={20} />
				</a>
				<a href="/" class="social-icon twitter" aria-label="Twitter">
					<Twitter size={20} />
				</a>
				<a href="/" class="social-icon youtube" aria-label="YouTube">
					<Youtube size={20} />
				</a>
			</div>
			<!-- Mobile Auth Links -->
			<div class="mobile-auth-wrapper">
				<AuthLinks />
			</div>
		</div>
	{/if}
</nav>

<style lang="postcss">
	nav {
		@apply shadow-sm backdrop-blur-md;
		background: rgba(255, 255, 255, 0.8);
		left: 50%;
		transform: translateX(-50%);
	}

	nav.scrolled {
		@apply shadow-xl;
	}

	nav.dark {
		background: rgba(17, 17, 17, 0.8);
	}

	.logo {
		@apply relative z-50 transition-all duration-300 hover:-translate-y-0.5;
	}

	.logo-wrapper {
		@apply flex flex-col items-start;
	}

	.own {
		@apply bg-gradient-to-br from-red-500 via-orange-400 to-yellow-500 bg-clip-text text-3xl font-black text-transparent;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	.chef-wrapper {
		@apply relative flex items-center;
	}

	.chef {
		@apply -mt-2 text-xl font-bold tracking-widest text-gray-800 transition-colors duration-300;
	}

	.chef.dark {
		@apply text-gray-100;
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
		@apply text-gray-900 hover:text-orange-500 dark:text-gray-900 dark:hover:text-orange-400;
	}

	.nav-link.active {
		@apply text-orange-500 dark:text-orange-400;
	}

	.nav-link.dark {
		@apply text-gray-100;
		@apply hover:text-orange-400;
	}

	.dropdown-menu {
		@apply absolute left-0 top-full z-[101] mt-1 w-48 rounded-lg py-1 shadow-lg;
		@apply bg-white dark:bg-gray-800;
		@apply border border-gray-100 dark:border-gray-700;
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
		@apply text-gray-900 hover:bg-gray-100 hover:text-orange-500;
		@apply dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-orange-400;
	}

	.dropdown-item:focus {
		@apply outline-none ring-2 ring-orange-500 dark:ring-orange-400;
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
		@apply h-8 w-full rounded-full pl-4 pr-10 text-sm outline-none transition-all duration-300;
		@apply bg-gray-100 dark:bg-gray-800;
		@apply text-gray-900 dark:text-gray-100;
		@apply placeholder-gray-500 dark:placeholder-gray-400;
		opacity: 0;
		pointer-events: none;
	}

	.search-container.open .search-input {
		opacity: 1;
		pointer-events: auto;
	}

	.search-toggle {
		@apply absolute right-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300;
		@apply text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800;
	}

	.social-links {
		@apply hidden items-center space-x-6 md:flex;
	}

	.social-icon {
		@apply flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300;
	}

	.facebook {
		@apply text-[#316FF6] hover:bg-[#316FF6]/10;
	}

	.instagram {
		@apply text-[#d62976] hover:bg-[#d62976]/10;
	}

	.twitter {
		@apply text-[#1DA1F2] hover:bg-[#1DA1F2]/10;
	}

	.youtube {
		@apply text-[#FF0000] hover:bg-[#FF0000]/10;
	}

	.mobile-menu-button {
		@apply flex items-center rounded-lg p-2 transition-colors duration-300 lg:hidden;
		@apply text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800;
	}

	.mobile-menu {
		@apply px-4 pb-3 pt-2 shadow-lg lg:hidden;
		@apply bg-white dark:bg-gray-900;
	}

	.mobile-search {
		@apply px-3 py-2;
	}

	.mobile-search-input {
		@apply w-full rounded-full px-4 py-2;
		@apply bg-gray-100 dark:bg-gray-800;
		@apply text-gray-900 dark:text-gray-100;
		@apply placeholder-gray-500 dark:placeholder-gray-400;
	}

	.mobile-nav-item {
		@apply block px-3 py-2 text-base font-medium transition-colors duration-200;
		@apply text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800;
	}

	.mobile-social-links {
		@apply flex justify-center space-x-6 px-3 py-4;
		@apply border-t border-gray-200 dark:border-gray-700;
	}

	.mobile-auth-wrapper {
		@apply px-3 py-4;
		@apply border-t border-gray-200 dark:border-gray-700;
	}
</style>
