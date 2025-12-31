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
      if (!req.user?.firebaseUid) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const user = await updateUser(req.user.firebaseUid, req.body);
      res.json({ success: true, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  