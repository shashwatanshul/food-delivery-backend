// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-1b3cc.firebaseapp.com",
  projectId: "vingo-1b3cc",
  storageBucket: "vingo-1b3cc.firebasestorage.app",
  messagingSenderId: "41516713689",
  appId: "1:41516713689:web:eca5b8218637414abde0c8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
