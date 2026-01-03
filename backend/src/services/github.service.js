import axios from "axios";

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
    const parts = u.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
    const [owner, repo] = parts;
    return { owner, repo };
  } catch (err) {
    throw new Error("Invalid repo URL");
  }
};

export const getRepoCommitStats = async (repoUrl, { days = 90, perPage = 100 } = {}) => {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const client = makeClient();

  // For simplicity, fetch most recent `perPage` commits and compute basic stats
  const res = await client.get(`/repos/${owner}/${repo}/commits`, {
    params: { per_page: perPage },
  });

  const commits = res.data || [];

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
  const maxCommitsInADay = timeline.reduce((max, t) => Math.max(max, t.commits), 0);

  // Estimate commit message pattern (rudimentary)
  const shortMsgs = messages.filter((m) => !m || m.length < 20).length;
  const commitMessagePattern = shortMsgs / Math.max(1, messages.length) > 0.6 ? "mostly short generic messages" : "varied messages";

  return {
    timeline,
    totalCommits,
    activeDays,
    maxCommitsInADay,
    averageFilesChanged: null, // could be implemented by fetching each commit details (expensive)
    commitMessagePattern,
  };
};
