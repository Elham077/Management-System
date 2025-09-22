const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  exportTasksReport,
  exportUsersReport,
  exportProjectsReport,
  exportExpensesReport,
} = require("../controllers/reportController");

const router = express.Router();

//? ===> Reports routes
router.get("/export/tasks", protect, adminOnly, exportTasksReport);
router.get("/export/users", protect, adminOnly, exportUsersReport);
router.get("/export/projects", protect, adminOnly, exportProjectsReport);
router.get("/export/expenses", protect, adminOnly, exportExpensesReport);

module.exports = router;
