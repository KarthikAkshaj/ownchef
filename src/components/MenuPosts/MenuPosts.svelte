<script lang="ts">
	export let withImage: boolean;
</script>

<div class="items">
	{#each Array(4) as _, i}
		<a href="/" class="item">
			{#if withImage}
				<div class="imageContainer">
					<img src="/Food.jpg" alt="" class="image" />
				</div>
			{/if}
			<div class="textContainer">
				<span class="category travel">Indian</span>
				<h3 class="postTitle">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
				<div class="detail">
					<span class="username">John Doe</span>
					<span class="date"> - 10.03.2023</span>
				</div>
			</div>
		</a>
	{/each}
</div>

<style lang="postcss">
	.items {
		@apply mt-5 flex flex-col gap-8;
	}

	.item {
		@apply flex gap-5;
	}

	.imageContainer {
		@apply relative aspect-square flex-1;
	}

	.image {
		@apply rounded-full border object-cover;
	}

	.textContainer {
		@apply flex flex-[4] flex-col gap-1;
	}

	.category {
		@apply w-max rounded-2xl px-2 py-1 text-sm;
	}

	.travel {
		@apply bg-orange-100 text-orange-600;
	}

	.postTitle {
		@apply text-base font-medium leading-5;
	}

	.detail {
		@apply text-sm;
	}

	.username {
		@apply font-medium;
	}

	.date {
		@apply text-gray-500;
	}
</style>
