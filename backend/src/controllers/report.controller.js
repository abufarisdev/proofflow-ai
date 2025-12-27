import Project from "../models/projects.model.js";
import Verification from "../models/verification.model.js";
import mongoose from "mongoose";

export const createReport = async (req, res) => {
  try {
    const { projectId } = req.body;

    // 1️⃣ Validate input
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing projectId",
      });
    }

    const userId = req.user?.uid; // safe optional chaining
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in",
      });
    }

    // 2️⃣ Check project exists & belongs to user
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have access",
      });
    }

    // 3️⃣ Prevent duplicate reports
    const existingReport = await Verification.findOne({ projectId });
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "Report already exists for this project",
      });
    }

    // 4️⃣ Fetch real timeline later (currently empty)
    const timeline = [];

    // 5️⃣ Compute confidence score
    const confidenceScore = 0; // replace with real logic later
    const flags = [];

    // 6️⃣ Create verification report
    const report = await Verification.create({
      projectId,
      timeline,
      confidenceScore,
      flags,
    });

    // 7️⃣ Update project status
    project.status = "pending"; // initial pending
    await project.save();

    // 8️⃣ Return response
    return res.status(201).json({
      success: true,
      message: "Verification report created",
      data: report,
    });
  } catch (error) {
    console.error("Create Report Error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    // Catch all unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Fetch all reports for projects owned by this user
    const reports = await Verification.find()
      .populate({
        path: "projectId",
        match: { userId },
        select: "repoName repoUrl status",
      })
      .sort({ createdAt: -1 });

    // Filter out reports where project is null (not owned by this user)
    const userReports = reports.filter((report) => report.projectId !== null);

    return res.status(200).json({
      success: true,
      count: userReports.length,
      data: userReports,
    });
  } catch (error) {
    console.error("Get All Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const projectId = req.params.id; 
    const userId = req.user?.uid;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // Find the report by projectId and populate project info
    const report = await Verification.findOne({ projectId }).populate({
      path: "projectId",
      match: { userId }, // only include if the project belongs to the logged-in user
      select: "repoName repoUrl status",
    });

    if (!report || !report.projectId) {
      return res.status(404).json({
        success: false,
        message: "Report not found or you do not have access",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Get Report By Project ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
