import { Worker } from "bullmq";
import { ENV } from "../../config/env.js";
import { connectDB } from "../../config/db.js";

import { weeklyReportJob } from "../jobs/weeklyReport.job.js";
import { dailyReminderJob } from "../jobs/dailyReminder.job.js";

const startWorkers = async () => {

  if (!ENV.ENABLE_AUTOMATION) {
    console.log("🚫 Automation workers disabled");
    process.exit(0);
  }

  if (!ENV.REDIS_URL) {
    console.error("❌ REDIS_URL not configured");
    process.exit(1);
  }

  // CONNECT MONGODB FIRST
  await connectDB();

  const connection = {
    url: ENV.REDIS_URL,
  };

  new Worker("weekly-report", weeklyReportJob, { connection });

  new Worker("daily-reminder", dailyReminderJob, { connection });

  console.log("✅ Automation workers started");
};

startWorkers();