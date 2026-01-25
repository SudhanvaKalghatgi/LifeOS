import { User } from "./user.model.js";

/**
 * Find user by authProviderUserId
 */
export const findUserByAuthId = async (authProviderUserId) => {
  return User.findOne({ authProviderUserId });
};

/**
 * Create user if not exists (sync)
 */
export const createUser = async ({ authProviderUserId, payload }) => {
  return User.create({
    authProviderUserId,
    ...payload,
  });
};

/**
 * Update user profile (partial update)
 */
export const updateUser = async ({ authProviderUserId, payload }) => {
  return User.findOneAndUpdate(
    { authProviderUserId },
    { $set: payload },
    { new: true, runValidators: true }
  );
};
