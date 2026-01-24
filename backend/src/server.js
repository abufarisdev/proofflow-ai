import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/reports.route.js";
import projectRoutes from "./routes/project.routes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.route.js";
import testRoutes from "./routes/test.routes.js";



dotenv.config({path:"./.env"});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

app.use("/test", testRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend running on localhost 🚀",
    port: PORT,
    endpoints: {
      health: "GET /",
      api: {
        users: {
          getMe: "GET /api/users/me (requires auth)",
          updateMe: "PUT /api/users/me (requires auth)"
        },
        projects: {
          create: "POST /api/projects (requires auth)",
          getAll: "GET /api/projects (requires auth)"
        },
        reports: {
          create: "POST /api/reports/create (requires auth)",
          getAll: "GET /api/reports (requires auth)",
          getById: "GET /api/reports/:id (requires auth)"
        },
        auth: {
          github: "GET /api/auth/github",
          callback: "POST /api/auth/github/callback"
        },
        test: {
          authTest: "GET /test/auth-test (requires auth)"
        }
      }
    }
  });
});

console.log(`📡 Starting server on port ${PORT}...`);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Backend URL: http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

