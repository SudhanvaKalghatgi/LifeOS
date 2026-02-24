import { requireAuth as clerkRequireAuth } from "@clerk/express";
import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const requireAuth = asyncHandler(async (req, res, next) => {

  clerkRequireAuth()(req, res, (err) => {

    if (err) {
      // Log only the message — never the full error object which may contain tokens
      console.warn(`[Auth] Clerk verification failed: ${err.message ?? "unknown"}`);
      throw new ApiError(401, "Unauthorized");
    }

    if (!req.auth || !req.auth.userId) {
      throw new ApiError(401, "Unauthorized");
    }

    req.user = {
      userId: req.auth.userId
    };

    next();
  });

});