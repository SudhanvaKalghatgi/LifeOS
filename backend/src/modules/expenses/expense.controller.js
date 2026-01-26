import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { formatZodError } from "../../utils/zodError.js";

import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseIdParamSchema,
  listExpenseQuerySchema,
} from "./expense.validation.js";

import {
  createExpense,
  findExpenseById,
  updateExpenseById,
  listExpenses,
} from "./expense.service.js";

/**
 * POST /api/v1/expenses
 */
export const createExpenseController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const parsed = createExpenseSchema.safeParse(req.body || {});
  if (!parsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(parsed.error));
  }

  const payload = { ...parsed.data };
  if (payload.spentAt) payload.spentAt = new Date(payload.spentAt);

  const expense = await createExpense({ userId, payload });

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Expense added ✅"));
});

/**
 * GET /api/v1/expenses
 */
export const listExpensesController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const parsed = listExpenseQuerySchema.safeParse(req.query || {});
  if (!parsed.success) {
    throw new ApiError(400, "Invalid query params", formatZodError(parsed.error));
  }

  const query = parsed.data;

  const filters = {
    category: query.category,
    minAmount: query.minAmount,
    maxAmount: query.maxAmount,
    search: query.search,
    from: query.from,
    to: query.to,
  };

  const options = {
    page: query.page,
    limit: query.limit,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  };

  const result = await listExpenses({ userId, filters, options });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        expenses: result.expenses,
        meta: result.meta,
      },
      "Expenses fetched ✅"
    )
  );
});

/**
 * GET /api/v1/expenses/:id
 */
export const getExpenseByIdController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = expenseIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid expense id", formatZodError(paramsParsed.error));
  }

  const expense = await findExpenseById({
    userId,
    expenseId: paramsParsed.data.id,
  });

  if (!expense || expense.isArchived) throw new ApiError(404, "Expense not found");

  return res
    .status(200)
    .json(new ApiResponse(200, expense, "Expense fetched ✅"));
});

/**
 * PATCH /api/v1/expenses/:id
 */
export const updateExpenseController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = expenseIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid expense id", formatZodError(paramsParsed.error));
  }

  const bodyParsed = updateExpenseSchema.safeParse(req.body || {});
  if (!bodyParsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(bodyParsed.error));
  }

  const payload = { ...bodyParsed.data };
  if (payload.spentAt) payload.spentAt = new Date(payload.spentAt);

  const updated = await updateExpenseById({
    userId,
    expenseId: paramsParsed.data.id,
    payload,
  });

  if (!updated || updated.isArchived) throw new ApiError(404, "Expense not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Expense updated ✅"));
});

/**
 * PATCH /api/v1/expenses/:id/archive
 */
export const archiveExpenseController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = expenseIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid expense id", formatZodError(paramsParsed.error));
  }

  const updated = await updateExpenseById({
    userId,
    expenseId: paramsParsed.data.id,
    payload: { isArchived: true, archivedAt: new Date() },
  });

  if (!updated) throw new ApiError(404, "Expense not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Expense archived ✅"));
});
