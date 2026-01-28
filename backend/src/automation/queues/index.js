import { Queue } from "bullmq";
import { ENV } from "../../config/env.js";

let weeklyReportQueue = null;
let dailyReminderQueue = null;

export const getQueues = () => {
  // If automation is disabled, NEVER touch BullMQ
  if (!ENV.ENABLE_AUTOMATION) {
    return {
      weeklyReportQueue: null,
      dailyReminderQueue: null,
    };
  }

  // Initialize queues ONLY once
  if (!weeklyReportQueue || !dailyReminderQueue) {
    const connection = {
      url: ENV.REDIS_URL,
    };

    weeklyReportQueue = new Queue("weekly-report", { connection });
    dailyReminderQueue = new Queue("daily-reminder", { connection });

    console.log("✅ Automation queues initialized");
  }

  return {
    weeklyReportQueue,
    dailyReminderQueue,
  };
};
