// services/firebase.ts
import * as firebaseApp from "firebase/app";
import { 
  getAuth, 
  type Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type UserCredential
} from "firebase/auth";
import { getFirestore, type Firestore, doc, getDoc, setDoc, updateDoc, serverTimestamp, type Timestamp } from "firebase/firestore";
import type { UserProfileData } from '../types';

// FIX: Reverted to hardcoded Firebase config to resolve initialization errors
// in environments where environment variables are not set.
const firebaseConfig = {
  apiKey: "AIzaSyDrsQpMlzjcFjUY8YBbikig1EPenBhL8WY",
  authDomain: "smartai-tools.firebaseapp.com",
  projectId: "smartai-tools",
  storageBucket: "smartai-tools.firebasestorage.app",
  messagingSenderId: "21937599398",
  appId: "1:21937599398:web:32e4c3fa8dd7a0cb391567",
  measurementId: "G-5R64B9Y7WH"
};

let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  const app = firebaseApp.getApps().length === 0 ? firebaseApp.initializeApp(firebaseConfig) : firebaseApp.getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

// --- New Auth Functions ---

export const signUpWithEmailPassword = async (name: string, email: string, password: string): Promise<UserCredential> => {
    if (!auth) throw new Error("Auth not initialized");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // After creating the user, update their auth profile with the name
    await updateProfile(userCredential.user, { displayName: name });
    // Also create their Firestore profile document to prevent race conditions on first load
    await createUserProfile(userCredential.user.uid, name);
    return userCredential;
};

export const signInWithEmailPassword = async (email: string, password: string): Promise<UserCredential> => {
    if (!auth) throw new Error("Auth not initialized");
    return await signInWithEmailAndPassword(auth, email, password);
};


// --- User Profile Service Functions ---

const DAILY_POINTS = 30;

const isFromPreviousDay = (timestamp: Timestamp): boolean => {
    const lastResetDate = timestamp.toDate();
    const today = new Date();
    // Reset the time part of 'today' to compare dates only
    today.setHours(0, 0, 0, 0);
    lastResetDate.setHours(0, 0, 0, 0);
    return lastResetDate.getTime() < today.getTime();
};

export const getUserProfile = async (uid: string): Promise<UserProfileData | null> => {
    if (!db) return null;
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        const data = docSnap.data() as {
            points: number;
            lastPointsReset: Timestamp;
            displayName?: string;
        };

        // Check and reset points if the last reset was on a previous day
        if (data.lastPointsReset && isFromPreviousDay(data.lastPointsReset)) {
            await updateDoc(userDocRef, {
                points: DAILY_POINTS,
                lastPointsReset: serverTimestamp(),
            });
            return { ...data, points: DAILY_POINTS, lastPointsReset: new Date() };
        }
        
        // Convert Firestore Timestamp to JS Date for use in the app state
        return {
            ...data,
            lastPointsReset: data.lastPointsReset.toDate(),
        };
    } else {
        return null;
    }
};

export const createUserProfile = async (uid: string, name?: string): Promise<UserProfileData> => {
    if (!db) throw new Error("Firestore not initialized");
    const newUserProfile = { // Explicitly define the object shape for setDoc
        points: DAILY_POINTS,
        lastPointsReset: serverTimestamp(),
        displayName: name || null,
    };
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, newUserProfile);
    // Return a UserProfileData compliant object with a JS Date for local state
    return { points: DAILY_POINTS, lastPointsReset: new Date(), displayName: name };
};

export const deductUserPoint = async (uid: string, currentPoints: number, amount: number): Promise<number> => {
    if (!db) throw new Error("Firestore not initialized");
    const newPoints = Math.max(0, currentPoints - amount);
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { points: newPoints });
    return newPoints;
};

export { auth, db };