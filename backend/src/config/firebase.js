import admin from "firebase-admin";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables first (path relative to backend root)
dotenv.config({ path: join(__dirname, "../../.env") });

let adminInstance;
let db;

try {
  const serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
  };

  if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
    // Check if Firebase app is already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    adminInstance = admin;
    db = admin.firestore();
    console.log("🔥 Firebase Admin Initialized");
    console.log(`   Project ID: ${serviceAccount.project_id}`);
  } else {
    console.warn("⚠️ Firebase service account environment variables not found. Admin SDK not initialized.");
    console.warn("Required env vars: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL");
    console.warn(`   FIREBASE_PROJECT_ID: ${serviceAccount.project_id ? "✅ Set" : "❌ Missing"}`);
    console.warn(`   FIREBASE_PRIVATE_KEY: ${serviceAccount.private_key ? "✅ Set" : "❌ Missing"}`);
    console.warn(`   FIREBASE_CLIENT_EMAIL: ${serviceAccount.client_email ? "✅ Set" : "❌ Missing"}`);
    console.warn("   Make sure your .env file is in the backend/ directory with all Firebase credentials.");
    adminInstance = null;
    db = null;
  }
} catch (error) {
  console.error("❌ Firebase Admin Init Failed:", error.message);
  adminInstance = null;
  db = null;
}

// Helper function to check if db is initialized
export const isFirebaseInitialized = () => {
  return db !== null && adminInstance !== null;
};

export { adminInstance as admin, db };
