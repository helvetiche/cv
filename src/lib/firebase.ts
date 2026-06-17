import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwn5mpQlHdzSkW31RlNw01aK6e5jNCCXs",
  authDomain: "my-portfolio-11c8a.firebaseapp.com",
  projectId: "my-portfolio-11c8a",
  storageBucket: "my-portfolio-11c8a.firebasestorage.app",
  messagingSenderId: "286363102093",
  appId: "1:286363102093:web:75c8fff57679dbdca2ebc4",
  measurementId: "G-VLXQ1M9913",
};

// Initialize Firebase (prevent multiple initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
