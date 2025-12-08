<script lang="ts">
	let status = true; 
</script>

<div class="container">
	<h1 class="title">Comments</h1>
	{#if status}
		<div class="write">
			<textarea placeholder="Write a Comment..." class="input" ></textarea>
			<button class="button">Send</button>
		</div>
	{:else}
		<a href="/login">Please Login to Write a comment</a>
	{/if}

	<div class="comments">
		{#each Array(3) as _}
			<div class="comment">
				<div class="user">
					<div class="userImageContainer">
						<img src="/images/recipes/carbonara.jpg" alt="user Image" class="image" />
					</div>
					<div class="userInfo">
						<span class="username">Megumi Fushiguro</span>
						<span class="date">10.02.2023</span>
					</div>
				</div>
				<p class="desc">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, molestiae optio odio
					dolorum recusandae perspiciatis.
				</p>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.container {
		@apply mt-12;
	}

	.title {
		@apply mb-6 text-2xl font-bold text-gray-800;
	}

	.write {
		@apply flex flex-col gap-4;
	}

	.input {
		@apply w-full rounded-md border p-5;
	}

	.button {
		@apply w-max rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600;
	}

	.comments {
		@apply mt-8;
	}

	.comment {
		@apply mb-8;
	}

	.user {
		@apply mb-4 flex items-center gap-4;
	}

	.userImageContainer {
		@apply relative h-12 w-12;
	}

	.image {
		@apply h-full w-full rounded-full object-cover;
	}

	.userInfo {
		@apply flex flex-col;
	}

	.username {
		@apply font-medium;
	}

	.date {
		@apply text-sm text-gray-500;
	}

	.desc {
		@apply leading-6 text-gray-700;
	}
</style>
