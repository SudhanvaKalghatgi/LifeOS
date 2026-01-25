import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { formatZodError } from "../../utils/zodError.js";

import {
  createHabitSchema,
  updateHabitSchema,
  habitIdParamSchema,
  habitCheckinSchema,
} from "./habit.validation.js";

import {
  createHabit,
  listHabits,
  findHabitById,
  updateHabitById,
  upsertHabitLog,
  getHabitLogsInRange,
} from "./habit.service.js";

/**
 * POST /api/v1/habits
 */
export const createHabitController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const parsed = createHabitSchema.safeParse(req.body || {});
  if (!parsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(parsed.error));
  }

  const habit = await createHabit({ userId, payload: parsed.data });

  return res
    .status(201)
    .json(new ApiResponse(201, habit, "Habit created ✅"));
});

/**
 * GET /api/v1/habits
 */
export const listHabitsController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const habits = await listHabits({ userId });

  return res.status(200).json(new ApiResponse(200, habits, "Habits fetched ✅"));
});

/**
 * PATCH /api/v1/habits/:id
 */
export const updateHabitController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = habitIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid habit id", formatZodError(paramsParsed.error));
  }

  const bodyParsed = updateHabitSchema.safeParse(req.body || {});
  if (!bodyParsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(bodyParsed.error));
  }

  const updated = await updateHabitById({
    userId,
    habitId: paramsParsed.data.id,
    payload: bodyParsed.data,
  });

  if (!updated) throw new ApiError(404, "Habit not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Habit updated ✅"));
});

/**
 * PATCH /api/v1/habits/:id/archive
 */
export const archiveHabitController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = habitIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid habit id", formatZodError(paramsParsed.error));
  }

  const updated = await updateHabitById({
    userId,
    habitId: paramsParsed.data.id,
    payload: { isArchived: true, archivedAt: new Date(), isActive: false },
  });

  if (!updated) throw new ApiError(404, "Habit not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Habit archived ✅"));
});

/**
 * POST /api/v1/habits/:id/checkin
 * Body: { completed: true/false, date?: ISO string }
 */
export const habitCheckinController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = habitIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid habit id", formatZodError(paramsParsed.error));
  }

  const bodyParsed = habitCheckinSchema.safeParse(req.body || {});
  if (!bodyParsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(bodyParsed.error));
  }

  const habit = await findHabitById({ userId, habitId: paramsParsed.data.id });
  if (!habit || habit.isArchived) throw new ApiError(404, "Habit not found");

  // ✅ Normalize date to start of day (prevents multiple logs same day)
  const inputDate = bodyParsed.data.date ? new Date(bodyParsed.data.date) : new Date();
  const date = new Date(inputDate);
  date.setHours(0, 0, 0, 0);

  const log = await upsertHabitLog({
    userId,
    habitId: paramsParsed.data.id,
    date,
    completed: bodyParsed.data.completed,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      log,
      bodyParsed.data.completed ? "Habit checked-in ✅" : "Habit unchecked ✅"
    )
  );
});

/**
 * GET /api/v1/habits/:id/stats?days=7
 * Returns logs for last N days (simple stats support)
 */
export const habitStatsController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = habitIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid habit id", formatZodError(paramsParsed.error));
  }

  const habit = await findHabitById({ userId, habitId: paramsParsed.data.id });
  if (!habit || habit.isArchived) throw new ApiError(404, "Habit not found");

  const days = Math.min(Math.max(Number(req.query.days || 7), 1), 60);

  const to = new Date();
  to.setHours(0, 0, 0, 0);

  const from = new Date(to);
  from.setDate(from.getDate() - (days - 1));

  const logs = await getHabitLogsInRange({
    userId,
    habitId: paramsParsed.data.id,
    from,
    to,
  });

  const completedCount = logs.filter((l) => l.completed).length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        habit,
        range: { from, to, days },
        logs,
        completedCount,
      },
      "Habit stats ✅"
    )
  );
});
