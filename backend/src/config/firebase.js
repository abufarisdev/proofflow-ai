import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

let adminInstance;

try {
  const serviceAccount = require("../../firebaseServiceKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("🔥 Firebase Admin Initialized");
  adminInstance = admin;

} catch (error) {
  console.error("❌ Error initializing Firebase Admin SDK:", error);
  adminInstance = null; // IMPORTANT: no mock in real mode
}

export default adminInstance;
