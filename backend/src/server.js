import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

import reportRoutes from "./routes/reports.route.js";
import projectRoutes from "./routes/project.routes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Backend running on localhost 🚀");
});

// ✅ Connect DB then start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Server failed to start");
  });
