export const weeklyReportJob = async (job) => {
  const { userId } = job.data;

  console.log(`🧠 [JOB] Generating weekly report for user: ${userId}`);

  // Later:
  // - fetch dashboard summary
  // - build AI prompt
  // - store AI-generated report

  return { success: true };
};
