<script lang="ts">
	import CardList from '$components/CardList/CardList.svelte';
	export let data;
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-4xl font-bold">
		{data.category.name} Recipes
	</h1>
	<CardList posts={data.posts} />
</div>
