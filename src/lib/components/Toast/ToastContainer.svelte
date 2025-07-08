<!-- src/lib/components/Toast/ToastContainer.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import toast, { ToastPersistence, toastA11y } from '$lib/stores/toast';
	import Toast from './Toast.svelte';
	import type { ToastData, ToastContainerOptions } from '$lib/stores/toast';

	// Props
	export let position: ToastContainerOptions['position'] = 'top-right';
	export let maxToasts: number = 5;
	export let spacing: number = 8;

	// State
	let toasts: ToastData[] = [];
	let containerElement: HTMLDivElement;

	// Position classes
	const positionClasses = {
		'top-right': 'fixed top-4 right-4 z-50',
		'top-left': 'fixed top-4 left-4 z-50',
		'bottom-right': 'fixed bottom-4 right-4 z-50',
		'bottom-left': 'fixed bottom-4 left-4 z-50',
		'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
		'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'
	};

	// Animation directions based on position
	const animationDirections = {
		'top-right': { x: 400, y: 0 },
		'top-left': { x: -400, y: 0 },
		'bottom-right': { x: 400, y: 0 },
		'bottom-left': { x: -400, y: 0 },
		'top-center': { x: 0, y: -100 },
		'bottom-center': { x: 0, y: 100 }
	};

	// Subscribe to toast store
	const unsubscribe = toast.subscribe((newToasts) => {
		// Limit number of visible toasts
		const visibleToasts = newToasts.slice(-maxToasts);

		// Announce new toasts to screen readers
		const previousIds = new Set(toasts.map((t) => t.id));
		visibleToasts.forEach((toast) => {
			if (!previousIds.has(toast.id)) {
				toastA11y.announce(toast.message, toast.type);
			}
		});

		toasts = visibleToasts;

		// Persist important toasts
		ToastPersistence.save(newToasts);
	});

	onMount(() => {
		// Load persisted toasts on mount
		const persistedToasts = ToastPersistence.load();
		persistedToasts.forEach((toastData) => {
			toast.add(toastData.message, {
				type: toastData.type,
				title: toastData.title,
				persistent: true
			});
		});

		// Clear persisted toasts since they're now loaded
		ToastPersistence.clear();

		return () => {
			unsubscribe();
		};
	});

	function handleToastClose(toastId: string) {
		toast.remove(toastId);
	}

	function handleActionClick(toastId: string, action: () => void) {
		action();
		toast.remove(toastId);
	}

	// Calculate transform for stacked toasts
	function getToastTransform(index: number): string {
		const isTop = position.includes('top');
		const baseOffset = index * spacing;

		if (isTop) {
			return `translateY(${baseOffset}px)`;
		} else {
			return `translateY(-${baseOffset}px)`;
		}
	}

	// Get animation direction
	function getAnimationDirection() {
		return animationDirections[position];
	}
</script>

<div
	bind:this={containerElement}
	class="toast-container {positionClasses[position]}"
	role="region"
	aria-label="Notifications"
	aria-live="polite"
>
	{#each toasts as toastData, index (toastData.id)}
		<div
			class="toast-wrapper"
			style="transform: {getToastTransform(index)}; z-index: {1000 - index};"
			animate:flip={{ duration: 300 }}
			in:fly={{
				...getAnimationDirection(),
				duration: 300,
				delay: index * 50
			}}
			out:fly={{
				...getAnimationDirection(),
				duration: 200
			}}
		>
			<Toast
				type={toastData.type}
				title={toastData.title}
				message={toastData.message}
				duration={toastData.persistent ? 0 : toastData.duration}
				persistent={toastData.persistent}
				showIcon={toastData.showIcon}
				showClose={toastData.showClose}
				onClose={() => handleToastClose(toastData.id)}
			>
				<!-- Action button slot -->
				{#if toastData.action}
					<button
						class="toast-action {toastData.action.style || 'secondary'}"
						on:click={() => handleActionClick(toastData.id, toastData.action.handler)}
					>
						{toastData.action.label}
					</button>
				{/if}
			</Toast>
		</div>
	{/each}
</div>

<style lang="postcss">
	.toast-container {
		@apply pointer-events-none;
		max-width: 100vw;
		max-height: 100vh;
		overflow: hidden;
	}

	.toast-wrapper {
		@apply pointer-events-auto relative;
		@apply mb-3 transition-transform duration-300 ease-out;
	}

	.toast-wrapper:last-child {
		@apply mb-0;
	}

	/* Action button styles */
	:global(.toast-action) {
		@apply ml-3 rounded-md px-3 py-1.5 text-sm font-medium transition-colors;
		@apply focus:outline-none focus:ring-2 focus:ring-offset-2;
	}

	:global(.toast-action.primary) {
		@apply bg-blue-600 text-white hover:bg-blue-700;
		@apply focus:ring-blue-500 focus:ring-offset-blue-50;
	}

	:global(.toast-action.secondary) {
		@apply border border-gray-300 bg-white text-gray-700 hover:bg-gray-50;
		@apply focus:ring-gray-500 focus:ring-offset-gray-50;
		@apply dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.toast-container {
			@apply left-4 right-4;
			transform: none !important;
		}

		.toast-wrapper {
			@apply mb-2;
		}

		:global(.toast) {
			@apply min-w-0 max-w-none;
		}
	}

	/* Reduce motion for accessibility */
	@media (prefers-reduced-motion: reduce) {
		.toast-wrapper {
			@apply transition-none;
		}

		:global(.toast-progress-bar) {
			animation: none;
		}
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		:global(.toast) {
			@apply border-2 border-solid;
		}

		:global(.toast-action) {
			@apply border-2;
		}
	}

	/* Focus management for keyboard navigation */
	.toast-container:focus-within {
		@apply outline-none;
	}

	/* Stack overflow handling */
	.toast-container {
		max-height: calc(100vh - 2rem);
		overflow-y: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.toast-container::-webkit-scrollbar {
		display: none;
	}

	/* Print styles */
	@media print {
		.toast-container {
			@apply hidden;
		}
	}
</style>
