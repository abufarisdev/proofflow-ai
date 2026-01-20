import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import reportRoutes from "./routes/reports.route.js";
import projectRoutes from "./routes/project.routes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.route.js";
import testRoutes from "./routes/test.routes.js";

/* ================= ENV ================= */
dotenv.config(); // Render automatically injects env vars

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= TRUST PROXY ================= */
// Needed for Render / reverse proxies
app.set("trust proxy", 1);

/* ================= CORS ================= */
const allowedOrigins = [
  "http://localhost:3000", // local frontend
  process.env.FRONTEND_URL, // deployed frontend (Render/Vercel)
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* ================= BODY PARSER ================= */
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/test", testRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend running 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 Backend started successfully");
  console.log(`🌐 Port: ${PORT}`);
  console.log(`🧠 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
});
