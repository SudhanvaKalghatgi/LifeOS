import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: [
        "food",
        "travel",
        "shopping",
        "bills",
        "health",
        "rent",
        "education",
        "entertainment",
        "subscriptions",
        "others",
      ],
    },

    note: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "netbanking", "other"],
      default: "upi",
    },

    spentAt: {
      type: Date,
      default: () => new Date(),
      index: true,
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

// ✅ Helpful indexes for reports + listing
expenseSchema.index({ userId: 1, isArchived: 1, spentAt: -1 });
expenseSchema.index({ userId: 1, category: 1, spentAt: -1 });

export const Expense = mongoose.model("Expense", expenseSchema);
