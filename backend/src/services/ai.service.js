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
  if (!process.env.USE_GEMINI || process.env.USE_GEMINI === "false") {
    return null;
  }

  if (!canCallAI()) {
    console.warn("AI rate limit hit — skipping AI assessment");
    return null;
  }

  activeAIRequests++;

  try {
    const prompt = `
You are a reviewer.

Return STRICT JSON with:
{
  "confidenceScore": number (0-100),
  "flags": string[],
  "aiSummary": string
}

Commit Stats:
${JSON.stringify(stats, null, 2)}
`;

    // Try importing Genkit safely
    let client = null;

    try {
      const { createClient } = await import("genkit");
      client = createClient({
        provider: "google",
        apiKey: process.env.GOOGLE_API_KEY,
      });
    } catch {
      try {
        const googleai = await import("@genkit-ai/googleai");
        if (googleai?.GoogleAI) {
          client = new googleai.GoogleAI({
            apiKey: process.env.GOOGLE_API_KEY,
          });
        }
      } catch (e) {
        console.warn("Gemini client unavailable:", e.message);
        return null;
      }
    }

    if (!client) return null;

    const rawText = await callWithTimeout(async () => {
      if (client.chat?.create) {
        const out = await client.chat.create({
          model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
          messages: [{ role: "user", content: prompt }],
        });
        return out?.choices?.[0]?.message?.content;
      }

      if (client.createText) {
        const out = await client.createText({
          model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
          input: prompt,
        });
        return out?.output || out?.text;
      }

      return null;
    });

    if (!rawText) return null;

    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]);

    return {
      confidenceScore:
        typeof parsed.confidenceScore === "number"
          ? Math.max(0, Math.min(100, Math.round(parsed.confidenceScore)))
          : undefined,
      flags: Array.isArray(parsed.flags) ? parsed.flags.slice(0, 10) : [],
      aiSummary:
        typeof parsed.aiSummary === "string" ? parsed.aiSummary : undefined,
    };
  } catch (err) {
    console.warn("AI assessment failed:", err.message || err);
    return null;
  } finally {
    activeAIRequests--;
  }
};
