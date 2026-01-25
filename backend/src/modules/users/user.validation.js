import { z } from "zod";

export const syncUserSchema = z.object({
  fullName: z.string().min(2).max(60).optional(),
  email: z.string().email().optional(),
});

export const updateMeSchema = z.object({
  fullName: z.string().min(2).max(60).optional(),
  email: z.string().email().optional(),

  persona: z.enum(["student", "working", "business"]).optional(),
  timezone: z.string().min(2).optional(),

  preferences: z
    .object({
      wakeUpTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      weeklyReviewDay: z.string().min(3).optional(),
      notifications: z
        .object({
          dailyPlanReminder: z.boolean().optional(),
          overdueTaskAlerts: z.boolean().optional(),
          overspendingAlerts: z.boolean().optional(),
          weeklyReviewEmail: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),

  routines: z
    .object({
      gym: z.boolean().optional(),
      study: z.boolean().optional(),
      work: z.boolean().optional(),
    })
    .optional(),

  incomeConfig: z
    .object({
      incomeType: z.enum(["fixed", "variable", "none"]).optional(),
      monthlyIncome: z.number().min(0).optional(),
    })
    .optional(),

  isOnboardingComplete: z.boolean().optional(),
});
