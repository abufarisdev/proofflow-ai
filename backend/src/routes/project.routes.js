import express from "express";
import {
  createProject,
  getUserProjects,
  deleteProject,
} from "../controllers/project.controller.js";
import firebaseAuth from "../middleware/firebaseAuth.js"; // Changed from named import to default import

const router = express.Router();

// Since firebaseAuth is a default export, you can rename it if you want
const authenticate = firebaseAuth;

router.post("/", authenticate, createProject);
router.get("/", authenticate, getUserProjects);
router.delete("/:id", authenticate, deleteProject);

export default router;