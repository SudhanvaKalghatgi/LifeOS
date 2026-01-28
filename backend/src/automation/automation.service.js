import { getQueues } from "./queues/index.js";
import { ENV } from "../config/env.js";

/**
 * Enqueue weekly AI report job
 */
export const enqueueWeeklyReport = async (userId) => {
  if (!ENV.ENABLE_AUTOMATION) {
    console.log("⚠️ Automation disabled — weekly report not queued");
    return;
  }

  const { weeklyReportQueue } = getQueues();

  if (!weeklyReportQueue) {
    console.warn("⚠️ weeklyReportQueue not initialized — skipping enqueue");
    return;
  }

  try {
    await weeklyReportQueue.add("weekly-report-job", { userId });
  } catch (error) {
    console.error("❌ Failed to enqueue weekly report job", error);
    // swallow error so API does not fail
  }
};

/**
 * Enqueue daily reminder job
 */
export const enqueueDailyReminder = async (userId) => {
  if (!ENV.ENABLE_AUTOMATION) {
    console.log("⚠️ Automation disabled — daily reminder not queued");
    return;
  }

  const { dailyReminderQueue } = getQueues();

  if (!dailyReminderQueue) {
    console.warn("⚠️ dailyReminderQueue not initialized — skipping enqueue");
    return;
  }

  try {
    await dailyReminderQueue.add("daily-reminder-job", { userId });
  } catch (error) {
    console.error("❌ Failed to enqueue daily reminder job", error);
    // swallow error so API does not fail
  }
};
