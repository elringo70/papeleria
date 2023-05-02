import { signOut } from 'firebase/auth';
import { auth } from '../../../utils/firebase';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	await cookies.delete('session');
	await signOut(auth);

	throw redirect(303, '/');
};
