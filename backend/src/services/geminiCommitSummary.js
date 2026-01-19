import { GoogleGenerativeAI } from "@google/generative-ai";

/* ================= CONFIG ================= */
const MAX_CONCURRENT_REQUESTS = 2; // 🔒 at most 2 Gemini calls at once
const MAX_REQUESTS_PER_MIN = 10; // 🔒 per server instance
const AI_TIMEOUT_MS = 30_000; // ⏱ 30 seconds

let activeRequests = 0;
let requestTimestamps = [];

/* ================= INIT SAFELY ================= */
function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/* ================= RATE LIMIT GUARD ================= */
function canProceedWithAI() {
  const now = Date.now();

  // Remove timestamps older than 1 minute
  requestTimestamps = requestTimestamps.filter((t) => now - t < 60_000);

  if (activeRequests >= MAX_CONCURRENT_REQUESTS) return false;
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MIN) return false;

  requestTimestamps.push(now);
  return true;
}

/* ================= GEMINI CALL WRAPPER ================= */
async function callGeminiWithTimeout(model, prompt) {
  if (!canProceedWithAI()) {
    throw new Error("AI rate limit exceeded");
  }

  activeRequests++;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const result = await model.generateContent(prompt, {
      signal: controller.signal,
    });

    const text = result?.response?.text?.();
    if (!text) throw new Error("Empty AI response");

    return text.trim();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("AI request timed out (30s)");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
    activeRequests--;
  }
}

/* ================= AI SUMMARY ================= */
export async function generateCommitAISummary(data) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
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

    return await callGeminiWithTimeout(model, prompt);
  } catch (error) {
    console.warn("AI summary skipped:", error.message);
    return "Development activity analysis is currently unavailable.";
  }
}

/* ================= AI COMMIT MESSAGE ================= */
export async function generateAICommitMessage(commitData) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
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

    const text = await callGeminiWithTimeout(model, prompt);

    return text
      .replace(/^["']|["']$/g, "")
      .split("\n")[0]
      .trim();
  } catch (error) {
    console.warn("AI commit message fallback:", error.message);
    return `${commitData.type}: ${commitData.description}`;
  }
}

/* ================= MULTIPLE COMMITS ================= */
export async function generateMultipleCommitMessages(count = 10) {
  const messages = [];

  for (let i = 0; i < count; i++) {
    messages.push(`chore: maintenance update`);
  }

  return messages;
}
