const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const USER_POPULATE_STR =
      "_id firstName lastName email phone role profileImg";
    const { token } = cookies;
    // console.log(req.cookies);
    if (!token) {
      throw new Error("Unauthorized request, Login again.");
    }
    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decodeToken);
    const { _id, firstName } = decodeToken;
    const userLogged = await User.findOne({ _id, firstName }).select(
      USER_POPULATE_STR
    );
    if (!userLogged) {
      throw new Error("Invalid Token found. User not registered.");
    }
    // Attached userData to req.
    req.userData = userLogged;
    // console.log(req.userData);
    // console.log("AUTHENTICATED_SUCCESSFULLY");
    next();
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      message: "Unexpected error occured.",
      err: err.message,
    });
  }
};

module.exports = auth;
