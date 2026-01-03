import { admin, isFirebaseInitialized } from "../config/firebase.js";
import { getUserById, createUser, updateUser } from "../models/user.model.js";

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

    const { uid, email, name, picture, githubUsername: claimGithubUsername } = decoded;
    
    // Prefer GitHub username from token claims (set during OAuth exchange). Fallback to Firebase user displayName if it looks like a username.
    let githubUsername = claimGithubUsername || "";
    try {
      const firebaseUser = await admin.auth().getUser(uid);

      // If not present in claims, check customClaims directly (safety)
      if (!githubUsername && firebaseUser.customClaims && firebaseUser.customClaims.githubUsername) {
        githubUsername = firebaseUser.customClaims.githubUsername;
      }

      // Fallback to displayName only if it doesn't contain spaces (likely a login)
      if (!githubUsername && firebaseUser.displayName && !/\s/.test(firebaseUser.displayName)) {
        githubUsername = firebaseUser.displayName;
      }

      // If Firestore user exists but lacks githubUsername, update it for future requests
      let existingUser = await getUserById(uid);
      if (existingUser && !existingUser.githubUsername && githubUsername) {
        await updateUser(uid, { githubUsername });
        existingUser = await getUserById(uid);
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
