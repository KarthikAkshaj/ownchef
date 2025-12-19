// src/lib/auth/index.ts - FIXED VERSION
import { goto, invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

export async function signIn(username: string, password: string) {
	try {
		const response = await fetch('/api/auth', {
			method: 'PUT', // FIXED: Consistent use of PUT for login
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || 'Authentication failed');
		}

		// Return success with user data and setup status
		return {
			success: true,
			data: data.data,
			needsProfileSetup: data.data.needsProfileSetup
		};
	} catch (error) {
		console.error('Sign in error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Authentication failed'
		};
	}
}

export async function signUp(username: string, password: string) {
	try {
		const response = await fetch('/api/auth', {
			method: 'POST', // FIXED: Consistent use of POST for registration
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || 'Registration failed');
		}

		// Return success with user data - let calling component handle redirect
		return {
			success: true,
			data: data.data,
			needsProfileSetup: data.data.needsProfileSetup || true // New users always need setup
		};
	} catch (error) {
		console.error('Sign up error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Registration failed'
		};
	}
}

export async function signOut() {
	try {
		await fetch('/api/auth', {
			method: 'DELETE'
		});
		// Invalidate all data to force SvelteKit to reload layout data
		await invalidateAll();
		goto('/login');
	} catch (error) {
		console.error('Sign out error:', error);
		// Still invalidate and redirect even if API call fails
		await invalidateAll();
		goto('/login');
	}
}

export async function getCurrentUser() {
	try {
		const response = await fetch('/api/auth', {
			method: 'GET'
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || 'Failed to get user data');
		}

		return { success: true, data: data.data };
	} catch (error) {
		console.error('Get user error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to get user data'
		};
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

// FIXED: New function to handle proper redirect logic
export async function handleAuthRedirect(authResult: any, defaultRedirect: string = '/') {
	if (!authResult.success) return;

	// Small delay to ensure session is fully established
	await new Promise(resolve => setTimeout(resolve, 100));

	if (authResult.needsProfileSetup) {
		goto('/profile/setup');
	} else {
		const redirectTo = get(page).url.searchParams.get('redirectTo') || defaultRedirect;
		goto(redirectTo);
	}
}