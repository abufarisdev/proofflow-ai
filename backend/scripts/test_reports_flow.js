import assert from "assert";
import { analyzeCommitStats } from "../src/services/report.service.js";

// Test case: large spike in commits
const statsSpike = {
  timeline: [
    { date: "2024-01-01", commits: 1 },
    { date: "2024-01-10", commits: 15 },
  ],
  totalCommits: 16,
  activeDays: 2,
  maxCommitsInADay: 15,
  commitMessagePattern: "mostly short generic messages",
};

const result = analyzeCommitStats(statsSpike);
console.log("Analysis Result:", result);
assert(result.flags.includes("Unusually high activity on a single day"), "Should flag spike");
assert(result.flags.includes("Commit messages are mostly short and generic"), "Should flag message pattern");
assert(result.confidenceScore < 40, "Score should be low for spike");

console.log("Test passed: spike detection and scoring ✅");
