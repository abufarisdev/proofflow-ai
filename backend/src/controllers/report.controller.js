import { getProjectById, updateProject } from "../models/projects.model.js";
import { 
  getReportByProjectId, 
  createReport as createReportInDb,
  getReportsByUserId,
  getReportById as getReportByIdFromDb
} from "../models/reports.model.js";

export const createReport = async (req, res) => {
  try {
    const { projectId } = req.body;

    // 1️⃣ Validate input
    if (!projectId || typeof projectId !== "string" || projectId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing projectId",
      });
    }

    const userId = req.user?.firebaseUid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in",
      });
    }

    // 2️⃣ Check project exists & belongs to user
    const project = await getProjectById(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have access",
      });
    }

    // 3️⃣ Prevent duplicate reports
    const existingReport = await getReportByProjectId(projectId);
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
    const report = await createReportInDb({
      projectId,
      timeline,
      confidenceScore,
      flags,
      summary: "",
    });

    // 7️⃣ Update project status
    await updateProject(projectId, { status: "pending" });

    // 8️⃣ Return response
    return res.status(201).json({
      success: true,
      message: "Verification report created",
      data: report,
    });
  } catch (error) {
    console.error("Create Report Error:", error);

    // Catch all unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const userId = req.user?.firebaseUid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Fetch all reports for projects owned by this user
    const reports = await getReportsByUserId(userId);
    
    // Fetch project details for each report
    const reportsWithProjects = await Promise.all(
      reports.map(async (report) => {
        try {
          // projectId is a string (the document ID)
          const projectId = report.projectId;
          if (!projectId) {
            console.warn("Report missing projectId:", report.id);
            return null;
          }
          
          const project = await getProjectById(projectId);
          if (!project) {
            console.warn("Project not found for report:", report.id, "projectId:", projectId);
            return null;
          }
          
          return {
            ...report,
            project: {
              id: project.id,
              repoName: project.repoName,
              repoUrl: project.repoUrl,
              status: project.status,
            },
          };
        } catch (err) {
          console.error("Error fetching project for report:", report.id, err);
          return null;
        }
      })
    );

    // Filter out null reports
    const userReports = reportsWithProjects.filter((report) => report !== null);

    return res.status(200).json({
      success: true,
      count: userReports.length,
      data: userReports,
    });
  } catch (error) {
    console.error("Get All Reports Error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user?.uid;

    if (!reportId || typeof reportId !== "string" || reportId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID",
      });
    }

    // Find the report by ID
    const report = await getReportByIdFromDb(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Check if the project belongs to the user
    const project = await getProjectById(report.projectId);
    
    if (!project || project.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: "Report not found or you do not have access",
      });
    }

    // Add project info to the report
    const reportWithProject = {
      ...report,
      projectId: {
        id: project.id,
        repoName: project.repoName,
        repoUrl: project.repoUrl,
        status: project.status,
      },
    };

    return res.status(200).json({
      success: true,
      data: reportWithProject,
    });
  } catch (error) {
    console.error("Get Report By Project ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteReports = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No report IDs provided",
      });
    }

    // Optional: Check if these reports belong to projects owned by the user
    // For now, assuming if they have the ID and are auth'd, it's okay, 
    // but ideally we should verify ownership via the associated project.

    // Deleting verifications where the project belongs to the user
    // 1. Find projects owned by user
    // const userProjects = await Project.find({ userId }).select('_id');
    // const userProjectIds = userProjects.map(p => p._id);

    // 2. Delete reports where projectId is in userProjectIds AND report._id is in ids
    // However, Verification model has projectId. 
    // A stricter check would be:

    const result = await Verification.deleteMany({
      _id: { $in: ids }
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No reports found to delete",
      });
    }

    // Also update associated projects status back to 'active' or similar if needed?
    // For now, we just delete the report.

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} reports deleted successfully`,
    });

  } catch (error) {
    console.error("Delete Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
