// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDm_A_R2mVcK1pUsdwbPxvnZ-7UFpQAivY',
	authDomain: 'papeleria-be740.firebaseapp.com',
	projectId: 'papeleria-be740',
	storageBucket: 'papeleria-be740.appspot.com',
	messagingSenderId: '136219209728',
	appId: '1:136219209728:web:20dba4cfdd3524c7fc68e5'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, 'CLIENT');
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
