const mongoose = require("mongoose");

const farmerSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    farmName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    farmLocation: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
  },
  { timestamps: true }
);

const Farmer = mongoose.model("farmer", farmerSchema);

module.exports = Farmer;
