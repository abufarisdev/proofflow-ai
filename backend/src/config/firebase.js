import admin from "firebase-admin";

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

  if (serviceAccount.project_id) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    admin
Instance = admin;
    db = admin.firestore();
    console.log("🔥 Firebase Admin Initialized");
  } else {
    console.warn("⚠️ Firebase service account environment variables not found. Admin SDK not initialized.");
    adminInstance = null;
    db = null;
  }
} catch (error) {
  console.error("❌ Firebase Admin Init Failed:", error);
  adminInstance = null;
  db = null;
}

export { adminInstance as admin, db };
