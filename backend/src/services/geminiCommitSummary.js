import { GoogleGenerativeAI } from "@google/generative-ai";

/* ================= INIT SAFELY ================= */
function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/* ================= AI SUMMARY ================= */
export async function generateCommitAISummary(data) {
  const genAI = getGeminiClient();

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // ✅ faster & stable
  });

  const prompt = `
You are a senior software engineering reviewer.

Analyze the following Git commit statistics and write a professional,
concise assessment of the development activity.

Commit Statistics:
- Total commits: ${data.totalCommits}
- Active days: ${data.activeDays}
- Maximum commits in a single day: ${data.maxCommitsInADay}
- Average commits per day: ${data.avgCommitsPerDay.toFixed(2)}
- Commit message quality: ${data.commitMessagePattern}

Detected Concerns:
${data.flags.length ? data.flags.join(", ") : "None"}

Rules:
- Do NOT mention AI or automation
- Neutral and factual tone
- 2–3 sentences only
`;

  const result = await model.generateContent(prompt);

  const text = result?.response?.text?.();
  if (!text) {
    throw new Error("Empty AI summary response");
  }

  return text.trim();
}

/* ================= AI COMMIT MESSAGE ================= */
export async function generateAICommitMessage(commitData) {
  try {
    const genAI = getGeminiClient();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Generate a professional conventional commit message.

Details:
- Type: ${commitData.type}
- Files: ${commitData.files}
- Description: ${commitData.description}

Rules:
- Format: type(scope): description
- Lowercase
- No quotes
- No period at end
- Single line only
`;

    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.();

    if (!text) throw new Error("Empty commit message");

    return text
      .replace(/^["']|["']$/g, "")
      .split("\n")[0]
      .trim();
  } catch (error) {
    console.error("AI commit message failed:", error.message);
    return `${commitData.type}: ${commitData.description}`;
  }
}

/* ================= MULTIPLE COMMITS ================= */
export async function generateMultipleCommitMessages(count = 10) {
  const messages = [];

  const commitTypes = [
    { type: "feat", description: "add new functionality" },
    { type: "fix", description: "resolve bug or issue" },
    { type: "refactor", description: "improve code structure" },
    { type: "docs", description: "update documentation" },
    { type: "style", description: "format code styling" },
    { type: "test", description: "add or update tests" },
    { type: "chore", description: "maintenance tasks" },
  ];

  for (let i = 0; i < count; i++) {
    const random = commitTypes[Math.floor(Math.random() * commitTypes.length)];

    const commitData = {
      files: "src/",
      type: random.type,
      description: random.description,
    };

    const message = await generateAICommitMessage(commitData);
    messages.push(message);
  }

  return messages;
}
