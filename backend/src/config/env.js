import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI: process.env.MONGO_URI || "",

  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  // 🔥 Automation / Redis
  ENABLE_AUTOMATION: process.env.ENABLE_AUTOMATION === "true",
  REDIS_URL: process.env.REDIS_URL || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY
};
