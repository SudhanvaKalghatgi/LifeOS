import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
      index: true,
    },

    targetPerWeek: {
      type: Number,
      default: 7,
      min: 1,
      max: 7,
    },

    color: {
      type: String,
      default: "default", // frontend can map to color chip
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },

    archivedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

habitSchema.index({ userId: 1, isArchived: 1 });

export const Habit = mongoose.model("Habit", habitSchema);
