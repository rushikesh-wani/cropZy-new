const express = require("express");
const auth = require("../middlewares/auth");
const customerAuth = require("../middlewares/customerAuth");
const {
  myOrderController,
  getAllProduct,
  cancelOrderInPendingState,
  getOrdersByStatus,
  getCustomerHomepage,
} = require("../controllers/customer.controller");

const customerRouter = express.Router();

//GET /home-page => Get User Home page details to show
customerRouter.get("/home-page", getCustomerHomepage);

// GET /my-orders => Get all the orders of users
customerRouter.get("/my-orders", auth, customerAuth, myOrderController);

// GET /my-orders/:orderStatus => Get orders based on status
customerRouter.get(
  "/my-orders/:orderStatus",
  auth,
  customerAuth,
  getOrdersByStatus
);

// GET /products => Get all product for user feed
customerRouter.get("/products", auth, customerAuth, getAllProduct);

// POST /cancel-order/:orderID => Cancel order when in pending state only
customerRouter.post(
  "/cancel-order/:orderID",
  auth,
  customerAuth,
  cancelOrderInPendingState
);

module.exports = customerRouter;
