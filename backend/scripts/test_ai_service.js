import assert from "assert";
import { getAIAssessment } from "../src/services/ai.service.js";
import {
  generateAICommitMessage,
  generateMultipleCommitMessages,
} from "../src/services/geminiCommitSummary.js";

const stats = {
  totalCommits: 10,
  activeDays: 5,
  maxCommitsInADay: 6,
  commitMessagePattern: "varied messages",
  timeline: [
    { date: "2024-01-01", commits: 1 },
    { date: "2024-01-02", commits: 2 },
  ],
};

(async () => {
  console.log(
    "Running AI service test (USE_GEMINI unset or false should return null)"
  );
  const res = await getAIAssessment(stats);
  console.log("AI service returned:", res);
  assert(
    res === null,
    "Expected null when USE_GEMINI is not enabled or not configured"
  );
  console.log("AI service behavior (disabled) OK ✅");

  console.log("\nTesting AI commit message generation...");
  try {
    const commitData = {
      files: "src/components/",
      type: "feat",
      description: "add new user interface component",
    };

    const message = await generateAICommitMessage(commitData);
    console.log("Generated commit message:", message);

    // Test multiple messages
    console.log("\nGenerating multiple AI commit messages...");
    const messages = await generateMultipleCommitMessages(5);
    console.log("Generated messages:");
    messages.forEach((msg, i) => console.log(`${i + 1}. ${msg}`));

    console.log("AI commit message generation OK ✅");
  } catch (error) {
    console.error("AI commit message generation failed:", error.message);
    console.log("Note: Make sure GEMINI_API_KEY is set in .env file");
  }
})();
