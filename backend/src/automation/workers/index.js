import { Worker } from "bullmq";
import { ENV } from "../../config/env.js";

import { weeklyReportJob } from "../jobs/weeklyReport.job.js";
import { dailyReminderJob } from "../jobs/dailyReminder.job.js";

// Correct boolean check
if (!ENV.ENABLE_AUTOMATION) {
  console.log("🚫 Automation workers disabled");
  process.exit(0);
}

if (!ENV.REDIS_URL) {
  console.error("❌ REDIS_URL not configured");
  process.exit(1);
}

const connection = {
  url: ENV.REDIS_URL,
};

// Create workers
const weeklyReportWorker = new Worker(
  "weekly-report",
  weeklyReportJob,
  { connection }
);

const dailyReminderWorker = new Worker(
  "daily-reminder",
  dailyReminderJob,
  { connection }
);

// Optional but recommended: error logging
weeklyReportWorker.on("error", (err) => {
  console.error("❌ Weekly Report Worker Error:", err);
});

dailyReminderWorker.on("error", (err) => {
  console.error("❌ Daily Reminder Worker Error:", err);
});

console.log("✅ Automation workers started");