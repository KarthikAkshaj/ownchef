<script lang="ts">
	import Comments from '$components/Comments/Comments.svelte';
	export let data;
</script>

<div class="mx-auto max-w-4xl">
	<h1 class="mb-4 text-4xl font-bold">{data.post.title}</h1>
	<div class="prose max-w-none">
		{@html data.post.content}
	</div>
	<Comments />
</div>
