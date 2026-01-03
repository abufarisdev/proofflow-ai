import { getProjectById, updateProject } from "../models/projects.model.js";
import { 
  getReportByProjectId, 
  createReport as createReportInDb,
  getReportsByUserId,
  getReportById as getReportByIdFromDb,
  deleteReport
} from "../models/reports.model.js";
import { getRepoCommitStats } from "../services/github.service.js";
import { analyzeCommitStats } from "../services/report.service.js";
import { getAIAssessment } from "../services/ai.service.js";

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

    // 4️⃣ Fetch commit stats from GitHub (owner/repo parsed from repoUrl)
    let timeline = [];
    let analysisResult = { confidenceScore: 0, flags: [], aiSummary: "Analysis not available" };

    try {
      const stats = await getRepoCommitStats(project.repoUrl, { days: 180, perPage: 100 });
      timeline = stats.timeline;
      analysisResult = analyzeCommitStats(stats);

      // Optional: call AI to augment or refine analysis
      try {
        const aiRes = await getAIAssessment(stats);
        if (aiRes) {
          // Merge results: prefer AI summary and combine flags. Average confidence as a simple merge strategy.
          analysisResult.aiSummary = aiRes.aiSummary || analysisResult.aiSummary;
          analysisResult.flags = Array.from(new Set([...(analysisResult.flags || []), ...(aiRes.flags || [])]));
          if (typeof aiRes.confidenceScore === "number") {
            analysisResult.confidenceScore = Math.round((analysisResult.confidenceScore + aiRes.confidenceScore) / 2);
          }
        }
      } catch (err) {
        console.warn("AI assessment failed, continuing with heuristic result", err.message || err);
      }
    } catch (err) {
      console.warn("Failed to fetch commit stats for project:", project.id, err.message || err);
      // Proceed with default analysisResult (0 score)
    }

    // 5️⃣ Create report in DB
    const report = await createReportInDb({
      projectId,
      timeline,
      confidenceScore: analysisResult.confidenceScore,
      flags: analysisResult.flags,
      aiSummary: analysisResult.aiSummary,
    });

    // 6️⃣ Update project status depending on confidence
    const determineStatus = (score) => {
      if (typeof score !== "number") return "pending";
      if (score > 70) return "verified";
      if (score < 40) return "flagged";
      return "pending";
    };

    const newStatus = determineStatus(analysisResult.confidenceScore);
    await updateProject(projectId, { status: newStatus });

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
    const reportId = req.params.id;
    const userId = req.user?.firebaseUid;

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
      project: {
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
    console.error("Get Report By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteReports = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.user?.firebaseUid;

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

    let deletedCount = 0;

    for (const id of ids) {
      const report = await getReportByIdFromDb(id);
      if (!report) continue;

      const project = await getProjectById(report.projectId);
      if (!project || project.userId !== userId) continue;

      await deleteReport(id);
      deletedCount += 1;

      // Optionally set project back to pending
      try {
        await updateProject(project.id, { status: "pending" });
      } catch (e) {
        // Non-fatal
        console.warn("Failed to update project status after report deletion", project.id, e.message);
      }
    }

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No reports found to delete or you don't have permission",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${deletedCount} reports deleted successfully`,
    });

  } catch (error) {
    console.error("Delete Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
