import { admin, isFirebaseInitialized } from "../config/firebase.js";
import { getUserById, createUser } from "../models/user.model.js";

const firebaseAuth = async (req, res, next) => {
  if (!isFirebaseInitialized()) {
    return res.status(500).json({ message: "Firebase is not initialized. Please check server configuration." });
  }

  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email, name, picture } = decoded;
    
    // Try to get GitHub username from Firebase user record
    let githubUsername = "";
    try {
      const firebaseUser = await admin.auth().getUser(uid);
      // Check provider data for GitHub
      const githubProvider = firebaseUser.providerData.find(
        (provider) => provider.providerId === "github.com"
      );
      if (githubProvider) {
        // Extract username from email or displayName
        githubUsername = githubProvider.displayName || githubProvider.email?.split("@")[0] || "";
      }
    } catch (err) {
      console.warn("Could not fetch Firebase user for GitHub username:", err.message);
    }

    let user = await getUserById(uid);

    if (!user) {
      console.log(`📝 Creating new user in Firestore: ${uid} (${email || 'no email'})`);
      user = await createUser({
        firebaseUid: uid,
        email: email || "",
        displayName: name || "New User",
        avatarUrl: picture || "",
        role: "Developer",
        organization: "",
        bio: "",
        githubUsername: githubUsername,
      });
      console.log(`✅ User created successfully in Firestore: ${uid}`);
    } else {
      console.log(`👤 User already exists in Firestore: ${uid}`);
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default firebaseAuth;
