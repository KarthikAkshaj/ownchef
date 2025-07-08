<!-- src/lib/components/RichTextEditor.svelte - ENHANCED VERSION -->
<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import {
		Bold,
		Italic,
		Underline,
		List,
		ListOrdered,
		Quote,
		Link,
		Image,
		Undo,
		Redo,
		Type,
		AlignLeft,
		AlignCenter,
		AlignRight
	} from 'lucide-svelte';

	// Props
	export let value = '';
	export let placeholder = 'Start writing your recipe story...';
	export let height = '400px';
	export let readonly = false;
	export let theme: 'light' | 'dark' = 'light';

	// Internal state
	let editor: HTMLDivElement;
	let quill: any;
	let isInitialized = false;
	let showLinkDialog = false;
	let linkUrl = '';
	let linkText = '';
	let currentSelection: any = null;

	const dispatch = createEventDispatcher();

	// Toolbar configuration
	const toolbarOptions = [
		['bold', 'italic', 'underline'],
		['blockquote', 'code-block'],
		[{ header: 1 }, { header: 2 }],
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ align: [] }],
		['link', 'image'],
		['clean']
	];

	// Custom toolbar
	const customToolbarOptions = {
		toolbar: {
			container: '#toolbar',
			handlers: {
				link: handleLinkClick,
				image: handleImageClick
			}
		},
		theme: 'snow',
		placeholder: placeholder,
		readOnly: readonly,
		modules: {
			toolbar: toolbarOptions
		}
	};

	onMount(async () => {
		if (!browser) return;

		try {
			// Dynamic import to avoid SSR issues
			const Quill = (await import('quill')).default;

			// Initialize Quill with custom configuration
			quill = new Quill(editor, {
				theme: 'snow',
				placeholder: placeholder,
				readOnly: readonly,
				modules: {
					toolbar: {
						container: '#toolbar',
						handlers: {
							link: handleLinkClick,
							image: handleImageClick
						}
					}
				}
			});

			// Set initial content
			if (value) {
				quill.root.innerHTML = value;
			}

			// Listen for text changes
			quill.on('text-change', () => {
				value = quill.root.innerHTML;
				dispatch('change', { value });
			});

			// Listen for selection changes
			quill.on('selection-change', (range: any) => {
				currentSelection = range;
				dispatch('selection-change', { range });
			});

			isInitialized = true;
		} catch (error) {
			console.error('Failed to initialize Quill editor:', error);
		}
	});

	// Custom handlers
	function handleLinkClick() {
		if (!quill) return;

		const range = quill.getSelection();
		if (range) {
			const text = quill.getText(range.index, range.length);
			linkText = text || '';
			linkUrl = '';
			showLinkDialog = true;
			currentSelection = range;
		}
	}

	function handleImageClick() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = async (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (file && quill) {
				try {
					const formData = new FormData();
					formData.append('file', file);
					formData.append('type', 'recipes');

					const response = await fetch('/api/upload', {
						method: 'POST',
						body: formData
					});

					const result = await response.json();
					if (result.success) {
						const range = quill.getSelection() || { index: 0 };
						quill.insertEmbed(range.index, 'image', result.data.url);
					}
				} catch (error) {
					console.error('Image upload failed:', error);
				}
			}
		};
		input.click();
	}

	function insertLink() {
		if (!quill || !currentSelection) return;

		if (linkUrl) {
			if (linkText) {
				quill.deleteText(currentSelection.index, currentSelection.length);
				quill.insertText(currentSelection.index, linkText);
				quill.formatText(currentSelection.index, linkText.length, 'link', linkUrl);
			} else {
				quill.formatText(currentSelection.index, currentSelection.length, 'link', linkUrl);
			}
		}

		closeLink();
	}

	function closeLink() {
		showLinkDialog = false;
		linkUrl = '';
		linkText = '';
		currentSelection = null;
	}

	// Public methods
	export function focus() {
		quill?.focus();
	}

	export function getContent() {
		return quill?.root.innerHTML || '';
	}

	export function setContent(content: string) {
		if (quill) {
			quill.root.innerHTML = content;
		}
	}

	export function insertText(text: string) {
		if (quill) {
			const range = quill.getSelection() || { index: 0 };
			quill.insertText(range.index, text);
		}
	}

	// Reactive updates
	$: if (quill && value !== quill.root.innerHTML) {
		quill.root.innerHTML = value;
	}

	$: if (quill) {
		quill.enable(!readonly);
	}
</script>

<!-- Import Quill CSS -->
<svelte:head>
	<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
</svelte:head>

<div class="editor-container" class:readonly>
	<!-- Custom Toolbar -->
	<div id="toolbar" class="editor-toolbar">
		<!-- Text Formatting -->
		<span class="ql-formats">
			<button class="ql-bold" title="Bold">
				<Bold size={14} />
			</button>
			<button class="ql-italic" title="Italic">
				<Italic size={14} />
			</button>
			<button class="ql-underline" title="Underline">
				<Underline size={14} />
			</button>
		</span>

		<!-- Headers -->
		<span class="ql-formats">
			<select class="ql-header" title="Text Style">
				<option value="1">Heading 1</option>
				<option value="2">Heading 2</option>
				<option value="3">Heading 3</option>
				<option selected>Normal</option>
			</select>
		</span>

		<!-- Lists and Blocks -->
		<span class="ql-formats">
			<button class="ql-list" value="ordered" title="Numbered List">
				<ListOrdered size={14} />
			</button>
			<button class="ql-list" value="bullet" title="Bullet List">
				<List size={14} />
			</button>
			<button class="ql-blockquote" title="Quote">
				<Quote size={14} />
			</button>
		</span>

		<!-- Alignment -->
		<span class="ql-formats">
			<button class="ql-align" value="" title="Align Left">
				<AlignLeft size={14} />
			</button>
			<button class="ql-align" value="center" title="Align Center">
				<AlignCenter size={14} />
			</button>
			<button class="ql-align" value="right" title="Align Right">
				<AlignRight size={14} />
			</button>
		</span>

		<!-- Media and Links -->
		<span class="ql-formats">
			<button class="ql-link" title="Insert Link">
				<Link size={14} />
			</button>
			<button class="ql-image" title="Insert Image">
				<Image size={14} />
			</button>
		</span>

		<!-- Actions -->
		<span class="ql-formats">
			<button class="ql-clean" title="Remove Formatting">
				<Type size={14} />
			</button>
		</span>
	</div>

	<!-- Editor Area -->
	<div bind:this={editor} class="editor-content" style="min-height: {height};"></div>

	<!-- Character count -->
	<div class="editor-footer">
		<div class="character-count">
			{value.replace(/<[^>]*>/g, '').length} characters
		</div>
	</div>
</div>

<!-- Link Dialog -->
{#if showLinkDialog}
	<div class="link-dialog-overlay" on:click={closeLink}>
		<div class="link-dialog" on:click|stopPropagation>
			<h3>Insert Link</h3>

			<div class="link-form">
				<div class="form-group">
					<label for="link-text">Link Text</label>
					<input
						id="link-text"
						type="text"
						bind:value={linkText}
						placeholder="Enter link text"
						class="link-input"
					/>
				</div>

				<div class="form-group">
					<label for="link-url">URL</label>
					<input
						id="link-url"
						type="url"
						bind:value={linkUrl}
						placeholder="https://example.com"
						class="link-input"
						required
					/>
				</div>
			</div>

			<div class="link-actions">
				<button class="btn-cancel" on:click={closeLink}> Cancel </button>
				<button class="btn-insert" on:click={insertLink} disabled={!linkUrl}> Insert Link </button>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	/* Container */
	.editor-container {
		@apply rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800;
		@apply transition-colors duration-200;
	}

	.editor-container.readonly {
		@apply bg-gray-50 dark:bg-gray-900;
	}

	/* Toolbar Styles */
	.editor-toolbar {
		@apply border-b border-gray-200 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700;
		@apply flex flex-wrap items-center gap-1;
	}

	:global(.ql-formats) {
		@apply mr-3 flex items-center gap-1;
	}

	:global(.ql-toolbar button) {
		@apply flex h-8 w-8 items-center justify-center rounded border-0 bg-transparent transition-colors;
		@apply hover:bg-gray-200 dark:hover:bg-gray-600;
	}

	:global(.ql-toolbar button.ql-active) {
		@apply bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400;
	}

	:global(.ql-toolbar select) {
		@apply rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white;
	}

	/* Editor Content */
	.editor-content {
		@apply p-4;
	}

	:global(.ql-editor) {
		@apply text-gray-900 dark:text-white;
		@apply min-h-[300px] leading-relaxed;
	}

	:global(.ql-editor.ql-blank::before) {
		@apply font-normal italic text-gray-400 dark:text-gray-500;
	}

	:global(.ql-editor h1) {
		@apply mb-4 text-2xl font-bold;
	}

	:global(.ql-editor h2) {
		@apply mb-3 text-xl font-semibold;
	}

	:global(.ql-editor h3) {
		@apply mb-2 text-lg font-medium;
	}

	:global(.ql-editor blockquote) {
		@apply border-l-4 border-gray-300 bg-gray-50 p-4 italic dark:border-gray-600 dark:bg-gray-800;
	}

	:global(.ql-editor ul, .ql-editor ol) {
		@apply my-4 pl-6;
	}

	:global(.ql-editor li) {
		@apply mb-1;
	}

	:global(.ql-editor img) {
		@apply my-4 max-w-full rounded-lg;
	}

	:global(.ql-editor a) {
		@apply text-blue-600 underline dark:text-blue-400;
	}

	:global(.ql-editor p) {
		@apply mb-3;
	}

	/* Footer */
	.editor-footer {
		@apply border-t border-gray-200 px-4 py-2 dark:border-gray-600;
	}

	.character-count {
		@apply text-xs text-gray-500 dark:text-gray-400;
	}

	/* Link Dialog */
	.link-dialog-overlay {
		@apply fixed inset-0 z-50 flex items-center justify-center bg-black/50;
	}

	.link-dialog {
		@apply w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800;
	}

	.link-dialog h3 {
		@apply mb-4 text-lg font-semibold text-gray-900 dark:text-white;
	}

	.link-form {
		@apply space-y-4;
	}

	.form-group {
		@apply space-y-1;
	}

	.form-group label {
		@apply block text-sm font-medium text-gray-700 dark:text-gray-300;
	}

	.link-input {
		@apply w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white;
		@apply focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500;
	}

	.link-actions {
		@apply mt-6 flex justify-end gap-3;
	}

	.btn-cancel {
		@apply rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600;
	}

	.btn-insert {
		@apply rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50;
	}

	/* Dark Mode Overrides */
	:global(.ql-snow .ql-tooltip) {
		@apply bg-gray-800 text-white dark:border-gray-600;
	}

	:global(.ql-snow .ql-tooltip input[type='text']) {
		@apply bg-gray-700 text-white;
	}

	/* Focus States */
	.editor-container:focus-within {
		@apply ring-2 ring-blue-500/20;
	}

	/* Responsive Design */
	@media (max-width: 640px) {
		.editor-toolbar {
			@apply p-1;
		}

		:global(.ql-formats) {
			@apply mr-2;
		}

		:global(.ql-toolbar button) {
			@apply h-7 w-7;
		}

		.editor-content {
			@apply p-3;
		}

		.link-dialog {
			@apply mx-4;
		}
	}

	/* Custom scrollbar for editor */
	:global(.ql-editor) {
		scrollbar-width: thin;
		scrollbar-color: rgb(156 163 175) transparent;
	}

	:global(.ql-editor::-webkit-scrollbar) {
		width: 6px;
	}

	:global(.ql-editor::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.ql-editor::-webkit-scrollbar-thumb) {
		background-color: rgb(156 163 175);
		border-radius: 3px;
	}

	:global(.ql-editor::-webkit-scrollbar-thumb:hover) {
		background-color: rgb(107 114 128);
	}
</style>
