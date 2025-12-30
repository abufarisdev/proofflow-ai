import { admin, db } from "../config/firebase.js";

const projectsCollection = db.collection("projects");

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

    const ref = await projectsCollection.add(data);

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
  const userId = req.user?.firebaseUid;

  const snap = await projectsCollection
    .where("userId", "==", userId)
    .get();

  const projects = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  res.json({ success: true, projects });
};
