import { generateWeeklyReport } from "../../modules/reports/weekly/weeklyReport.service.js";

/**
 * BullMQ weekly report job
 */
export const weeklyReportJob = async (job) => {
  try {
    const { userId } = job.data;

    console.log(`🧠 [JOB] Generating weekly report for user: ${userId}`);

    const report = await generateWeeklyReport(userId);

    console.log(
      `✅ Weekly report generated for user: ${userId} | Productivity Score: ${report.productivityScore}`
    );

    return report;

  } catch (error) {

    console.error("❌ Weekly report generation failed:", error);

    throw error;
  }
};