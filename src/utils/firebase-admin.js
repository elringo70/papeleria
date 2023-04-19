import admin from 'firebase-admin';

import serviceAccount from 'C:/Users/elrin/Documents/GitHub/papeleria/firebase-admin.json';

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}

export default admin;
