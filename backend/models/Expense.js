const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "Office",
        "Marketing",
        "Transportation",
        "Travel",
        "Training & Development",
        "Utilities",
        "Maintenance",
        "Food",
        "Health",
        "Entertainment",
        "Rent",
        "Bank Fees",
        "Insurance",
        "Taxes",
        "Loans",
        "Hardware",
        "Internet",
        "Subscriptions",
        "Events",
        "Other",
      ],
      default: "Office",
    },
    description: {
      type: String,
      maxlength: 500,
    },
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachment: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

ExpenseSchema.index({ createdBy: 1, expenseDate: -1 });
ExpenseSchema.index({ status: 1 });

module.exports = mongoose.model("Expense", ExpenseSchema);
