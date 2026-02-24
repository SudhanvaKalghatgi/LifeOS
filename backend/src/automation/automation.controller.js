import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { generateWeeklyReport } from "../modules/reports/weekly/weeklyReport.service.js";

/**
 * POST /api/v1/automation/weekly-report
 * Directly generates the weekly report + AI insights (no queue required).
 */
export const triggerWeeklyReport = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  console.log(`🧠 [Direct] Generating weekly report for user: ${userId}`);

  const report = await generateWeeklyReport(userId);

  console.log(
    `✅ Weekly report generated | Score: ${report.productivityScore}`
  );

  return res.status(200).json(
    new ApiResponse(200, report, "Weekly report generated ✅")
  );
});

