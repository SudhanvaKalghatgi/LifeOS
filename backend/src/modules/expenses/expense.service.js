import { Expense } from "./expense.model.js";

/**
 * Create Expense
 */
export const createExpense = async ({ userId, payload }) => {
  return Expense.create({
    userId,
    ...payload,
  });
};

/**
 * Find Expense by id + userId
 */
export const findExpenseById = async ({ userId, expenseId }) => {
  return Expense.findOne({ _id: expenseId, userId });
};

/**
 * Update Expense by id + userId
 */
export const updateExpenseById = async ({ userId, expenseId, payload }) => {
  return Expense.findOneAndUpdate(
    { _id: expenseId, userId },
    { $set: payload },
    { new: true, runValidators: true }
  );
};

/**
 * List Expenses (filters + pagination)
 */
export const listExpenses = async ({ userId, filters, options }) => {
  const query = { userId, isArchived: false };

  if (filters.category) query.category = filters.category;

  // Amount range
  if (typeof filters.minAmount === "number" || typeof filters.maxAmount === "number") {
    query.amount = {};
    if (!Number.isNaN(filters.minAmount)) query.amount.$gte = filters.minAmount;
    if (!Number.isNaN(filters.maxAmount)) query.amount.$lte = filters.maxAmount;
  }

  // Date range
  if (filters.from || filters.to) {
    query.spentAt = {};
    if (filters.from) query.spentAt.$gte = new Date(filters.from);
    if (filters.to) query.spentAt.$lte = new Date(filters.to);
  }

  // Search by note
  if (filters.search) {
    query.note = { $regex: filters.search, $options: "i" };
  }

  const page = Math.max(options.page || 1, 1);
  const limit = Math.min(Math.max(options.limit || 10, 1), 50);
  const skip = (page - 1) * limit;

  // Sorting
  const sortOrder = options.sortOrder === "asc" ? 1 : -1;
  let sort = { spentAt: -1 };

  if (options.sortBy === "amount") sort = { amount: sortOrder, spentAt: -1 };
  if (options.sortBy === "spentAt") sort = { spentAt: sortOrder };
  if (options.sortBy === "createdAt") sort = { createdAt: sortOrder };

  const [expenses, total] = await Promise.all([
    Expense.find(query).sort(sort).skip(skip).limit(limit),
    Expense.countDocuments(query),
  ]);

  return {
    expenses,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
