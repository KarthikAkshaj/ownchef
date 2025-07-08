<!-- src/lib/components/Toast/Toast.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-svelte';

	export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
	export let title: string = '';
	export let message: string;
	export let duration: number = 5000; // Auto-dismiss after 5 seconds
	export let persistent: boolean = false; // Don't auto-dismiss
	export let showIcon: boolean = true;
	export let showClose: boolean = true;
	export let onClose: (() => void) | undefined = undefined;

	let visible = true;
	let timeoutId: NodeJS.Timeout;

	const icons = {
		success: CheckCircle,
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info
	};

	const styles = {
		success:
			'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
		error:
			'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
		warning:
			'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
		info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
	};

	const iconStyles = {
		success: 'text-green-500 dark:text-green-400',
		error: 'text-red-500 dark:text-red-400',
		warning: 'text-yellow-500 dark:text-yellow-400',
		info: 'text-blue-500 dark:text-blue-400'
	};

	onMount(() => {
		if (!persistent && duration > 0) {
			timeoutId = setTimeout(() => {
				close();
			}, duration);
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});

	function close() {
		visible = false;
		if (onClose) {
			onClose();
		}
	}

	function handleMouseEnter() {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	}

	function handleMouseLeave() {
		if (!persistent && duration > 0) {
			timeoutId = setTimeout(() => {
				close();
			}, 1000); // Shorter timeout after hover
		}
	}
</script>

{#if visible}
	<div
		class="toast {styles[type]}"
		transition:fly={{ y: -20, duration: 300 }}
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
		role="alert"
	>
		<div class="toast-content">
			{#if showIcon}
				<div class="toast-icon {iconStyles[type]}">
					<svelte:component this={icons[type]} size={20} />
				</div>
			{/if}

			<div class="toast-text">
				{#if title}
					<div class="toast-title">{title}</div>
				{/if}
				<div class="toast-message">{message}</div>
			</div>

			{#if showClose}
				<button class="toast-close" on:click={close}>
					<X size={16} />
				</button>
			{/if}
		</div>

		{#if !persistent && duration > 0}
			<div class="toast-progress">
				<div class="toast-progress-bar {type}" style="animation-duration: {duration}ms;"></div>
			</div>
		{/if}
	</div>
{/if}

<style lang="postcss">
	.toast {
		@apply pointer-events-auto relative overflow-hidden rounded-lg border p-4 shadow-lg;
		@apply min-w-[320px] max-w-[480px];
	}

	.toast-content {
		@apply flex items-start gap-3;
	}

	.toast-icon {
		@apply flex-shrink-0;
	}

	.toast-text {
		@apply min-w-0 flex-1;
	}

	.toast-title {
		@apply mb-1 font-semibold;
	}

	.toast-message {
		@apply text-sm leading-relaxed;
	}

	.toast-close {
		@apply flex-shrink-0 rounded-md p-1 transition-colors;
		@apply hover:bg-black/5 dark:hover:bg-white/5;
	}

	.toast-progress {
		@apply absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10;
	}

	.toast-progress-bar {
		@apply h-full origin-left;
		animation: toast-progress linear forwards;
	}

	.toast-progress-bar.success {
		@apply bg-green-500;
	}

	.toast-progress-bar.error {
		@apply bg-red-500;
	}

	.toast-progress-bar.warning {
		@apply bg-yellow-500;
	}

	.toast-progress-bar.info {
		@apply bg-blue-500;
	}

	@keyframes toast-progress {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}
</style>
