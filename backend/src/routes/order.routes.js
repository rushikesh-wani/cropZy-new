const express = require("express");
const auth = require("../middlewares/auth");
const { getAllOrder, makeAnOrder } = require("../controllers/order.controller");
const customerAuth = require("../middlewares/customerAuth");

const orderRouter = express.Router();

orderRouter.get("/order", auth, getAllOrder);

// POST /order/send/:farmerId/:itemId => Send order
orderRouter.post("/order/send/:itemID", auth, customerAuth, makeAnOrder);

module.exports = orderRouter;
