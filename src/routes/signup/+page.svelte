<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import {
		User,
		Lock,
		Eye,
		EyeOff,
		ArrowRight,
		AlertCircle,
		Loader2,
		CheckCircle,
		Sparkles,
		Coffee,
		Heart,
		Mail,
		Shield,
		UserPlus
	} from 'lucide-svelte';
	import { fade, fly, scale, blur, slide } from 'svelte/transition';
	import { quintOut, backOut, elasticOut } from 'svelte/easing';

	// ========================================
	// STATE MANAGEMENT
	// ========================================

	interface SignupForm {
		username: string;
		password: string;
		confirmPassword: string;
		acceptTerms: boolean;
	}

	let form: SignupForm = {
		username: '',
		password: '',
		confirmPassword: '',
		acceptTerms: false
	};

	let showPassword = false;
	let showConfirmPassword = false;
	let isSubmitting = false;
	let error = '';
	let success = false;
	let inputFocused = {
		username: false,
		password: false,
		confirmPassword: false
	};

	// Form validation
	let errors: Record<string, string> = {};
	let touched: Record<string, boolean> = {};

	// ========================================
	// REACTIVE STATEMENTS
	// ========================================

	$: isValidUsername = form.username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(form.username);
	$: isValidPassword = form.password.length >= 6;
	$: passwordsMatch = form.password === form.confirmPassword && form.confirmPassword.length > 0;
	$: canSubmit =
		isValidUsername && isValidPassword && passwordsMatch && form.acceptTerms && !isSubmitting;

	// Password strength indicator
	$: passwordStrength = getPasswordStrength(form.password);

	// Real-time validation
	$: if (touched.username) {
		if (!form.username) {
			errors.username = 'Username is required';
		} else if (form.username.length < 3) {
			errors.username = 'Username must be at least 3 characters';
		} else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
			errors.username = 'Username can only contain letters, numbers, and underscores';
		} else {
			delete errors.username;
			errors = { ...errors };
		}
	}

	$: if (touched.password) {
		if (!form.password) {
			errors.password = 'Password is required';
		} else if (form.password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
		} else {
			delete errors.password;
			errors = { ...errors };
		}
	}

	$: if (touched.confirmPassword) {
		if (!form.confirmPassword) {
			errors.confirmPassword = 'Please confirm your password';
		} else if (form.password !== form.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
		} else {
			delete errors.confirmPassword;
			errors = { ...errors };
		}
	}

	// ========================================
	// UTILITY FUNCTIONS
	// ========================================

	function getPasswordStrength(password: string) {
		let score = 0;
		let feedback = [];

		if (password.length >= 8) score += 1;
		else feedback.push('At least 8 characters');

		if (/[A-Z]/.test(password)) score += 1;
		else feedback.push('Add uppercase letters');

		if (/[a-z]/.test(password)) score += 1;
		else feedback.push('Add lowercase letters');

		if (/[0-9]/.test(password)) score += 1;
		else feedback.push('Add numbers');

		if (/[^A-Za-z0-9]/.test(password)) score += 1;
		else feedback.push('Add special characters');

		const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][Math.min(score, 4)];
		const color = ['red', 'red', 'yellow', 'blue', 'green'][Math.min(score, 4)];

		return { score, strength, color, feedback: feedback.slice(0, 2) };
	}

	// ========================================
	// EVENT HANDLERS
	// ========================================

	function handleFocus(field: keyof SignupForm) {
		inputFocused[field] = true;
		touched[field] = true;

		// Clear errors when user focuses
		if (errors[field]) {
			delete errors[field];
			errors = { ...errors };
		}
		if (error) {
			error = '';
		}
	}

	function handleBlur(field: keyof SignupForm) {
		inputFocused[field] = false;
	}

	async function handleSubmit() {
		if (!canSubmit) return;

		// Mark all fields as touched for validation
		touched = { username: true, password: true, confirmPassword: true };

		// Check for validation errors
		if (Object.keys(errors).length > 0) {
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			const response = await fetch('/api/auth', {
				method: 'POST', // POST for registration
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: form.username,
					password: form.password
				})
			});

			const data = await response.json();

			if (response.ok && data.success) {
				success = true;

				// Success animation delay then redirect to profile setup
				setTimeout(() => {
					goto('/profile/setup');
				}, 2000);
			} else {
				error = data.error || 'Registration failed. Please try again.';
			}
		} catch (err) {
			console.error('Signup error:', err);
			error = 'Network error. Please check your connection and try again.';
		} finally {
			isSubmitting = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && canSubmit) {
			handleSubmit();
		}
	}

	// ========================================
	// SOCIAL LOGIN HANDLERS
	// ========================================

	async function handleGoogleLogin() {
		if (isSubmitting) return;
		error = 'Social signup coming soon! Use the form below for now.';
	}

	async function handleGithubLogin() {
		if (isSubmitting) return;
		error = 'Social signup coming soon! Use the form below for now.';
	}

	async function handleDiscordLogin() {
		if (isSubmitting) return;
		error = 'Social signup coming soon! Use the form below for now.';
	}

	// ========================================
	// LIFECYCLE
	// ========================================

	onMount(() => {
		// Auto-focus username field
		const usernameInput = document.getElementById('username') as HTMLInputElement;
		if (usernameInput) {
			usernameInput.focus();
		}

		// Add floating animation to shapes
		const shapes = document.querySelectorAll('.floating-shape');
		shapes.forEach((shape, index) => {
			(shape as HTMLElement).style.animationDelay = `${index * 0.7}s`;
		});
	});
</script>

<svelte:head>
	<title>Sign Up | Recipe App</title>
	<meta
		name="description"
		content="Join Recipe App and start sharing your amazing recipes with the world"
	/>
</svelte:head>

<div class="signup-page" class:dark={$theme === 'dark'}>
	<!-- Animated Background -->
	<div class="bg-animation">
		<div class="floating-shapes">
			{#each Array(10) as _, i}
				<div class="floating-shape shape-{i + 1}"></div>
			{/each}
		</div>
		<div class="gradient-orbs">
			<div class="orb orb-1"></div>
			<div class="orb orb-2"></div>
			<div class="orb orb-3"></div>
			<div class="orb orb-4"></div>
		</div>
	</div>

	<!-- Main Container -->
	<div class="signup-container">
		<!-- Left Side - Branding -->
		<div class="branding-section" in:fly={{ x: -50, duration: 800, easing: quintOut }}>
			<div class="brand-content">
				<!-- Logo -->
				<div class="logo-container" in:scale={{ duration: 600, easing: backOut }}>
					<div class="logo-icon">
						<div class="logo-coffee-wrapper">
							<Coffee class="logo-coffee" />
						</div>
						<div class="logo-sparkle-wrapper">
							<Sparkles class="logo-sparkle" />
						</div>
					</div>
					<div class="logo-text">
						<span class="logo-main">Recipe</span>
						<span class="logo-sub">APP</span>
					</div>
				</div>

				<!-- Brand messaging -->
				<div class="brand-messaging">
					<h1 class="brand-title" in:fly={{ y: 30, duration: 600, delay: 200 }}>
						Join the culinary community
					</h1>

					<p class="brand-subtitle" in:fly={{ y: 30, duration: 600, delay: 300 }}>
						Connect with food lovers worldwide, share your favorite recipes, and discover new
						flavors that will inspire your cooking journey.
					</p>

					<!-- Benefits -->
					<div class="brand-benefits" in:fly={{ y: 30, duration: 600, delay: 400 }}>
						<div class="benefit">
							<div class="benefit-icon-wrapper">
								<Heart class="benefit-icon" />
							</div>
							<div class="benefit-content">
								<span class="benefit-title">Share & Discover</span>
								<span class="benefit-text">Upload recipes and find new favorites</span>
							</div>
						</div>
						<div class="benefit">
							<div class="benefit-icon-wrapper">
								<User class="benefit-icon" />
							</div>
							<div class="benefit-content">
								<span class="benefit-title">Connect</span>
								<span class="benefit-text">Follow your favorite chefs</span>
							</div>
						</div>
						<div class="benefit">
							<div class="benefit-icon-wrapper">
								<Shield class="benefit-icon" />
							</div>
							<div class="benefit-content">
								<span class="benefit-title">100% Free</span>
								<span class="benefit-text">No hidden fees, ever</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Trust indicators -->
				<div class="trust-badges" in:fly={{ y: 20, duration: 600, delay: 500 }}>
					<div class="badge">
						<Shield class="badge-icon" />
						<span>Your data is secure</span>
					</div>
					<div class="badge">
						<CheckCircle class="badge-icon" />
						<span>Join 5K+ chefs</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Side - Signup Form -->
		<div class="form-section" in:fly={{ x: 50, duration: 800, easing: quintOut }}>
			<div class="form-container" in:scale={{ duration: 600, delay: 200, easing: quintOut }}>
				{#if success}
					<!-- Success State -->
					<div class="success-state" in:scale={{ duration: 400, easing: elasticOut }}>
						<div class="success-icon-wrapper">
							<CheckCircle class="success-icon" />
						</div>
						<h3 class="success-title">Account created!</h3>
						<p class="success-message">Setting up your profile...</p>
						<div class="success-loader">
							<div class="loader-bar"></div>
						</div>
					</div>
				{:else}
					<!-- Form Header -->
					<div class="form-header">
						<h2 class="form-title">Create Account</h2>
						<p class="form-subtitle">Start your culinary journey today</p>
					</div>

					<!-- Error Alert -->
					{#if error}
						<div
							class="error-alert"
							in:fly={{ y: -10, duration: 300 }}
							out:fade={{ duration: 200 }}
						>
							<div class="alert-icon-wrapper">
								<AlertCircle class="alert-icon" />
							</div>
							<div class="alert-content">
								<span class="alert-title">Sign up failed</span>
								<span class="alert-message">{error}</span>
							</div>
						</div>
					{/if}

					<!-- Social Login Section -->
					<div class="social-section">
						<div class="social-title" in:fade={{ duration: 400, delay: 200 }}>
							<span>Sign up with</span>
						</div>

						<div class="social-buttons">
							<button
								class="social-btn google"
								on:click={handleGoogleLogin}
								disabled={isSubmitting}
								in:fly={{ y: 20, duration: 400, delay: 300 }}
							>
								<svg class="social-icon" viewBox="0 0 24 24">
									<path
										fill="#4285F4"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="#34A853"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="#FBBC05"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="#EA4335"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								<span>Google</span>
							</button>

							<button
								class="social-btn github"
								on:click={handleGithubLogin}
								disabled={isSubmitting}
								in:fly={{ y: 20, duration: 400, delay: 350 }}
							>
								<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
									/>
								</svg>
								<span>GitHub</span>
							</button>

							<button
								class="social-btn discord"
								on:click={handleDiscordLogin}
								disabled={isSubmitting}
								in:fly={{ y: 20, duration: 400, delay: 400 }}
							>
								<svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0188 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
									/>
								</svg>
								<span>Discord</span>
							</button>
						</div>
					</div>

					<!-- Divider -->
					<div class="auth-divider" in:fade={{ duration: 400, delay: 450 }}>
						<div class="divider-line"></div>
						<span class="divider-text">or create account with username</span>
						<div class="divider-line"></div>
					</div>

					<!-- Signup Form -->
					<form class="signup-form" on:submit|preventDefault={handleSubmit} novalidate>
						<!-- Username Field -->
						<div class="form-group" in:fly={{ y: 20, duration: 400, delay: 500 }}>
							<label for="username" class="form-label">Username</label>
							<div
								class="input-wrapper"
								class:focused={inputFocused.username}
								class:filled={form.username}
								class:error={errors.username}
								class:success={touched.username && !errors.username && form.username}
							>
								<div class="input-icon-wrapper">
									<User class="input-icon" />
								</div>
								<input
									id="username"
									type="text"
									class="form-input"
									bind:value={form.username}
									on:focus={() => handleFocus('username')}
									on:blur={() => handleBlur('username')}
									on:keydown={handleKeydown}
									autocomplete="username"
									autocapitalize="none"
									spellcheck="false"
									placeholder="Choose a username"
									disabled={isSubmitting}
								/>
								{#if touched.username && !errors.username && form.username && isValidUsername}
									<div class="validation-icon success" in:scale={{ duration: 200 }}>
										<CheckCircle />
									</div>
								{/if}
							</div>
							{#if errors.username}
								<span class="error-message" in:fly={{ y: -5, duration: 200 }}
									>{errors.username}</span
								>
							{/if}
						</div>

						<!-- Password Field -->
						<div class="form-group" in:fly={{ y: 20, duration: 400, delay: 600 }}>
							<label for="password" class="form-label">Password</label>
							<div
								class="input-wrapper"
								class:focused={inputFocused.password}
								class:filled={form.password}
								class:error={errors.password}
								class:success={touched.password && !errors.password && form.password}
							>
								<div class="input-icon-wrapper">
									<Lock class="input-icon" />
								</div>
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									class="form-input"
									bind:value={form.password}
									on:focus={() => handleFocus('password')}
									on:blur={() => handleBlur('password')}
									on:keydown={handleKeydown}
									autocomplete="new-password"
									placeholder="Create a strong password"
									disabled={isSubmitting}
								/>
								<button
									type="button"
									class="password-toggle"
									on:click={() => (showPassword = !showPassword)}
									tabindex="-1"
									disabled={isSubmitting}
								>
									<div class="toggle-icon-wrapper">
										{#if showPassword}
											<EyeOff class="toggle-icon" />
										{:else}
											<Eye class="toggle-icon" />
										{/if}
									</div>
								</button>
								{#if touched.password && !errors.password && form.password && isValidPassword}
									<div class="validation-icon success" in:scale={{ duration: 200 }}>
										<CheckCircle />
									</div>
								{/if}
							</div>

							<!-- Password Strength Indicator -->
							{#if form.password}
								<div class="password-strength" in:slide={{ duration: 200 }}>
									<div class="strength-bar">
										<div
											class="strength-fill strength-{passwordStrength.color}"
											style="width: {(passwordStrength.score / 4) * 100}%"
										></div>
									</div>
									<div class="strength-info">
										<span class="strength-label strength-{passwordStrength.color}">
											{passwordStrength.strength}
										</span>
										{#if passwordStrength.feedback.length > 0}
											<span class="strength-tips">
												{passwordStrength.feedback.join(', ')}
											</span>
										{/if}
									</div>
								</div>
							{/if}

							{#if errors.password}
								<span class="error-message" in:fly={{ y: -5, duration: 200 }}
									>{errors.password}</span
								>
							{/if}
						</div>

						<!-- Confirm Password Field -->
						<div class="form-group" in:fly={{ y: 20, duration: 400, delay: 700 }}>
							<label for="confirmPassword" class="form-label">Confirm Password</label>
							<div
								class="input-wrapper"
								class:focused={inputFocused.confirmPassword}
								class:filled={form.confirmPassword}
								class:error={errors.confirmPassword}
								class:success={touched.confirmPassword &&
									!errors.confirmPassword &&
									form.confirmPassword &&
									passwordsMatch}
							>
								<div class="input-icon-wrapper">
									<Lock class="input-icon" />
								</div>
								<input
									id="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									class="form-input"
									bind:value={form.confirmPassword}
									on:focus={() => handleFocus('confirmPassword')}
									on:blur={() => handleBlur('confirmPassword')}
									on:keydown={handleKeydown}
									autocomplete="new-password"
									placeholder="Confirm your password"
									disabled={isSubmitting}
								/>
								<button
									type="button"
									class="password-toggle"
									on:click={() => (showConfirmPassword = !showConfirmPassword)}
									tabindex="-1"
									disabled={isSubmitting}
								>
									<div class="toggle-icon-wrapper">
										{#if showConfirmPassword}
											<EyeOff class="toggle-icon" />
										{:else}
											<Eye class="toggle-icon" />
										{/if}
									</div>
								</button>
								{#if touched.confirmPassword && !errors.confirmPassword && form.confirmPassword && passwordsMatch}
									<div class="validation-icon success" in:scale={{ duration: 200 }}>
										<CheckCircle />
									</div>
								{/if}
							</div>
							{#if errors.confirmPassword}
								<span class="error-message" in:fly={{ y: -5, duration: 200 }}
									>{errors.confirmPassword}</span
								>
							{/if}
						</div>

						<!-- Terms & Conditions -->
						<div class="form-group" in:fly={{ y: 20, duration: 400, delay: 800 }}>
							<label class="terms-wrapper">
								<input
									type="checkbox"
									bind:checked={form.acceptTerms}
									class="terms-input"
									disabled={isSubmitting}
								/>
								<span class="terms-custom"></span>
								<span class="terms-label">
									I agree to the <a href="/terms" class="terms-link">Terms of Service</a> and
									<a href="/privacy" class="terms-link">Privacy Policy</a>
								</span>
							</label>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							class="submit-btn"
							class:loading={isSubmitting}
							disabled={!canSubmit}
							in:fly={{ y: 20, duration: 400, delay: 900 }}
						>
							<div class="btn-content">
								{#if isSubmitting}
									<div class="btn-icon spinning">
										<Loader2 />
									</div>
									<span>Creating account...</span>
								{:else}
									<div class="btn-icon">
										<UserPlus />
									</div>
									<span>Create Account</span>
								{/if}
							</div>
						</button>
					</form>

					<!-- Sign In Link -->
					<div class="signin-section" in:fly={{ y: 20, duration: 400, delay: 1000 }}>
						<p class="signin-text">
							Already have an account? <a href="/login" class="signin-link">Sign in here</a>
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	/* Global Styles */
	.signup-page {
		@apply relative min-h-screen overflow-x-hidden;
		background: linear-gradient(135deg, #E0CEAD 0%, #EBE0CC 50%, #B5C9BD 100%);
	}

	.signup-page.dark {
		background: linear-gradient(135deg, #1A3636 0%, #40534C 50%, #677D6A 100%);
	}

	/* Animated Background */
	.bg-animation {
		@apply pointer-events-none absolute inset-0 overflow-hidden;
	}

	.floating-shapes {
		@apply relative h-full w-full;
	}

	.floating-shape {
		@apply absolute rounded-full opacity-5;
		animation: float 30s infinite linear;
	}

	.shape-1 {
		@apply h-32 w-32;
		background-color: #677D6A;
		top: 5%;
		left: 10%;
		animation-duration: 35s;
	}

	.shape-2 {
		@apply h-24 w-24;
		background-color: #8FA998;
		top: 15%;
		right: 15%;
		animation-duration: 40s;
		animation-direction: reverse;
	}

	.shape-3 {
		@apply h-40 w-40;
		background-color: #B5C9BD;
		bottom: 25%;
		left: 20%;
		animation-duration: 45s;
	}

	.shape-4 {
		@apply h-20 w-20;
		background-color: #D6BD98;
		top: 50%;
		right: 25%;
		animation-duration: 30s;
		animation-direction: reverse;
	}

	.shape-5 {
		@apply h-36 w-36;
		background-color: #E0CEAD;
		bottom: 10%;
		right: 10%;
		animation-duration: 50s;
	}

	.shape-6 {
		@apply h-28 w-28;
		background-color: #677D6A;
		top: 35%;
		left: 5%;
		animation-duration: 35s;
		animation-direction: reverse;
	}

	.shape-7 {
		@apply h-16 w-16;
		background-color: #8FA998;
		top: 75%;
		left: 35%;
		animation-duration: 32s;
	}

	.shape-8 {
		@apply h-44 w-44;
		background-color: #B5C9BD;
		top: 8%;
		right: 40%;
		animation-duration: 55s;
		animation-direction: reverse;
	}

	.shape-9 {
		@apply h-20 w-20;
		background-color: #D6BD98;
		bottom: 40%;
		left: 45%;
		animation-duration: 38s;
	}

	.shape-10 {
		@apply h-16 w-16;
		background-color: #E0CEAD;
		top: 60%;
		right: 5%;
		animation-duration: 42s;
		animation-direction: reverse;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg) scale(1);
		}
		25% {
			transform: translateY(-30px) rotate(90deg) scale(1.1);
		}
		50% {
			transform: translateY(0px) rotate(180deg) scale(0.9);
		}
		75% {
			transform: translateY(30px) rotate(270deg) scale(1.05);
		}
	}

	.gradient-orbs {
		@apply absolute inset-0;
	}

	.orb {
		@apply absolute rounded-full;
		filter: blur(120px);
		opacity: 0.1;
	}

	.orb-1 {
		@apply h-96 w-96;
		background-color: #677D6A;
		top: -15%;
		left: -15%;
		animation: pulse 10s infinite ease-in-out;
	}

	.orb-2 {
		@apply h-80 w-80;
		background-color: #8FA998;
		bottom: -15%;
		right: -15%;
		animation: pulse 12s infinite ease-in-out reverse;
	}

	.orb-3 {
		@apply h-64 w-64;
		background-color: #B5C9BD;
		top: 40%;
		left: 60%;
		animation: pulse 14s infinite ease-in-out;
	}

	.orb-4 {
		@apply h-72 w-72;
		background-color: #D6BD98;
		top: 60%;
		left: 20%;
		animation: pulse 16s infinite ease-in-out reverse;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.1;
		}
		50% {
			transform: scale(1.3);
			opacity: 0.2;
		}
	}

	/* Main Container */
	.signup-container {
		@apply relative z-10 flex min-h-screen w-full;
	}

	/* Branding Section */
	.branding-section {
		@apply hidden items-center justify-center p-12 lg:flex lg:w-1/2;
	}

	.brand-content {
		@apply max-w-lg space-y-8;
	}

	.logo-container {
		@apply flex items-center gap-4;
	}

	.logo-icon {
		@apply relative;
	}

	.logo-coffee-wrapper {
		@apply relative;
	}

	.logo-coffee {
		@apply h-12 w-12;
		color: #677D6A;
		animation: bounce 3s infinite ease-in-out;
	}

	.logo-sparkle-wrapper {
		@apply absolute -right-1 -top-1;
	}

	.logo-sparkle {
		@apply h-6 w-6;
		color: #8FA998;
		animation: sparkle 4s infinite ease-in-out;
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-8px);
		}
		60% {
			transform: translateY(-4px);
		}
	}

	@keyframes sparkle {
		0%,
		100% {
			transform: rotate(0deg) scale(1);
			opacity: 1;
		}
		25% {
			transform: rotate(90deg) scale(1.1);
			opacity: 0.8;
		}
		50% {
			transform: rotate(180deg) scale(1.2);
			opacity: 0.6;
		}
		75% {
			transform: rotate(270deg) scale(1.1);
			opacity: 0.8;
		}
	}

	.logo-text {
		@apply flex flex-col;
	}

	.logo-main {
		background: linear-gradient(to right, #677D6A, #8FA998);
		-webkit-background-clip: text;
		background-clip: text;
		@apply text-4xl font-black text-transparent;
	}

	.logo-sub {
		@apply -mt-2 text-xl font-bold text-gray-800 dark:text-gray-200;
		letter-spacing: 0.2em;
	}

	.brand-messaging {
		@apply space-y-6;
	}

	.brand-title {
		@apply text-4xl font-bold leading-tight text-gray-900 dark:text-white;
	}

	.brand-subtitle {
		@apply text-lg leading-relaxed text-gray-600 dark:text-gray-400;
	}

	.brand-benefits {
		@apply space-y-4;
	}

	.benefit {
		@apply flex items-start gap-3;
	}

	.benefit-icon-wrapper {
		@apply flex h-10 w-10 items-center justify-center rounded-full;
		background-color: rgba(103, 125, 106, 0.1);
	}

	.benefit-icon {
		@apply h-5 w-5;
		color: #677D6A;
	}

	.benefit-content {
		@apply flex flex-col;
	}

	.benefit-title {
		@apply text-lg font-semibold text-gray-900 dark:text-white;
	}

	.benefit-text {
		@apply text-sm text-gray-600 dark:text-gray-400;
	}

	.trust-badges {
		@apply flex gap-4;
	}

	.badge {
		@apply flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400;
	}

	.badge-icon {
		@apply h-4 w-4;
	}

	/* Form Section */
	.form-section {
		@apply flex w-full items-start justify-center overflow-y-auto p-6 lg:w-1/2 lg:p-12;
	}

	.form-container {
		@apply w-full max-w-md space-y-6;
		@apply bg-white/80 backdrop-blur-xl dark:bg-gray-900/80;
		@apply rounded-3xl border border-white/20 p-8 shadow-2xl dark:border-gray-700/20;
		@apply my-8;
	}

	/* Form Header */
	.form-header {
		@apply space-y-2 text-center;
	}

	.form-title {
		@apply text-3xl font-bold text-gray-900 dark:text-white;
	}

	.form-subtitle {
		@apply text-gray-600 dark:text-gray-400;
	}

	/* Success State */
	.success-state {
		@apply space-y-6 py-8 text-center;
	}

	.success-icon-wrapper {
		@apply mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10;
	}

	.success-icon {
		@apply h-10 w-10 text-green-500;
		animation: successPulse 2s infinite;
	}

	@keyframes successPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.success-title {
		@apply text-2xl font-bold text-gray-900 dark:text-white;
	}

	.success-message {
		@apply text-gray-600 dark:text-gray-400;
	}

	.success-loader {
		@apply mx-auto w-32 rounded-full bg-gray-200 dark:bg-gray-700;
	}

	.loader-bar {
		@apply h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500;
		animation: loading 2s ease-in-out infinite;
	}

	@keyframes loading {
		0% {
			width: 0%;
		}
		50% {
			width: 60%;
		}
		100% {
			width: 100%;
		}
	}

	/* Error Alert */
	.error-alert {
		@apply flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20;
	}

	.alert-icon-wrapper {
		@apply flex-shrink-0;
	}

	.alert-icon {
		@apply h-5 w-5 text-red-500;
	}

	.alert-content {
		@apply flex flex-col gap-1;
	}

	.alert-title {
		@apply text-sm font-medium text-red-800 dark:text-red-200;
	}

	.alert-message {
		@apply text-sm text-red-600 dark:text-red-400;
	}

	/* Social Login */
	.social-section {
		@apply space-y-4;
	}

	.social-title {
		@apply text-center;
	}

	.social-title span {
		@apply text-sm font-medium text-gray-600 dark:text-gray-400;
	}

	.social-buttons {
		@apply grid grid-cols-3 gap-3;
	}

	.social-btn {
		@apply flex flex-col items-center justify-center gap-2 p-4;
		@apply bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700;
		@apply rounded-xl border border-gray-200 dark:border-gray-600;
		@apply font-medium text-gray-700 dark:text-gray-300;
		@apply transform transition-all duration-300;
		@apply hover:scale-[1.02] hover:shadow-lg;
		@apply disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50;
		@apply focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900;
	}

	.social-btn.google {
		@apply hover:border-blue-300 hover:shadow-blue-100 dark:hover:shadow-blue-900/20;
		@apply focus:ring-blue-500;
	}

	.social-btn.github {
		@apply hover:border-gray-400 hover:shadow-gray-100 dark:hover:shadow-gray-900/20;
		@apply focus:ring-gray-500;
	}

	.social-btn.discord {
		@apply hover:border-indigo-300 hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20;
		@apply focus:ring-indigo-500;
	}

	.social-icon {
		@apply h-6 w-6;
	}

	.social-btn span {
		@apply text-xs font-medium;
	}

	/* Auth Divider */
	.auth-divider {
		@apply flex items-center gap-4;
	}

	.divider-line {
		@apply flex-1 border-t border-gray-200 dark:border-gray-700;
	}

	.divider-text {
		@apply text-sm text-gray-500 dark:text-gray-400;
		@apply bg-white px-2 dark:bg-gray-900;
	}

	/* Form */
	.signup-form {
		@apply space-y-5;
	}

	.form-group {
		@apply space-y-2;
	}

	.form-label {
		@apply block text-sm font-medium text-gray-700 dark:text-gray-300;
	}

	.input-wrapper {
		@apply relative overflow-hidden;
		@apply rounded-xl border border-gray-200 dark:border-gray-600;
		@apply bg-white/50 dark:bg-gray-800/50;
		@apply transition-all duration-300;
		@apply hover:border-gray-300 dark:hover:border-gray-500;
	}

	.input-wrapper.focused {
		border-color: #677D6A;
		box-shadow: 0 0 0 2px rgba(103, 125, 106, 0.2), 0 10px 15px -3px rgba(103, 125, 106, 0.1);
	}

	.input-wrapper.error {
		@apply border-red-500 ring-2 ring-red-500/20;
		@apply shadow-lg shadow-red-500/10;
	}

	.input-wrapper.success {
		@apply border-green-500 ring-2 ring-green-500/20;
		@apply shadow-lg shadow-green-500/10;
	}

	.input-icon-wrapper {
		@apply absolute left-4 top-1/2 z-10 -translate-y-1/2;
	}

	.input-icon {
		@apply h-5 w-5 text-gray-400 transition-colors duration-300;
	}

	.input-wrapper.focused .input-icon {
		color: #677D6A;
	}

	.input-wrapper.error .input-icon {
		@apply text-red-500;
	}

	.input-wrapper.success .input-icon {
		@apply text-green-500;
	}

	.form-input {
		@apply w-full bg-transparent py-4 pl-12 pr-12;
		@apply text-gray-900 placeholder-gray-400 dark:text-white dark:placeholder-gray-500;
		@apply focus:outline-none;
		@apply font-medium;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
	}

	.password-toggle {
		@apply absolute right-4 top-1/2 z-10 -translate-y-1/2;
		@apply rounded-md p-1 text-gray-400 transition-colors duration-200;
		@apply hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
	}

	.toggle-icon-wrapper {
		@apply flex items-center justify-center;
	}

	.toggle-icon {
		@apply h-4 w-4;
	}

	.validation-icon {
		@apply absolute right-12 top-1/2 -translate-y-1/2;
	}

	.validation-icon.success {
		@apply text-green-500;
	}

	.validation-icon :global(svg) {
		@apply h-4 w-4;
	}

	.error-message {
		@apply text-sm text-red-600 dark:text-red-400;
	}

	/* Password Strength */
	.password-strength {
		@apply mt-2 space-y-1;
	}

	.strength-bar {
		@apply h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700;
		overflow: hidden;
	}

	.strength-fill {
		@apply h-full transition-all duration-300;
	}

	.strength-red {
		@apply bg-red-500;
	}

	.strength-yellow {
		@apply bg-yellow-500;
	}

	.strength-blue {
		@apply bg-blue-500;
	}

	.strength-green {
		@apply bg-green-500;
	}

	.strength-info {
		@apply flex items-center justify-between text-xs;
	}

	.strength-label {
		@apply font-medium;
	}

	.strength-label.strength-red {
		@apply text-red-600 dark:text-red-400;
	}

	.strength-label.strength-yellow {
		@apply text-yellow-600 dark:text-yellow-400;
	}

	.strength-label.strength-blue {
		@apply text-blue-600 dark:text-blue-400;
	}

	.strength-label.strength-green {
		@apply text-green-600 dark:text-green-400;
	}

	.strength-tips {
		@apply text-gray-500 dark:text-gray-400;
	}

	/* Terms & Conditions */
	.terms-wrapper {
		@apply flex cursor-pointer items-start gap-3;
	}

	.terms-input {
		@apply sr-only;
	}

	.terms-custom {
		@apply mt-0.5 h-4 w-4 rounded border-2 border-gray-300 dark:border-gray-600;
		@apply transition-all duration-200;
		@apply flex flex-shrink-0 items-center justify-center;
	}

	.terms-input:checked + .terms-custom {
		border-color: #677D6A;
		background-color: #677D6A;
	}

	.terms-input:checked + .terms-custom::after {
		content: '✓';
		@apply text-xs font-bold text-white;
	}

	.terms-label {
		@apply text-sm leading-relaxed text-gray-600 dark:text-gray-400;
	}

	.terms-link {
		@apply font-medium transition-colors duration-200;
		color: #677D6A;
	}

	.terms-link:hover {
		color: #8FA998;
	}

	/* Submit Button */
	.submit-btn {
		@apply w-full overflow-hidden rounded-xl;
		background: linear-gradient(to right, #677D6A, #8FA998);
		@apply font-semibold text-white;
		@apply transform transition-all duration-300;
		@apply disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50;
		@apply focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900;
		box-shadow: 0 4px 6px -1px rgba(103, 125, 106, 0.1), 0 2px 4px -1px rgba(103, 125, 106, 0.06);
	}

	.submit-btn:hover {
		background: linear-gradient(to right, #8FA998, #B5C9BD);
		transform: scale(1.02);
		box-shadow: 0 10px 15px -3px rgba(103, 125, 106, 0.25);
	}

	.submit-btn:focus {
		ring-color: #677D6A;
	}

	.submit-btn.loading {
		@apply cursor-wait;
	}

	.btn-content {
		@apply flex items-center justify-center gap-2 p-4;
	}

	.btn-icon {
		@apply flex items-center justify-center;
	}

	.btn-icon :global(svg) {
		@apply h-5 w-5;
	}

	.spinning {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Sign In Section */
	.signin-section {
		@apply border-t border-gray-200 pt-6 text-center dark:border-gray-700;
	}

	.signin-text {
		@apply text-sm text-gray-600 dark:text-gray-400;
	}

	.signin-link {
		@apply font-semibold transition-colors duration-200;
		color: #677D6A;
	}

	.signin-link:hover {
		color: #8FA998;
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.signup-container {
			@apply justify-center;
		}

		.form-container {
			@apply mx-4;
		}
	}

	@media (max-width: 640px) {
		.form-container {
			@apply rounded-2xl p-6;
		}

		.form-title {
			@apply text-2xl;
		}

		.form-input {
			@apply py-3;
		}

		.btn-content {
			@apply p-3;
		}

		.social-buttons {
			@apply grid-cols-1 gap-3;
		}

		.social-btn {
			@apply flex-row gap-3 p-3;
		}

		.social-btn span {
			@apply text-sm;
		}

		.benefit {
			@apply flex-col text-center;
		}

		.terms-wrapper {
			@apply flex-col items-center gap-2 text-center;
		}
	}
</style>
