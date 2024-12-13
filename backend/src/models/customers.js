const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      trim: true,
      maxLength: 150,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
