import express from "express";
import { createReport, getAllReports, getReportById, deleteReports } from "../controllers/report.controller.js";
import authMiddleware from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post("/create", authMiddleware, createReport);
router.post("/delete", authMiddleware, deleteReports);
router.get("/", authMiddleware, getAllReports);
router.get("/:id", authMiddleware, getReportById);

export default router;
