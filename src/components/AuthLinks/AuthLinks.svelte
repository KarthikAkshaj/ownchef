<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '$lib/auth';
	import { slide } from 'svelte/transition';
	import { clickOutside } from '$lib/utils/clickOutside';
	import { User, Settings, LogOut, ChevronDown } from 'lucide-svelte';

	let isUserMenuOpen = false;
	let suppressHover = false;
	let closeTimeout: ReturnType<typeof setTimeout> | null = null;

	function toggleUserMenu() {
		isUserMenuOpen = !isUserMenuOpen;
		suppressHover = true;
		setTimeout(() => (suppressHover = false), 300);
	}

	function handleMouseEnter() {
		// Clear any pending close timeout
		if (closeTimeout) {
			clearTimeout(closeTimeout);
			closeTimeout = null;
		}
		if (!suppressHover) isUserMenuOpen = true;
	}

	function handleMouseLeave() {
		// Don't close immediately - wait 200ms
		if (!suppressHover) {
			closeTimeout = setTimeout(() => {
				isUserMenuOpen = false;
				closeTimeout = null;
			}, 200);
		}
	}

	function closeMenu() {
		isUserMenuOpen = false;
	}

	async function handleLogout() {
		closeMenu();
		await signOut();
	}
</script>

{#if !$page.data.session}
	<a href="/login" class="login-btn">
		<span>Login</span>
		<div class="shine"></div>
	</a>
{:else}
	<div class="auth-links-container">
		<a href="/write" class="add-recipe-btn">Add Recipe</a>

		<!-- User Dropdown Menu -->
		<div
			class="user-menu-wrapper"
			role="navigation"
			on:mouseenter={handleMouseEnter}
			on:mouseleave={handleMouseLeave}
		>
			<button
				class="user-menu-button"
				aria-expanded={isUserMenuOpen}
				aria-controls="user-menu"
				aria-haspopup="true"
				on:click={toggleUserMenu}
			>
				<div class="user-avatar">
					{$page.data.user?.username?.charAt(0).toUpperCase() || 'U'}
				</div>
				<span class="user-name">{$page.data.user?.username || 'User'}</span>
				<ChevronDown
					size={16}
					class={`chevron ${isUserMenuOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{#if isUserMenuOpen}
				<div
					id="user-menu"
					class="user-dropdown"
					role="menu"
					tabindex="0"
					on:mouseenter={handleMouseEnter}
					on:mouseleave={handleMouseLeave}
					transition:slide={{ duration: 200 }}
					use:clickOutside={() => {
						if (!suppressHover) isUserMenuOpen = false;
					}}
				>
					<a
						href="/profile/{$page.data.user?.username || ''}"
						class="dropdown-item"
						role="menuitem"
						tabindex="0"
						on:click={closeMenu}
					>
						<User size={16} />
						<span>My Profile</span>
					</a>
					<a
						href="/settings"
						class="dropdown-item"
						role="menuitem"
						tabindex="0"
						on:click={closeMenu}
					>
						<Settings size={16} />
						<span>Settings</span>
					</a>
					<button
						class="dropdown-item logout"
						role="menuitem"
						tabindex="0"
						on:click={handleLogout}
					>
						<LogOut size={16} />
						<span>Logout</span>
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	.login-btn {
		@apply relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2;
		background: linear-gradient(to right, #677D6A, #8FA998, #677D6A);
		background-size: 200% 100%;
		@apply text-sm font-semibold text-white;
		@apply transition-all duration-300;
		animation: gradient 3s linear infinite;
		box-shadow: 0 4px 14px 0 rgba(103, 125, 106, 0.39);
	}

	.login-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 10px 15px -3px rgba(103, 125, 106, 0.25);
	}

	.login-btn .shine {
		@apply absolute inset-0 block;
		background: linear-gradient(
			45deg,
			transparent 0%,
			rgba(255, 255, 255, 0.25) 25%,
			transparent 50%
		);
		animation: shine 3s linear infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	@keyframes shine {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(200%);
		}
	}

	.auth-links-container {
		@apply flex items-center gap-3;
	}

	.add-recipe-btn {
		@apply flex items-center justify-center rounded-full px-5 py-2;
		@apply text-sm font-semibold text-white;
		@apply transition-all duration-300;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		box-shadow: 0 2px 8px 0 rgba(103, 125, 106, 0.3);
	}

	.add-recipe-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px 0 rgba(103, 125, 106, 0.4);
	}

	.logout-btn {
		@apply flex items-center justify-center rounded-full px-5 py-2;
		@apply text-sm font-medium text-[#677D6A] bg-transparent;
		@apply border-2 border-[#677D6A];
		@apply transition-all duration-300 cursor-pointer;
	}

	.logout-btn:hover {
		@apply bg-[#677D6A] text-white;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px 0 rgba(103, 125, 106, 0.3);
	}

	/* User Menu Styles */
	.user-menu-wrapper {
		@apply relative;
		padding-bottom: 0.5rem;
	}

	.user-menu-button {
		@apply flex items-center gap-2 rounded-full px-3 py-1.5;
		@apply bg-transparent border-2 border-[#677D6A];
		@apply text-sm font-medium text-[#677D6A];
		@apply transition-all duration-300 cursor-pointer;
	}

	.user-menu-button:hover {
		@apply bg-[#677D6A] text-white;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px 0 rgba(103, 125, 106, 0.3);
	}

	.user-menu-button:hover .user-avatar {
		@apply bg-white text-[#677D6A];
	}

	.user-avatar {
		@apply flex items-center justify-center w-7 h-7 rounded-full;
		@apply bg-[#677D6A] text-white text-xs font-bold;
		@apply transition-all duration-300;
	}

	.user-name {
		@apply hidden sm:inline-block max-w-[100px] truncate;
	}

	.chevron {
		@apply transition-transform duration-200;
	}

	.user-dropdown {
		@apply absolute right-0 top-full w-48;
		@apply bg-white dark:bg-[#1A3636] rounded-lg shadow-xl;
		@apply border border-gray-200 dark:border-[#2A4A47];
		@apply py-1 z-50;
		margin-top: 0.25rem;
	}

	.dropdown-item {
		@apply flex items-center gap-3 w-full px-4 py-2.5;
		@apply text-sm text-gray-700 dark:text-[#EBE0CC];
		@apply transition-colors duration-200;
		@apply cursor-pointer border-none bg-transparent text-left;
	}

	.dropdown-item:hover {
		@apply bg-gray-100 dark:bg-[#2A4A47];
	}

	.dropdown-item.logout {
		@apply text-red-600 dark:text-red-400;
		@apply border-t border-gray-200 dark:border-[#2A4A47];
		@apply mt-1;
	}

	.dropdown-item.logout:hover {
		@apply bg-red-50 dark:bg-red-900/20;
	}

	:global(.user-menu-button:hover .chevron) {
		@apply text-white;
	}
</style>
