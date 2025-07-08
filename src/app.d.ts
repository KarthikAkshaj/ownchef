// src/app.d.ts - FIXED VERSION
declare global {
	namespace App {
		interface Error { }

		interface Locals {
			user: {
				id: string;
				username: string;
				email: string | null;
				firstName: string | null;
				lastName: string | null;
				bio: string | null;
				profileImage: string | null;
				age: number | null;
				createdAt: Date;
				updatedAt: Date;
			} | null;

			session: {
				id: string;
				userId: string;
				expiresAt: Date;
			} | null;
		}

		interface PageData { }

		interface PageState { }

		interface Platform { }
	}
}

export { };