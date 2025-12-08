import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				forest: {
					900: '#1A3636', // Darkest - main background
					700: '#40534C', // Dark sage - cards, navbar
					500: '#677D6A', // Medium sage - hover, accents
					300: '#8FA998', // Lighter sage (derived)
					100: '#B5C9BD'  // Very light sage (derived)
				},
				sand: {
					500: '#D6BD98', // Warm beige - primary text
					400: '#E0CEAD', // Lighter beige (derived)
					300: '#EBE0CC'  // Very light beige (derived)
				},
				accent: {
					DEFAULT: '#677D6A', // Sage green accent
					hover: '#8FA998'    // Lighter on hover
				}
			}
		}
	},

	plugins: [typography, forms]
} satisfies Config;
