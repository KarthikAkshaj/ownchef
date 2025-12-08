<!-- src/components/Footer/Footer.svelte -->
<script lang="ts">
	import { Facebook, Instagram, Twitter, Youtube, ChefHat, Mail, MapPin } from 'lucide-svelte';
</script>

<footer class="footer">
	<!-- Wave Decoration -->
	<div class="wave-decoration">
		<svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="wave-svg">
			<path
				d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
				opacity=".25"
				class="wave-path"
			/>
			<path
				d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
				opacity=".5"
				class="wave-path"
			/>
			<path
				d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
				class="wave-path"
			/>
		</svg>
	</div>

	<div class="footer-main">
		<div class="footer-container">
			<!-- Brand Section -->
			<div class="brand-section">
				<div class="logo-wrapper">
					<div class="logo-icon">
						<ChefHat size={28} strokeWidth={2} />
					</div>
					<div class="logo-text">
						<span class="own">Own</span>
						<span class="chef">CHEF</span>
					</div>
				</div>
				<p class="brand-desc">
					Your ultimate destination for discovering and sharing authentic recipes from around the
					globe. Cook with passion, share with love.
				</p>
				<div class="contact-info">
					<div class="contact-item">
						<Mail size={16} strokeWidth={2} />
						<span>hello@ownchef.com</span>
					</div>
					<div class="contact-item">
						<MapPin size={16} strokeWidth={2} />
						<span>New York, NY 10012</span>
					</div>
				</div>
			</div>

			<!-- Quick Links -->
			<div class="link-column">
				<h3 class="column-title">Quick Links</h3>
				<div class="link-list">
					<a href="/" class="footer-link">
						<span class="link-arrow">→</span>
						<span>Home</span>
					</a>
					<a href="/search" class="footer-link">
						<span class="link-arrow">→</span>
						<span>Recipes</span>
					</a>
					<a href="/contact" class="footer-link">
						<span class="link-arrow">→</span>
						<span>Contact</span>
					</a>
					<a href="/about" class="footer-link">
						<span class="link-arrow">→</span>
						<span>About Us</span>
					</a>
				</div>
			</div>

			<!-- Categories -->
			<div class="link-column">
				<h3 class="column-title">Popular Cuisines</h3>
				<div class="link-list">
					<a href="/category/indian" class="footer-link">
						<span class="link-arrow">→</span>
						<span>Indian</span>
					</a>
					<a href="/category/italian" class="footer-link">
						<span class="link-arrow">→</span>
						<span>Italian</span>
					</a>
					<a href="/category/chinese" class="footer-link">
						<span class="link-arrow">→</span>
						<span>Chinese</span>
					</a>
					<a href="/category/japanese" class="footer-link">
						<span class="link-arrow">→</span>
						<span>Japanese</span>
					</a>
				</div>
			</div>

			<!-- Newsletter & Social -->
			<div class="newsletter-section">
				<h3 class="column-title">Stay Connected</h3>
				<p class="newsletter-desc">Get the latest recipes and cooking tips delivered to your inbox.</p>
				<form class="newsletter-form">
					<input type="email" placeholder="Your email address" class="newsletter-input" />
					<button type="submit" class="newsletter-button">Subscribe</button>
				</form>
				<div class="social-links">
					<a href="/" class="social-icon facebook" aria-label="Facebook">
						<Facebook size={20} strokeWidth={2} />
					</a>
					<a href="/" class="social-icon instagram" aria-label="Instagram">
						<Instagram size={20} strokeWidth={2} />
					</a>
					<a href="/" class="social-icon twitter" aria-label="Twitter">
						<Twitter size={20} strokeWidth={2} />
					</a>
					<a href="/" class="social-icon youtube" aria-label="YouTube">
						<Youtube size={20} strokeWidth={2} />
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Bottom Bar -->
	<div class="footer-bottom">
		<div class="bottom-container">
			<p class="copyright">© {new Date().getFullYear()} OwnChef. All rights reserved.</p>
			<div class="footer-links">
				<a href="/privacy" class="bottom-link">Privacy Policy</a>
				<span class="separator">•</span>
				<a href="/terms" class="bottom-link">Terms of Service</a>
				<span class="separator">•</span>
				<a href="/cookies" class="bottom-link">Cookie Policy</a>
			</div>
		</div>
	</div>
</footer>

<style lang="postcss">
	/* ========== Footer Base ========== */
	.footer {
		@apply relative mt-24 overflow-hidden;
		background: linear-gradient(180deg, #1A3636 0%, #40534C 100%);
	}

	/* ========== Wave Decoration ========== */
	.wave-decoration {
		@apply absolute left-0 right-0 top-0;
		height: 120px;
		transform: translateY(-100%);
	}

	.wave-svg {
		@apply h-full w-full;
	}

	.wave-path {
		fill: #1A3636;
	}

	/* ========== Main Footer ========== */
	.footer-main {
		@apply relative z-10 px-4 py-16;
	}

	.footer-container {
		@apply mx-auto grid max-w-7xl gap-12;
		grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
	}

	/* ========== Brand Section ========== */
	.brand-section {
		@apply flex flex-col gap-6;
	}

	.logo-wrapper {
		@apply flex items-center gap-3;
	}

	.logo-icon {
		@apply flex h-12 w-12 items-center justify-center rounded-xl;
		@apply transition-all duration-300;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.3);
		color: #EBE0CC;
	}

	.logo-icon:hover {
		transform: rotate(-5deg) scale(1.05);
	}

	.logo-text {
		@apply flex flex-col;
	}

	.own {
		@apply text-2xl font-black leading-none;
		background: linear-gradient(to right, #D6BD98, #E0CEAD, #EBE0CC);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.chef {
		@apply -mt-1 text-sm font-bold uppercase tracking-widest;
		color: #8FA998;
	}

	.brand-desc {
		@apply text-sm leading-relaxed;
		color: rgba(214, 189, 152, 0.8);
		max-width: 320px;
	}

	.contact-info {
		@apply flex flex-col gap-3;
	}

	.contact-item {
		@apply flex items-center gap-2 text-sm;
		color: rgba(214, 189, 152, 0.7);
		transition: all 0.3s ease;
	}

	.contact-item:hover {
		color: #E0CEAD;
		transform: translateX(4px);
	}

	/* ========== Link Columns ========== */
	.link-column {
		@apply flex flex-col gap-5;
	}

	.column-title {
		@apply mb-1 text-sm font-bold uppercase tracking-wider;
		color: #E0CEAD;
		position: relative;
		padding-bottom: 8px;
	}

	.column-title::after {
		content: '';
		@apply absolute bottom-0 left-0 h-0.5 w-12 rounded-full;
		background: linear-gradient(90deg, #8FA998, transparent);
	}

	.link-list {
		@apply flex flex-col gap-3;
	}

	.footer-link {
		@apply flex items-center gap-2 text-sm;
		@apply transition-all duration-300;
		color: rgba(214, 189, 152, 0.7);
	}

	.link-arrow {
		@apply inline-block transition-transform duration-300;
		opacity: 0;
		transform: translateX(-8px);
	}

	.footer-link:hover .link-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	.footer-link:hover {
		color: #E0CEAD;
		transform: translateX(4px);
	}

	/* ========== Newsletter Section ========== */
	.newsletter-section {
		@apply flex flex-col gap-5;
	}

	.newsletter-desc {
		@apply text-sm leading-relaxed;
		color: rgba(214, 189, 152, 0.7);
	}

	.newsletter-form {
		@apply flex flex-col gap-3;
	}

	.newsletter-input {
		@apply w-full rounded-lg border px-4 py-3 text-sm outline-none;
		@apply transition-all duration-300;
		background: rgba(103, 125, 106, 0.1);
		border-color: rgba(103, 125, 106, 0.3);
		color: #E0CEAD;
	}

	.newsletter-input::placeholder {
		color: rgba(214, 189, 152, 0.5);
	}

	.newsletter-input:focus {
		background: rgba(103, 125, 106, 0.15);
		border-color: rgba(143, 169, 152, 0.5);
		box-shadow: 0 0 0 3px rgba(143, 169, 152, 0.1);
	}

	.newsletter-button {
		@apply rounded-lg px-6 py-3 text-sm font-semibold;
		@apply transition-all duration-300;
		background: linear-gradient(135deg, #677D6A, #8FA998);
		color: #1A3636;
		box-shadow: 0 4px 12px rgba(103, 125, 106, 0.3);
	}

	.newsletter-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(143, 169, 152, 0.4);
	}

	.newsletter-button:active {
		transform: translateY(0);
	}

	/* ========== Social Links ========== */
	.social-links {
		@apply mt-2 flex gap-3;
	}

	.social-icon {
		@apply flex h-10 w-10 items-center justify-center rounded-lg;
		@apply transition-all duration-300;
		background: rgba(103, 125, 106, 0.2);
		border: 1px solid rgba(103, 125, 106, 0.3);
	}

	.social-icon:hover {
		transform: translateY(-4px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
	}

	.facebook {
		color: #8FA998;
	}

	.facebook:hover {
		background: rgba(103, 125, 106, 0.4);
		border-color: #8FA998;
	}

	.instagram {
		color: #B5C9BD;
	}

	.instagram:hover {
		background: rgba(181, 201, 189, 0.2);
		border-color: #B5C9BD;
	}

	.twitter {
		color: #8FA998;
	}

	.twitter:hover {
		background: rgba(103, 125, 106, 0.4);
		border-color: #8FA998;
	}

	.youtube {
		color: #D6BD98;
	}

	.youtube:hover {
		background: rgba(214, 189, 152, 0.2);
		border-color: #D6BD98;
	}

	/* ========== Bottom Bar ========== */
	.footer-bottom {
		@apply border-t px-4 py-6;
		border-color: rgba(103, 125, 106, 0.3);
		background: rgba(26, 54, 54, 0.5);
	}

	.bottom-container {
		@apply mx-auto flex max-w-7xl flex-col items-center justify-between gap-4;
		@apply md:flex-row;
	}

	.copyright {
		@apply text-sm;
		color: rgba(214, 189, 152, 0.6);
	}

	.footer-links {
		@apply flex items-center gap-3 text-sm;
	}

	.bottom-link {
		@apply transition-colors duration-300;
		color: rgba(214, 189, 152, 0.6);
	}

	.bottom-link:hover {
		color: #E0CEAD;
	}

	.separator {
		color: rgba(103, 125, 106, 0.5);
	}

	/* ========== Responsive Design ========== */
	@media (max-width: 1024px) {
		.footer-container {
			grid-template-columns: repeat(2, 1fr);
		}

		.brand-section {
			@apply col-span-2;
		}
	}

	@media (max-width: 768px) {
		.footer-container {
			@apply grid-cols-1;
		}

		.brand-section {
			@apply col-span-1;
		}

		.wave-decoration {
			height: 80px;
		}

		.footer-main {
			@apply py-12;
		}

		.bottom-container {
			@apply text-center;
		}

		.footer-links {
			@apply flex-wrap justify-center;
		}
	}
</style>
