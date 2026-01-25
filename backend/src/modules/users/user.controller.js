import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

import { syncUserSchema, updateMeSchema } from "./user.validation.js";
import { findUserByAuthId, createUser, updateUser } from "./user.service.js";
import { formatZodError } from "../../utils/zodError.js";

/**
 * POST /api/v1/users/sync
 * Creates user if not exists, otherwise updates basic fields
 */
export const syncUser = asyncHandler(async (req, res) => {
  const authProviderUserId = req.user?.userId;

  if (!authProviderUserId) {
    throw new ApiError(401, "Unauthorized: userId missing");
  }

  const parsed = syncUserSchema.safeParse(req.body || {});
  if (!parsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(parsed.error));
  }

  const existing = await findUserByAuthId(authProviderUserId);

  if (existing) {
    // Update only fields that were provided
    const updated = await updateUser({
      authProviderUserId,
      payload: parsed.data,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updated, "User synced (updated) ✅"));
  }

  const created = await createUser({
    authProviderUserId,
    payload: parsed.data,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, created, "User synced (created) ✅"));
});

/**
 * GET /api/v1/users/me
 * Returns current logged-in user
 */
export const getMe = asyncHandler(async (req, res) => {
  const authProviderUserId = req.user?.userId;

  if (!authProviderUserId) {
    throw new ApiError(401, "Unauthorized: userId missing");
  }

  const user = await findUserByAuthId(authProviderUserId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "Me ✅"));
});

/**
 * PATCH /api/v1/users/me
 * Updates profile + preferences + onboarding
 */
export const updateMe = asyncHandler(async (req, res) => {
  const authProviderUserId = req.user?.userId;

  if (!authProviderUserId) {
    throw new ApiError(401, "Unauthorized: userId missing");
  }

  const parsed = updateMeSchema.safeParse(req.body || {});
  if (!parsed.success) {
    throw new ApiError(400, "Validation failed", formatZodError(parsed.error));
  }

  const updated = await updateUser({
    authProviderUserId,
    payload: parsed.data,
  });

  if (!updated) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Profile updated ✅"));
});
