import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyDRmbtaD238eMpdphTeZ0Tw4_uBWpu6Dxk",
  authDomain: "brand-products-manager.firebaseapp.com",
  projectId: "brand-products-manager",
  storageBucket: "brand-products-manager.firebasestorage.app",
  messagingSenderId: "398191240964",
  appId: "1:398191240964:web:8ee3062e4cd727fccf1251",
  measurementId: "G-Q4PYPJP4EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const db = getFirestore(app); // Firestore instance

export {db, app, auth}
