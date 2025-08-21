const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // SET THE TOKEN IN AN HTTP-ONLY COOKIE
  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Helps prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, budgetLimit } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      budgetLimit,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        pfp: user.pfp,
        aboutMe: user.aboutMe,
        fatherName: user.fatherName,
        phone: user.phone,
        education: user.education,
        dob: user.dob,
        gender: user.gender,
        jobTitle: user.jobTitle,
        streetAddress: user.streetAddress,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        pfp: user.pfp,
        aboutMe: user.aboutMe,
        fatherName: user.fatherName,
        phone: user.phone,
        education: user.education,
        dob: user.dob,
        gender: user.gender,
        jobTitle: user.jobTitle,
        streetAddress: user.streetAddress,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.budgetLimit = req.body.budgetLimit || user.budgetLimit;
    user.pfp = req.body.pfp || user.pfp;
    user.aboutMe = req.body.aboutMe || user.aboutMe;
    user.fatherName = req.body.fatherName || user.fatherName;
    user.phone = req.body.phone || user.phone;
    user.education = req.body.education || user.education;
    user.dob = req.body.dob || user.dob;
    user.gender = req.body.gender || user.gender;
    user.jobTitle = req.body.jobTitle || user.jobTitle;
    user.streetAddress = req.body.streetAddress || user.streetAddress;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.zipCode = req.body.zipCode || user.zipCode;

    const updatedUser = await user.save();

    generateToken(res, updatedUser._id);

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      budgetLimit: updatedUser.budgetLimit,
      role: updatedUser.role,
      pfp: updatedUser.pfp,
      aboutMe: updatedUser.aboutMe,
      fatherName: updatedUser.fatherName,
      phone: updatedUser.phone,
      education: updatedUser.education,
      dob: updatedUser.dob,
      gender: updatedUser.gender,
      jobTitle: updatedUser.jobTitle,
      streetAddress: updatedUser.streetAddress,
      city: updatedUser.city,
      state: updatedUser.state,
      zipCode: updatedUser.zipCode,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = { signupUser, loginUser, updateUserProfile };
