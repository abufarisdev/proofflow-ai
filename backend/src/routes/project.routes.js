import express from "express";
import {createProject,getAllProjects,getProjectById} from "../controllers/project.controller.js";
import firebaseAuth from "../middleware/firebaseAuth.js";

const router = express.Router();

// POST /projects - create a new project
router.post("/create", firebaseAuth, createProject);

// GET /projects - get all projects of logged-in user
router.get("/", firebaseAuth, getAllProjects);

// GET /projects/:id - get a single project
router.get("/:id", firebaseAuth, getProjectById);

export default router;
