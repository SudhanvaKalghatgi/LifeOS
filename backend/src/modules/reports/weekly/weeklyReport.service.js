import { WeeklyReport } from "./weeklyReport.model.js";

import { Task } from "../../tasks/task.model.js";
import { HabitLog } from "../../habits/habitLog.model.js";
import { Expense } from "../../expenses/expense.model.js";
import { generateWeeklyAIInsights } from "./weeklyReport.ai.js";

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
 * Generate weekly report (atomic, race-condition safe)
 */
export const generateWeeklyReport = async (userId) => {
  const { start, end } = getWeeklyPeriod();

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

  const habitsExpected = 7;

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

  const averagePerDay =
    totalExpenses === 0
      ? 0
      : Math.round(totalExpenses / 7);

  /*
   * PRODUCTIVITY SCORE
   */
  const productivityScore = calculateProductivityScore({
    taskCompletionRate,
    habitConsistencyRate,
  });

  /*
   * REPORT DATA OBJECT
   */
  const reportData = {
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
  };

  /*
   * UPSERT — always recalculate stats and regenerate AI insights on every call
   */

  let report = await WeeklyReport.findOneAndUpdate(
    {
      userId,
      periodStart: start,
      periodEnd: end,
    },
    {
      $set: reportData,          // always overwrite with fresh aggregated stats
      $unset: { aiInsights: "" } // clear old insights so they get regenerated
    },
    {
      upsert: true,
      new: true,
    }
  );

  /*
   * Always regenerate AI insights for fresh analysis
   */
  console.log(`🤖 Generating AI insights for user: ${userId}`);

  const aiInsights = await generateWeeklyAIInsights(report);

  if (aiInsights) {
    report.aiInsights = aiInsights;
    await report.save();
    console.log(`✅ AI insights generated for user: ${userId}`);
  }

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