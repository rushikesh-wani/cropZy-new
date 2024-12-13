const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
      minLength: 2,
    },
    stockQty: {
      type: Number,
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
    img: {
      type: String,
      required: true,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500",
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      maxLength: 100,
      default: "Recently Added",
      enum: {
        values: [
          "Recently Added",
          "Fresh Fruits",
          "Cereals",
          "Dairy Product",
          "Vegetables",
        ],
        message: `{VALUE} is not a valid category`,
      },
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxLength: 500,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing
itemSchema.index({ _id: 1, farmerId: 1 });

const Product = mongoose.model("product", itemSchema);

module.exports = Product;
