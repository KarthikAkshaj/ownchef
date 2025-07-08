<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';
	import { theme } from '$lib/stores/theme';
	import {
		User,
		Mail,
		Camera,
		ArrowRight,
		ArrowLeft,
		CheckCircle,
		Sparkles,
		Coffee,
		Loader2,
		AlertCircle,
		ChevronRight,
		MapPin,
		Globe,
		Calendar,
		Edit3,
		Heart,
		Star,
		Upload,
		X,
		Image as ImageIcon
	} from 'lucide-svelte';

	// Props
	let { data, form: formErrors }: { data: PageServerData; form: ActionData } = $props();

	// Centralized state management
	let formState = $state({
		// Required fields
		firstName: data.user.firstName || '',
		lastName: data.user.lastName || '',

		// Optional fields
		email: data.user.email || '',
		location: '',
		bio: data.user.bio || '',
		website: '',
		age: data.user.age || null,
		profileImage: '', // FIXED: Always start empty in setup

		// Form flow state
		currentStep: 1,
		totalSteps: 4,
		isSubmitting: false,
		error: '',
		success: false,
		loadingProgress: 0,

		// File upload state
		isUploading: false,
		uploadProgress: 0
	});

	// Validation
	const validation = $derived({
		hasRequiredFields:
			formState.firstName.trim().length >= 2 && formState.lastName.trim().length >= 2,
		canContinueStep1:
			formState.firstName.trim().length >= 2 && formState.lastName.trim().length >= 2,
		canSubmit: formState.firstName.trim().length >= 2 && formState.lastName.trim().length >= 2,
		isOnLastStep: formState.currentStep === formState.totalSteps
	});

	// Update error from server
	$effect(() => {
		if (formErrors?.error) {
			formState.error = formErrors.error;
		}
	});

	// Loading progress animation
	$effect(() => {
		if (formState.success && formState.loadingProgress < 100) {
			const interval = setInterval(() => {
				formState.loadingProgress += 2;
				if (formState.loadingProgress >= 100) {
					clearInterval(interval);
				}
			}, 30);
			return () => clearInterval(interval);
		}
	});

	function clearError() {
		formState.error = '';
	}

	function nextStep() {
		if (formState.currentStep === 1 && !validation.canContinueStep1) {
			formState.error = 'Please fill in your first and last name to continue';
			return;
		}

		clearError();
		if (formState.currentStep < formState.totalSteps) {
			formState.currentStep++;
		}
	}

	function prevStep() {
		clearError();
		if (formState.currentStep > 1) {
			formState.currentStep--;
		}
	}

	function skipToFinish() {
		if (!validation.hasRequiredFields) {
			formState.error = 'Please go back and fill in your first and last name';
			formState.currentStep = 1;
			return;
		}
		submitForm();
	}

	function submitForm() {
		const form = document.querySelector('form') as HTMLFormElement;
		if (form) {
			formState.isSubmitting = true;
			clearError();
			form.submit();
		} else {
			formState.error = 'Form not found. Please try again.';
		}
	}

	// File upload handler
	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;
		await processFileUpload(file);
	}

	// Drag and drop handlers
	let isDragOver = $state(false);

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragOver = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			await processFileUpload(files[0]);
		}
	}

	// Process file upload
	async function processFileUpload(file: File) {
		// Validate file
		if (!file.type.startsWith('image/')) {
			formState.error = 'Please select an image file';
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			// 5MB limit
			formState.error = 'Image must be smaller than 5MB';
			return;
		}

		formState.isUploading = true;
		formState.uploadProgress = 0;
		clearError();

		try {
			// Create form data
			const formData = new FormData();
			formData.append('file', file);
			formData.append('type', 'profiles');
			formData.append('alt', `${formState.firstName} ${formState.lastName} profile photo`);

			// Upload with progress tracking
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Upload failed');
			}

			const result = await response.json();

			if (result.success && result.data?.url) {
				formState.profileImage = result.data.url;
				console.log('✅ Image uploaded successfully:', result.data.url);
			} else {
				throw new Error('Invalid response from server');
			}
		} catch (error) {
			console.error('❌ Upload error:', error);
			formState.error = error instanceof Error ? error.message : 'Failed to upload image';
		} finally {
			formState.isUploading = false;
			formState.uploadProgress = 0;
		}
	}

	// Remove uploaded image
	function removeImage() {
		formState.profileImage = '';
		// Clear the file input
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}
</script>

<svelte:head>
	<title>Complete Your Profile | OwnChef</title>
</svelte:head>

<div class="setup-page" class:dark={$theme === 'dark'}>
	<!-- Subtle Background -->
	<div class="bg-gradient"></div>
	<div class="bg-mesh"></div>

	<!-- Main Container -->
	<div class="setup-container">
		{#if formState.success}
			<!-- Enhanced Success State -->
			<div class="success-state">
				<div class="success-content">
					<!-- Animated Check Icon -->
					<div class="success-icon-container">
						<div class="success-ring"></div>
						<div class="success-ring ring-2"></div>
						<CheckCircle class="success-icon" />
						<div class="success-sparkles">
							{#each Array(6) as _, i}
								<Star class="sparkle sparkle-{i + 1}" />
							{/each}
						</div>
					</div>

					<h2 class="success-title">Welcome to OwnChef!</h2>
					<p class="success-subtitle">Your profile has been created successfully</p>

					<!-- Enhanced Progress Bar -->
					<div class="success-progress">
						<div class="progress-track">
							<div class="progress-fill" style="width: {formState.loadingProgress}%"></div>
						</div>
						<p class="progress-text">Taking you to your dashboard...</p>
					</div>
				</div>
			</div>
		{:else}
			<!-- Enhanced Setup Flow -->
			<div class="setup-form">
				<!-- Modern Header -->
				<div class="form-header">
					<div class="brand">
						<div class="brand-icon">
							<Coffee class="coffee-icon" />
						</div>
						<div class="brand-text">
							<span class="brand-own">Own</span>
							<span class="brand-chef">Chef</span>
						</div>
					</div>

					<div class="header-content">
						<h1 class="form-title">Complete Your Profile</h1>
						<p class="form-subtitle">Let's personalize your culinary journey</p>
					</div>

					<!-- Modern Progress Indicator -->
					<div class="progress-indicator">
						<div class="progress-track">
							<div
								class="progress-bar"
								style="width: {(formState.currentStep / formState.totalSteps) * 100}%"
							></div>
						</div>
						<div class="step-indicators">
							{#each Array(formState.totalSteps) as _, i}
								<div
									class="step-dot"
									class:active={i + 1 <= formState.currentStep}
									class:current={i + 1 === formState.currentStep}
								>
									{#if i + 1 < formState.currentStep}
										<CheckCircle class="step-check" />
									{:else}
										<span class="step-number">{i + 1}</span>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Error Alert -->
				{#if formState.error}
					<div class="error-notification">
						<AlertCircle class="error-icon" />
						<span class="error-text">{formState.error}</span>
					</div>
				{/if}

				<!-- Enhanced Form -->
				<form
					method="post"
					use:enhance={() => {
						formState.isSubmitting = true;
						clearError();

						return async ({ result, update }) => {
							if (result.type === 'failure') {
								formState.error = result.data?.error || 'Failed to save profile';
							} else if (result.type === 'redirect') {
								formState.success = true;
								formState.loadingProgress = 0;
							}
							formState.isSubmitting = false;
							await update();
						};
					}}
				>
					<!-- Hidden form inputs -->
					<input type="hidden" name="firstName" value={formState.firstName} />
					<input type="hidden" name="lastName" value={formState.lastName} />
					<input type="hidden" name="email" value={formState.email} />
					<input type="hidden" name="location" value={formState.location} />
					<input type="hidden" name="bio" value={formState.bio} />
					<input type="hidden" name="website" value={formState.website} />
					<input type="hidden" name="age" value={formState.age?.toString() || ''} />
					<input type="hidden" name="profileImage" value={formState.profileImage} />

					<!-- Enhanced Step Content -->
					<div class="step-wrapper">
						{#if formState.currentStep === 1}
							<!-- Step 1: Enhanced Basic Info -->
							<div class="step-content">
								<div class="step-header">
									<h2 class="step-title">
										<User class="step-icon" />
										Tell us about yourself
									</h2>
									<p class="step-description">
										Your name helps us create a personalized experience
									</p>
								</div>

								<div class="field-grid">
									<div class="field-group">
										<label for="firstName" class="field-label">
											First Name <span class="required-indicator">*</span>
										</label>
										<div class="input-container">
											<input
												id="firstName"
												type="text"
												bind:value={formState.firstName}
												oninput={clearError}
												placeholder="Your first name"
												class="field-input"
												required
												autocomplete="given-name"
											/>
											<div class="input-border"></div>
										</div>
									</div>

									<div class="field-group">
										<label for="lastName" class="field-label">
											Last Name <span class="required-indicator">*</span>
										</label>
										<div class="input-container">
											<input
												id="lastName"
												type="text"
												bind:value={formState.lastName}
												oninput={clearError}
												placeholder="Your last name"
												class="field-input"
												required
												autocomplete="family-name"
											/>
											<div class="input-border"></div>
										</div>
									</div>
								</div>

								<div class="step-actions">
									<div></div>
									<button
										type="button"
										class="btn btn-primary"
										disabled={!validation.canContinueStep1}
										onclick={nextStep}
									>
										Continue
										<ArrowRight class="btn-icon" />
									</button>
								</div>
							</div>
						{/if}

						{#if formState.currentStep === 2}
							<!-- Step 2: Enhanced Contact -->
							<div class="step-content">
								<div class="step-header">
									<h2 class="step-title">
										<Mail class="step-icon" />
										Contact Information
									</h2>
									<p class="step-description">Help others connect with you (optional)</p>
								</div>

								<div class="field-grid">
									<div class="field-group">
										<label for="email" class="field-label">
											<Mail class="label-icon" />
											Email Address
										</label>
										<div class="input-container">
											<input
												id="email"
												type="email"
												bind:value={formState.email}
												placeholder="your@email.com"
												class="field-input"
												autocomplete="email"
											/>
											<div class="input-border"></div>
										</div>
									</div>

									<div class="field-group">
										<label for="location" class="field-label">
											<MapPin class="label-icon" />
											Location
										</label>
										<div class="input-container">
											<input
												id="location"
												type="text"
												bind:value={formState.location}
												placeholder="City, Country"
												class="field-input"
												autocomplete="address-level2"
											/>
											<div class="input-border"></div>
										</div>
									</div>
								</div>

								<div class="step-actions">
									<button type="button" class="btn btn-secondary" onclick={prevStep}>
										<ArrowLeft class="btn-icon" />
										Back
									</button>
									<button type="button" class="btn btn-primary" onclick={nextStep}>
										Continue
										<ArrowRight class="btn-icon" />
									</button>
								</div>
							</div>
						{/if}

						{#if formState.currentStep === 3}
							<!-- Step 3: Enhanced Personal -->
							<div class="step-content">
								<div class="step-header">
									<h2 class="step-title">
										<Edit3 class="step-icon" />
										Personal Details
									</h2>
									<p class="step-description">Share your story and interests (optional)</p>
								</div>

								<div class="field-grid">
									<div class="field-group full-width">
										<label for="bio" class="field-label">
											<Heart class="label-icon" />
											Bio
										</label>
										<div class="textarea-container">
											<textarea
												id="bio"
												bind:value={formState.bio}
												placeholder="Tell us about your cooking journey, favorite cuisines, or culinary goals..."
												class="field-textarea"
												rows="4"
											></textarea>
											<div class="input-border"></div>
										</div>
									</div>

									<div class="field-group">
										<label for="website" class="field-label">
											<Globe class="label-icon" />
											Website/Blog
										</label>
										<div class="input-container">
											<input
												id="website"
												type="url"
												bind:value={formState.website}
												placeholder="https://yourwebsite.com"
												class="field-input"
												autocomplete="url"
											/>
											<div class="input-border"></div>
										</div>
									</div>

									<div class="field-group">
										<label for="age" class="field-label">
											<Calendar class="label-icon" />
											Age
										</label>
										<div class="input-container">
											<input
												id="age"
												type="number"
												bind:value={formState.age}
												placeholder="25"
												min="13"
												max="120"
												class="field-input"
											/>
											<div class="input-border"></div>
										</div>
									</div>
								</div>

								<div class="step-actions">
									<button type="button" class="btn btn-secondary" onclick={prevStep}>
										<ArrowLeft class="btn-icon" />
										Back
									</button>
									<button type="button" class="btn btn-primary" onclick={nextStep}>
										Continue
										<ArrowRight class="btn-icon" />
									</button>
								</div>
							</div>
						{/if}

						{#if formState.currentStep === 4}
							<!-- Step 4: Enhanced Photo Upload -->
							<div class="step-content">
								<div class="step-header">
									<h2 class="step-title">
										<Camera class="step-icon" />
										Profile Photo
									</h2>
									<p class="step-description">Add a photo to personalize your profile (optional)</p>
								</div>

								<div
									style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; width: 100%;"
								>
									{#if formState.profileImage && !formState.isUploading}
										<!-- Uploaded Image Display -->
										<div
											style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;"
										>
											<div
												style="position: relative; width: 140px; height: 140px; border-radius: 20px; overflow: hidden; border: 3px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.05); transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);"
											>
												<img
													src={formState.profileImage}
													alt="Profile preview"
													style="width: 100%; height: 100%; object-fit: cover;"
												/>
												<div
													style="position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; opacity: 0; transition: opacity 0.2s ease;"
													class="image-actions-hover"
												>
													<button
														type="button"
														onclick={() => document.getElementById('photo-upload')?.click()}
														style="width: 32px; height: 32px; border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(8px); background: rgba(59, 130, 246, 0.9); color: white;"
													>
														<Camera style="width: 16px; height: 16px;" />
													</button>
													<button
														type="button"
														onclick={removeImage}
														style="width: 32px; height: 32px; border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(8px); background: rgba(239, 68, 68, 0.9); color: white;"
													>
														<X style="width: 16px; height: 16px;" />
													</button>
												</div>
											</div>
											<p
												style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: rgba(255, 255, 255, 0.8); background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 0.875rem 1.25rem; margin: 0;"
											>
												<CheckCircle
													style="width: 18px; height: 18px; color: #10b981; flex-shrink: 0;"
												/>
												Profile photo uploaded successfully
											</p>
										</div>
									{:else}
										<!-- Upload Interface with Inline Styles -->
										<div style="width: 100%; max-width: 400px;">
											{#if formState.isUploading}
												<!-- Loading State -->
												<div
													style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px; padding: 2rem; text-align: center; gap: 1.5rem; border: 2px dashed rgba(16, 185, 129, 0.4); border-radius: 16px; background: rgba(16, 185, 129, 0.05);"
												>
													<div
														style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1)); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(16, 185, 129, 0.2);"
													>
														<Loader2
															style="width: 28px; height: 28px; color: #10b981; animation: spin 1s linear infinite;"
														/>
													</div>
													<h3
														style="font-size: 1.25rem; font-weight: 700; color: white; margin: 0;"
													>
														Uploading your photo...
													</h3>
													<div
														style="width: 100%; max-width: 200px; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden;"
													>
														<div
															style="height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); border-radius: 2px; animation: loadingMove 1.5s ease-in-out infinite;"
														></div>
													</div>
													<p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin: 0;">
														Please wait while we process your image
													</p>
												</div>
											{:else}
												<!-- Upload Zone -->
												<div
													style="width: 100%; min-height: 280px; border: 2px dashed rgba(255, 255, 255, 0.3); border-radius: 16px; background: rgba(255, 255, 255, 0.02); transition: all 0.3s ease; position: relative; overflow: hidden; cursor: pointer;"
													class="upload-zone-interactive"
													ondragover={handleDragOver}
													ondragleave={handleDragLeave}
													ondrop={handleDrop}
													onclick={() => document.getElementById('photo-upload')?.click()}
												>
													<label
														for="photo-upload"
														style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; min-height: 280px; padding: 2rem; cursor: pointer; text-align: center; gap: 1.5rem;"
													>
														<!-- Upload Icon -->
														<div
															style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1)); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;"
														>
															<Upload style="width: 28px; height: 28px; color: #3b82f6;" />
														</div>

														<!-- Upload Text -->
														<div style="display: flex; flex-direction: column; gap: 1rem;">
															<h3
																style="font-size: 1.25rem; font-weight: 700; color: white; margin: 0;"
															>
																Add your profile photo
															</h3>
															<p
																style="font-size: 0.95rem; color: rgba(255, 255, 255, 0.7); margin: 0; line-height: 1.5;"
															>
																<span style="color: #3b82f6; font-weight: 600;"
																	>Click to browse</span
																> or drag and drop your image here
															</p>

															<!-- Format Badges -->
															<div
																style="display: flex; gap: 0.5rem; justify-content: center; margin: 0.5rem 0;"
															>
																<span
																	style="background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.1);"
																	>JPG</span
																>
																<span
																	style="background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.1);"
																	>PNG</span
																>
																<span
																	style="background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.1);"
																	>WebP</span
																>
															</div>

															<p
																style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); margin: 0;"
															>
																Maximum file size: 5MB
															</p>
														</div>
													</label>
												</div>
											{/if}
										</div>
									{/if}

									<!-- Hidden File Input -->
									<input
										id="photo-upload"
										type="file"
										accept="image/*"
										onchange={handleFileUpload}
										disabled={formState.isUploading}
										style="display: none !important;"
									/>
								</div>

								<div class="final-actions">
									<button type="button" class="btn btn-secondary" onclick={prevStep}>
										<ArrowLeft class="btn-icon" />
										Back
									</button>

									<button
										type="button"
										class="btn btn-outline"
										onclick={skipToFinish}
										disabled={!validation.hasRequiredFields}
									>
										Skip & Complete
									</button>

									<button
										type="submit"
										class="btn btn-success"
										disabled={!validation.canSubmit || formState.isSubmitting}
									>
										{#if formState.isSubmitting}
											<Loader2 class="btn-icon spinning" />
											Creating Profile...
										{:else}
											Complete Setup
											<CheckCircle class="btn-icon" />
										{/if}
									</button>
								</div>
							</div>
						{/if}
					</div>
				</form>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Base Setup */
	.setup-page {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		overflow: auto;
		background: #0a0a0a;
	}

	.setup-page.dark {
		background: #000000;
	}

	/* Subtle Background */
	.bg-gradient {
		position: fixed;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(99, 102, 241, 0.1) 0%,
			rgba(168, 85, 247, 0.1) 25%,
			rgba(236, 72, 153, 0.1) 50%,
			rgba(251, 146, 60, 0.1) 75%,
			rgba(34, 197, 94, 0.1) 100%
		);
		animation: gradientShift 20s ease infinite;
	}

	.bg-mesh {
		position: fixed;
		inset: 0;
		background-image: radial-gradient(
				circle at 25% 25%,
				rgba(99, 102, 241, 0.05) 0%,
				transparent 50%
			),
			radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
			radial-gradient(circle at 75% 25%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
			radial-gradient(circle at 25% 75%, rgba(251, 146, 60, 0.05) 0%, transparent 50%);
	}

	@keyframes gradientShift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	/* Main Container */
	.setup-container {
		position: relative;
		z-index: 10;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
	}

	/* Enhanced Form */
	.setup-form {
		width: 100%;
		max-width: 540px;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(24px);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 24px;
		padding: 2.5rem;
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.4),
			0 0 0 1px rgba(255, 255, 255, 0.05);
	}

	/* Modern Header */
	.form-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.brand {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.brand-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: linear-gradient(135deg, #f97316, #ea580c);
		border-radius: 12px;
		box-shadow: 0 8px 16px rgba(249, 115, 22, 0.3);
	}

	.coffee-icon {
		width: 24px;
		height: 24px;
		color: white;
	}

	.brand-text {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
	}

	.brand-own {
		font-size: 1.75rem;
		font-weight: 700;
		color: white;
	}

	.brand-chef {
		font-size: 1.25rem;
		font-weight: 900;
		background: linear-gradient(135deg, #f97316, #ea580c);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.header-content {
		margin-bottom: 2rem;
	}

	.form-title {
		font-size: 2rem;
		font-weight: 700;
		color: white;
		margin-bottom: 0.5rem;
		line-height: 1.2;
	}

	.form-subtitle {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.5;
	}

	/* Modern Progress */
	.progress-indicator {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.progress-track {
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #8b5cf6);
		border-radius: 2px;
		transition: width 0.3s ease;
	}

	.step-indicators {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.step-dot {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
	}

	.step-dot.active {
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		border-color: transparent;
		transform: scale(1.1);
	}

	.step-dot.current {
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		border-color: rgba(59, 130, 246, 0.5);
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
	}

	.step-number {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.7);
	}

	.step-dot.active .step-number,
	.step-dot.current .step-number {
		color: white;
	}

	.step-check {
		width: 16px;
		height: 16px;
		color: white;
	}

	/* Error Notification */
	.error-notification {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.2);
		border-radius: 12px;
		margin-bottom: 1.5rem;
	}

	.error-icon {
		width: 20px;
		height: 20px;
		color: #ef4444;
		flex-shrink: 0;
	}

	.error-text {
		color: #fca5a5;
		font-weight: 500;
		font-size: 0.875rem;
	}

	/* Enhanced Step Content */
	.step-wrapper {
		min-height: 400px;
		display: flex;
		flex-direction: column;
	}

	.step-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.step-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.step-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
		margin-bottom: 0.5rem;
	}

	.step-icon {
		width: 24px;
		height: 24px;
		color: #3b82f6;
	}

	.step-description {
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	/* Enhanced Form Fields */
	.field-grid {
		display: grid;
		gap: 1.5rem;
		margin-bottom: 2.5rem;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-group.full-width {
		grid-column: 1 / -1;
	}

	.field-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 0.25rem;
	}

	.label-icon {
		width: 16px;
		height: 16px;
		color: rgba(255, 255, 255, 0.5);
	}

	.required-indicator {
		color: #f87171;
		font-weight: 700;
	}

	.input-container,
	.textarea-container {
		position: relative;
	}

	.field-input,
	.field-textarea {
		width: 100%;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
		padding: 0.875rem 1rem;
		color: white;
		font-size: 0.95rem;
		transition: all 0.2s ease;
		outline: none;
	}

	.field-input::placeholder,
	.field-textarea::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.field-input:focus,
	.field-textarea:focus {
		background: rgba(255, 255, 255, 0.08);
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.field-textarea {
		resize: none;
		min-height: 100px;
	}

	.input-border {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #3b82f6, #8b5cf6);
		border-radius: 1px;
		transform: scaleX(0);
		transition: transform 0.2s ease;
	}

	.field-input:focus + .input-border,
	.field-textarea:focus + .input-border {
		transform: scaleX(1);
	}

	/* Photo Section */
	.photo-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2.5rem;
	}

	.photo-upload {
		position: relative;
	}

	.photo-preview {
		position: relative;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid rgba(255, 255, 255, 0.12);
		transition: all 0.3s ease;
	}

	.photo-preview:hover {
		border-color: #3b82f6;
		transform: scale(1.05);
	}

	.profile-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.photo-preview:hover .image-overlay {
		opacity: 1;
	}

	.overlay-icon {
		width: 24px;
		height: 24px;
		color: white;
	}

	.placeholder-image {
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.06);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.camera-icon {
		width: 32px;
		height: 32px;
		color: rgba(255, 255, 255, 0.5);
	}

	.placeholder-text {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 500;
	}

	.upload-controls {
		text-align: center;
		width: 100%;
		max-width: 320px;
	}

	.photo-input {
		text-align: center;
		font-size: 0.875rem;
	}

	.upload-hint {
		margin-top: 0.75rem;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.4;
	}

	/* Enhanced Buttons */
	.step-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
		gap: 1rem;
	}

	.final-actions {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: auto;
		flex-wrap: wrap;
	}

	.btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1.5rem;
		border-radius: 12px;
		font-weight: 600;
		font-size: 0.95rem;
		transition: all 0.2s ease;
		border: none;
		cursor: pointer;
		outline: none;
		text-decoration: none;
		position: relative;
		overflow: hidden;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none !important;
	}

	.btn-primary {
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		color: white;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.btn-secondary:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-2px);
	}

	.btn-outline {
		background: transparent;
		color: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.btn-outline:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.btn-success {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	.btn-success:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
	}

	.btn-icon {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}

	.spinning {
		animation: spin 1s linear infinite;
	}

	/* Enhanced Success State */
	.success-state {
		width: 100%;
		max-width: 460px;
		text-align: center;
		padding: 3rem 2rem;
	}

	.success-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.success-icon-container {
		position: relative;
		width: 120px;
		height: 120px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.success-ring {
		position: absolute;
		inset: 0;
		border: 3px solid transparent;
		border-top-color: #10b981;
		border-radius: 50%;
		animation: successRing 2s ease-in-out infinite;
	}

	.success-ring.ring-2 {
		animation-delay: 1s;
		border-top-color: #3b82f6;
	}

	.success-icon {
		width: 64px;
		height: 64px;
		color: #10b981;
		z-index: 2;
		animation: successPulse 2s ease-in-out infinite;
	}

	.success-sparkles {
		position: absolute;
		inset: -20px;
		pointer-events: none;
	}

	.sparkle {
		position: absolute;
		width: 16px;
		height: 16px;
		color: #fbbf24;
		animation: sparkleFloat 3s ease-in-out infinite;
	}

	.sparkle-1 {
		top: 0;
		left: 50%;
		animation-delay: 0s;
	}
	.sparkle-2 {
		top: 20%;
		right: 0;
		animation-delay: 0.5s;
	}
	.sparkle-3 {
		bottom: 20%;
		right: 0;
		animation-delay: 1s;
	}
	.sparkle-4 {
		bottom: 0;
		left: 50%;
		animation-delay: 1.5s;
	}
	.sparkle-5 {
		bottom: 20%;
		left: 0;
		animation-delay: 2s;
	}
	.sparkle-6 {
		top: 20%;
		left: 0;
		animation-delay: 2.5s;
	}

	@keyframes successRing {
		0% {
			transform: rotate(0deg);
			opacity: 1;
		}
		100% {
			transform: rotate(360deg);
			opacity: 0.3;
		}
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

	@keyframes sparkleFloat {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		50% {
			transform: translateY(-20px) rotate(180deg);
			opacity: 1;
		}
		75% {
			opacity: 1;
		}
	}

	.success-title {
		font-size: 2rem;
		font-weight: 700;
		color: white;
		margin: 0;
	}

	.success-subtitle {
		font-size: 1.125rem;
		color: rgba(255, 255, 255, 0.7);
		margin: 0;
	}

	.success-progress {
		width: 100%;
		max-width: 300px;
	}

	.success-progress .progress-track {
		height: 6px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
		margin-bottom: 1rem;
	}

	.success-progress .progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #10b981, #3b82f6);
		border-radius: 3px;
		transition: width 0.1s ease;
	}

	.progress-text {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
	}

	/* Responsive Design */
	@media (max-width: 640px) {
		.setup-container {
			padding: 1rem;
		}

		.setup-form {
			padding: 2rem 1.5rem;
		}

		.form-title {
			font-size: 1.75rem;
		}

		.field-grid {
			grid-template-columns: 1fr;
		}

		.step-actions {
			flex-direction: column;
			gap: 1rem;
		}

		.final-actions {
			flex-direction: column;
		}

		.btn {
			width: 100%;
			justify-content: center;
		}

		.success-state {
			padding: 2rem 1rem;
		}

		.success-title {
			font-size: 1.75rem;
		}
	}
</style>
