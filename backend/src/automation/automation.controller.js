import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { enqueueWeeklyReport } from "./automation.service.js";

/**
 * POST /api/v1/automation/weekly-report
 * DEV ONLY – triggers weekly report job
 */
export const triggerWeeklyReport = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  await enqueueWeeklyReport(userId);

  return res.status(202).json(
    new ApiResponse(
      202,
      null,
      "Weekly report job queued (or skipped if automation disabled) ✅"
    )
  );
});
