const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
//* @desc    Get all users (Admin only)
//* @route   GET /api/users
//* @access  Private/Admin

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });
        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );
    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//* @desc    Get user by ID
//* @route   GET /api/users/:id
//* @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User Not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// //* @desc    Delete user (Admin only)
// //* @route   DELETE /api/users/:id
// //* @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "User removed" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
module.exports = {
  getUsers,
  deleteUser,
  getUserById,
};
