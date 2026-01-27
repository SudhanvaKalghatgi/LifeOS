import { Task } from "../tasks/task.model.js";
import { Habit } from "../habits/habit.model.js";
import { HabitLog } from "../habits/habitLog.model.js";
import { Expense } from "../expenses/expense.model.js";

/**
 * Utility: start & end of today
 */
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Utility: last 7 days range
 */
const getLast7DaysRange = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  return { start, end };
};

/**
 * =========================
 * TASKS SUMMARY
 * =========================
 */
const getTaskSummary = async (userId) => {
  const { start, end } = getLast7DaysRange();
  const today = getTodayRange();

  const [total, completed, overdue, dueToday] = await Promise.all([
    Task.countDocuments({
      userId,
      createdAt: { $gte: start, $lte: end },
      isArchived: false,
    }),

    Task.countDocuments({
  userId,
  completed: true,
  createdAt: { $gte: start, $lte: end },
  isArchived: false,
}),


    Task.countDocuments({
      userId,
      completed: false,
      dueDate: { $lt: today.start },
      isArchived: false,
    }),

    Task.countDocuments({
      userId,
      completed: false,
      dueDate: { $gte: today.start, $lte: today.end },
      isArchived: false,
    }),
  ]);

  return { total, completed, overdue, dueToday };
};

/**
 * =========================
 * HABITS SUMMARY
 * =========================
 */
const getHabitSummary = async (userId) => {
  const { start, end } = getLast7DaysRange();

   const habits = await Habit.find({
    userId,
    isArchived: false,
  });
  const habitIds = habits.map((h) => h._id);
  if (habits.length === 0) {
    return {
      total: 0,
      completionRate: 0,
      mostMissed: null,
    };
  }
  const logs = await HabitLog.aggregate([
    {
      $match: {
        userId,
        habitId: { $in: habitIds },
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$habitId",
        completedCount: {
          $sum: {
            $cond: [{ $eq: ["$completed", true] }, 1, 0],
          },
        },
      },
    },
  ]);

  const totalExpected = habits.length * 7;
  const totalCompleted = logs.reduce(
    (sum, l) => sum + l.completedCount,
    0
  );

  const completionRate = Math.round(
    (totalCompleted / totalExpected) * 100
  );

  // Most missed habit
  let mostMissed = null;
  let lowestCompletion = Infinity;

  logs.forEach((log) => {
    if (log.completedCount < lowestCompletion) {
      lowestCompletion = log.completedCount;
      const habit = habits.find(
        (h) => h._id.toString() === log._id.toString()
      );
      if (habit) mostMissed = habit.name;
    }
  });

  return {
    total: habits.length,
    completionRate: Number.isNaN(completionRate) ? 0 : completionRate,
    mostMissed,
  };
};

/**
 * =========================
 * EXPENSES SUMMARY
 * =========================
 */
const getExpenseSummary = async (userId) => {
  const { start, end } = getLast7DaysRange();

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
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);

 const totalSpent = result.reduce((sum, r) => sum + r.total, 0);
  const topCategory = result[0]?._id || null;

  return {
    totalSpent,
    topCategory,
  };
};

/**
 * =========================
 * DASHBOARD SUMMARY (MAIN)
 * =========================
 */
export const getDashboardSummary = async (userId) => {
  const [tasks, habits, expenses] = await Promise.all([
    getTaskSummary(userId),
    getHabitSummary(userId),
    getExpenseSummary(userId),
  ]);

  return {
    tasks,
    habits,
    expenses,
  };
};
