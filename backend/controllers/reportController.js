const Task = require("../models/Task");
const User = require("../models/User");
const Project = require("../models/Project");
const Expense = require("../models/Expense");
const excelJs = require("exceljs");
// --------------------- Helper Functions ---------------------
const { formatDate, sendExcel, styleHeader } = require("../utils/helper");
// --------------------- Export Reports ---------------------
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email").lean();
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");
    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 30 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 40 },
    ];
    styleHeader(worksheet);
    tasks.forEach((task) => {
      const assignedTo = Array.isArray(task.assignedTo)
        ? task.assignedTo.map((u) => `${u.name} (${u.email})`).join(", ")
        : "";
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: formatDate(task.dueDate),
        assignedTo: assignedTo || "Unassigned",
      });
    });
    await sendExcel(res, workbook, "tasks_report.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const tasks = await Task.find()
      .populate("assignedTo", "name email _id")
      .lean();
    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });
    tasks.forEach((task) => {
      if (Array.isArray(task.assignedTo)) {
        task.assignedTo.forEach((u) => {
          if (userTaskMap[u._id]) {
            userTaskMap[u._id].taskCount += 1;
            if (task.status === "Pending") userTaskMap[u._id].pendingTasks += 1;
            else if (task.status === "In Progress")
              userTaskMap[u._id].inProgressTasks += 1;
            else if (task.status === "Completed")
              userTaskMap[u._id].completedTasks += 1;
          }
        });
      }
    });
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");
    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In-Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];
    styleHeader(worksheet);
    Object.values(userTaskMap).forEach((u) => worksheet.addRow(u));
    await sendExcel(res, workbook, "users_tasks_report.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const exportProjectsReport = async (req, res) => {
  try {
    const projects = await Project.find().select("title _id").lean();
    const tasks = await Task.find().populate("project", "title _id").lean();
    const projectTaskMap = {};
    projects.forEach((p) => {
      projectTaskMap[p._id] = {
        title: p.title,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });
    tasks.forEach((task) => {
      if (task.project && projectTaskMap[task.project._id]) {
        projectTaskMap[task.project._id].taskCount += 1;
        if (task.status === "Pending")
          projectTaskMap[task.project._id].pendingTasks += 1;
        else if (task.status === "In Progress")
          projectTaskMap[task.project._id].inProgressTasks += 1;
        else if (task.status === "Completed")
          projectTaskMap[task.project._id].completedTasks += 1;
      }
    });
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Projects Report");
    worksheet.columns = [
      { header: "Project Title", key: "title", width: 30 },
      { header: "Total Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];
    styleHeader(worksheet);
    Object.values(projectTaskMap).forEach((p) => worksheet.addRow(p));
    await sendExcel(res, workbook, "projects_tasks_report.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
module.exports = exportProjectsReport;
const exportExpensesReport = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("createdBy", "name email")
      .lean();
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Expenses Report");
    worksheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Category", key: "category", width: 20 },
      { header: "Date", key: "date", width: 20 },
      { header: "Created By", key: "createdBy", width: 40 },
    ];
    styleHeader(worksheet);
    expenses.forEach((e) =>
      worksheet.addRow({
        title: e.title,
        amount: e.amount,
        category: e.category,
        date: formatDate(e.date),
        createdBy: e.createdBy
          ? `${e.createdBy.name} (${e.createdBy.email})`
          : "N/A",
      })
    );
    await sendExcel(res, workbook, "expenses_report.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
module.exports = {
  exportExpensesReport,
  exportProjectsReport,
  exportTasksReport,
  exportUsersReport,
};
