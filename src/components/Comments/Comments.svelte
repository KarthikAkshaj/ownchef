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
		@apply mt-12 p-6;
		background: rgba(26, 54, 54, 0.6);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(143, 169, 152, 0.3);
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.title {
		@apply mb-6 text-2xl font-bold;
		color: #EBE0CC;
	}

	.write {
		@apply flex flex-col gap-4 mb-8;
	}

	.input {
		@apply w-full p-5;
		background: rgba(26, 54, 54, 0.5);
		border: 1px solid rgba(143, 169, 152, 0.3);
		border-radius: 12px;
		color: #EBE0CC;
		transition: all 0.3s ease;
		resize: none;
		min-height: 100px;
	}

	.input:focus {
		outline: none;
		border-color: #8FA998;
		box-shadow: 0 0 0 2px rgba(143, 169, 152, 0.2);
	}

	.input::placeholder {
		color: rgba(214, 189, 152, 0.6);
	}

	.button {
		@apply w-max px-6 py-2 font-medium transition-all;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #EBE0CC;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.3);
	}

	.button:hover {
		box-shadow: 0 6px 16px rgba(103, 125, 106, 0.4);
		transform: translateY(-2px);
	}

	.comments {
		@apply mt-8 space-y-6;
	}

	.comment {
		@apply pb-6;
		border-bottom: 1px solid rgba(143, 169, 152, 0.2);
	}

	.comment:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.user {
		@apply mb-4 flex items-center gap-4;
	}

	.userImageContainer {
		@apply relative h-12 w-12;
	}

	.image {
		@apply h-full w-full rounded-full object-cover;
		border: 2px solid #8FA998;
	}

	.userInfo {
		@apply flex flex-col;
	}

	.username {
		@apply font-medium;
		color: #EBE0CC;
	}

	.date {
		@apply text-sm;
		color: #D6BD98;
	}

	.desc {
		@apply leading-6;
		color: rgba(235, 224, 204, 0.9);
	}
</style>
