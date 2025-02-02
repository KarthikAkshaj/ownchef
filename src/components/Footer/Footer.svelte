<!-- src/components/Footer/Footer.svelte -->
<script lang="ts">
	import { Facebook, Instagram, Twitter, Youtube } from 'lucide-svelte';
	import { theme } from '$lib/stores/theme';
</script>

<footer class="footer" class:dark={$theme === 'dark'}>
	<div class="footer-container">
		<!-- Logo Section -->
		<div class="info">
			<div class="logo-section">
				<div class="logo-text">
					<span class="own">Own</span>
					<span class="chef" class:dark={$theme === 'dark'}>CHEF</span>
				</div>
			</div>
			<p class="desc">
				Discover, create, and share delicious recipes from around the world. Join our community of
				food lovers and culinary enthusiasts.
			</p>
			<div class="social-links">
				<a href="/" class="social-icon facebook">
					<Facebook size={20} />
				</a>
				<a href="/" class="social-icon instagram">
					<Instagram size={20} />
				</a>
				<a href="/" class="social-icon twitter">
					<Twitter size={20} />
				</a>
				<a href="/" class="social-icon youtube">
					<Youtube size={20} />
				</a>
			</div>
		</div>

		<!-- Links Section -->
		<div class="links">
			<div class="link-group">
				<h3 class="group-title">Quick Links</h3>
				<a href="/">Home</a>
				<a href="/blog">Recipes</a>
				<a href="/about">About</a>
				<a href="/contact">Contact</a>
			</div>

			<div class="link-group">
				<h3 class="group-title">Categories</h3>
				<a href="/category/indian">Indian</a>
				<a href="/category/chinese">Chinese</a>
				<a href="/category/italian">Italian</a>
				<a href="/category/spanish">Spanish</a>
			</div>

			<div class="link-group">
				<h3 class="group-title">Follow Us</h3>
				<a href="/">Facebook</a>
				<a href="/">Instagram</a>
				<a href="/">Twitter</a>
				<a href="/">Youtube</a>
			</div>
		</div>
	</div>

	<div class="copyright">
		<p>© {new Date().getFullYear()} OwnChef. All rights reserved.</p>
	</div>
</footer>

<style lang="postcss">
	.footer {
		@apply mt-24 border-t transition-colors duration-300;
		@apply border-gray-200 bg-white;
	}

	.footer.dark {
		@apply border-gray-800 bg-gray-900;
	}

	.footer-container {
		@apply mx-auto max-w-7xl px-6 py-12;
		@apply grid grid-cols-1 gap-8 lg:grid-cols-3;
	}

	.info {
		@apply lg:col-span-1;
	}

	.logo-text {
		@apply flex items-baseline gap-1 text-2xl font-bold;
	}

	.own {
		@apply bg-gradient-to-br from-red-500 via-orange-400 to-yellow-500 bg-clip-text font-black text-transparent;
	}

	.chef {
		@apply font-bold tracking-wider text-gray-800 transition-colors duration-300;
	}

	.chef.dark {
		@apply text-white;
	}

	.desc {
		@apply mt-6 text-gray-600 transition-colors duration-300;
	}

	.footer.dark .desc {
		@apply text-gray-300;
	}

	.social-links {
		@apply mt-8 flex space-x-6;
	}

	.social-icon {
		@apply flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300;
	}

	.facebook {
		@apply text-[#316FF6] hover:bg-[#316FF6]/10;
	}

	.instagram {
		@apply text-[#d62976] hover:bg-[#d62976]/10;
	}

	.twitter {
		@apply text-[#1DA1F2] hover:bg-[#1DA1F2]/10;
	}

	.youtube {
		@apply text-[#FF0000] hover:bg-[#FF0000]/10;
	}

	.links {
		@apply grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-2;
	}

	.link-group {
		@apply flex flex-col space-y-4;
	}

	.group-title {
		@apply text-sm font-semibold uppercase tracking-wider;
		@apply text-gray-400 transition-colors duration-300;
	}

	.footer.dark .group-title {
		@apply text-gray-300;
	}

	.link-group a {
		@apply text-base transition-colors duration-300;
		@apply text-gray-600 hover:text-gray-900;
	}

	.footer.dark .link-group a {
		@apply text-gray-300 hover:text-white;
	}

	.copyright {
		@apply border-t transition-colors duration-300;
		@apply border-gray-200 bg-gray-50 py-4 text-center;
	}

	.footer.dark .copyright {
		@apply border-gray-800 bg-gray-900;
	}

	.copyright p {
		@apply text-sm transition-colors duration-300;
		@apply text-gray-500;
	}

	.footer.dark .copyright p {
		@apply text-gray-400;
	}
</style>
