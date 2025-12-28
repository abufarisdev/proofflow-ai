import Project from "../models/projects.model.js";
import mongoose from "mongoose";

// Create a new project
export const createProject = async (req, res) => {
  try {
    // ✅ Get userId from Firebase token
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in",
      });
    }

    const { repoName, repoUrl } = req.body;

    if (!repoName || !repoUrl) {
      return res.status(400).json({
        success: false,
        message: "repoName and repoUrl are required",
      });
    }

    // Create project
    const project = await Project.create({
      userId, // <-- from Firebase token
      repoName,
      repoUrl,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all projects of the logged-in user
export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user?.uid; // ✅ Use uid from Firebase, not _id

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in",
      });
    }

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get All Projects Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user?.uid; // ✅ use Firebase UID

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({ _id: projectId, userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you do not have access",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get Project By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};