const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  signupUser,
  loginUser,
  updateUserProfile,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
