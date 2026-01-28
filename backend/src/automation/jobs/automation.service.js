import { weeklyReportQueue, dailyReminderQueue } from "./queues/index.js";
import { ENV } from "../config/env.js";

export const enqueueWeeklyReport = async (userId) => {
  if (ENV.ENABLE_AUTOMATION !== "true") return;

  await weeklyReportQueue.add("weekly-report-job", {
    userId,
  });
};

export const enqueueDailyReminder = async (userId) => {
  if (ENV.ENABLE_AUTOMATION !== "true") return;

  await dailyReminderQueue.add("daily-reminder-job", {
    userId,
  });
};
