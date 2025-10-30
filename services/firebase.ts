// services/firebase.ts
// FIX: Changed to named imports for firebase/app to resolve module export errors.
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
// import * as firebaseAnalytics from "firebase/analytics";

// ✅ إعدادات تطبيقك من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCqewW88AVmKF9vXcf1ytmbHDZglUARC4I",
  authDomain: "smartai-tools.firebaseapp.com",
  projectId: "smartai-tools",
  storageBucket: "smartai-tools.firebasestorage.app",
  messagingSenderId: "21937599398",
  appId: "1:21937599398:web:32e4c3fa8dd7a0cb391567",
  measurementId: "G-5R64B9Y7WH"
};

let auth: Auth | null = null;
let db: Firestore | null = null;
// let analytics: firebaseAnalytics.Analytics | null = null;

// Initialize Firebase and services in a try-catch block to gracefully handle
// potential configuration errors, allowing the app to run without Firebase features.
try {
  // FIX: Use named imports directly instead of via a namespace.
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  auth = getAuth(app);
  db = getFirestore(app);

  /*
  if (typeof window !== "undefined") {
    firebaseAnalytics.isSupported().then((supported) => {
      if (supported) {
        analytics = firebaseAnalytics.getAnalytics(app);
      }
    });
  }
  */
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // App will continue with `auth` as null, disabling Firebase-dependent features.
}

export { auth, db };