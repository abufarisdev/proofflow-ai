import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

let adminInstance;
let db;

try {
  const serviceAccount = require("../../firebaseServiceKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  adminInstance = admin;
  db = admin.firestore();

  console.log("🔥 Firebase Admin Initialized");

} catch (error) {
  console.error("❌ Firebase Admin Init Failed:", error);
  adminInstance = null;
  db = null;
}

export { adminInstance as admin, db };
