const express = require("express");
const auth = require("../middlewares/auth");
const {
  profileViewController,
  handleOrderStatus,
  getAllOrders,
  getOrdersBasedOnStatus,
  viewOrder,
  getOrderSummary,
} = require("../controllers/farmer.controller");
const farmerAuth = require("../middlewares/farmerAuth");

const farmerRouter = express.Router();

farmerRouter.get(
  "/farmer/profileView",
  auth,
  farmerAuth,
  profileViewController
);

// get all farmer received orders
farmerRouter.get("/farmer/getOrders", auth, farmerAuth, getAllOrders);

farmerRouter.post(
  "/order/:status/:orderID",
  auth,
  farmerAuth,
  handleOrderStatus
);

farmerRouter.get(
  "/farmer/orders/:status",
  auth,
  farmerAuth,
  getOrdersBasedOnStatus
);

farmerRouter.get("/farmer/view-order/:orderId", auth, farmerAuth, viewOrder);

// Get order summary
farmerRouter.get("/farmer/getOrderSummary", auth, farmerAuth, getOrderSummary);

module.exports = farmerRouter;
