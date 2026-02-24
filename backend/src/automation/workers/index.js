import { Worker } from "bullmq";
import { ENV } from "../../config/env.js";

import { connectDB } from "../../config/db.js";

import { weeklyReportJob } from "../jobs/weeklyReport.job.js";
import { dailyReminderJob } from "../jobs/dailyReminder.job.js";

/**
 * Start automation workers safely
 */
const startWorkers = async () => {
  try {
    // Do not start workers if automation disabled
    if (!ENV.ENABLE_AUTOMATION) {
      console.log("🚫 Automation workers disabled");
      process.exit(0);
    }

    if (!ENV.REDIS_URL) {
      throw new Error("REDIS_URL is missing in environment variables");
    }

    // Ensure MongoDB connection before starting workers
    await connectDB();

    const connection = {
      url: ENV.REDIS_URL,
    };

    /**
     * Weekly Report Worker
     */
    new Worker(
      "weekly-report",
      async (job) => {
        try {
          await weeklyReportJob(job);
        } catch (error) {
          console.error(
            "❌ Weekly Report Worker Job Error:",
            error
          );
          throw error;
        }
      },
      { connection }
    );

    /**
     * Daily Reminder Worker
     */
    new Worker(
      "daily-reminder",
      async (job) => {
        try {
          await dailyReminderJob(job);
        } catch (error) {
          console.error(
            "❌ Daily Reminder Worker Job Error:",
            error
          );
          throw error;
        }
      },
      { connection }
    );

    console.log("✅ Automation workers started");

  } catch (error) {

    console.error(
      "❌ Failed to start automation workers:",
      error
    );

    process.exit(1);
  }
};

/**
 * SAFE startup invocation with rejection handling
 */
startWorkers().catch((error) => {

  console.error(
    "❌ Worker startup fatal error:",
    error
  );

  process.exit(1);
});