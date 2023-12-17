import { redirect } from '@sveltejs/kit';
import { signOut } from 'firebase/auth';
import { auth } from '../../../utils/firebase';

export async function POST({ cookies }) {
	/* @migration task: add path argument */ cookies.delete('session');
	await signOut(auth);
	redirect(303, '/');
}
