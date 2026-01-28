import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { logger } from "./utils/logger.js";
console.log("🔍 ENABLE_AUTOMATION =", ENV.ENABLE_AUTOMATION);
const startServer = async () => {
  await connectDB();

  app.listen(ENV.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${ENV.PORT}`);
  });
};

startServer();
