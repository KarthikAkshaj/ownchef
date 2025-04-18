<!-- src/components/CookingMode/CookingMode.svelte -->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { X, ChevronLeft, ChevronRight, Clock, Check } from 'lucide-svelte';

	export let steps: { title: string; content: string }[] = [];
	export let title: string = '';
	export let onClose: () => void;

	let currentStep = 0;
	let completedSteps: boolean[] = Array(steps.length).fill(false);

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
			window.scrollTo(0, 0);
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
			window.scrollTo(0, 0);
		}
	}

	function toggleStepComplete() {
		completedSteps[currentStep] = !completedSteps[currentStep];
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		} else if (event.key === 'ArrowRight') {
			nextStep();
		} else if (event.key === 'ArrowLeft') {
			prevStep();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="cooking-mode" in:fade={{ duration: 300 }}>
	<div class="cooking-mode-header">
		<button class="close-button" on:click={onClose} aria-label="Close cooking mode">
			<X size={24} />
		</button>
		<h1 class="recipe-title">{title}</h1>
		<div class="progress-indicator">
			Step {currentStep + 1} of {steps.length}
		</div>
	</div>

	<div class="step-container">
		{#key currentStep}
			<div class="step" in:fly={{ y: 20, duration: 300 }}>
				<div class="step-header">
					<div class="step-number">{currentStep + 1}</div>
					<h2 class="step-title">{steps[currentStep].title}</h2>
					<button
						class="complete-step-button"
						class:completed={completedSteps[currentStep]}
						on:click={toggleStepComplete}
						aria-label={completedSteps[currentStep]
							? 'Mark step as incomplete'
							: 'Mark step as complete'}
					>
						<Check size={24} />
					</button>
				</div>
				<p class="step-content">{steps[currentStep].content}</p>
			</div>
		{/key}
	</div>

	<div class="cooking-mode-footer">
		<button
			class="nav-button prev"
			on:click={prevStep}
			disabled={currentStep === 0}
			aria-label="Previous step"
		>
			<ChevronLeft size={24} />
			<span>Previous</span>
		</button>

		<div class="step-dots">
			{#each steps as _, i}
				<button
					class="step-dot"
					class:active={i === currentStep}
					class:completed={completedSteps[i]}
					on:click={() => (currentStep = i)}
					aria-label={`Go to step ${i + 1}`}
				></button>
			{/each}
		</div>

		<button
			class="nav-button next"
			on:click={nextStep}
			disabled={currentStep === steps.length - 1}
			aria-label="Next step"
		>
			<span>Next</span>
			<ChevronRight size={24} />
		</button>
	</div>
</div>

<style lang="postcss">
	.cooking-mode {
		@apply fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900;
		@apply overflow-y-auto;
	}

	.cooking-mode-header {
		@apply sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900;
		@apply z-10;
	}

	.close-button {
		@apply rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200;
	}

	.recipe-title {
		@apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-900 dark:text-white;
		@apply max-w-[60%] truncate;
	}

	.progress-indicator {
		@apply text-sm font-medium text-gray-500 dark:text-gray-400;
	}

	.step-container {
		@apply flex-1 p-6;
	}

	.step {
		@apply mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800;
	}

	.step-header {
		@apply mb-6 flex items-center gap-4;
	}

	.step-number {
		@apply flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white shadow-md;
	}

	.step-title {
		@apply flex-1 text-2xl font-bold text-gray-900 dark:text-white;
	}

	.complete-step-button {
		@apply flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 transition-all hover:border-orange-500 hover:text-orange-500 dark:border-gray-600 dark:text-gray-500 dark:hover:border-orange-500 dark:hover:text-orange-500;
	}

	.complete-step-button.completed {
		@apply border-green-500 bg-green-500 text-white hover:border-green-600 hover:bg-green-600 hover:text-white dark:border-green-500 dark:bg-green-500 dark:text-white dark:hover:border-green-600 dark:hover:bg-green-600;
	}

	.step-content {
		@apply prose prose-lg max-w-none text-gray-700 dark:prose-invert dark:text-gray-300;
		@apply prose-headings:text-gray-900 dark:prose-headings:text-white;
		@apply prose-strong:text-gray-900 dark:prose-strong:text-white;
	}

	.cooking-mode-footer {
		@apply sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900;
	}

	.nav-button {
		@apply flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-gray-700 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700;
	}

	.nav-button.prev {
		@apply mr-auto;
	}

	.nav-button.next {
		@apply ml-auto;
	}

	.step-dots {
		@apply absolute left-1/2 flex -translate-x-1/2 gap-2;
	}

	.step-dot {
		@apply h-2.5 w-2.5 rounded-full bg-gray-300 transition-all hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500;
	}

	.step-dot.active {
		@apply w-8 bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600;
	}

	.step-dot.completed {
		@apply bg-green-500 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600;
	}
</style>
