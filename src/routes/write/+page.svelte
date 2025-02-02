<!-- src/routes/write/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Image as ImageIcon, Plus, ExternalLink, Video } from 'lucide-svelte';
	import { page } from '$app/stores';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';

	let open = false;
	let content = '';
	let title = '';

	// Client-side redirect if no session
	$: if (!$page.data.session) {
		goto('/login');
	}

	// Handle form submission
	async function handleSubmit() {
		if (!title || !content) return;

		const response = await fetch('/api/posts', {
			method: 'POST',
			body: JSON.stringify({
				title,
				content
			})
		});

		if (response.ok) {
			goto('/blog');
		}
	}
</script>

<div class="container">
	<form on:submit|preventDefault={handleSubmit} class="relative">
		<input type="text" placeholder="T I T L E" class="input" bind:value={title} required />

		<div class="editor">
			<button type="button" class="button" on:click={() => (open = !open)}>
				<Plus size={24} />
			</button>

			{#if open}
				<div class="add">
					<button type="button" class="addButton">
						<ImageIcon size={24} />
					</button>
					<button type="button" class="addButton">
						<ExternalLink size={24} />
					</button>
					<button type="button" class="addButton">
						<Video size={24} />
					</button>
				</div>
			{/if}

			<RichTextEditor bind:value={content} />
		</div>

		<button type="submit" class="publish"> Publish </button>
	</form>
</div>

<style lang="postcss">
	.container {
		@apply flex flex-col gap-5 p-8;
	}

	.input {
		@apply border-none bg-transparent p-12 text-3xl outline-none placeholder:text-gray-400;
	}

	.editor {
		@apply relative flex flex-col gap-5;
	}

	.button {
		@apply flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-50;
	}

	.add {
		@apply absolute left-12 top-0 z-10 flex gap-5;
	}

	.addButton {
		@apply flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:bg-gray-50;
	}

	.publish {
		@apply absolute right-8 top-8 cursor-pointer rounded-md border-none bg-green-500 px-5 py-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50;
	}
</style>
