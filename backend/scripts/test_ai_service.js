import assert from "assert";
import { getAIAssessment } from "../src/services/ai.service.js";

const stats = {
  totalCommits: 10,
  activeDays: 5,
  maxCommitsInADay: 6,
  commitMessagePattern: "varied messages",
  timeline: [
    { date: "2024-01-01", commits: 1 },
    { date: "2024-01-02", commits: 2 },
  ],
};

(async () => {
  console.log("Running AI service test (USE_GEMINI unset or false should return null)");
  const res = await getAIAssessment(stats);
  console.log("AI service returned:", res);
  assert(res === null, "Expected null when USE_GEMINI is not enabled or not configured");
  console.log("AI service behavior (disabled) OK ✅");
})();