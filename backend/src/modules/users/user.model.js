import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    authProviderUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
      maxlength: 60,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    persona: {
      type: String,
      enum: ["student", "working", "business"],
      default: "student",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    preferences: {
      wakeUpTime: {
        type: String,
        default: "07:00", // HH:mm
      },
      weeklyReviewDay: {
        type: String,
        default: "Sunday",
      },
      notifications: {
        dailyPlanReminder: { type: Boolean, default: true },
        overdueTaskAlerts: { type: Boolean, default: true },
        overspendingAlerts: { type: Boolean, default: true },
        weeklyReviewEmail: { type: Boolean, default: true },
      },
    },

    routines: {
      gym: { type: Boolean, default: false },
      study: { type: Boolean, default: false },
      work: { type: Boolean, default: false },
    },

    incomeConfig: {
      incomeType: {
        type: String,
        enum: ["fixed", "variable", "none"],
        default: "none",
      },
      monthlyIncome: { type: Number, default: 0, min: 0 },
    },

    isOnboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Helpful index for email lookups (not unique because email can be optional)
userSchema.index({ email: 1 });

export const User = mongoose.model("User", userSchema);
