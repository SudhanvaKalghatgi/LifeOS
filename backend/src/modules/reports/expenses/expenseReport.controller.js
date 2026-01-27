import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";

import {
  getExpenseSummary,
  getCategoryBreakdown,
  getDailyTrend,
} from "./expenseReport.service.js";

/**
 * GET /api/v1/reports/expenses/summary
 */
export const expenseSummaryController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const range = req.query.range || "weekly";

  const data = await getExpenseSummary({ userId, range });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Expense summary fetched ✅"));
});

/**
 * GET /api/v1/reports/expenses/categories
 */
export const expenseCategoryController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const range = req.query.range || "weekly";

  const data = await getCategoryBreakdown({ userId, range });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Category breakdown fetched ✅"));
});

/**
 * GET /api/v1/reports/expenses/trend
 */
export const expenseTrendController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const days = Number(req.query.days || 7);

  const data = await getDailyTrend({ userId, days });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Expense trend fetched ✅"));
});
