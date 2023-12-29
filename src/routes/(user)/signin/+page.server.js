import { error, redirect } from '@sveltejs/kit';

const expiresIn = 1000 * 60 * 60 * 27 * 7;

export const load = async ({ locals }) => {
	try {
		return { user: JSON.parse(JSON.stringify(locals.user)) };
	} catch (err) {
		console.log('Error:', err);
		error(500, err);
	}
};

export const actions = {
	loginWithEmailAndPassword: async ({ request, cookies }) => {
		const body = Object.fromEntries(await request.formData());

		cookies.set('session', body.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: expiresIn
		});

		cookies.set('refreshToken', body.refreshToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: expiresIn
		});

		redirect(303, '/orders');
	},
	loginWithGoogle: async ({ request, cookies }) => {
		const body = Object.fromEntries(await request.formData());

		cookies.set('session', body.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: expiresIn
		});

		redirect(303, '/orders');
	}
};
