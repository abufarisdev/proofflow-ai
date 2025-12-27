import express from "express";
import cors from "cors";
import reportRoutes from "./routes/report.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running on localhost 🚀");
});

app.use("/reports", reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
