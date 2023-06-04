import admin from 'firebase-admin';
import { GOOGLE_APPLICATION_CREDENTIALS } from '$env/static/private';

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
		storageBucket: 'papeleria-be740.appspot.com'
	});
}

export const bucket = admin.storage().bucket();
export default admin;
