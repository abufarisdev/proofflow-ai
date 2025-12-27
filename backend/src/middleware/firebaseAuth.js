import admin from "../config/firebase.js";
import User from "../models/user.model.js";

const firebaseAuth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    // Find user in DB or create if new
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email || "",
        displayName: name || "New User",
      });
    }

    req.user = user; // Attach Mongoose document
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default firebaseAuth;
