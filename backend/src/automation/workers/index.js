import { Worker } from "bullmq";
import { ENV } from "../../config/env.js";

import { weeklyReportJob } from "../jobs/weeklyReport.job.js";
import { dailyReminderJob } from "../jobs/dailyReminder.job.js";

if (ENV.ENABLE_AUTOMATION !== "true") {
  console.log("🚫 Automation workers disabled");
  process.exit(0);
}

const connection = {
  url: ENV.REDIS_URL,
};

new Worker("weekly-report", weeklyReportJob, { connection });
new Worker("daily-reminder", dailyReminderJob, { connection });

console.log("✅ Automation workers started");
