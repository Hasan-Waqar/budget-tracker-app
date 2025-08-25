const express = require("express");
const router = express.Router();
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createExpense);

router.route("/").get(protect, getExpenses);

router.route("/stats").get(protect, getExpenseStats);
router.route("/:id").put(protect, updateExpense).delete(protect, deleteExpense);

module.exports = router;
