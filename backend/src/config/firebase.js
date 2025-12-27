import admin from "firebase-admin";

let adminInstance;

try {
  const serviceAccount = (await import("../../firebaseServiceKey.json", { assert: { type: "json" } })).default;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  adminInstance = admin;
} catch (error) {
  if (error.code === 'ERR_MODULE_NOT_FOUND') {
    console.log("`firebaseServiceKey.json` not found, so Firebase Admin SDK is not initialized. Using a mock for authentication which is not secure.");
  } else {
    console.error("Error initializing Firebase Admin SDK:", error);
  }

  adminInstance = {
    auth: () => ({
      verifyIdToken: async (token) => {
        console.log("Firebase not initialized, using mock user.");
        return { uid: 'mock-uid', email: 'mock@example.com' };
      },
    }),
  };
}

export default adminInstance;