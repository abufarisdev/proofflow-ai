
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJGzJEiRnnGNpovvRj621nsxNZS9T-psE",
  authDomain: "proofflow-ai.firebaseapp.com",
  projectId: "proofflow-ai",
  storageBucket: "proofflow-ai.firebasestorage.app",
  messagingSenderId: "137806276386",
  appId: "1:137806276386:web:00a6cd8bb78f4db546e77b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
