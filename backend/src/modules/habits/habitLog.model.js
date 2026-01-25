import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    completed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ One log per habit per day per user
habitLogSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

export const HabitLog = mongoose.model("HabitLog", habitLogSchema);
