<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import Navbar from '../components/Navbar/Navbar.svelte';
	import Footer from '../components/Footer/Footer.svelte';
	import ToastContainer from '$lib/components/Toast/ToastContainer.svelte';
	import { theme } from '$lib/stores/theme';

	export let data;
</script>

<div data-theme={$theme}>
	<Navbar />
	<main class="pt-20">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<slot />
		</div>
	</main>
	<Footer />

	<!-- Toast notifications -->
	<ToastContainer position="top-right" maxToasts={5} />
</div>
