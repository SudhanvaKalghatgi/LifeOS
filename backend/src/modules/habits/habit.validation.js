import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1, "Habit name is required").max(60),
  description: z.string().max(300).optional(),

  frequency: z.enum(["daily", "weekly"]).optional(),
  targetPerWeek: z.number().min(1).max(7).optional(),

  color: z.string().max(30).optional(),
  isActive: z.boolean().optional(),
});

export const updateHabitSchema = createHabitSchema.partial();

export const habitIdParamSchema = z.object({
  id: z.string().min(1),
});

export const habitCheckinSchema = z.object({
  date: z.string().datetime().optional(), // ISO date-time
  completed: z.boolean(),
});
