import { z } from "zod";

const objectIdLike = z.string().min(1); // we use Mongo _id as string in params

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(1000).optional(),

  priority: z.enum(["low", "medium", "high"]).optional(),
  effort: z.enum(["S", "M", "L"]).optional(),

  dueDate: z.string().datetime().optional(), // ISO string
  remindAt: z.string().datetime().optional(),

  labels: z.array(z.string().min(1).max(30)).optional(),

  subtasks: z
    .array(
      z.object({
        title: z.string().min(1).max(120),
        done: z.boolean().optional(),
      })
    )
    .optional(),

  isRecurring: z.boolean().optional(),
  recurrence: z
    .object({
      type: z.enum(["daily", "weekly", "monthly"]).optional(),
      interval: z.number().min(1).optional(),
      daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    })
    .optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const toggleTaskSchema = z.object({
  isCompleted: z.boolean(),
});

export const taskIdParamSchema = z.object({
  id: objectIdLike,
});

export const listTaskQuerySchema = z.object({
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  isArchived: z
    .string()
    .transform((v) => v === "true")
    .optional(),

  search: z.string().min(1).max(100).optional(),

  overdue: z
    .string()
    .transform((v) => v === "true")
    .optional(),

  from: z.string().datetime().optional(), // dueDate >= from
  to: z.string().datetime().optional(), // dueDate <= to

  page: z
    .string()
    .transform((v) => Number(v))
    .optional(),

  limit: z
    .string()
    .transform((v) => Number(v))
    .optional(),

  sortBy: z.enum(["createdAt", "dueDate", "priority"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
