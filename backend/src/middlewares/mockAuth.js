import { ApiError } from "../utils/ApiError.js";

/**
 * Temporary auth middleware (DEV ONLY)
 * Reads x-user-id header and sets req.user.userId
 *
 * Later: Replace this with Clerk middleware when frontend is ready.
 */
export const mockAuth = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return next(new ApiError(401, "Unauthorized: x-user-id header missing"));
  }

  req.user = { userId: String(userId) };
  next();
};
