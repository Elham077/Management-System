const express = require("express");
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseDashboard,
} = require("../controllers/expenseController");

const { protect, adminOnly} = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

//? Expense CRUD
router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.get("/dashboard", protect, adminOnly,getExpenseDashboard);
router.get("/:id", protect, getExpenseById);
router.put("/:id", protect, adminOnly,updateExpense);
router.delete("/:id", protect, adminOnly,deleteExpense);

//? Upload attachment
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
