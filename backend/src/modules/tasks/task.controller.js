import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { formatZodError } from "../../utils/zodError.js";

import {
  createTaskSchema,
  updateTaskSchema,
  toggleTaskSchema,
  taskIdParamSchema,
  listTaskQuerySchema,
} from "./task.validation.js";

import {
  createTask,
  findTaskById,
  updateTaskById,
  listTasks,
} from "./task.service.js";

/**
 * POST /api/v1/tasks
 */
export const createTaskController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const parsed = createTaskSchema.safeParse(req.body || {});
  if (!parsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(parsed.error));
  }

  // Convert ISO strings to Date safely
  const payload = { ...parsed.data };
  if (payload.dueDate) payload.dueDate = new Date(payload.dueDate);
  if (payload.remindAt) payload.remindAt = new Date(payload.remindAt);

  const task = await createTask({ userId, payload });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created ✅"));
});

/**
 * GET /api/v1/tasks
 */
export const listTasksController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const parsed = listTaskQuerySchema.safeParse(req.query || {});
  if (!parsed.success) {
    throw new ApiError(400, "Invalid query params", formatZodError(parsed.error));
  }

  const query = parsed.data;

  const filters = {
    status: query.status,
    priority: query.priority,
    isArchived: query.isArchived,
    search: query.search,
    overdue: query.overdue,
    from: query.from,
    to: query.to,
  };

  const options = {
    page: query.page,
    limit: query.limit,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  };

  const result = await listTasks({ userId, filters, options });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tasks: result.tasks,
        meta: result.meta,
      },
      "Tasks fetched ✅"
    )
  );
});

/**
 * GET /api/v1/tasks/:id
 */
export const getTaskByIdController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = taskIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid task id", formatZodError(paramsParsed.error));
  }

  const task = await findTaskById({ userId, taskId: paramsParsed.data.id });
  if (!task) throw new ApiError(404, "Task not found");

  return res.status(200).json(new ApiResponse(200, task, "Task fetched ✅"));
});

/**
 * PATCH /api/v1/tasks/:id
 */
export const updateTaskController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = taskIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid task id", formatZodError(paramsParsed.error));
  }

  const bodyParsed = updateTaskSchema.safeParse(req.body || {});
  if (!bodyParsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(bodyParsed.error));
  }

  const payload = { ...bodyParsed.data };
  if (payload.dueDate) payload.dueDate = new Date(payload.dueDate);
  if (payload.remindAt) payload.remindAt = new Date(payload.remindAt);

  const updated = await updateTaskById({
    userId,
    taskId: paramsParsed.data.id,
    payload,
  });

  if (!updated) throw new ApiError(404, "Task not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Task updated ✅"));
});

/**
 * PATCH /api/v1/tasks/:id/toggle
 * Body: { isCompleted: true/false }
 */
export const toggleTaskController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = taskIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid task id", formatZodError(paramsParsed.error));
  }

  const bodyParsed = toggleTaskSchema.safeParse(req.body || {});
  if (!bodyParsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(bodyParsed.error));
  }

  const { isCompleted } = bodyParsed.data;

  const payload = isCompleted
    ? { status: "done", completedAt: new Date() }
    : { status: "todo", completedAt: null };

  const updated = await updateTaskById({
    userId,
    taskId: paramsParsed.data.id,
    payload,
  });

  if (!updated) throw new ApiError(404, "Task not found");

  return res.status(200).json(
    new ApiResponse(
      200,
      updated,
      isCompleted ? "Task completed ✅" : "Task marked as todo ✅"
    )
  );
});

/**
 * PATCH /api/v1/tasks/:id/archive
 * Soft delete
 */
export const archiveTaskController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized: userId missing");

  const paramsParsed = taskIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    throw new ApiError(400, "Invalid task id", formatZodError(paramsParsed.error));
  }

  const updated = await updateTaskById({
    userId,
    taskId: paramsParsed.data.id,
    payload: { isArchived: true, archivedAt: new Date() },
  });

  if (!updated) throw new ApiError(404, "Task not found");

  return res.status(200).json(new ApiResponse(200, updated, "Task archived ✅"));
});
