// backend/src/services/ai.service.js
// Optional Gemini integration (aggregated stats only)

/* ================= CONFIG ================= */
const AI_TIMEOUT_MS = 30_000;
const MAX_CONCURRENT_AI = 1;
const MAX_AI_CALLS_PER_MIN = 5;

let activeAIRequests = 0;
let aiCallTimestamps = [];

/* ================= RATE LIMIT ================= */
function canCallAI() {
  const now = Date.now();
  aiCallTimestamps = aiCallTimestamps.filter((t) => now - t < 60_000);

  if (activeAIRequests >= MAX_CONCURRENT_AI) return false;
  if (aiCallTimestamps.length >= MAX_AI_CALLS_PER_MIN) return false;

  aiCallTimestamps.push(now);
  return true;
}

/* ================= AI CALL WITH TIMEOUT ================= */
async function callWithTimeout(fn) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    return await fn(controller.signal);
  } catch (err) {
    if (err.name === "AbortError") {
      console.warn("AI request timed out (30s)");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/* ================= MAIN FUNCTION ================= */
export const getAIAssessment = async (stats) => {
  if (process.env.USE_GEMINI === "false") return null;

  if (!canCallAI()) {
    console.warn("AI rate limit hit — skipping AI assessment");
    return null;
  }

  activeAIRequests++;

  try {
    const prompt = `
Return STRICT JSON only:

{
  "confidenceScore": number,
  "flags": string[],
  "aiSummary": string
}

Commit Stats:
${JSON.stringify(stats, null, 2)}
`;

    let client = null;

    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    } catch (e) {
      console.warn("Gemini client unavailable:", e.message);
      return null;
    }

    const model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
    });

    const rawText = await callWithTimeout(async () => {
      const res = await model.generateContent(prompt);
      return res?.response?.text?.();
    });

    if (!rawText) return null;

    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]);

    return {
      confidenceScore: Math.max(
        0,
        Math.min(100, Number(parsed.confidenceScore) || 0),
      ),
      flags: Array.isArray(parsed.flags) ? parsed.flags.slice(0, 10) : [],
      aiSummary:
        typeof parsed.aiSummary === "string" ? parsed.aiSummary : undefined,
    };
  } catch (err) {
    console.warn("AI assessment failed:", err.message);
    return null;
  } finally {
    activeAIRequests--;
  }
};
