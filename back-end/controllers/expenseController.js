const Expense = require("../models/ExpenseModel");
const User = require("../models/UserModel");

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  const { title, price, date } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!title || !price || !date) {
    return res
      .status(400)
      .json({ message: "Please provide title, price, and date" });
  }

  const expenditure = Math.round((price / user.budgetLimit) * 100);

  const expense = await Expense.create({
    user: req.user._id,
    title,
    price,
    date,
    expenditure,
  });

  res.status(201).json(expense);
};

// @desc    Get expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  const query = {};
  if (req.user.role !== "Admin") {
    query.user = req.user._id;
  }

  if (req.query.date && req.query.date !== "null") {
    const selectedDate = new Date(req.query.date);

    if (!isNaN(selectedDate.getTime())) {
      const nextDay = new Date(req.query.date);
      nextDay.setDate(selectedDate.getDate() + 1);

      query.date = {
        $gte: selectedDate,
        $lt: nextDay,
      };
    }
  }
  if (req.query.keyword) {
    query.title = {
      $regex: req.query.keyword,
      $options: "i",
    };
  }

  if (req.query.date) {
    const selectedDate = new Date(req.query.date);
    const nextDay = new Date(req.query.date);
    nextDay.setDate(selectedDate.getDate() + 1);

    query.date = {
      $gte: selectedDate,
      $lt: nextDay,
    };
  }

  let sort = {};
  const sortBy = req.query.sortBy || "newdate";
  switch (sortBy) {
    case "highprice":
      sort = { price: -1 };
      break;
    case "lowprice":
      sort = { price: 1 };
      break;
    case "olddate":
      sort = { date: 1 };
      break;
    case "newdate":
    default:
      sort = { date: -1 };
      break;
  }

  const expenses = await Expense.find(query)
    .populate("user", "firstName lastName")
    .sort(sort);

  res.status(200).json(expenses);
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  const { title, price, date } = req.body;
  const user = await User.findById(req.user._id);
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  if (expense.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "User not authorized" });
  }

  const expenditure = Math.round((price / user.budgetLimit) * 100);

  expense.title = title || expense.title;
  expense.price = price || expense.price;
  expense.date = date || expense.date;
  expense.expenditure = expenditure;

  const updatedExpense = await expense.save();
  res.status(200).json(updatedExpense);
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  if (expense.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "User not authorized" });
  }

  await Expense.deleteOne({ _id: expense._id });
  res.status(200).json({ message: "Expense deleted successfully" });
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
const getExpenseStats = async (req, res) => {
  try {
    const matchQuery = {};
    if (req.user.role !== "Admin") {
      matchQuery.user = req.user._id;
    }

    // --- THIS IS THE NEW LOGIC FOR THE DATE RANGE FILTER ---
    const range = req.query.range || "12m"; // Default to '12m' if no range is provided
    const now = new Date();
    let startDate;

    switch (range) {
      case "6m":
        // Set the date to 6 months ago from the first day of the current month
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case "3m":
        // Set the date to 3 months ago from the first day of the current month
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case "12m":
      default:
        // Set the date to 12 months ago from the first day of the current month
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        break;
    }

    // Add the date condition to our main query
    matchQuery.date = { $gte: startDate };
    // --- END NEW LOGIC ---

    // The rest of the aggregation pipelines will now use this filtered matchQuery
    const totalStats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlySpending = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$price" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const topExpenses = await Expense.find(matchQuery)
      .sort({ price: -1 })
      .limit(5);

    res.status(200).json({
      totalSpent: totalStats[0]?.totalSpent || 0,
      expenseCount: totalStats[0]?.count || 0,
      monthlySpending: monthlySpending,
      topExpenses: topExpenses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching stats", error: error.message });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseStats,
};
