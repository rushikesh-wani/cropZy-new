const User = require("../models/users");

const farmerAuth = async (req, res, next) => {
  const { role, _id } = req.userData;

  if (role !== "farmer") {
    res.status(400).json({
      statusCode: 400,
      message: "BAD REQUEST",
      err: "You are not the farmer",
    });
  } else {
    next();
  }
};

module.exports = farmerAuth;
