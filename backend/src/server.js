import express from "express";
import cors from "cors";
import reportRoutes from "./routes/reports.route.js";
import userRoutes from "./routes/users.route.js";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running on localhost 🚀");
});

app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
