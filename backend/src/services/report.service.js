import { generateCommitAISummary } from "./geminiCommitSummary.js";

export const analyzeCommitStats = async (stats) => {
  const {
    totalCommits = 0,
    activeDays = 0,
    maxCommitsInADay = 0,
    commitMessagePattern = "varied messages",
    timeline = [],
    aiGenerated = false,
  } = stats || {};

  const flags = [];

  /* ================= EARLY EXIT ================= */
  if (totalCommits === 0) {
    return {
      confidenceScore: 0,
      flags: ["No commit activity detected"],
      aiSummary:
        "No commit history was found for this project, so development activity could not be evaluated.",
      timeline,
    };
  }

  /* ================= DERIVED METRICS ================= */
  const avgCommitsPerDay =
    activeDays > 0 ? totalCommits / activeDays : totalCommits;

  const spikeRatio = totalCommits > 0 ? maxCommitsInADay / totalCommits : 0;

  /* ================= HEURISTICS ================= */
  if (maxCommitsInADay >= 15 || spikeRatio > 0.5) {
    flags.push("Unusually high activity on a single day");
  }

  if (activeDays <= 2 && totalCommits > 10) {
    flags.push("Most commits concentrated in very few days");
  }

  if (commitMessagePattern === "mostly short generic messages") {
    flags.push("Low-quality commit messages");
  }

  // AI-generated commits get better treatment
  if (
    aiGenerated &&
    commitMessagePattern === "professional conventional commits"
  ) {
    // Remove the low-quality flag if AI generated good commits
    const lowQualityIndex = flags.indexOf("Low-quality commit messages");
    if (lowQualityIndex > -1) {
      flags.splice(lowQualityIndex, 1);
    }
  }

  /* ================= SCORING ================= */
  let score = 100;

  score -= Math.round(spikeRatio * 40);

  if (activeDays <= 2) score -= 20;
  else if (activeDays <= 5) score -= 10;

  if (commitMessagePattern === "mostly short generic messages") score -= 15;
  if (totalCommits < 3) score -= 20;

  // Bonus for AI-generated professional commits
  if (
    aiGenerated &&
    commitMessagePattern === "professional conventional commits"
  ) {
    score += 10;
  }

  score = Math.max(0, Math.min(100, score));

  /* ================= AI SUMMARY ================= */
  let aiSummary = "Analysis completed with heuristic scoring.";
  try {
    aiSummary = await generateCommitAISummary({
      totalCommits,
      activeDays,
      maxCommitsInADay,
      avgCommitsPerDay,
      commitMessagePattern,
      flags,
    });
  } catch (error) {
    console.warn(
      "AI summary generation failed, using fallback:",
      error.message
    );
    // Keep the default aiSummary
  }

  /* ================= RETURN ================= */
  return {
    confidenceScore: score,
    flags,
    aiSummary,
    timeline,
  };
};
