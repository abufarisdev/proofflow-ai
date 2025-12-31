        // backend/src/models/projects.model.js (Completely replaced with Firestore logic)
        import { db, admin } from "../config/firebase.js";

        const projectsCollection = db.collection("projects");

        export const getProjectById = async (projectId) => {
          const projectDoc = await projectsCollection.doc(projectId).get();
          return projectDoc.exists ? { id: projectDoc.id, ...projectDoc.data() } : null;
        };

        export const getProjectsByUserId = async (userId) => {
          const projectsSnapshot = await projectsCollection.where("userId", "==", userId).get();
          return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };

        export const createProject = async (projectData) => {
          const newProjectData = {
            ...projectData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: projectData.status || "pending", // Add default status as per old schema
          };
          const projectRef = await projectsCollection.add(newProjectData);
          return { id: projectRef.id, ...newProjectData };
        };

        export const updateProject = async (projectId, updateData) => {
          await projectsCollection.doc(projectId).update({
            ...updateData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          const updatedDoc = await projectsCollection.doc(projectId).get();
          return { id: updatedDoc.id, ...updatedDoc.data() };
        };

        export const deleteProject = async (projectId) => {
          await projectsCollection.doc(projectId).delete();
        };
