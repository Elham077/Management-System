const Task = require("../models/Task");
const mongoose = require("mongoose");
//? @desc Get all tasks (in app permission)
//? @route GET /api/tasks/
//? @Access Private
//* ==================== Get all tasks (Admin or assigned user) ====================
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }
    //? ===> Add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.complete
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );
    //? status Summary Counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//* ==================== Get task by ID ====================
//? @desc Get tasks by ID
//? @route GET /api/tasks/:id
//? @Access Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//* ==================== Create a new task (Admin only) ====================
//? @desc create a new task
//? @route POST /api/tasks/
//? @Access Private (Admin)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachment,
      todoChecklist,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (
      !Array.isArray(assignedTo) ||
      !assignedTo.every((id) => mongoose.Types.ObjectId.isValid(id))
    ) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of valid user IDs" });
    }
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      todoChecklist,
      attachment,
    });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//* ==================== Update a task (Admin only) ====================
//? @desc update tasks details
//? @route PUT /api/tasks/:id
//? @Access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.attachment = req.body.attachment || task.attachment;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }
    const updatedTask = await task.save();
    res.json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//* ==================== Delete a task (Admin only) ====================
//? @desc delete a tasks (Admin only)
//? @route DELETE /api/tasks/:id
//? @Access Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//* ==================== Update task status (Assigned user or Admin) ====================
//? @desc Update task Status
//? @route PUT /api/tasks/:id/status
//? @Access Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const assignedIds = task.assignedTo.some(
      (id) => id.toString() === req.user._id.toString()
    );
    if (!assignedIds && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task status" });
    }
    task.status = req.body.status || task.status;
    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Task status updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//* ==================== Update task checklist (Assigned user or Admin) ====================
//? @desc Update tasks CheckList
//? @route PUT /api/tasks/:id/todo
//? @Access Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const isAssigned = task.assignedTo.some(
      (id) => id.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    task.todoChecklist = todoChecklist;
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }
    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    res.json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    console.error("Error in updateTaskChecklist:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//* ==================== Admin dashboard data ====================
//? @desc Dashboard Data (Admin Only)
//? @route GET /api/tasks/dashboard-data
//? @Access Private
const getDashboardData = async (req, res) => {
  try {
    //? Fetch satistics
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      acc[status.replace(/\s+/g, "")] =
        taskDistributionRaw.find((t) => t._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelRaw.find((t) => t._id === priority)?.count || 0;
      return acc;
    }, {});
    // const tasksPerUser = {};
    // raw.tasksPerUser.forEach((t) => {
    //   tasksPerUser[t._id] = {
    //     pending: t.pending,
    //     inProgress: t.inProgress,
    //     completed: t.completed,
    //   };
    // });
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate assignedTo createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevel,
        // tasksPerUser,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//* ==================== User dashboard data ====================
//? @desc Dashboard Data (User-Specific)
//? @route GET /api/tasks/user-dashboard-data
//? @Access Private
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formatedKey = status.replace(/\s+/g, "");
      acc[formatedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelRaw.find((t) => t._id === priority)?.count || 0;
      return acc;
    }, {});
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate project createdAt");
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: { taskDistribution, taskPriorityLevel },
      recentTasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
