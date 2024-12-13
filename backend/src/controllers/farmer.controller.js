const Order = require("../models/orders");
const validator = require("validator");
const { isMongoId } = validator;
const profileViewController = async (req, res) => {
  try {
    const { _id, firstName, lastName, email, phone, role, profileImg } =
      req.userData;

    // Validate if user logged in is the Farmer or not
    if (role !== "farmer") {
      res.status(400).json({
        statusCode: "400",
        err: "Unauthorized access",
        message: "User logged in does not have access to farmer role.",
      });
    } else {
      res.status(200).json({
        statusCode: 200,
        message: `Hello farmer ${firstName} ${lastName}. Welcome back!`,
        data: req.userData,
      });
    }
  } catch (err) {
    res.status(400).json({
      statusCode: "400",
      err: err.message,
      message: "Internal server error",
    });
  }
};

const handleOrderStatus = async (req, res) => {
  try {
    const { status, orderID } = req.params;
    const { _id } = req.userData; // farmer.user._id
    const allowedStatus = ["approved", "rejected", "delivered"];
    const isStatusValid = allowedStatus.includes(status);
    const isOrderIdMongoId = isMongoId(orderID);
    console.log(status + " " + orderID + " " + isOrderIdMongoId);
    console.log(isStatusValid);
    if (!isStatusValid) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: `${status} is not the valid status`,
      });
    }
    if (isOrderIdMongoId == false) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: `${orderID} is not the valid mongo ObjectId`,
      });
    }
    // check if farmer has received order and the farmer._id is farmerId:farmer._id for that document
    const isOrderIdValid = await Order.findOne({ _id: orderID, farmerId: _id });
    if (!isOrderIdValid) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: `Order id - ${orderID} is not valid`,
      });
    }
    if (isStatusValid) {
      isOrderIdValid.status = status;
      await isOrderIdValid.save();
      return res.status(202).json({
        statusCode: 202,
        success: true,
        message: `Order Id - ${orderID} status changed to ${status} successfully!`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: `Internal server error : ${err.message}`,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { _id } = req.userData; // Farmer id
    const allOrders = await Order.find({ farmerId: _id })
      .populate("item", "itemName img price description category")
      .populate("customerId", "firstName lastName email phone profileImg");
    res.status(200).json({
      statusCode: 200,
      message: "Orders fetched successfully",
      data: allOrders,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
      err: err.message,
    });
  }
};

const getOrdersBasedOnStatus = async (req, res) => {
  try {
    const { _id } = req.userData;
    const { status } = req.params;

    const isStatusValid = [
      "pending",
      "approved",
      "rejected",
      "delivered",
      "excludeDelivered",
    ].includes(status);

    // console.log(isStatusValid);
    if (!isStatusValid) {
      return res.status(404).json({
        statusCode: 404,
        message: "Invalid status for order to be fetched",
      });
    }
    if (status === "excludeDelivered") {
      const orderData = await Order.find({
        $and: [{ farmerId: _id }, { status: { $ne: "delivered" } }],
      })
        .populate("item", "itemName img price description category")
        .populate("customerId", "firstName lastName email phone profileImg");
      res.status(200).json({
        statusCode: 200,
        message: `Orders with status ${status} fetched successfully`,
        data: orderData,
      });
    } else {
      const orderData = await Order.find({ farmerId: _id, status: status })
        .populate("item", "itemName img price description category")
        .populate("customerId", "firstName lastName email phone profileImg");
      res.status(200).json({
        statusCode: 200,
        message: `Orders with status ${status} fetched successfully`,
        data: orderData,
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
      err: error.message,
    });
  }
};

const viewOrder = async (req, res) => {
  try {
    const { _id } = req.userData;
    const { orderId } = req.params;
    const isOrderIdAMongoId = validator.isMongoId(orderId);
    if (!isOrderIdAMongoId) {
      return res.status(400).json({
        statusCode: 400,
        message: `Order Id ${orderId} is not a valid mongoId`,
      });
    }
    const isOrderIdValid = await Order.findOne({ _id: orderId, farmerId: _id })
      .populate("item", "itemName img weight price description category")
      .populate(
        "customerId",
        "firstName lastName email phone profileImg address"
      )
      .populate("farmerId", "firstName lastName email phone profileImg");
    if (!isOrderIdValid) {
      return res.status(404).json({
        statusCode: 404,
        message: `Order Id ${orderId} is not valid`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Order details fetched successfully...",
      data: isOrderIdValid,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
      err: err.message,
    });
  }
};

const getOrderSummary = async (req, res) => {
  const { _id } = req.userData;
  try {
    const data = await Order.aggregate([
      {
        $match: {
          farmerId: _id,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      statusCode: 200,
      message: "Orders overview Fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
      err: err.message,
    });
  }
};

module.exports = {
  profileViewController,
  handleOrderStatus,
  getAllOrders,
  getOrdersBasedOnStatus,
  viewOrder,
  getOrderSummary,
};
