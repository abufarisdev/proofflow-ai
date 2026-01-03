export const analyzeCommitStats = (stats) => {
  const { totalCommits = 0, activeDays = 0, maxCommitsInADay = 0, commitMessagePattern = "varied messages", timeline = [] } = stats || {};

  const flags = [];

  // Heuristics
  if (maxCommitsInADay >= 15 || (totalCommits > 0 && maxCommitsInADay / totalCommits > 0.5)) {
    flags.push("Unusually high activity on a single day");
  }

  if (activeDays <= 2 && totalCommits > 10) {
    flags.push("Most commits concentrated in very few days");
  }

  if (commitMessagePattern === "mostly short generic messages") {
    flags.push("Commit messages are mostly short and generic");
  }

  // Basic scoring: start at 80, penalize large spikes and tiny activity
  let score = 80;
  const spikeFactor = totalCommits > 0 ? maxCommitsInADay / totalCommits : 0;
  score -= Math.round(spikeFactor * 50); // penalize spikes up to 50 points

  if (totalCommits < 3) score -= 20; // insufficient data
  if (flags.length >= 2) score -= 15;

  score = Math.max(0, Math.min(100, score));

  // Summary
  let summary = "The project shows organic progress.";
  if (flags.length > 0) {
    summary = `The analysis found potential concerns: ${flags.join("; ")}.`;
  }

  return {
    confidenceScore: score,
    flags,
    aiSummary: summary,
    timeline,
  };
};
