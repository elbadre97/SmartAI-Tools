// services/firebase.ts
import * as firebaseApp from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore, doc, getDoc, setDoc, updateDoc, serverTimestamp, type Timestamp } from "firebase/firestore";
import type { UserProfileData } from '../types';

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

try {
  const app = firebaseApp.getApps().length === 0 ? firebaseApp.initializeApp(firebaseConfig) : firebaseApp.getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

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
        const data = docSnap.data() as UserProfileData;
        // Check and reset points if the last reset was on a previous day
        if (data.lastPointsReset && isFromPreviousDay(data.lastPointsReset)) {
            await updateDoc(userDocRef, {
                points: DAILY_POINTS,
                lastPointsReset: serverTimestamp(),
            });
            return { ...data, points: DAILY_POINTS, lastPointsReset: new Date() };
        }
        return data;
    } else {
        return null;
    }
};

export const createUserProfile = async (uid: string): Promise<UserProfileData> => {
    if (!db) throw new Error("Firestore not initialized");
    const newUserProfile = { // Explicitly define the object shape for setDoc
        points: DAILY_POINTS,
        lastPointsReset: serverTimestamp(),
    };
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, newUserProfile);
    // Return a UserProfileData compliant object with a JS Date for local state
    return { points: DAILY_POINTS, lastPointsReset: new Date() };
};

export const deductUserPoint = async (uid: string, currentPoints: number): Promise<number> => {
    if (!db) throw new Error("Firestore not initialized");
    const newPoints = Math.max(0, currentPoints - 1);
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { points: newPoints });
    return newPoints;
};

export { auth, db };