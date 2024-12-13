const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected", "delivered", "cancel"], // pending => at time of order | approved => approved by farmer | delivered => delivered by farmer | cancel => order cancelled by customer
        message: `{VALUE} is not the valid status`,
      },
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    weight: {
      value: {
        type: Number,
        required: true,
        min: 0,
      },
      unit: {
        type: String,
        required: true,
        enum: {
          values: ["gm", "kg", "liters", "ml", "Piece", "Combo"],
          message: `{VALUE} is not the valid unit`,
        },
      },
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
