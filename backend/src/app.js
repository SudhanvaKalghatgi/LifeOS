import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import { ENV } from "./config/env.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true,
  })
);

//  health route (temporary but useful)
app.get("/api/v1/health", (req, res) => {
  return res.status(200).json(new ApiResponse(200, { ok: true }, "LifeOS OK ✅"));
});

//  error middleware LAST
app.use(errorHandler);
