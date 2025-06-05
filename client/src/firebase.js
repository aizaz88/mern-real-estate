// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-373f7.firebaseapp.com",
  projectId: "mern-estate-373f7",
  storageBucket: "mern-estate-373f7.firebasestorage.app",
  messagingSenderId: "901170394567",
  appId: "1:901170394567:web:fa95e60aab55c6b36615e2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
