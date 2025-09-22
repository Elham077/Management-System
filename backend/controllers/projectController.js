const Project = require("../models/Project");
const Task = require("../models/Task");
const mongoose = require("mongoose");
// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      startDate,
      endDate,
      status,
      assignedEmployees,
      attachments,
    } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is Required" });
    }
    if (!technologies) {
      return res
        .status(400)
        .json({ message: "Development Technologies are require!" });
    }
    if (!startDate) {
      return res.status(400).json({ message: "Start Date is required" });
    }
    if (
      !Array.isArray(assignedEmployees) ||
      !assignedEmployees.every((id) => mongoose.Types.ObjectId.isValid(id))
    ) {
      return res.status(400).json({
        message: "assignedEmployees must be an array of valid user IDs",
      });
    }
    const project = await Project.create({
      title,
      description,
      technologies,
      startDate,
      endDate,
      status,
      createdBy: req.user._id,
      assignedEmployees,
      attachments,
    });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
// Get all projects
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === "admin") {
      projects = await Project.find()
        .sort({ createdAt: -1 })
        .populate("createdBy assignedEmployees");
    } else {
      // user فقط پروژه‌هایی که دخیل است
      projects = await Project.find({
        $or: [{ createdBy: req.user._id }, { assignedEmployees: req.user._id }],
      })
        .sort({ createdAt: -1 })
        .populate("createdBy assignedEmployees");
    }

    // اضافه کردن تعداد تسک‌ها
    const projectsWithTaskCount = await Promise.all(
      projects.map(async (proj) => {
        const taskCount = await Task.countDocuments({ project: proj._id });
        return { ...proj.toObject(), taskCount };
      })
    );

    res.status(200).json(projectsWithTaskCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy assignedEmployees"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (
      req.user.role !== "admin" &&
      !project.assignedEmployees.some(
        (emp) => emp._id.toString() === req.user._id.toString()
      ) &&
      project.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const taskCount = await Task.countDocuments({ project: project._id });

    res.status(200).json({ ...project.toObject(), taskCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (
      req.user.role !== "admin" &&
      project.assignedEmployees.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(project, req.body);
    const updatedProject = await project.save();
    res
      .status(200)
      .json(await updatedProject.populate("createdBy assignedEmployees"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (admin only)
const deleteProject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project dashboard stats
// @route   GET /api/projects/dashboard
// @access  Private
const getProjectDashboard = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const statusCounts = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const formattedStatus = {
      "Not Started": 0,
      "In Progress": 0,
      "On Hold": 0,
      Completed: 0,
    };
    statusCounts.forEach((s) => {
      formattedStatus[s._id] = s.count;
    });

    res.status(200).json({
      totalProjects,
      statusCounts: formattedStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectDashboard,
};
