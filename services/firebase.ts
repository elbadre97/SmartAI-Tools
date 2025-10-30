// services/firebase.ts

// FIX: Changed to namespace imports to avoid potential module resolution issues.
// This preserves the v9+ modular API while being more robust with some build tools.
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import * as firebaseFirestore from "firebase/firestore";
import * as firebaseAnalytics from "firebase/analytics";

// ✅ إعدادات تطبيقك من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDrsQpMlzjcFjUY8YBbikig1EPenBhL8WY",
  authDomain: "smartai-tools.firebaseapp.com",
  projectId: "smartai-tools",
  storageBucket: "smartai-tools.firebasestorage.app",
  messagingSenderId: "21937599398",
  appId: "1:21937599398:web:32e4c3fa8dd7a0cb391567",
  measurementId: "G-5R64B9Y7WH"
};

// ✅ تهيئة التطبيق
const app = firebaseApp.initializeApp(firebaseConfig);

// ✅ تفعيل خدمات Firebase
export const auth = firebaseAuth.getAuth(app);
export const db = firebaseFirestore.getFirestore(app);

// ✅ تفعيل التحليلات (analytics) فقط إذا كانت مدعومة
let analytics: any = null;
if (typeof window !== "undefined") {
  firebaseAnalytics.isSupported().then((supported) => {
    if (supported) analytics = firebaseAnalytics.getAnalytics(app);
  });
}

export { analytics };
export default app;
