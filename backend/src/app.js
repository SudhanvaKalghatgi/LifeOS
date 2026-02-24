import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./config/env.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// MODULE ROUTES
import userRoutes from "./modules/users/user.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import habitRoutes from "./modules/habits/habit.routes.js";
import expenseRoutes from "./modules/expenses/expense.routes.js";
import expenseReportRoutes from "./modules/reports/expenses/expenseReport.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import automationRoutes from "./automation/automation.routes.js";
import weeklyReportRoutes from "./modules/reports/weekly/weeklyReport.routes.js";

export const app = express();


// CORE MIDDLEWARES
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));


// CORS CONFIG
const corsOrigins = ENV.CORS_ORIGIN.includes(",")
  ? ENV.CORS_ORIGIN.split(",").map(o => o.trim())
  : ENV.CORS_ORIGIN;

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// RATE LIMITING
// General API limit: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

// Strict limit for expensive AI endpoints: 10 per 15 minutes
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "AI report generation rate limit exceeded. Please wait before trying again." },
});

app.use("/api", generalLimiter);


// CRITICAL: ENABLE CLERK MIDDLEWARE
// THIS MUST BE BEFORE ALL ROUTES
app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  })
);


// HEALTH ROUTE
app.get("/api/v1/health", (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { ok: true }, "LifeOS OK ✅"));
});


// MODULE ROUTES
// requireAuth is applied inside route files
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/habits", habitRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/reports/expenses", expenseReportRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/automation", aiLimiter, automationRoutes); // extra strict for AI
app.use("/api/v1/reports/weekly", weeklyReportRoutes);


// ERROR MIDDLEWARE
app.use(errorHandler);