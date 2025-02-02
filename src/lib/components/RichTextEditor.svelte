<script lang="ts">
	import { onMount } from 'svelte';
	import 'quill/dist/quill.bubble.css';

	export let value = '';
	let element: HTMLDivElement;
	let quill: any;

	onMount(async () => {
		const Quill = (await import('quill')).default;
		quill = new Quill(element, {
			theme: 'bubble',
			placeholder: 'Share Your Recipe....'
		});

		quill.on('text-change', () => {
			value = quill.root.innerHTML;
		});
	});
</script>

<div bind:this={element} class="editor"/>

<style lang="postcss">
	.editor {
		@apply min-h-[400px] text-lg;
	}

	:global(.ql-editor.ql-blank::before) {
		@apply font-normal text-gray-400;
	}
</style>
