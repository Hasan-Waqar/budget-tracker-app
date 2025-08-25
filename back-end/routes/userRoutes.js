const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../config/cloudinary");
const upload = multer({ storage });

const { protect, admin } = require("../middleware/authMiddleware");

const {
  signupUser,
  loginUser,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPfp,
  createUser,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.put("/profile", protect, updateUserProfile);

router
  .route("/")
  .post(protect, admin, createUser)
  .get(protect, admin, getUsers);

router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.post("/profile/pfp", protect, upload.single("pfp"), updateUserPfp);

module.exports = router;
