// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDqtCjaXf_2XUqebhS2K0CeVXEktUDHMQ",
  authDomain: "masss-6dbc3.firebaseapp.com",
  projectId: "masss-6dbc3",
  storageBucket: "masss-6dbc3.firebasestorage.app",
  messagingSenderId: "638199930794",
  appId: "1:638199930794:web:d469cafda02e6df44095d3",
  measurementId: "G-LT6JSJ2RWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
