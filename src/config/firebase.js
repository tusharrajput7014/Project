import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage'; // TODO: Enable later for file sharing
// import { getFunctions } from 'firebase/functions'; // TODO: Enable later for cloud functions

// Your web app's Firebase configuration
// Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIi3LhDaKFPZI_vEKtCJBCLTXEe_aiQzg",
  authDomain: "friend-finder-58d98.firebaseapp.com",
  projectId: "friend-finder-58d98",
  storageBucket: "friend-finder-58d98.firebasestorage.app",
  messagingSenderId: "1003280803300",
  appId: "1:1003280803300:web:773f5aba47c1a2049513f1",
  measurementId: "G-TW557H37XW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app); // TODO: Uncomment when enabling file sharing
// export const functions = getFunctions(app); // TODO: Uncomment when needed

export default app;
