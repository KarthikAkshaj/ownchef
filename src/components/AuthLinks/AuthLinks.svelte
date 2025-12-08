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

	.auth-link {
		@apply rounded-md px-3 py-2 text-sm font-medium text-white transition-colors duration-200;
		background-color: #677D6A;
	}

	.auth-link:hover {
		background-color: #8FA998;
	}

	button.auth-link {
		@apply cursor-pointer border-0;
	}
</style>
