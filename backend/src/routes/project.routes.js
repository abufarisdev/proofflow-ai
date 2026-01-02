import express from "express";
import firebaseAuth from "../middleware/firebaseAuth.js";
import {
  createProject,
  getUserProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", firebaseAuth, createProject);
router.get("/", firebaseAuth, getUserProjects);

export default router;
