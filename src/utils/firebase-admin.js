import admin from 'firebase-admin';
const serviceAccount = require('../../firebase-admin.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

export default admin;
