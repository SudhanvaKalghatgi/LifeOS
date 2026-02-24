import { generateAIContent } from "../../../lib/ai/geminiClient.js";

/**
 * Generate AI insights for weekly report
 */
export const generateWeeklyAIInsights = async (report) => {
  try {

    const prompt = `
You are an intelligent productivity assistant.

Analyze this user's weekly productivity data and provide:

1. Summary (2-3 sentences)
2. Strengths (array of points)
3. Improvements (array of points)
4. Productivity score explanation

Data:

Tasks:
- Created: ${report.tasks.created}
- Completed: ${report.tasks.completed}
- Completion Rate: ${report.tasks.completionRate}%

Habits:
- Completed: ${report.habits.completed}
- Expected: ${report.habits.expected}
- Consistency Rate: ${report.habits.consistencyRate}%

Expenses:
- Total: ${report.expenses.total}
- Average Per Day: ${report.expenses.averagePerDay}

Productivity Score: ${report.productivityScore}

Return response in JSON format:
{
  "summary": "",
  "strengths": [],
  "improvements": [],
  "explanation": ""
}
`;

    const aiText = await generateAIContent(prompt);

    if (!aiText) return null;

    // Try parsing JSON safely
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

  } catch (error) {

    console.error("Weekly AI Insights Error:", error);

    return null;
  }
};