import { z } from "zod";

export const categoryEnum = z.enum([
  "food",
  "travel",
  "shopping",
  "bills",
  "health",
  "rent",
  "education",
  "entertainment",
  "subscriptions",
  "others",
]);

export const paymentEnum = z.enum(["cash", "upi", "card", "netbanking", "other"]);

export const createExpenseSchema = z.object({
  amount: z.number().min(0, "Amount must be >= 0"),
  category: categoryEnum,
  note: z.string().max(300).optional(),
  paymentMethod: paymentEnum.optional(),
  spentAt: z.string().datetime().optional(), // ISO date string
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseIdParamSchema = z.object({
  id: z.string().min(1),
});

export const listExpenseQuerySchema = z.object({
  category: categoryEnum.optional(),

  minAmount: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().min(0))
    .optional(),

  maxAmount: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().min(0))
    .optional(),
  search: z.string().min(1).max(100).optional(),

  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().min(1))
    .optional(),

  limit: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().min(1).max(100))
    .optional(),    

  sortBy: z.enum(["spentAt", "amount", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
