// backend/src/models/reports.model.js (Firestore implementation)
import { db, admin, isFirebaseInitialized } from "../config/firebase.js";

const getReportsCollection = () => {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  return db.collection("reports");
};

export const getReportById = async (reportId) => {
  const reportDoc = await getReportsCollection().doc(reportId).get();
  return reportDoc.exists ? { id: reportDoc.id, ...reportDoc.data() } : null;
};

export const getReportByProjectId = async (projectId) => {
  const reportsSnapshot = await getReportsCollection()
    .where("projectId", "==", projectId)
    .limit(1)
    .get();
  
  if (reportsSnapshot.empty) {
    return null;
  }
  
  const doc = reportsSnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const getReportsByUserId = async (userId) => {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  
  // Get all projects for the user first
  const projectsSnapshot = await db.collection("projects")
    .where("userId", "==", userId)
    .get();
  
  const projectIds = projectsSnapshot.docs.map(doc => doc.id);
  
  if (projectIds.length === 0) {
    return [];
  }
  
  // Get all reports for these projects
  // Note: Firestore 'in' queries are limited to 10 items, so we need to batch
  const reports = [];
  for (let i = 0; i < projectIds.length; i += 10) {
    const batch = projectIds.slice(i, i + 10);
    const reportsSnapshot = await getReportsCollection()
      .where("projectId", "in", batch)
      .get();
    
    reportsSnapshot.docs.forEach(doc => {
      reports.push({ id: doc.id, ...doc.data() });
    });
  }
  
  // Sort by createdAt descending (client-side to avoid index requirement)
  reports.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds || 0;
    return bTime - aTime;
  });
  
  return reports;
};

export const createReport = async (reportData) => {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  
  const newReportData = {
    ...reportData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  const reportRef = await getReportsCollection().add(newReportData);
  return { id: reportRef.id, ...newReportData };
};

export const updateReport = async (reportId, updateData) => {
  await getReportsCollection().doc(reportId).update({
    ...updateData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  const updatedDoc = await getReportsCollection().doc(reportId).get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

export const deleteReport = async (reportId) => {
  await getReportsCollection().doc(reportId).delete();
};

