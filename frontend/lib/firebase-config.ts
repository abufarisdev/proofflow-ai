import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
const auth = getAuth(app);

export { app, auth };
