import { Expense } from "../../expenses/expense.model.js";

/**
 * Utility to get date range
 */
const getDateRange = ({ range, days }) => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);

  if (range === "monthly") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else if (days) {
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);
  } else {
    // weekly default (last 7 days)
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  }

  return { start, end };
};

/**
 * =========================
 * Expense Summary
 * =========================
 */
export const getExpenseSummary = async ({ userId, range }) => {
  const { start, end } = getDateRange({ range });

  const result = await Expense.aggregate([
    {
      $match: {
        userId,
        isArchived: false,
        spentAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" },
        avgSpent: { $avg: "$amount" },
        maxSpent: { $max: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    range: { start, end },
    summary:
      result[0] || {
        totalSpent: 0,
        avgSpent: 0,
        maxSpent: 0,
        count: 0,
      },
  };
};

/**
 * =========================
 * Category Breakdown
 * =========================
 */
export const getCategoryBreakdown = async ({ userId, range }) => {
  const { start, end } = getDateRange({ range });

  return Expense.aggregate([
    {
      $match: {
        userId,
        isArchived: false,
        spentAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        total: "$total",
        count: "$count",
      },
    },
  ]);
};

/**
 * =========================
 * Daily Trend
 * =========================
 */
export const getDailyTrend = async ({ userId, days }) => {
  const { start, end } = getDateRange({ days });

  return Expense.aggregate([
    {
      $match: {
        userId,
        isArchived: false,
        spentAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$spentAt",
          },
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        total: "$total",
      },
    },
  ]);
};
