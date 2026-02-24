import { generateAIContent } from "../../../lib/ai/geminiClient.js";

/**
 * Generate AI insights for weekly report
 */
export const generateWeeklyAIInsights = async ({
  userId,
  productivityScore,
  tasks,
  habits,
  expenses,
}) => {
  try {
    console.log(`🤖 Generating AI insights for user: ${userId}`);

    const prompt = `
You are an intelligent productivity coach analyzing a user's weekly performance.

User weekly stats:

Productivity score: ${productivityScore}/100

Tasks:
- Created: ${tasks.created}
- Completed: ${tasks.completed}
- Completion rate: ${tasks.completionRate}%

Habits:
- Completed: ${habits.completed}
- Expected: ${habits.expected}
- Consistency rate: ${habits.consistencyRate}%

Expenses:
- Total spent: ${expenses.total}
- Daily average: ${expenses.averagePerDay}

INSTRUCTIONS:

Return ONLY valid JSON in this format:

{
  "summary": "2-3 sentence overview of the week",
  "strengths": ["3 strengths"],
  "improvements": ["3 improvements"],
  "explanation": "Detailed explanation of productivity score"
}
`;

    const aiText = await generateAIContent(prompt);

    /**
     * Case 1: AI failed
     */
    if (!aiText) {
      console.warn("⚠️ AI returned null");
      return null;
    }

    /**
     * Case 2: Already parsed object (expected case)
     */
    if (typeof aiText === "object") {
      return aiText;
    }

    /**
     * Case 3: String response (fallback handling)
     */
    if (typeof aiText === "string") {
      try {
        return JSON.parse(aiText);
      } catch {
        return {
          summary: aiText,
          strengths: [],
          improvements: [],
          explanation: "",
        };
      }
    }

    /**
     * Unknown format fallback
     */
    return null;

  } catch (error) {

    console.error(
      "❌ AI insights generation failed:",
      error.message
    );

    return null;
  }
};