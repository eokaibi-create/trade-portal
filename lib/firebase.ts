import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA53DSLAUXCdQKKfgzRlZ7BNjZgCq5K3l0",
  authDomain: "trade-portal-2829f.firebaseapp.com",
  projectId: "trade-portal-2829f",
  storageBucket: "trade-portal-2829f.firebasestorage.app",
  messagingSenderId: "117857044144",
  appId: "1:117857044144:web:baff84b2dfef2a9a561d75"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
