// src/lib/stores/theme.ts
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = 'light';
const initialValue = browser
	? (window.localStorage.getItem('theme') ?? defaultValue)
	: defaultValue;

export const theme = writable<string>(initialValue);

if (browser) {
	theme.subscribe((value) => {
		window.localStorage.setItem('theme', value);
		document.documentElement.setAttribute('data-theme', value);
		document.documentElement.classList.toggle('dark', value === 'dark');
	});
}
