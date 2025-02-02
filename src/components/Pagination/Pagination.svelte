<!-- src/components/Pagination/Pagination.svelte -->
<script lang="ts">
	export let page: number;
	export let hasMore: boolean;

	function handlePageChange(newPage: number) {
		if ((newPage > page && hasMore) || (newPage < page && page > 1)) {
			window.history.pushState({}, '', `?page=${newPage}`);
		}
	}
</script>

<div class="pagination">
	<button
		class="page-button"
		class:disabled={page <= 1}
		on:click={() => handlePageChange(page - 1)}
	>
		Previous
	</button>
	<button class="page-button" class:disabled={!hasMore} on:click={() => handlePageChange(page + 1)}>
		Next
	</button>
</div>

<style lang="postcss">
	.pagination {
		@apply flex items-center justify-between;
	}

	.page-button {
		@apply rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-200;
		@apply bg-orange-500 text-white hover:bg-orange-600;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
	}

	.disabled {
		@apply pointer-events-none opacity-50;
	}
</style>
