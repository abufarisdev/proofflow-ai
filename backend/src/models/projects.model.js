// backend/src/models/projects.model.js (Completely replaced with Firestore logic)
import { db, admin, isFirebaseInitialized } from "../config/firebase.js";

const getProjectsCollection = () => {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  return db.collection("projects");
};

export const getProjectById = async (projectId) => {
  const projectDoc = await getProjectsCollection().doc(projectId).get();
  return projectDoc.exists ? { id: projectDoc.id, ...projectDoc.data() } : null;
};

export const getProjectsByUserId = async (userId) => {
  const projectsSnapshot = await getProjectsCollection().where("userId", "==", userId).get();
  return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createProject = async (projectData) => {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  const newProjectData = {
    ...projectData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    status: projectData.status || "pending", // Add default status as per old schema
  };
  const projectRef = await getProjectsCollection().add(newProjectData);
  return { id: projectRef.id, ...newProjectData };
};

export const updateProject = async (projectId, updateData) => {
  await getProjectsCollection().doc(projectId).update({
    ...updateData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  const updatedDoc = await getProjectsCollection().doc(projectId).get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

export const deleteProject = async (projectId) => {
  await getProjectsCollection().doc(projectId).delete();
};
