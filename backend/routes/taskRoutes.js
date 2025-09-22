const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
} = require("../controllers/taskController");
const router = express.Router();
//* =================== Dashboard ===================
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
//* =================== Tasks CRUD ===================
router.get("/", protect, getTasks);//? ===========> All Tasks
router.get("/:id", protect, getTaskById);//? ========> Specific Task
router.post("/", protect, adminOnly, createTask);//? ===========> creating a new task
router.put("/:id", protect, updateTask);//? =========> updating a task
router.delete("/:id", protect, adminOnly, deleteTask);//? ======> deleting a task
//* =================== Task Actions ===================
router.put("/:id/status", protect, updateTaskStatus); //? =======> update task status for user
router.put("/:id/todo", protect, updateTaskChecklist); //? ======> update task checklist for user
//* =================== Project-specific Tasks ==========
module.exports = router;
