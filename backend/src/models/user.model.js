import { db, isFirebaseInitialized } from "../config/firebase.js";

const USERS = "user";

export const getUserById = async (uid) => {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  const doc = await db.collection(USERS).doc(uid).get();
  return doc.exists ? doc.data() : null;
};

export const createUser = async (user) => {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  const userData = {
    ...user,
    createdAt: new Date(),
  };
  await db.collection(USERS).doc(user.firebaseUid).set(userData);
  console.log(`💾 Firestore write: Created user document ${user.firebaseUid} in collection '${USERS}'`);
  return userData;
};

export const updateUser = async (uid, updates) => {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  await db.collection(USERS).doc(uid).update({
    ...updates,
    updatedAt: new Date(),
  });

  const updated = await db.collection(USERS).doc(uid).get();
  return updated.data();
};
