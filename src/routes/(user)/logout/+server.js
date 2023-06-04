import { redirect } from '@sveltejs/kit';
import { signOut } from 'firebase/auth';
import { auth } from '../../../utils/firebase';

export async function POST({ cookies }) {
	cookies.delete('session');
	await signOut(auth);
	throw redirect(303, '/');
}
