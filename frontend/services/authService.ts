import api from "@/lib/api";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
} from "firebase/auth";

export const signUpWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential['user']> => {
  try {
    const userCredential = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up", error);
    throw error;
  }
};

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential['user']> => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem("github_token");
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
