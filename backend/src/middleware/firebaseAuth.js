import admin from "../config/firebase.js";



const firebaseAuth = async (req, res, next) => {

  const header = req.headers.authorization;



  if (!header || !header.startsWith("Bearer ")) {

    return res.status(401).json({ message: "No token provided" });

  }



  const token = header.split(" ")[1];



  try {

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken; // uid, email, name

    next();

  } catch (err) {

    return res.status(401).json({ message: "Invalid token" });

  }

};



export default firebaseAuth;

