import { redirect } from '@sveltejs/kit';
import admin from './utils/firebase-admin';

const publicRoutes = ['/', '/signin', '/signup'];

export const handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');
	const currentLocation = event.url.pathname;

	let decodedToken = null;
	try {
		decodedToken = await admin.auth().verifyIdToken(token);

		const user = {
			name: decodedToken.name,
			email: decodedToken.email,
			picture: decodedToken.picture,
			uid: decodedToken.uid
		};

		event.locals.user = user;
	} catch (error) {
		event.locals.user = null;
		event.cookies.delete('session');

		if (!publicRoutes.includes(currentLocation)) throw redirect(303, '/');
	}

	if (decodedToken && publicRoutes.includes(currentLocation)) throw redirect(301, '/profile');

	const response = await resolve(event);
	return response;
};
