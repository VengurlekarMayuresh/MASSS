// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration - replace with your own config
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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics only if supported
export let analytics = null;
try {
    if (typeof window !== 'undefined') {
        isSupported().then((supported) => {
            if (supported) {
                analytics = getAnalytics(app);
            }
        });
    }
} catch (error) {
    console.warn('Analytics not supported:', error);
}

export default app;
