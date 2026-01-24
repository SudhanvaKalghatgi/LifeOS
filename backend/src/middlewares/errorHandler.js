import { ENV } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  //  Handle unexpected errors safely
  if (!(err instanceof ApiError) && ENV.NODE_ENV === "production") {
    message = "Something went wrong";
    errors = [];
  }

  logger.error(
    `${req.method} ${req.originalUrl} -> ${statusCode} | ${message}`
  );

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(ENV.NODE_ENV === "development" && { stack: err.stack }),
  });
};
