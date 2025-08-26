const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    budgetLimit: { type: Number, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },

    pfp: { type: String, default: "" },
    aboutMe: { type: String, default: "" },
    fatherName: { type: String, default: "" },
    phone: { type: String, default: "" },
    education: { type: String, default: "" },
    dob: { type: Date, default: null },
    gender: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    streetAddress: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
