<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';
	import { theme } from '$lib/stores/theme';
	import {
		User,
		Mail,
		Camera,
		Save,
		Loader2,
		AlertCircle,
		CheckCircle,
		Calendar,
		Edit3,
		ArrowLeft,
		Upload,
		X
	} from 'lucide-svelte';

	let { data, form: formErrors }: { data: PageServerData; form: ActionData } = $props();

	// Form state
	let formState = $state({
		firstName: data.user.firstName || '',
		lastName: data.user.lastName || '',
		email: data.user.email || '',
		bio: data.user.bio || '',
		age: data.user.age || null,
		location: data.user.location || '',
		website: data.user.website || '',
		profileImage: data.user.profileImage || '',
		isSubmitting: false,
		error: '',
		isUploading: false
	});

	// Update error from server
	$effect(() => {
		if (formErrors?.error) {
			formState.error = formErrors.error;
		}
	});

	function clearError() {
		formState.error = '';
	}

	// File upload handler
	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		await processFileUpload(file);
	}

	// Process file upload
	async function processFileUpload(file: File) {
		if (!file.type.startsWith('image/')) {
			formState.error = 'Please select an image file';
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			formState.error = 'Image must be smaller than 5MB';
			return;
		}

		formState.isUploading = true;
		clearError();

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('type', 'profiles');
			formData.append('alt', `${formState.firstName} ${formState.lastName} profile photo`);

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
			} else {
				throw new Error('Invalid response from server');
			}
		} catch (error) {
			formState.error = error instanceof Error ? error.message : 'Failed to upload image';
		} finally {
			formState.isUploading = false;
		}
	}

	function removeImage() {
		formState.profileImage = '';
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		if (fileInput) fileInput.value = '';
	}
</script>

<svelte:head>
	<title>Edit Profile | OwnChef</title>
</svelte:head>

<div class="edit-page" class:dark={$theme === 'dark'}>
	<div class="edit-container">
		<!-- Header -->
		<div class="edit-header">
			<a href="/profile/{data.user.username}" class="back-button">
				<ArrowLeft size={20} />
				<span>Back to Profile</span>
			</a>
			<h1 class="page-title">Edit Profile</h1>
			<p class="page-subtitle">Update your personal information</p>
		</div>

		<!-- Error Alert -->
		{#if formState.error}
			<div class="error-notification">
				<AlertCircle class="error-icon" />
				<span class="error-text">{formState.error}</span>
			</div>
		{/if}

		<!-- Edit Form -->
		<form
			method="post"
			class="edit-form"
			use:enhance={() => {
				formState.isSubmitting = true;
				clearError();

				return async ({ result, update }) => {
					if (result.type === 'failure') {
						formState.error = result.data?.error || 'Failed to save profile';
					}
					formState.isSubmitting = false;
					await update();
				};
			}}
		>
			<!-- Hidden inputs -->
			<input type="hidden" name="profileImage" value={formState.profileImage} />

			<!-- Profile Image Section -->
			<div class="image-section">
				<h2 class="section-title">
					<Camera size={20} />
					Profile Photo
				</h2>

				<div class="image-upload">
					{#if formState.profileImage && !formState.isUploading}
						<div class="image-preview">
							<img src={formState.profileImage} alt="Profile" class="profile-img" />
							<div class="image-actions">
								<button
									type="button"
									onclick={() => document.getElementById('photo-upload')?.click()}
									class="action-btn change"
								>
									<Camera size={16} />
								</button>
								<button type="button" onclick={removeImage} class="action-btn remove">
									<X size={16} />
								</button>
							</div>
						</div>
					{:else if formState.isUploading}
						<div class="upload-loading">
							<Loader2 size={32} class="spinning" />
							<p>Uploading...</p>
						</div>
					{:else}
						<button
							type="button"
							class="upload-placeholder"
							onclick={() => document.getElementById('photo-upload')?.click()}
						>
							<Upload size={32} />
							<span>Upload Photo</span>
						</button>
					{/if}
					<input
						id="photo-upload"
						type="file"
						accept="image/*"
						onchange={handleFileUpload}
						disabled={formState.isUploading}
						style="display: none;"
					/>
				</div>
			</div>

			<!-- Personal Information -->
			<div class="form-section">
				<h2 class="section-title">
					<User size={20} />
					Personal Information
				</h2>

				<div class="field-grid">
					<div class="field-group">
						<label for="firstName" class="field-label">
							First Name <span class="required">*</span>
						</label>
						<input
							id="firstName"
							name="firstName"
							type="text"
							bind:value={formState.firstName}
							oninput={clearError}
							placeholder="Your first name"
							class="field-input"
							required
						/>
					</div>

					<div class="field-group">
						<label for="lastName" class="field-label">
							Last Name <span class="required">*</span>
						</label>
						<input
							id="lastName"
							name="lastName"
							type="text"
							bind:value={formState.lastName}
							oninput={clearError}
							placeholder="Your last name"
							class="field-input"
							required
						/>
					</div>
				</div>

				<div class="field-grid">
					<div class="field-group">
						<label for="email" class="field-label">
							<Mail size={16} />
							Email Address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							bind:value={formState.email}
							placeholder="your@email.com"
							class="field-input"
						/>
					</div>

					<div class="field-group">
						<label for="age" class="field-label">
							<Calendar size={16} />
							Age
						</label>
						<input
							id="age"
							name="age"
							type="number"
							bind:value={formState.age}
							placeholder="25"
							min="13"
							max="120"
							class="field-input"
						/>
					</div>
				</div>

				<div class="field-grid">
					<div class="field-group">
						<label for="location" class="field-label">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
							Location
						</label>
						<input
							id="location"
							name="location"
							type="text"
							bind:value={formState.location}
							placeholder="City, Country"
							class="field-input"
						/>
					</div>

					<div class="field-group">
						<label for="website" class="field-label">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
							Website
						</label>
						<input
							id="website"
							name="website"
							type="url"
							bind:value={formState.website}
							placeholder="https://yourwebsite.com"
							class="field-input"
						/>
					</div>
				</div>

				<div class="field-group">
					<label for="bio" class="field-label">
						<Edit3 size={16} />
						Bio
					</label>
					<textarea
						id="bio"
						name="bio"
						bind:value={formState.bio}
						placeholder="Tell us about your cooking journey..."
						class="field-textarea"
						rows="4"
					></textarea>
				</div>
			</div>

			<!-- Actions -->
			<div class="form-actions">
				<a href="/profile/{data.user.username}" class="btn btn-secondary">Cancel</a>
				<button type="submit" class="btn btn-primary" disabled={formState.isSubmitting}>
					{#if formState.isSubmitting}
						<Loader2 size={18} class="spinning" />
						Saving...
					{:else}
						<Save size={18} />
						Save Changes
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>

<style lang="postcss">
	.edit-page {
		@apply min-h-screen;
		/* Vertical gradient: dark top → light middle → dark bottom */
		background: linear-gradient(
			to bottom,
			#40534C 0%,
			#EBE0CC 30%,
			#D6BD98 50%,
			#EBE0CC 70%,
			#40534C 100%
		);
		padding-top: 80px;
		position: relative;
		overflow-x: hidden;
	}

	.edit-page::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(
			ellipse at center,
			rgba(143, 169, 152, 0.1) 0%,
			transparent 70%
		);
		z-index: 0;
	}

	.edit-page.dark {
		/* Dark mode: dark top → lighter middle → dark bottom */
		background: linear-gradient(
			to bottom,
			#1A3636 0%,
			#40534C 30%,
			#677D6A 50%,
			#40534C 70%,
			#1A3636 100%
		);
	}

	.edit-page.dark::before {
		background: radial-gradient(
			ellipse at center,
			rgba(143, 169, 152, 0.15) 0%,
			transparent 70%
		);
	}

	.edit-container {
		@apply max-w-4xl mx-auto px-4 py-12;
		position: relative;
		z-index: 1;
	}

	/* Header */
	.edit-header {
		@apply mb-10 text-center;
	}

	.back-button {
		@apply inline-flex items-center gap-2 mb-6;
		@apply px-4 py-2 rounded-full;
		@apply bg-white/60 dark:bg-[#2A4A47]/60;
		@apply backdrop-blur-sm;
		@apply border border-[#677D6A]/20 dark:border-[#8FA998]/20;
		@apply text-[#677D6A] dark:text-[#8FA998];
		@apply hover:bg-white dark:hover:bg-[#2A4A47];
		@apply transition-all duration-300;
		@apply text-sm font-medium;
		box-shadow: 0 2px 8px rgba(103, 125, 106, 0.1);
	}

	.back-button:hover {
		transform: translateX(-4px);
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.2);
	}

	.page-title {
		@apply text-4xl md:text-5xl font-bold mb-3;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.page-subtitle {
		@apply text-lg text-[#677D6A] dark:text-[#D6BD98];
		@apply opacity-80;
	}

	/* Error Notification */
	.error-notification {
		@apply flex items-center gap-3 p-5 mb-8;
		@apply bg-gradient-to-r from-red-50 to-red-100;
		@apply dark:from-red-900/20 dark:to-red-800/20;
		@apply border-l-4 border-red-500;
		@apply rounded-xl shadow-lg;
		backdrop-filter: blur(10px);
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.error-text {
		@apply text-red-700 dark:text-red-300 text-sm font-medium;
	}

	/* Form */
	.edit-form {
		@apply bg-white/80 dark:bg-[#2A4A47]/80;
		@apply backdrop-blur-xl rounded-3xl p-10;
		@apply border border-white/20 dark:border-[#677D6A]/20;
		box-shadow:
			0 20px 60px rgba(103, 125, 106, 0.15),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		transition: all 0.3s ease;
	}

	.edit-form:hover {
		box-shadow:
			0 25px 70px rgba(103, 125, 106, 0.2),
			0 0 0 1px rgba(255, 255, 255, 0.15);
	}

	/* Sections */
	.image-section,
	.form-section {
		@apply mb-10 pb-10;
		border-bottom: 1px solid rgba(103, 125, 106, 0.1);
	}

	.image-section:last-child,
	.form-section:last-child {
		@apply border-b-0 pb-0 mb-0;
	}

	.section-title {
		@apply flex items-center justify-center gap-3;
		@apply text-2xl font-bold mb-8;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	/* Image Upload */
	.image-upload {
		@apply flex justify-center;
	}

	.image-preview {
		@apply relative w-40 h-40 rounded-full overflow-hidden;
		border: 5px solid transparent;
		background: linear-gradient(white, white) padding-box,
			linear-gradient(135deg, #677D6A, #8FA998) border-box;
		box-shadow:
			0 10px 30px rgba(103, 125, 106, 0.2),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		transition: all 0.3s ease;
	}

	.edit-page.dark .image-preview {
		background: linear-gradient(#2A4A47, #2A4A47) padding-box,
			linear-gradient(135deg, #8FA998, #677D6A) border-box;
	}

	.image-preview:hover {
		transform: scale(1.05);
		box-shadow:
			0 15px 40px rgba(103, 125, 106, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.2);
	}

	.profile-img {
		@apply w-full h-full object-cover;
	}

	.image-actions {
		@apply absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent;
		@apply flex items-center justify-center gap-3;
		@apply opacity-0 transition-all duration-300;
	}

	.image-preview:hover .image-actions {
		@apply opacity-100;
	}

	.action-btn {
		@apply w-12 h-12 rounded-full flex items-center justify-center;
		@apply transition-all duration-300 cursor-pointer border-none;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.action-btn:hover {
		transform: translateY(-2px) scale(1.1);
	}

	.action-btn.change {
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		@apply text-white;
	}

	.action-btn.remove {
		background: linear-gradient(135deg, #ef4444, #dc2626);
		@apply text-white;
	}

	.upload-loading {
		@apply w-40 h-40 rounded-full;
		@apply flex flex-col items-center justify-center gap-3;
		background: linear-gradient(135deg, rgba(103, 125, 106, 0.1), rgba(143, 169, 152, 0.1));
		border: 3px dashed rgba(103, 125, 106, 0.3);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.upload-placeholder {
		@apply w-40 h-40 rounded-full;
		@apply flex flex-col items-center justify-center gap-3;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(103, 125, 106, 0.05));
		border: 3px dashed rgba(103, 125, 106, 0.3);
		@apply transition-all duration-300 cursor-pointer;
		@apply text-[#677D6A] dark:text-[#8FA998];
		box-shadow: 0 4px 15px rgba(103, 125, 106, 0.1);
	}

	.upload-placeholder:hover {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(103, 125, 106, 0.1));
		border-color: #677D6A;
		transform: scale(1.05);
		box-shadow: 0 8px 25px rgba(103, 125, 106, 0.2);
	}

	/* Form Fields */
	.field-grid {
		@apply grid grid-cols-1 md:grid-cols-2 gap-8 mb-8;
	}

	.field-group {
		@apply flex flex-col gap-3;
		position: relative;
	}

	.field-label {
		@apply flex items-center gap-2 text-sm font-bold;
		@apply text-[#677D6A] dark:text-[#8FA998];
		@apply uppercase tracking-wide;
		letter-spacing: 0.05em;
	}

	.required {
		@apply text-red-500;
		font-size: 1.2em;
	}

	.field-input,
	.field-textarea {
		@apply w-full px-5 py-4 rounded-xl;
		@apply bg-white/50 dark:bg-[#1A3636]/50;
		@apply border-2 border-transparent;
		@apply text-[#1A3636] dark:text-[#EBE0CC];
		@apply transition-all duration-300;
		@apply focus:outline-none;
		backdrop-filter: blur(10px);
		box-shadow: 0 2px 8px rgba(103, 125, 106, 0.08);
	}

	.field-input:focus,
	.field-textarea:focus {
		@apply bg-white dark:bg-[#1A3636];
		border-color: #677D6A;
		box-shadow:
			0 0 0 4px rgba(103, 125, 106, 0.1),
			0 4px 12px rgba(103, 125, 106, 0.15);
		transform: translateY(-2px);
	}

	.field-input::placeholder,
	.field-textarea::placeholder {
		@apply text-gray-400 dark:text-gray-500;
	}

	.field-textarea {
		@apply resize-none;
		min-height: 120px;
	}

	/* Actions */
	.form-actions {
		@apply flex justify-end gap-5 mt-12 pt-8;
		border-top: 1px solid rgba(103, 125, 106, 0.1);
	}

	.btn {
		@apply flex items-center gap-3 px-8 py-4 rounded-xl;
		@apply font-bold text-base;
		@apply border-none cursor-pointer no-underline;
		@apply transition-all duration-300;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
	}

	.btn::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transform: translate(-50%, -50%);
		transition: width 0.6s, height 0.6s;
	}

	.btn:hover::before {
		width: 300px;
		height: 300px;
	}

	.btn:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
	}

	.btn:active {
		transform: translateY(-1px);
	}

	.btn:disabled {
		@apply opacity-60 cursor-not-allowed;
		transform: none !important;
	}

	.btn-secondary {
		background: linear-gradient(135deg, #E0CEAD, #D6BD98);
		@apply text-[#1A3636];
	}

	.btn-secondary:hover {
		background: linear-gradient(135deg, #D6BD98, #B5C9BD);
	}

	.edit-page.dark .btn-secondary {
		background: linear-gradient(135deg, #40534C, #677D6A);
		@apply text-[#EBE0CC];
	}

	.btn-primary {
		background: linear-gradient(135deg, #677D6A, #8FA998);
		@apply text-white;
	}

	.btn-primary:hover {
		background: linear-gradient(135deg, #8FA998, #A8C5B5);
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

	/* Responsive */
	@media (max-width: 768px) {
		.edit-container {
			@apply px-4 py-8;
		}

		.edit-form {
			@apply p-6;
		}

		.page-title {
			@apply text-3xl;
		}

		.section-title {
			@apply text-xl;
		}

		.field-grid {
			@apply grid-cols-1 gap-6;
		}

		.form-actions {
			@apply flex-col gap-4;
		}

		.btn {
			@apply w-full justify-center;
		}

		.image-preview,
		.upload-loading,
		.upload-placeholder {
			@apply w-32 h-32;
		}
	}
</style>
