import { WeeklyReport } from "./weeklyReport.model.js";

import { Task } from "../../tasks/task.model.js";
import { HabitLog } from "../../habits/habitLog.model.js";
import { Expense } from "../../expenses/expense.model.js";

/**
 * Get start and end of last 7 days
 */
const getWeeklyPeriod = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  return { start, end };
};

/**
 * Calculate productivity score (0–100)
 */
const calculateProductivityScore = ({
  taskCompletionRate,
  habitConsistencyRate,
}) => {
  const score =
    taskCompletionRate * 0.6 +
    habitConsistencyRate * 0.4;

  return Math.round(score);
};

/**
 * Generate weekly report
 */
export const generateWeeklyReport = async (userId) => {
  const { start, end } = getWeeklyPeriod();

  // Prevent duplicate reports
  const existing = await WeeklyReport.findOne({
    userId,
    periodStart: start,
    periodEnd: end,
  });

  if (existing) {
    return existing;
  }

  /*
   * TASK STATS
   */
  const [taskStats] = await Task.aggregate([
    {
      $match: {
        userId,
        isArchived: false,
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        created: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
      },
    },
  ]);

  const tasksCreated = taskStats?.created || 0;
  const tasksCompleted = taskStats?.completed || 0;

  const taskCompletionRate =
    tasksCreated === 0
      ? 0
      : Math.round((tasksCompleted / tasksCreated) * 100);

  /*
   * HABIT STATS
   */
  const habitsCompleted = await HabitLog.countDocuments({
    userId,
    completedAt: { $gte: start, $lte: end },
  });

  const habitsExpected = 7; // basic version (can improve later)

  const habitConsistencyRate =
    habitsExpected === 0
      ? 0
      : Math.round((habitsCompleted / habitsExpected) * 100);

  /*
   * EXPENSE STATS
   */
  const [expenseStats] = await Expense.aggregate([
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
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalExpenses = expenseStats?.total || 0;

  const averagePerDay = Math.round(totalExpenses / 7);

  /*
   * PRODUCTIVITY SCORE
   */
  const productivityScore = calculateProductivityScore({
    taskCompletionRate,
    habitConsistencyRate,
  });

  /*
   * CREATE REPORT
   */
  const report = await WeeklyReport.create({
    userId,

    periodStart: start,
    periodEnd: end,

    tasks: {
      created: tasksCreated,
      completed: tasksCompleted,
      completionRate: taskCompletionRate,
    },

    habits: {
      completed: habitsCompleted,
      expected: habitsExpected,
      consistencyRate: habitConsistencyRate,
    },

    expenses: {
      total: totalExpenses,
      averagePerDay,
    },

    productivityScore,
  });

  return report;
};

/**
 * Get latest report
 */
export const getLatestWeeklyReport = async (userId) => {
  return WeeklyReport.findOne({ userId })
    .sort({ periodStart: -1 });
};

/**
 * Get report history
 */
export const getWeeklyReportHistory = async (userId) => {
  return WeeklyReport.find({ userId })
    .sort({ periodStart: -1 });
};