import { redirect } from '@sveltejs/kit';
import { signOut } from 'firebase/auth';
import { auth } from '../../../utils/firebase';

export async function GET({ cookies }) {
	cookies.delete('session', { path: '/' });
	cookies.delete('refreshToken', { path: '/' });
	await signOut(auth);
	throw redirect(303, '/');
}
