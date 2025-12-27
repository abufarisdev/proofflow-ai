
import axios from "axios";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
} from "firebase/auth";

const API_URL = "http://localhost:5000/api/auth";

export const getGithubAuthUrl = async () => {
  try {
    const response = await axios.get(`${API_URL}/github`);
    return response.data.url;
  } catch (error) {
    console.error("Error getting GitHub auth URL", error);
    throw error;
  }
};

export const exchangeCodeForToken = async (code: string) => {
  try {
    const response = await axios.post(`${API_URL}/github/callback`, { code });
    if (response.data.access_token) {
      localStorage.setItem("github_token", response.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error("Error exchanging code for token", error);
    throw error;
  }
};

export const getGithubToken = () => {
  return localStorage.getItem("github_token");
};

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
