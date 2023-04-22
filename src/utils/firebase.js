// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyD2MLfrmVdp2tYSEAJNFuFKY-CN_VbJ3DQ',
	authDomain: 'papeleria-f4bf7.firebaseapp.com',
	projectId: 'papeleria-f4bf7',
	storageBucket: 'papeleria-f4bf7.appspot.com',
	messagingSenderId: '529992410970',
	appId: '1:529992410970:web:c2c95aa75a4ce737a7f563'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, 'CLIENT');
export const auth = getAuth(app);
