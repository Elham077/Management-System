const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");

const router = express.Router();

//? ================> routers for user operations
router.get("/", protect, adminOnly, getUsers); //* ==============> Only admin can access the list of all users
router.get("/:id", protect, getUserById); //* ======================> Users can access their own data; Admin can access any user's data
router.delete("/:id", protect, adminOnly, deleteUser); //* =========> Only admin can delete a user

module.exports = router;