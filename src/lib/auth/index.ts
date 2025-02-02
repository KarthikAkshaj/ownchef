// src/lib/auth/index.ts
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

export async function signIn(username: string, password: string) {
	try {
		const response = await fetch('/api/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || 'Authentication failed');
		}

		goto('/');
		return { success: true };
	} catch (error) {
		console.error('Sign in error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Authentication failed'
		};
	}
}

export async function signOut() {
	try {
		await fetch('/api/auth', {
			method: 'DELETE'
		});
		goto('/login');
	} catch (error) {
		console.error('Sign out error:', error);
	}
}

export function requireAuth() {
	const $page = get(page);
	if (!$page?.data?.session) {
		goto('/login');
		return false;
	}
	return true;
}
