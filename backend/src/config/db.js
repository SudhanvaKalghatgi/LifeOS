import mongoose from "mongoose";
import { ENV } from "./env.js";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    mongoose.set("strictQuery", true);
    await mongoose.connect(ENV.MONGO_URI);

    logger.info("✅ MongoDB connected");
  } catch (err) {
    logger.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};
