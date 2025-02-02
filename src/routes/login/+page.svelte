<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { enhance } from '$app/forms';
	import { signIn } from '$lib/auth';
	import { Github, Mail, Facebook, AlertCircle } from 'lucide-svelte';

	let username = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleSubmit() {
		loading = true;
		error = '';

		const result = await signIn(username, password);

		if (!result.success) {
			error = result.error || 'Authentication failed';
		}

		loading = false;
	}
</script>

<div class="login-container" class:dark={$theme === 'dark'}>
	<div class="login-content">
		<!-- Logo Section -->
		<div class="logo-section">
			<span class="own">Own</span>
			<span class="chef">CHEF</span>
		</div>

		<h1 class="title">Welcome Back!</h1>
		<p class="subtitle">Sign in to create, discover and share amazing recipes</p>

		{#if error}
			<div class="error-message">
				<AlertCircle size={20} />
				<span>{error}</span>
			</div>
		{/if}

		<!-- Social Login Buttons -->
		<div class="social-buttons">
			<button class="social-btn google">
				<img src="/google.svg" alt="Google" class="h-5 w-5" />
				<span>Continue with Google</span>
			</button>

			<button class="social-btn github">
				<Github class="h-5 w-5" />
				<span>Continue with Github</span>
			</button>

			<button class="social-btn facebook">
				<Facebook class="h-5 w-5" />
				<span>Continue with Facebook</span>
			</button>
		</div>

		<div class="divider">
			<span>or</span>
		</div>

		<button class="email-btn" on:click={() => document.getElementById('usernameInput')?.focus()}>
			<Mail class="h-5 w-5" />
			<span>Continue with Email</span>
		</button>

		<!-- Hidden email login form that shows when email button is clicked -->
		<form class="email-form" on:submit|preventDefault={handleSubmit}>
			<input
				id="usernameInput"
				type="text"
				bind:value={username}
				placeholder="Username"
				class="form-input"
				required
			/>
			<input
				type="password"
				bind:value={password}
				placeholder="Password"
				class="form-input"
				required
			/>
			<button type="submit" class="submit-btn" disabled={loading}>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>

		<p class="terms">
			By continuing, you agree to our
			<a href="/terms" class="link">Terms of Service</a> and
			<a href="/privacy" class="link">Privacy Policy</a>
		</p>
	</div>
</div>

<style lang="postcss">
	.login-container {
		@apply flex min-h-screen items-center justify-center shadow-xl;
		background-image: radial-gradient(
				circle at 10% 20%,
				rgba(255, 107, 107, 0.05) 0%,
				transparent 50%
			),
			radial-gradient(circle at 90% 80%, rgba(255, 179, 107, 0.05) 0%, transparent 50%);
	}

	.login-content {
		@apply w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800;
		@apply transform transition-all duration-300;
	}

	.logo-section {
		@apply mb-8 flex items-baseline justify-center;
	}

	.own {
		@apply bg-gradient-to-br from-red-500 via-orange-400 to-yellow-500 bg-clip-text text-3xl font-black text-transparent;
	}

	.chef {
		@apply ml-1 text-2xl font-bold tracking-wider text-gray-800 dark:text-white;
	}

	.title {
		@apply mb-2 text-center text-2xl font-bold text-gray-800 dark:text-white;
	}

	.subtitle {
		@apply mb-8 text-center text-gray-600 dark:text-gray-300;
	}

	.error-message {
		@apply mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400;
	}

	.social-buttons {
		@apply mb-6 flex flex-col gap-3;
	}

	.social-btn {
		@apply flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium;
		@apply transition-all duration-300;
	}

	.social-btn.google {
		@apply border-gray-200 bg-white text-gray-700 hover:bg-gray-50;
		@apply dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600;
	}

	.social-btn.github {
		@apply bg-[#24292F] text-white hover:bg-[#24292F]/90;
	}

	.social-btn.facebook {
		@apply bg-[#1877F2] text-white hover:bg-[#1877F2]/90;
	}

	.divider {
		@apply my-6 flex items-center;
	}

	.divider::before,
	.divider::after {
		content: '';
		@apply flex-1 border-t border-gray-200 dark:border-gray-700;
	}

	.divider span {
		@apply px-3 text-sm text-gray-500 dark:text-gray-400;
	}

	.email-btn {
		@apply flex w-full items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium;
		@apply bg-gradient-to-r from-orange-500 to-red-500 text-white;
		@apply hover:from-orange-600 hover:to-red-600;
		@apply transition-all duration-300;
	}

	.email-form {
		@apply mt-4 space-y-3;
	}

	.form-input {
		@apply w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm;
		@apply focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20;
		@apply dark:border-gray-700 dark:bg-gray-700 dark:text-white;
	}

	.submit-btn {
		@apply w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white;
		@apply hover:bg-orange-600 disabled:opacity-50;
		@apply transition-all duration-300;
	}

	.terms {
		@apply mt-6 text-center text-sm text-gray-500 dark:text-gray-400;
	}

	.link {
		@apply text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500;
	}
</style>
