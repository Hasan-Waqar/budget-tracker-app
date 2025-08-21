const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");

const protect = async (req, res, next) => {
  let token;

  // We will be reading the token from an httpOnly cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token's payload
      // and attach the user object to the request (excluding the password)
      req.user = await User.findById(decoded.id).select("-password");

      // Proceed to the next step (the actual controller)
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
