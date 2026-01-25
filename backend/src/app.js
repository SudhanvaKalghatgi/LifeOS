import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import { ENV } from "./config/env.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// ✅ IMPORT MODULE ROUTES
import userRoutes from "./modules/users/user.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";


export const app = express();

// ✅ CORE MIDDLEWARES
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// ✅ CORS CONFIG
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true,
  })
);

// ✅ HEALTH ROUTE
app.get("/api/v1/health", (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { ok: true }, "LifeOS OK ✅"));
});

// ✅ MODULE ROUTES (ADD ALL MODULES LIKE THIS)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);


// ✅ ERROR MIDDLEWARE LAST (ALWAYS)
app.use(errorHandler);
