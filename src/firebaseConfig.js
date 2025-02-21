// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; // Import getAuth
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMUx5gYQJgwtfeDUKyN0tdHUTaWsmlK90",
  authDomain: "netly-dbb77.firebaseapp.com",
  projectId: "netly-dbb77",
  storageBucket: "netly-dbb77.firebasestorage.app",
  messagingSenderId: "438128479308",
  appId: "1:438128479308:web:780fff2e569568654438e9",
  measurementId: "G-LKXZTVGN5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // Initialize and export auth
export const db = getFirestore(app); // Initialize and export db (Firestore)

export default app; // Also export the app instance itself (optional, but can be useful)