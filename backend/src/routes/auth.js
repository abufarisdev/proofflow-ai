import express from "express";
import { getGithubAuthUrl, exchangeCodeForToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/github", getGithubAuthUrl);
router.post("/github/callback", exchangeCodeForToken);

export default router;
