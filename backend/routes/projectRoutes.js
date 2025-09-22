const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectDashboard,
} = require("../controllers/projectController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

//? Project CRUD
router.post("/", protect, adminOnly, createProject);
router.get("/", protect, getProjects);
router.get("/dashboard/stats", protect, getProjectDashboard);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

//? Upload Attachment
router.post(
  "/upload-attachment",
  protect,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file was uploaded.");
    }
    const fileURL = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({ fileURL });
  }
);

module.exports = router;
