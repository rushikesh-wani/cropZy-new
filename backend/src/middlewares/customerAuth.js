const customerAuth = async (req, res, next) => {
  const { role, _id } = req.userData;

  if (role !== "customer") {
    res.status(400).json({
      statusCode: 400,
      succes: false,
      message: "BAD REQUEST : You are not a customer",
    });
  } else {
    next();
  }
};

module.exports = customerAuth;
