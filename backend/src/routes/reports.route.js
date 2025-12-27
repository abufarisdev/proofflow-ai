import express from "express";
import { createReport, getAllReports, getReportById } from "../controllers/report.controller.js";
import authMiddleware from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post("/create", authMiddleware, createReport);
router.get("/", authMiddleware, getAllReports);
router.get("/:id", authMiddleware, getReportById);

export default router;
