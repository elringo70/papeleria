import { redirect } from '@sveltejs/kit';
import admin from './utils/firebase-admin';

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
  const currentLocation = url.pathname;

  if (!token) {
    locals.user = null;
    if (!publicRoutes.includes(currentLocation)) throw redirect(303, '/signin');
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
    } catch (error) {
      cookies.delete('session');
      locals.user = null;
      if (privateRoutes.includes(currentLocation)) throw redirect(303, '/signin');
    }

    if (publicRoutes.includes(currentLocation))
      return new Response(null, { status: 303, headers: { location: '/profile' } });
  }

  const response = await resolve(event);
  return response;
};
