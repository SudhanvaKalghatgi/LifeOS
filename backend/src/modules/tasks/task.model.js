import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    effort: {
      type: String,
      enum: ["S", "M", "L"], // small/medium/large
      default: "M",
    },

    dueDate: {
      type: Date,
      default: null,
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    remindAt: {
      type: Date,
      default: null,
    },

    labels: {
      type: [String],
      default: [],
    },

    subtasks: {
      type: [subTaskSchema],
      default: [],
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

    // Future-ready recurring fields (we won't implement generation now)
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurrence: {
      type: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
      },
      interval: { type: Number, min: 1, default: 1 },
      daysOfWeek: { type: [Number], default: [] }, // 0=Sun ... 6=Sat
    },
  },
  { timestamps: true }
);

// Helpful indexes for fast queries
taskSchema.index({ userId: 1, status: 1, isArchived: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

export const Task = mongoose.model("Task", taskSchema);
