import axios from "axios";
import { generateMultipleCommitMessages } from "./geminiCommitSummary.js";

const GITHUB_API = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || null;

const makeClient = () => {
  const headers = { Accept: "application/vnd.github.v3+json" };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return axios.create({ baseURL: GITHUB_API, headers, timeout: 10000 });
};

const parseRepoUrl = (repoUrl) => {
  // Accept formats like https://github.com/owner/repo or git@github.com:owner/repo.git
  try {
    if (repoUrl.startsWith("git@")) {
      const parts = repoUrl.split(":")[1];
      const [owner, repo] = parts.replace(/\.git$/, "").split("/");
      return { owner, repo };
    }
    const u = new URL(repoUrl);
    const parts = u.pathname
      .replace(/^\//, "")
      .replace(/\.git$/, "")
      .split("/");
    const [owner, repo] = parts;
    return { owner, repo };
  } catch (err) {
    throw new Error("Invalid repo URL");
  }
};

export const getRepoCommitStats = async (
  repoUrl,
  { days = 90, perPage = 100 } = {}
) => {
  const { owner, repo } = parseRepoUrl(repoUrl);

  // Generate AI-powered commit messages instead of fetching real ones
  let aiCommitMessages = [];
  try {
    aiCommitMessages = await generateMultipleCommitMessages(perPage);
  } catch (error) {
    console.warn(
      "AI commit message generation failed, using fallback messages:",
      error.message
    );
    // Fallback to some default conventional commit messages
    aiCommitMessages = [
      "feat: add user authentication",
      "fix: resolve login issue",
      "docs: update README",
      "style: format code",
      "refactor: optimize performance",
      "test: add unit tests",
      "chore: update dependencies",
    ];
    // Repeat messages to fill the requested count
    while (aiCommitMessages.length < perPage) {
      aiCommitMessages = aiCommitMessages.concat(aiCommitMessages);
    }
    aiCommitMessages = aiCommitMessages.slice(0, perPage);
  }

  // Create simulated commit data with AI-generated messages
  const commits = aiCommitMessages.map((message, index) => ({
    commit: {
      message,
      author: {
        date: new Date(
          Date.now() - Math.random() * days * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    },
  }));

  // Aggregate commits by date (YYYY-MM-DD)
  const byDate = {};
  const messages = [];

  for (const c of commits) {
    const date = new Date(c.commit.author.date).toISOString().slice(0, 10);
    byDate[date] = (byDate[date] || 0) + 1;
    messages.push(c.commit.message);
  }

  const timeline = Object.keys(byDate)
    .sort()
    .map((date) => ({ date, commits: byDate[date] }));

  const totalCommits = commits.length;
  const activeDays = timeline.length;
  const maxCommitsInADay = timeline.reduce(
    (max, t) => Math.max(max, t.commits),
    0
  );

  // Analyze AI-generated commit message quality
  const conventionalCommits = messages.filter((m) =>
    /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?:/.test(m)
  ).length;
  const commitMessagePattern =
    conventionalCommits / Math.max(1, messages.length) > 0.7
      ? "professional conventional commits"
      : "varied messages";

  return {
    timeline,
    totalCommits,
    activeDays,
    maxCommitsInADay,
    averageFilesChanged: null,
    commitMessagePattern,
    aiGenerated: true, // Flag to indicate these are AI-generated
  };
};
