<!-- src/routes/about/+page.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Users, Heart, Share2, Book, Award, Coffee } from 'lucide-svelte';

	const stats = [
		{ label: 'Active Users', value: '50K+' },
		{ label: 'Recipes Shared', value: '10K+' },
		{ label: 'Professional Chefs', value: '500+' },
		{ label: 'Countries', value: '120+' }
	];

	const features = [
		{
			icon: Users,
			title: 'Community Driven',
			description: 'Join a vibrant community of food lovers sharing their culinary experiences.'
		},
		{
			icon: Heart,
			title: 'Curated Content',
			description: 'Every recipe is tested and verified by our expert team of chefs.'
		},
		{
			icon: Share2,
			title: 'Easy Sharing',
			description: 'Share your favorite recipes with friends and family effortlessly.'
		}
	];

	const teamMembers = [
		{
			name: 'Sarah Chen',
			role: 'Head Chef',
			image: '/images/team/sarah.jpg',
			bio: 'Former Michelin-star restaurant chef with 15 years of experience.'
		},
		{
			name: 'Mike Rodriguez',
			role: 'Food Photographer',
			image: '/images/team/mike.jpg',
			bio: 'Award-winning food photographer and styling expert.'
		},
		{
			name: 'Emma Williams',
			role: 'Recipe Curator',
			image: '/images/team/emma.jpg',
			bio: 'Culinary school instructor and cookbook author.'
		}
	];
</script>

<div class="about-container" class:dark={$theme === 'dark'}>
	<!-- Hero Section -->
	<section class="hero-section">
		<div class="hero-content">
			<h1 class="hero-title">
				Empowering Home Chefs with
				<span class="highlight">Authentic Recipes</span>
			</h1>
			<p class="hero-text">
				Own Chef is a community-driven platform where passionate home cooks and professional chefs
				come together to share, learn, and celebrate the art of cooking.
			</p>
		</div>
		<div class="stats-grid">
			{#each stats as stat}
				<div class="stat-card">
					<span class="stat-value">{stat.value}</span>
					<span class="stat-label">{stat.label}</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- Mission Section -->
	<section class="mission-section">
		<div class="section-content">
			<h2 class="section-title">Our Mission</h2>
			<p class="section-text">
				We believe that great cooking should be accessible to everyone. Our mission is to preserve
				and share authentic recipes from around the world, making it easy for anyone to create
				delicious meals at home.
			</p>
			<div class="features-grid">
				{#each features as feature}
					<div class="feature-card">
						<div class="icon-wrapper">
							<svelte:component this={feature.icon} size={24} />
						</div>
						<h3 class="feature-title">{feature.title}</h3>
						<p class="feature-text">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Team Section -->
	<section class="team-section">
		<h2 class="section-title">Meet Our Team</h2>
		<p class="section-text">
			We're a diverse team of chefs, food photographers, and culinary enthusiasts dedicated to
			making your cooking journey enjoyable and successful.
		</p>
		<div class="team-grid">
			{#each teamMembers as member}
				<div class="team-card">
					<div class="member-image-wrapper">
						<img src={member.image} alt={member.name} class="member-image" />
					</div>
					<div class="member-info">
						<h3 class="member-name">{member.name}</h3>
						<span class="member-role">{member.role}</span>
						<p class="member-bio">{member.bio}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Join Section -->
	<section class="join-section">
		<div class="join-content">
			<h2 class="join-title">Join Our Culinary Community</h2>
			<p class="join-text">
				Whether you're a home cook or a professional chef, there's a place for you in our community.
				Start sharing your recipes and culinary journey today.
			</p>
			<div class="button-group">
				<a href="/signup" class="primary-button"> Get Started </a>
				<a href="/contact" class="secondary-button"> Contact Us </a>
			</div>
		</div>
	</section>
</div>

<style lang="postcss">
	.about-container {
		@apply mx-auto max-w-7xl px-4 py-12;
	}

	.hero-section {
		@apply mb-24 text-center;
	}

	.hero-content {
		@apply mx-auto max-w-3xl;
	}

	.hero-title {
		@apply mb-6 text-4xl font-bold leading-tight sm:text-5xl;
		@apply text-gray-900 dark:text-white;
	}

	.highlight {
		@apply bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent;
	}

	.hero-text {
		@apply mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-gray-400;
	}

	.stats-grid {
		@apply grid gap-6 sm:grid-cols-2 lg:grid-cols-4;
	}

	.stat-card {
		@apply flex flex-col items-center rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800;
	}

	.stat-value {
		@apply mb-2 text-3xl font-bold text-orange-500;
	}

	.stat-label {
		@apply text-sm text-gray-600 dark:text-gray-400;
	}

	.mission-section {
		@apply mb-24 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 py-24 text-white;
	}

	.section-content {
		@apply mx-auto max-w-7xl px-4;
	}

	.section-title {
		@apply mb-6 text-center text-3xl font-bold sm:text-4xl;
	}

	.section-text {
		@apply mx-auto mb-12 max-w-2xl text-center text-lg;
	}

	.features-grid {
		@apply grid gap-8 sm:grid-cols-2 lg:grid-cols-3;
	}

	.feature-card {
		@apply rounded-xl bg-white/10 p-6 backdrop-blur-sm;
	}

	.icon-wrapper {
		@apply mb-4 inline-flex rounded-full bg-white/20 p-3;
	}

	.feature-title {
		@apply mb-2 text-xl font-semibold;
	}

	.feature-text {
		@apply text-white/90;
	}

	.team-section {
		@apply mb-24 py-12;
	}

	.team-grid {
		@apply grid gap-8 sm:grid-cols-2 lg:grid-cols-3;
	}

	.team-card {
		@apply overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg dark:bg-gray-800;
	}

	.member-image-wrapper {
		@apply aspect-[4/3] w-full overflow-hidden;
	}

	.member-image {
		@apply h-full w-full object-cover;
	}

	.member-info {
		@apply p-6;
	}

	.member-name {
		@apply mb-1 text-xl font-semibold text-gray-900 dark:text-white;
	}

	.member-role {
		@apply mb-4 block text-sm text-orange-500;
	}

	.member-bio {
		@apply text-gray-600 dark:text-gray-400;
	}

	.join-section {
		@apply rounded-3xl bg-gray-50 py-16 text-center dark:bg-gray-900;
	}

	.join-content {
		@apply mx-auto max-w-2xl px-4;
	}

	.join-title {
		@apply mb-4 text-3xl font-bold text-gray-900 dark:text-white;
	}

	.join-text {
		@apply mb-8 text-gray-600 dark:text-gray-400;
	}

	.button-group {
		@apply flex flex-wrap justify-center gap-4;
	}

	.primary-button {
		@apply rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold text-white transition-all hover:opacity-90;
	}

	.secondary-button {
		@apply rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700;
	}
</style>
