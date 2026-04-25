import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-WEtzrlobXquK_JOEEZnf33OAbS-5x0c", 
  authDomain: "curalink-db8c9.firebaseapp.com",
  projectId: "curalink-db8c9",
  storageBucket: "curalink-db8c9.firebasestorage.app",
  messagingSenderId: "957985422586",
  appId: "1:957985422586:web:9cde7cff93df54644a9d43",
  measurementId: "G-9SS9H5B04M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
