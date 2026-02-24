import mongoose from "mongoose";

const weeklyReportSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    periodStart: {
      type: Date,
      required: true,
      index: true,
    },

    periodEnd: {
      type: Date,
      required: true,
      index: true,
    },

    tasks: {
      created: {
        type: Number,
        required: true,
        default: 0,
      },
      completed: {
        type: Number,
        required: true,
        default: 0,
      },
      completionRate: {
        type: Number,
        required: true,
        default: 0,
      },
    },

    habits: {
      completed: {
        type: Number,
        required: true,
        default: 0,
      },
      expected: {
        type: Number,
        required: true,
        default: 0,
      },
      consistencyRate: {
        type: Number,
        required: true,
        default: 0,
      },
    },

    expenses: {
      total: {
        type: Number,
        required: true,
        default: 0,
      },
      averagePerDay: {
        type: Number,
        required: true,
        default: 0,
      },
    },

    productivityScore: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
    aiInsights: {
      type: Object,
      default: null,
    },

    meta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate report for same week
weeklyReportSchema.index(
  { userId: 1, periodStart: 1, periodEnd: 1 },
  { unique: true }
);

export const WeeklyReport = mongoose.model(
  "WeeklyReport",
  weeklyReportSchema
);