export const dailyReminderJob = async (job) => {
  const { userId } = job.data;

  console.log(`⏰ [JOB] Sending daily reminder to user: ${userId}`);

  // Later:
  // - find overdue tasks
  // - send email / notification

  return { success: true };
};
