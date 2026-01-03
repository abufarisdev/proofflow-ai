// backend/src/services/ai.service.js
// Optional Gemini integration (uses aggregated stats only)

export const getAIAssessment = async (stats) => {
  // Only run if explicitly enabled
  if (!process.env.USE_GEMINI || process.env.USE_GEMINI === "false") {
    return null;
  }

  try {
    // Build a concise prompt with only aggregated statistics (no raw code)
    const prompt = `You are a helpful reviewer. Given the project commit statistics, provide a JSON object with: confidenceScore (0-100), flags (array of short strings), aiSummary (one sentence).\n\nStats:\n${JSON.stringify(stats, null, 2)}`;

    // Try to dynamically import genkit/googleai client (best-effort). If import fails, bail gracefully.
    let genkitClient = null;
    try {
      // Preferred import if available
      const { createClient } = await import("genkit");
      genkitClient = createClient({ provider: "google", apiKey: process.env.GOOGLE_API_KEY });
    } catch (e1) {
      try {
        // Fallback: import direct package
        const googleai = await import("@genkit-ai/googleai");
        if (googleai && googleai.GoogleAI) {
          genkitClient = new googleai.GoogleAI({ apiKey: process.env.GOOGLE_API_KEY });
        }
      } catch (e2) {
        console.warn("AI client import failed:", e1.message || e1, e2?.message || e2);
        return null;
      }
    }

    if (!genkitClient) return null;

    // Make a best-effort call to the model. The exact client API may vary between versions — use try/catch.
    let modelResponseText = null;
    try {
      // Try common GenKit client patterns
      if (genkitClient.chat && typeof genkitClient.chat.create === "function") {
        const out = await genkitClient.chat.create({ model: process.env.GEMINI_MODEL || "gpt-4o-mini", messages: [{ role: "user", content: prompt }] });
        modelResponseText = out?.choices?.[0]?.message?.content || out?.output || out?.choices?.[0]?.text || null;
      } else if (typeof genkitClient.createText === "function") {
        const out = await genkitClient.createText({ model: process.env.GEMINI_MODEL || "gpt-4o-mini", input: prompt });
        modelResponseText = out?.output || out?.text || null;
      } else {
        console.warn("AI client has unexpected API shape; skipping AI analysis");
        return null;
      }
    } catch (err) {
      console.warn("AI model call failed:", err.message || err);
      return null;
    }

    if (!modelResponseText) return null;

    // Attempt to extract JSON blob from response
    const jsonMatch = modelResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("AI response did not contain JSON");
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and normalize
    const res = {
      confidenceScore: typeof parsed.confidenceScore === "number" ? Math.max(0, Math.min(100, Math.round(parsed.confidenceScore))) : undefined,
      flags: Array.isArray(parsed.flags) ? parsed.flags.slice(0, 10) : undefined,
      aiSummary: typeof parsed.aiSummary === "string" ? parsed.aiSummary : undefined,
    };

    return res;
  } catch (err) {
    console.error("AIAssessment error:", err.message || err);
    return null;
  }
};
