<!-- src/lib/components/AutoSave/AutoSave.svelte -->
<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import { Save, Clock, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { toastHelpers } from '$lib/stores/toast';

	// ========================================
	// PROPS AND CONFIGURATION
	// ========================================

	export let data: any; // Data to auto-save
	export let saveEndpoint: string = '/api/recipes/autosave';
	export let interval: number = 30000; // Auto-save every 30 seconds
	export let debounceDelay: number = 2000; // Wait 2 seconds after last change
	export let enabled: boolean = true;
	export let showIndicator: boolean = true;
	export let storageKey: string = 'recipe_draft';
	export let maxRetries: number = 3;

	// ========================================
	// STATE MANAGEMENT
	// ========================================

	type AutoSaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error' | 'offline';

	let status: AutoSaveStatus = 'idle';
	let lastSaved: Date | null = null;
	let lastError: string | null = null;
	let retryCount: number = 0;
	let isOnline: boolean = true;
	let hasUnsavedChanges: boolean = false;

	// Timers and intervals
	let debounceTimer: NodeJS.Timeout;
	let autoSaveInterval: NodeJS.Timeout;
	let retryTimeout: NodeJS.Timeout;

	// Previous data for comparison
	let previousData: string = '';

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		saved: { timestamp: Date; data: any };
		error: { error: string; data: any };
		restored: { data: any };
		statusChange: { status: AutoSaveStatus };
	}>();

	// ========================================
	// LIFECYCLE AND SETUP
	// ========================================

	onMount(() => {
		if (!browser || !enabled) return;

		// Initialize data tracking
		previousData = JSON.stringify(data);

		// Set up network status monitoring
		setupNetworkMonitoring();

		// Start auto-save interval
		startAutoSaveInterval();

		// Restore from local storage if available
		restoreFromLocalStorage();

		// Set up beforeunload warning
		setupBeforeUnloadWarning();

		return () => {
			cleanup();
		};
	});

	onDestroy(() => {
		cleanup();
	});

	// ========================================
	// REACTIVE STATEMENTS
	// ========================================

	// Watch for data changes
	$: if (browser && enabled) {
		handleDataChange(data);
	}

	// Update status
	$: if (status) {
		dispatch('statusChange', { status });
	}

	// ========================================
	// CORE AUTO-SAVE LOGIC
	// ========================================

	function handleDataChange(newData: any) {
		const currentDataString = JSON.stringify(newData);

		if (currentDataString !== previousData) {
			hasUnsavedChanges = true;
			status = 'pending';

			// Clear existing debounce timer
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}

			// Set new debounce timer
			debounceTimer = setTimeout(() => {
				if (isOnline) {
					performAutoSave();
				} else {
					saveToLocalStorage();
				}
			}, debounceDelay);

			previousData = currentDataString;
		}
	}

	async function performAutoSave(): Promise<boolean> {
		if (!isOnline) {
			status = 'offline';
			saveToLocalStorage();
			return false;
		}

		status = 'saving';

		try {
			const response = await fetch(saveEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					data,
					timestamp: new Date().toISOString(),
					storageKey
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();

			if (result.success) {
				status = 'saved';
				lastSaved = new Date();
				lastError = null;
				retryCount = 0;
				hasUnsavedChanges = false;

				// Clear local storage backup since server save succeeded
				clearLocalStorage();

				// Show subtle success indicator
				if (showIndicator) {
					toastHelpers.autoSaved();
				}

				dispatch('saved', { timestamp: lastSaved, data });

				// Return to idle after short delay
				setTimeout(() => {
					if (status === 'saved') {
						status = 'idle';
					}
				}, 2000);

				return true;
			} else {
				throw new Error(result.error || 'Auto-save failed');
			}
		} catch (error) {
			console.error('Auto-save error:', error);

			lastError = error instanceof Error ? error.message : 'Unknown error';
			retryCount++;

			if (retryCount <= maxRetries) {
				status = 'pending';
				// Exponential backoff for retries
				const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000);

				retryTimeout = setTimeout(() => {
					performAutoSave();
				}, retryDelay);
			} else {
				status = 'error';
				// Save to local storage as fallback
				saveToLocalStorage();

				if (showIndicator) {
					toastHelpers.saveError('Auto-save failed. Your changes are saved locally.');
				}
			}

			dispatch('error', { error: lastError, data });
			return false;
		}
	}

	// ========================================
	// LOCAL STORAGE MANAGEMENT
	// ========================================

	function saveToLocalStorage() {
		try {
			const saveData = {
				data,
				timestamp: new Date().toISOString(),
				url: window.location.pathname
			};

			localStorage.setItem(storageKey, JSON.stringify(saveData));
			console.log('Data saved to local storage');
		} catch (error) {
			console.error('Failed to save to local storage:', error);
		}
	}

	function restoreFromLocalStorage() {
		try {
			const saved = localStorage.getItem(storageKey);
			if (!saved) return;

			const parsedData = JSON.parse(saved);
			const savedTimestamp = new Date(parsedData.timestamp);
			const isRecent = Date.now() - savedTimestamp.getTime() < 24 * 60 * 60 * 1000; // 24 hours

			if (isRecent && parsedData.data) {
				// Ask user if they want to restore
				const shouldRestore = confirm(
					`Found unsaved changes from ${savedTimestamp.toLocaleString()}. Would you like to restore them?`
				);

				if (shouldRestore) {
					dispatch('restored', { data: parsedData.data });
					clearLocalStorage();

					toastHelpers.success('Previous draft restored successfully!');
				} else {
					clearLocalStorage();
				}
			} else {
				clearLocalStorage(); // Clear old data
			}
		} catch (error) {
			console.error('Failed to restore from local storage:', error);
			clearLocalStorage();
		}
	}

	function clearLocalStorage() {
		try {
			localStorage.removeItem(storageKey);
		} catch (error) {
			console.error('Failed to clear local storage:', error);
		}
	}

	// ========================================
	// NETWORK MONITORING
	// ========================================

	function setupNetworkMonitoring() {
		isOnline = navigator.onLine;

		const handleOnline = () => {
			isOnline = true;
			if (hasUnsavedChanges && status !== 'saving') {
				// Retry auto-save when coming back online
				performAutoSave();
			}
		};

		const handleOffline = () => {
			isOnline = false;
			status = 'offline';
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}

	// ========================================
	// INTERVAL MANAGEMENT
	// ========================================

	function startAutoSaveInterval() {
		if (interval > 0) {
			autoSaveInterval = setInterval(() => {
				if (hasUnsavedChanges && isOnline && status !== 'saving') {
					performAutoSave();
				}
			}, interval);
		}
	}

	// ========================================
	// UTILITY FUNCTIONS
	// ========================================

	function setupBeforeUnloadWarning() {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				const message = 'You have unsaved changes. Are you sure you want to leave?';
				event.preventDefault();
				event.returnValue = message;
				return message;
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}

	function cleanup() {
		if (debounceTimer) clearTimeout(debounceTimer);
		if (autoSaveInterval) clearInterval(autoSaveInterval);
		if (retryTimeout) clearTimeout(retryTimeout);
	}

	// ========================================
	// PUBLIC METHODS
	// ========================================

	export function forceSave() {
		if (isOnline) {
			return performAutoSave();
		} else {
			saveToLocalStorage();
			return Promise.resolve(false);
		}
	}

	export function getStatus() {
		return {
			status,
			lastSaved,
			lastError,
			hasUnsavedChanges,
			isOnline,
			retryCount
		};
	}

	export function clearDraft() {
		clearLocalStorage();
		hasUnsavedChanges = false;
		status = 'idle';
	}

	// ========================================
	// STATUS DISPLAY HELPERS
	// ========================================

	function getStatusIcon() {
		switch (status) {
			case 'saving':
				return Clock;
			case 'saved':
				return CheckCircle;
			case 'error':
				return AlertCircle;
			case 'offline':
				return WifiOff;
			default:
				return isOnline ? Wifi : WifiOff;
		}
	}

	function getStatusText() {
		switch (status) {
			case 'saving':
				return 'Saving...';
			case 'saved':
				return lastSaved ? `Saved ${formatTime(lastSaved)}` : 'Saved';
			case 'error':
				return lastError || 'Save failed';
			case 'offline':
				return 'Offline - saved locally';
			case 'pending':
				return 'Unsaved changes';
			default:
				return 'Auto-save enabled';
		}
	}

	function formatTime(date: Date): string {
		const now = new Date();
		const diff = now.getTime() - date.getTime();

		if (diff < 60000) {
			// Less than 1 minute
			return 'just now';
		} else if (diff < 3600000) {
			// Less than 1 hour
			const minutes = Math.floor(diff / 60000);
			return `${minutes}m ago`;
		} else {
			return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}
	}

	function getStatusColor() {
		switch (status) {
			case 'saving':
				return 'text-blue-600 dark:text-blue-400';
			case 'saved':
				return 'text-green-600 dark:text-green-400';
			case 'error':
				return 'text-red-600 dark:text-red-400';
			case 'offline':
				return 'text-yellow-600 dark:text-yellow-400';
			case 'pending':
				return 'text-orange-600 dark:text-orange-400';
			default:
				return 'text-gray-600 dark:text-gray-400';
		}
	}
</script>

{#if showIndicator && enabled}
	<div
		class="auto-save-indicator {getStatusColor()}"
		title={getStatusText()}
		transition:fade={{ duration: 200 }}
	>
		<svelte:component
			this={getStatusIcon()}
			size={16}
			class={status === 'saving' ? 'animate-spin' : ''}
		/>
		<span class="status-text">{getStatusText()}</span>

		{#if status === 'error' && retryCount <= maxRetries}
			<button class="retry-button" on:click={() => performAutoSave()} title="Retry save">
				Retry
			</button>
		{/if}
	</div>
{/if}

<style lang="postcss">
	.auto-save-indicator {
		@apply flex items-center gap-2 text-sm font-medium transition-colors;
	}

	.status-text {
		@apply hidden sm:inline;
	}

	.retry-button {
		@apply ml-2 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40;
	}

	@media (max-width: 640px) {
		.auto-save-indicator {
			@apply gap-1;
		}
	}

	/* Accessibility improvements */
	.auto-save-indicator[title] {
		@apply cursor-help;
	}

	/* Animation for saving state */
	:global(.animate-spin) {
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
</style>
