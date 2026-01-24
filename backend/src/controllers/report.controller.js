import { getProjectById, updateProject } from "../models/projects.model.js";
import {
  getReportByProjectId,
  createReport as createReportInDb,
  getReportsByUserId,
  getReportById as getReportByIdFromDb,
  deleteReport,
  updateReport,
} from "../models/reports.model.js";

import { getRepoCommitStats } from "../services/github.service.js";
import { analyzeCommitStats } from "../services/report.service.js";
import { getAIAssessment } from "../services/ai.service.js";

/* ======================================================
   CREATE / REGENERATE REPORT
====================================================== */
export const createReport = async (req, res) => {
  try {
    const { projectId } = req.body;

    /* ---------- VALIDATION ---------- */
    if (!projectId || typeof projectId !== "string" || !projectId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing projectId",
      });
    }

    const userId = req.user?.firebaseUid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* ---------- PROJECT CHECK ---------- */
    const project = await getProjectById(projectId);
    if (!project || project.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: "Project not found or access denied",
      });
    }

    /* ---------- EXISTING REPORT ---------- */
    const existingReport = await getReportByProjectId(projectId);
    const isRegenerating = Boolean(existingReport);

    /* ---------- ANALYSIS ---------- */
    let timeline = [];
    let analysisResult = {
      confidenceScore: 0,
      flags: [],
      aiSummary: "Analysis not available",
    };

    try {
      const stats = await getRepoCommitStats(project.repoUrl, {
        days: 180,
        perPage: 100,
      });

      timeline = stats?.timeline || [];
      analysisResult = await analyzeCommitStats(stats);

      /* ---------- OPTIONAL AI ---------- */
      const aiResult = await getAIAssessment(stats);
      if (aiResult) {
        analysisResult.aiSummary =
          aiResult.aiSummary || analysisResult.aiSummary;

        analysisResult.flags = Array.from(
          new Set([...(analysisResult.flags || []), ...(aiResult.flags || [])]),
        );

        if (typeof aiResult.confidenceScore === "number") {
          analysisResult.confidenceScore = Math.round(
            (analysisResult.confidenceScore + aiResult.confidenceScore) / 2,
          );
        }
      }
    } catch (err) {
      console.warn(
        "Commit analysis failed, continuing with defaults:",
        err.message || err,
      );
    }

    const confidenceScore =
      typeof analysisResult.confidenceScore === "number"
        ? analysisResult.confidenceScore
        : 0;

    /* ---------- SAVE REPORT ---------- */
    let report;

    if (isRegenerating) {
      report = await updateReport(existingReport.id, {
        timeline,
        confidenceScore,
        flags: analysisResult.flags || [],
        aiSummary: analysisResult.aiSummary || "Analysis not available",
        updatedAt: new Date(),
      });
    } else {
      report = await createReportInDb({
        projectId,
        timeline,
        confidenceScore,
        flags: analysisResult.flags || [],
        aiSummary: analysisResult.aiSummary || "Analysis not available",
      });
    }

    /* ---------- UPDATE PROJECT STATUS ---------- */
    const determineStatus = (score) => {
      if (score > 70) return "verified";
      if (score < 40) return "flagged";
      return "pending";
    };

    await updateProject(projectId, {
      status: determineStatus(confidenceScore),
    });

    /* ---------- RESPONSE ---------- */
    return res.status(isRegenerating ? 200 : 201).json({
      success: true,
      message: isRegenerating
        ? "Verification report regenerated"
        : "Verification report created",
      data: report,
    });
  } catch (error) {
    console.error("Create Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ======================================================
   GET ALL REPORTS (USER)
====================================================== */
export const getAllReports = async (req, res) => {
  try {
    const userId = req.user?.firebaseUid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reports = await getReportsByUserId(userId);

    const reportsWithProjects = await Promise.all(
      reports.map(async (report) => {
        const project = await getProjectById(report.projectId);
        if (!project) return null;

        return {
          ...report,
          project: {
            id: project.id,
            repoName: project.repoName,
            repoUrl: project.repoUrl,
            status: project.status,
          },
        };
      }),
    );

    return res.status(200).json({
      success: true,
      count: reportsWithProjects.filter(Boolean).length,
      data: reportsWithProjects.filter(Boolean),
    });
  } catch (error) {
    console.error("Get All Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ======================================================
   GET REPORT BY ID
====================================================== */
export const getReportById = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user?.firebaseUid;

    if (!reportId || !reportId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID",
      });
    }

    const report = await getReportByIdFromDb(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const project = await getProjectById(report.projectId);
    if (!project || project.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...report,
        project: {
          id: project.id,
          repoName: project.repoName,
          repoUrl: project.repoUrl,
          status: project.status,
        },
      },
    });
  } catch (error) {
    console.error("Get Report By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ======================================================
   DELETE REPORTS
====================================================== */
export const deleteReports = async (req, res) => {
  try {
    const { ids } = req.body;
    const userId = req.user?.firebaseUid;

    if (!userId) {
      return res.status(401).json({ success: false });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No report IDs provided",
      });
    }

    let deleted = 0;

    for (const id of ids) {
      const report = await getReportByIdFromDb(id);
      if (!report) continue;

      const project = await getProjectById(report.projectId);
      if (!project || project.userId !== userId) continue;

      await deleteReport(id);
      await updateProject(project.id, { status: "pending" });
      deleted++;
    }

    return res.status(200).json({
      success: true,
      message: `${deleted} reports deleted`,
    });
  } catch (error) {
    console.error("Delete Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
