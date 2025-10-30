// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrsQpMlzjcFjUY8YBbikig1EPenBhL8WY",
  authDomain: "smartai-tools.firebaseapp.com",
  projectId: "smartai-tools",
  storageBucket: "smartai-tools.firebasestorage.app",
  messagingSenderId: "21937599398",
  appId: "1:21937599398:web:32e4c3fa8dd7a0cb391567",
  measurementId: "G-5R64B9Y7WH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
