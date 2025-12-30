import { admin } from "../config/firebase.js";
import { getUserById, createUser } from "../models/user.model.js";

const firebaseAuth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email, name, picture } = decoded;

    let user = await getUserById(uid);

    if (!user) {
      user = await createUser({
        firebaseUid: uid,
        email: email || "",
        displayName: name || "New User",
        avatarUrl: picture || "",
        role: "Developer",
        organization: "",
        bio: "",
        githubUsername: "",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default firebaseAuth;
