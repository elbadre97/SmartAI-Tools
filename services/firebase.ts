// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
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

// Initialize and export Firebase Authentication to be used in other parts of the app
export const auth = getAuth(app);
