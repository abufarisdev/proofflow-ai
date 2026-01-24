import express from "express";
import firebaseAuth from "../middleware/firebaseAuth.js";

const router = express.Router();

router.get("/auth-test", firebaseAuth, (req, res) => {
  res.json({
    message: "User authenticated",
    user: req.user,
  });
});

export default router;
