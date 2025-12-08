<div class="categoryList">
	<a href="/category/thai" class="categoryItem style">Thai</a>
	<a href="/category/japanese" class="categoryItem fashion">Japanese</a>
	<a href="/category/italian" class="categoryItem food">Italian</a>
	<a href="/category/indian" class="categoryItem travel">Indian</a>
	<a href="/category/spanish" class="categoryItem culture">Spanish</a>
	<a href="/category/chinese" class="categoryItem coding">Chinese</a>
</div>

<style lang="postcss">
	.categoryList {
		@apply flex flex-wrap gap-3;
	}

	.categoryItem {
		@apply rounded-lg px-4 py-2 text-sm;
	}

	.style {
		@apply bg-blue-100 text-blue-600;
	}

	.fashion {
		@apply bg-rose-100 text-rose-600;
	}

	.food {
		@apply bg-green-100 text-green-600;
	}

	.travel {
		@apply bg-orange-100 text-orange-600;
	}

	.culture {
		@apply bg-purple-100 text-purple-600;
	}

	.coding {
		@apply bg-indigo-100 text-indigo-600;
	}
</style>
