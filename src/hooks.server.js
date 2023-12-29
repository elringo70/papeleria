import { redirect } from '@sveltejs/kit';
import admin from './utils/firebase-admin';
import { FIREBASE_API_KEY } from '$env/static/private';

const publicRoutes = ['/', '/signin', '/signup'];
const privateRoutes = [
	'/categories',
	'/customers',
	'/orders',
	'/products',
	'/logout',
	'/profile',
	'/settings',
	'/test'
];

export const handle = async ({ event, resolve }) => {
	const { cookies, locals, url } = event;

	const token = cookies.get('session');
	const refreshToken = cookies.get('refreshToken');
	const currentLocation = url.pathname;

	if (!token) {
		locals.user = null;
		if (!publicRoutes.includes(currentLocation)) redirect(303, '/signin');
	} else {
		try {
			const decodedToken = await admin.auth().verifyIdToken(token);

			const user = {
				name: decodedToken.name ?? 'No name',
				email: decodedToken.email,
				picture: decodedToken.picture ?? 'No picture',
				uid: decodedToken.uid
			};

			locals.user = user;

			if (timeDate(decodedToken)) {
				const expiresIn = 1000 * 60 * 60 * 27 * 7;

				const { id_token, refresh_token } = await refreshTokenFunction(refreshToken);

				cookies.set('session', id_token, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: expiresIn
				});

				cookies.set('refreshToken', refresh_token, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: expiresIn
				});
			}
		} catch (error) {
			cookies.delete('session', { path: '/' });
			cookies.delete('refreshToken', { path: '/' });
			locals.user = null;
			if (privateRoutes.includes(currentLocation)) redirect(303, '/signin');
		}

		if (publicRoutes.includes(currentLocation))
			return new Response(null, { status: 303, headers: { location: '/profile' } });
	}

	const response = await resolve(event);
	return response;
};

const refreshTokenFunction = async (refreshToken) => {
	const url = 'https://securetoken.googleapis.com/v1/token?key=' + FIREBASE_API_KEY;
	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		})
	});

	const data = await response.json();
	const { id_token, refresh_token } = data;

	return { id_token, refresh_token };
};

const timeDate = (decodedToken) => {
	const actualDate = new Date();
	const expirationDate = decodedToken.exp * 1000;
	const expDate = new Date();
	expDate.setTime(expirationDate);

	return expDate - actualDate < 600000;
};
