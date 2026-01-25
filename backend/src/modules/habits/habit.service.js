import { Habit } from "./habit.model.js";
import { HabitLog } from "./habitLog.model.js";

/**
 * Habit CRUD
 */
export const createHabit = async ({ userId, payload }) => {
  return Habit.create({ userId, ...payload });
};

export const listHabits = async ({ userId }) => {
  return Habit.find({ userId, isArchived: false }).sort({ createdAt: -1 });
};

export const findHabitById = async ({ userId, habitId }) => {
  return Habit.findOne({ _id: habitId, userId });
};

export const updateHabitById = async ({ userId, habitId, payload }) => {
  return Habit.findOneAndUpdate(
    { _id: habitId, userId },
    { $set: payload },
    { new: true, runValidators: true }
  );
};

/**
 * ✅ Check-in (Upsert habit log for a date)
 */
export const upsertHabitLog = async ({ userId, habitId, date, completed }) => {
  return HabitLog.findOneAndUpdate(
    { userId, habitId, date },
    { $set: { completed } },
    { new: true, upsert: true }
  );
};

/**
 * Get logs for last N days (for stats UI)
 */
export const getHabitLogsInRange = async ({ userId, habitId, from, to }) => {
  return HabitLog.find({
    userId,
    habitId,
    date: { $gte: from, $lte: to },
  }).sort({ date: 1 });
};
