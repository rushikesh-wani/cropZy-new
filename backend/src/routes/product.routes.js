const express = require("express");
const auth = require("../middlewares/auth");
const farmerAuth = require("../middlewares/farmerAuth");
const {
  getAllItemsController,
  deleteItemController,
  updateItemDetails,
  productAddController,
  getProductDetails,
} = require("../controllers/product.controller");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const validator = require("validator");
const { isMongoId } = validator;
const productRouter = express.Router();

// GET /product/:itemId => Get the Item Details based on its _id
productRouter.get("/getProduct/:itemId", getProductDetails);

productRouter.post(
  "/product/add",
  auth,
  farmerAuth,
  upload.single("img"),
  productAddController
);

productRouter.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        statusCode: 400,
        message: "Image file is required",
      });
    }

    // File uploaded successfully
    return res.status(200).json({
      statusCode: 200,
      message: "Image uploaded successfully",
      imageUrl: req.file.path, // Cloudinary URL of the uploaded image
    });
  } catch (err) {
    console.error("Error uploading image:", err.message);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
});

productRouter.get(
  "/product/getAllItems",
  auth,
  farmerAuth,
  getAllItemsController
);
productRouter.delete(
  "/product/delete/:itemId",
  auth,
  farmerAuth,
  deleteItemController
);
productRouter.patch(
  "/product/edit/:itemId",
  auth,
  farmerAuth,
  updateItemDetails
);

module.exports = productRouter;
