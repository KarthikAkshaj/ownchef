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
		@apply rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-300;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #1A3636;
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.3);
	}

	.page-button:hover:not(.disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(143, 169, 152, 0.4);
		background: linear-gradient(135deg, #8FA998, #B5C9BD);
	}

	.page-button:active:not(.disabled) {
		transform: translateY(0);
	}

	.disabled {
		@apply pointer-events-none opacity-50;
	}
</style>
