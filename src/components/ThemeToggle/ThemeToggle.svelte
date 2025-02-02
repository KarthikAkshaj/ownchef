<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Moon, Sun } from 'lucide-svelte';
</script>

<button type="button" class="container" on:click={() => ($theme = $theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle Theme">
	<Moon class="icon moon" size={16} />
	<div class="ball" class:dark={$theme === 'dark'}></div>
	<Sun class="icon sun" size={16} />
</button>

<style lang="postcss">	
	.container {
		@apply relative flex h-[24px] w-[42px] cursor-pointer items-center justify-between rounded-full border border-gray-300 bg-white p-1 dark:bg-gray-800;
	}

	.ball {
		@apply absolute right-1 h-[15px] w-[15px] rounded-full bg-gray-200 transition-all duration-300;
	}

	.ball.dark {
		@apply left-1 bg-gray-700;
	}

	/* .icon {
		@apply text-gray-700 dark:text-gray-300;
	} */

	/* .moon {
		@apply text-gray-400;
	}

	.sun {
		@apply text-yellow-500;
	} */
</style>
