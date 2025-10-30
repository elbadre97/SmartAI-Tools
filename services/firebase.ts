// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

// Your web app's Firebase configuration is now loaded from environment variables
const firebaseConfig = {
  // --- IMPORTANT ---
  // These values MUST be provided as environment variables for the application to work.
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let googleAuthProviderInstance: GoogleAuthProvider | null = null;

// Initialize Firebase only if the core configuration is provided
if (
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    googleAuthProviderInstance = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase initialization failed. Please check your configuration:", error);
    // Ensure instances remain null if initialization fails
    authInstance = null;
    googleAuthProviderInstance = null;
  }
} else {
  console.warn("Firebase configuration is missing or incomplete in environment variables. Authentication functionality will be disabled.");
}

// Export auth and provider, which will be null if configuration is missing/invalid
export const auth = authInstance;
export const googleProvider = googleAuthProviderInstance;
