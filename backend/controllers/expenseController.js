const mongoose = require("mongoose");
const Expense = require("../models/Expense");

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private (employee/admin)
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, description, expenseDate, attachment } =
      req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      description,
      expenseDate,
      createdBy: req.user._id,
      attachment,
      status: "Pending",
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all expenses (admin/employee)
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    let expenses;

    if (req.user.role === "admin") {
      expenses = await Expense.find()
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });
    } else {
      expenses = await Expense.find({ createdBy: req.user._id })
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (
      req.user.role !== "admin" &&
      expense.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private (owner/admin)
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (
      req.user.role !== "admin" &&
      expense.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(expense, req.body);
    const updatedExpense = await expense.save();

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private (admin only)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete expenses" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Expense Dashboard (Statistics)
// @route   GET /api/expenses/dashboard
// @access  Private (admin/employee)
const getExpenseDashboard = async (req, res) => {
  try {
    const matchQuery =
      req.user.role === "admin" ? {} : { createdBy: req.user._id };

    const statusCounts = await Expense.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statuses = ["Pending", "Approved", "Rejected"];
    const expenseStatus = statuses.reduce((acc, status) => {
      acc[status] = statusCounts.find((s) => s._id === status)?.count || 0;
      return acc;
    }, {});

    const categoryCounts = await Expense.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
    ]);

    const recentExpenses = await Expense.find(matchQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title amount category status expenseDate createdAt");

    res.status(200).json({
      statistics: {
        totalExpenses:
          expenseStatus.Pending +
          expenseStatus.Approved +
          expenseStatus.Rejected,
        ...expenseStatus,
      },
      categories: categoryCounts,
      recentExpenses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseDashboard,
};
