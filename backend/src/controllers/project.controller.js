import { admin, db, isFirebaseInitialized } from "../config/firebase.js";

const getProjectsCollection = () => {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  return db.collection("projects");
};

export const createProject = async (req, res) => {
  try {
    const userId = req.user?.firebaseUid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { repoName, repoUrl } = req.body;
    if (!repoName || !repoUrl) {
      return res.status(400).json({ message: "repoName and repoUrl required" });
    }

    const data = {
      userId,
      repoName,
      repoUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const ref = await getProjectsCollection().add(data);

    res.status(201).json({
      success: true,
      project: { id: ref.id, ...data },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user?.firebaseUid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const snap = await getProjectsCollection()
      .where("userId", "==", userId)
      .get();

    const projects = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    res.json({ success: true, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const userId = req.user?.firebaseUid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    
    // Check if the project exists and belongs to the user
    const projectDoc = await getProjectsCollection().doc(id).get();
    
    if (!projectDoc.exists) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = projectDoc.data();
    if (project.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Delete the project
    await getProjectsCollection().doc(id).delete();

    res.json({ 
      success: true, 
      message: "Project deleted successfully" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};