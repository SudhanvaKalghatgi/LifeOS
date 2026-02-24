import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";

import {
  getLatestWeeklyReport,
  getWeeklyReportHistory,
} from "./weeklyReport.service.js";

/**
 * GET /api/v1/reports/weekly/latest
 */
export const getLatestReport = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const report = await getLatestWeeklyReport(userId);

  if (!report) {
    throw new ApiError(404, "No weekly report found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      report,
      "Latest weekly report fetched successfully"
    )
  );
});

/**
 * GET /api/v1/reports/weekly/history
 */
export const getReportHistory = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const reports = await getWeeklyReportHistory(userId);

  return res.status(200).json(
    new ApiResponse(
      200,
      reports,
      "Weekly report history fetched successfully"
    )
  );
});