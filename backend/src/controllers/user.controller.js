import {
    getUserById,
    updateUser,
  } from "../models/user.model.js";
  
  export const getMe = async (req, res) => {
    try {
      const uid = req.user?.firebaseUid;
      if (!uid) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const user = await getUserById(uid);
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const updateMe = async (req, res) => {
    try {
      const uid = req.user?.firebaseUid;
      const user = await updateUser(uid, req.body);
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
  