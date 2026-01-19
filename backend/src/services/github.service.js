import axios from "axios";

const GITHUB_API = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || null;

const makeClient = () => {
  const headers = {
    Accept: "application/vnd.github+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  return axios.create({
    baseURL: GITHUB_API,
    headers,
    timeout: 10000,
  });
};

const parseRepoUrl = (repoUrl) => {
  try {
    if (repoUrl.startsWith("git@")) {
      const parts = repoUrl.split(":")[1];
      const [owner, repo] = parts.replace(/\.git$/, "").split("/");
      return { owner, repo };
    }

    const u = new URL(repoUrl);
    const [owner, repo] = u.pathname
      .replace(/^\//, "")
      .replace(/\.git$/, "")
      .split("/");

    return { owner, repo };
  } catch {
    throw new Error("Invalid repository URL");
  }
};

/* ================= FETCH ALL COMMITS ================= */
const fetchAllCommits = async (client, owner, repo) => {
  let page = 1;
  const perPage = 100;
  let allCommits = [];

  while (true) {
    const res = await client.get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page: perPage, page },
    });

    if (!res.data || res.data.length === 0) break;

    allCommits = allCommits.concat(res.data);

    if (res.data.length < perPage) break;
    page++;
  }

  return allCommits;
};

/* ================= MAIN FUNCTION ================= */
export const getRepoCommitStats = async (repoUrl) => {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const client = makeClient();

  /* ================= COMMITS ================= */
  const commits = await fetchAllCommits(client, owner, repo);

  if (commits.length === 0) {
    return {
      timeline: [],
      totalCommits: 0,
      activeDays: 0,
      maxCommitsInADay: 0,
      avgCommitsPerDay: 0,
      commitMessagePattern: "no commits",
      flags: [],
      aiGenerated: false,
    };
  }

  /* ================= GROUP BY DATE ================= */
  const byDate = {};
  const messages = [];

  let earliestCommit = null;
  let latestCommit = null;

  commits.forEach((c) => {
    if (!c.commit || !c.commit.author || !c.commit.author.date) return;

    const date = new Date(c.commit.author.date);
    const isoDate = date.toISOString().slice(0, 10);

    byDate[isoDate] = (byDate[isoDate] || 0) + 1;
    messages.push(c.commit.message || "");

    if (!earliestCommit || date < earliestCommit) earliestCommit = date;
    if (!latestCommit || date > latestCommit) latestCommit = date;
  });

  /* ================= BUILD TIMELINE ================= */
  const timeline = [];
  if (earliestCommit && latestCommit) {
    const cursor = new Date(earliestCommit);
    while (cursor <= latestCommit) {
      const d = cursor.toISOString().slice(0, 10);
      timeline.push({
        date: d,
        commits: byDate[d] || 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  /* ================= STATS ================= */
  const totalCommits = commits.length;
  const activeDays = Object.keys(byDate).length;
  const maxCommitsInADay = Math.max(...Object.values(byDate), 0);

  /* ================= MESSAGE QUALITY ================= */
  const conventional = messages.filter((m) =>
    /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?:/.test(m),
  ).length;

  const commitMessagePattern =
    conventional / Math.max(messages.length, 1) > 0.7
      ? "mostly conventional commits"
      : "mostly short or generic messages";

  return {
    timeline, // ✅ from first commit → last commit
    totalCommits,
    activeDays,
    maxCommitsInADay,
    avgCommitsPerDay: activeDays > 0 ? totalCommits / activeDays : totalCommits,
    commitMessagePattern,
    flags:
      conventional / Math.max(messages.length, 1) < 0.4
        ? ["Commit messages are mostly short and generic"]
        : [],
    aiGenerated: false,
  };
};
