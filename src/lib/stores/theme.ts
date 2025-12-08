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
	});
}
