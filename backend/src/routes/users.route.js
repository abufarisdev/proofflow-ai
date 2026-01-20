import express from "express";
import firebaseAuth from "../middleware/firebaseAuth.js";
import { getMe, updateMe } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", firebaseAuth, getMe);
router.put("/me", firebaseAuth, updateMe);

export default router;
