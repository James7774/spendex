import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDkHIuOZwXk5Z41qaoL8GDMoT_9DOXtxE",
  authDomain: "finova-aeb4c.firebaseapp.com",
  projectId: "finova-aeb4c",
  storageBucket: "finova-aeb4c.firebasestorage.app",
  messagingSenderId: "586561165822",
  appId: "1:586561165822:web:1be6a914f9dfa23e29c8af",
  measurementId: "G-42QN7DEHF6"
};

import { getAnalytics, isSupported } from "firebase/analytics";

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

// Initialize Analytics ONLY if it's supported (client-side)
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { auth, googleAuthProvider, analytics };
