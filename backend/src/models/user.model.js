import { db } from "../config/firebase.js";

const USERS = "users";

export const getUserById = async (uid) => {
  const doc = await db.collection(USERS).doc(uid).get();
  return doc.exists ? doc.data() : null;
};

export const createUser = async (user) => {
  await db.collection(USERS).doc(user.firebaseUid).set({
    ...user,
    createdAt: new Date(),
  });
  return user;
};

export const updateUser = async (uid, updates) => {
  await db.collection(USERS).doc(uid).update({
    ...updates,
    updatedAt: new Date(),
  });

  const updated = await db.collection(USERS).doc(uid).get();
  return updated.data();
};
