import express from "express";
import { createReport } from "../controllers/report.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createReport);
router.get("/", authMiddleware, getAllReports);
router.get("/:id", authMiddleware, getReportById);

export default router;
