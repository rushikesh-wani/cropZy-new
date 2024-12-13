const mongoose = require("mongoose");
const { DEFAULT_USER_IMG_URL } = require("../utils/constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 10,
      maxLength: 10,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["farmer", "customer", "admin"],
        message: `{VALUE} is not the valid role`,
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // minLength: 6,
    },
    profileImg: {
      type: String,
      default: DEFAULT_USER_IMG_URL,
    },
  },
  { timestamps: true }
);

// Schema methods
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashPassword
  );
  return isPasswordValid;
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id, firstName: user.firstName },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
  return token;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
