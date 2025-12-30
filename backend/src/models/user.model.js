import { admin, db } from "../config/firebase.js";

const usersCollection = db.collection("users");

export const getUserById = async (firebaseUid) => {
  if (!firebaseUid) return null;

  const doc = await usersCollection.doc(firebaseUid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const createUser = async (userData) => {
  if (!userData?.firebaseUid) {
    throw new Error("firebaseUid required");
  }

  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  const payload = {
    ...userData,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await usersCollection.doc(userData.firebaseUid).set(payload);

  const doc = await usersCollection.doc(userData.firebaseUid).get();
  return { id: doc.id, ...doc.data() };
};

export const updateUser = async (firebaseUid, updateData) => {
  await usersCollection.doc(firebaseUid).update({
    ...updateData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const doc = await usersCollection.doc(firebaseUid).get();
  return { id: doc.id, ...doc.data() };
};
