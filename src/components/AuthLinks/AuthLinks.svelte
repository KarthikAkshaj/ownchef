<!-- src/components/AuthLinks/AuthLinks.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '$lib/auth';
</script>

{#if !$page.data.session}
	<a href="/login" class="login-btn">
		<span>Login</span>
		<div class="shine"></div>
	</a>
{:else}
	<a href="/write" class="auth-link"> Add Recipe </a>
	<button class="auth-link" on:click={signOut}> Logout </button>
{/if}

<style lang="postcss">
	.login-btn {
		@apply relative flex items-center justify-center overflow-hidden rounded-full px-6 py-2;
		@apply bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-[length:200%_100%];
		@apply text-sm font-semibold text-white;
		@apply transition-all duration-300;
		@apply hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25;
		animation: gradient 3s linear infinite;
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

	.auth-link {
		@apply rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600;
	}

	button.auth-link {
		@apply cursor-pointer border-0;
	}
</style>
