// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c192a.firebaseapp.com",
  projectId: "mern-estate-c192a",
  storageBucket: "mern-estate-c192a.firebasestorage.app",
  messagingSenderId: "867121343164",
  appId: "1:867121343164:web:4415fc14b88d11a7fcfeb9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);