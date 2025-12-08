<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import Navbar from '../components/Navbar/Navbar.svelte';
	import Footer from '../components/Footer/Footer.svelte';
	import ToastContainer from '$lib/components/Toast/ToastContainer.svelte';
</script>

<Navbar />
<main class="min-h-screen bg-[#1A3636] pt-20">
	<slot />
</main>
<Footer />

<!-- Toast notifications -->
<ToastContainer position="top-right" maxToasts={5} />
