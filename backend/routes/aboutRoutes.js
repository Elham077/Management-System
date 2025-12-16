const express = require("express");
const router = express.Router();

const {
  createAbout,
  getAllAbout,
  getAboutById,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

const {protect, adminOnly} = require("../middlewares/authMiddleware")

/**
 * Public Routes
 */
router.get("/abouts", protect, adminOnly,getAllAbout);
router.get("/getabout/:id", protect, adminOnly,getAboutById);

/**
 * Protected Routes
 */
router.post("/create", protect, adminOnly,createAbout);
router.put("/update/:id", protect, adminOnly,updateAbout);
router.delete("/delete/:id", protect, adminOnly,deleteAbout);

module.exports = router;
