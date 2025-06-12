import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvuyNURZndFf1GCQPF5zSXYKaHvQVdMAQ",
  authDomain: "fir-ashizawa.firebaseapp.com",
  projectId: "fir-ashizawa",
  storageBucket: "fir-ashizawa.firebasestorage.app",
  messagingSenderId: "629645682286",
  appId: "1:629645682286:web:3b9e2e29bf70933608a87f",
  measurementId: "G-KJKTCV2C7D",
};

export default function initializeFirebase() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  const auth = getAuth(app);
  console.log("Firebase initialized successfully");
}
