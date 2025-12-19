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
	<div class="auth-links-container">
		<a href="/write" class="add-recipe-btn">Add Recipe</a>
		<button class="logout-btn" on:click={signOut}>Logout</button>
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
</style>
