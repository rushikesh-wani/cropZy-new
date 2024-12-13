const Product = require("../models/product");
const cloudinary = require("cloudinary").v2;
const upload = require("../config/multer");
const validator = require("validator");
const { isMongoId } = validator;
const Order = require("../models/orders");

const getProductDetails = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json({
        statusCode: 400,
        message: "itemId not found in params!",
      });
    }
    const isItemIdAValidMongoId = isMongoId(itemId);
    if (!isItemIdAValidMongoId) {
      return res.status(400).json({
        statusCode: 400,
        message: "Item Id is not the valid mongoId! Try not to hit /API",
      });
    }

    const itemData = await Product.findOne({ _id: itemId }).select(
      "itemName description category stockQty price weight img"
    );
    if (!itemData) {
      return res.status(404).json({
        statusCode: 404,
        message: "Item not found. Either itemId is invalid",
      });
    }
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: `Item details of ${itemId} fetched successfully`,
      data: itemData,
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: "INTERNAL SERVER ERROR",
      err: err.message,
    });
  }
};
const getAllItemsController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const allItems = await Product.find({ farmerId: _id });

    if (allItems.length == 0) {
      res.status(200).json({
        statusCode: 200,
        message: "No items yet added in shop. Add item to your shop first",
      });
    } else {
      res.status(200).json({
        statusCode: 200,
        message: "All items fetched successfully!",
        data: allItems,
      });
    }
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      message: "Internal server error",
      err: err.message,
    });
  }
};

const productAddController = async (req, res) => {
  try {
    const { _id } = req.userData;
    const { itemName, price, category, description, stockQty, value, unit } =
      req.body;
    if (!itemName || !stockQty || !unit || !value || !description || !price) {
      return res.status(400).json({
        statusCode: 400,
        message: "All fields are required",
      });
    }

    const isItemAlreadyExists = await Product.findOne({
      itemName: itemName,
      farmerId: _id,
    });

    if (!req.file) {
      return res.status(400).json({
        statusCode: 400,
        message: "Image file is required",
      });
    }
    if (isItemAlreadyExists) {
      return res.status(409).json({
        statusCode: 409,
        message:
          "Item already listed in your shop! Try update the existing product or delete to add new item with same name.",
      });
    }

    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "cropZy/products",
    });

    const product = new Product({
      itemName,
      price,
      category,
      description,
      stockQty,
      weight: {
        value: value,
        unit: unit,
      },
      img: cloudinaryResult.secure_url,
      farmerId: _id,
    });
    const productData = await product.save();

    const productAddedData = await Product.findById(productData._id).populate(
      "farmerId",
      "firstName lastName email phone"
    );
    res.status(201).json({
      statusCode: 201,
      message: `${itemName} item successfully added!`,
      data: productAddedData,
    });
  } catch (err) {
    res.status(400).json({
      statusCode: "400",
      err: err.message,
      message: "Internal server error",
    });
  }
};

const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { _id } = req.userData;
    // 1. Validate the item Id before deleting item
    // 2. Check if item has been ordered or not. If Yes then don't let Farmer Delete the item

    // Validate the itemId => whether is item id is reset and is where associated with the user logged in
    const doesItemExists = await Product.findOne({
      _id: itemId,
      farmerId: _id,
    });

    if (!doesItemExists) {
      res.status(404).json({
        statusCode: 404,
        message: "Item not found!",
      });
    } else {
      const isItemOrdered = await Order.find({
        itemId: itemId,
        farmerId: _id,
        status: { $ne: "delivered" },
      });
      if (isItemOrdered) {
        return res.status(409).json({
          statusCode: 409,
          success: false,
          message: `Item cann't be deleted at this time due to item is currently ordered. Finish all the orders then you will be able to delete this item.`,
        });
      } else {
        const deletedItem = await Product.findByIdAndDelete(itemId);
        return res.status(200).json({
          statusCode: 200,
          message: `Item ${deletedItem.itemName} deleted successfully!`,
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      statusCode: "400",
      err: err.message,
      message: "Internal server error",
    });
  }
};

const updateItemDetails = async (req, res) => {
  try {
    const { _id } = req.userData; // Farmer Id as farmer is logged in
    const { itemId } = req.params;
    const {
      itemName,
      description,
      stockQty,
      price,
      weight,
      unit,
      value,
      category,
      img,
    } = req.body;
    const allowedFields = [
      "_id",
      "itemName",
      "description",
      "stockQty",
      "price",
      "category",
      "weight",
      "img",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedFields.includes(field)
    );
    const doesItemExists = await Product.findOne({
      _id: itemId,
      farmerId: _id,
    });

    // if edit is allowed then => then check if item with Id and farmerId exists or not => then validate the fields => then update the fields

    if (!isEditAllowed) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Unkown field found in req.body!",
      });
    } else {
      if (!doesItemExists) {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: "Item not found!",
        });
      } else {
        // Validate the updated Fields
        // write validations here

        // update the item details
        const updatedItem = await Product.findByIdAndUpdate(itemId, req.body, {
          returnDocument: "after",
        });
        if (!updatedItem) {
          return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "Item not found!",
          });
        } else {
          return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Item details updated successfully",
            data: updatedItem,
          });
        }
      }
    }
  } catch (err) {
    res.status(400).json({
      statusCode: "400",
      err: err.message,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getProductDetails,
  productAddController,
  getAllItemsController,
  deleteItemController,
  updateItemDetails,
};
