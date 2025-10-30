// services/firebase.ts

// ✅ استيراد الوظائف التي نحتاجها
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

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
const app = initializeApp(firebaseConfig);

// ✅ تفعيل خدمات Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ تفعيل التحليلات (analytics) فقط إذا كانت مدعومة
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export { analytics };
export default app;
