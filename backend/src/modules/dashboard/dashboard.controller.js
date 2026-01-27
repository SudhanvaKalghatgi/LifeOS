import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

import { getDashboardSummary } from "./dashboard.service.js";

/**
 * GET /api/v1/dashboard/summary
 */
export const dashboardSummaryController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const data = await getDashboardSummary(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Dashboard summary fetched ✅"));
});
