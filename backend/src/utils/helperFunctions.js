const bcrypt = require("bcrypt");
const validator = require("validator");
const { isLength, isNumeric, isAlphanumeric } = validator;
const User = require("../models/users");

// function to sanitize the request body to avoid attacks
const sanitizeReqBody = (req, res) => {
  const { firstName, lastName, email, phone, role, password, profileImg } =
    req.body;
  if (!firstName || !lastName || !email || !phone || !password || !role) {
    return res.status(409).json({
      statusCode: 409,
      message: "All fields are required",
    });
  }
  if (firstName.length < 3 || firstName.length > 50) {
    return res.status(409).json({
      statusCode: 409,
      message:
        "FirstName either too big or too small. Must be 3 < firstName < 50",
    });
  }
  if (!/^[a-zA-Z]+$/.test(firstName.trim())) {
    return res.status(409).json({
      statusCode: 409,
      message: "firstName must contain a-z or A-Z character only",
    });
  }
  if (!/^[a-zA-Z]+$/.test(lastName.trim())) {
    return res.status(409).json({
      statusCode: 409,
      message: "lastName must contain a-z or A-Z character only",
    });
  }
  if (lastName.length < 3 || lastName.length > 50) {
    return res.status(409).json({
      statusCode: 409,
      message:
        "LastName either too big or too small. Must be 3 < lastName < 50",
    });
  }
};

// function to valid the req.body at time of signup
const validateReqBody = async (req, res) => {
  const { email, phone, role } = req.body;
  const validRoles = ["customer", "farmer", "admin"];
  const isUserAlreadyExists = await User.findOne({ email: email });
  const isPhoneNumberAlreadyExists = await User.findOne({ phone });
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid role provided",
    });
  }
  if (isUserAlreadyExists) {
    return res.status(400).json({
      statusCode: 400,
      message: "User already exists.",
    });
  }
  if (isPhoneNumberAlreadyExists) {
    return res.status(400).json({
      statusCode: 400,
      message: "Phone number already exists",
    });
  }
};

// functions to encrpt password while signup
const encrptPass = async (password) => {
  const saltRound = 10;
  return await bcrypt.hash(password, saltRound);
};

const validateItemEditFields = async (data) => {
  const allowedFields = [
    "itemName",
    "pricePerUnit",
    "category",
    "description",
    "quantity",
  ];

  const errors = {};
  const sanitizedData = {};

  const invalidFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return {
      inValid: false,
      errors: { invalidFields: `Invalid fields: ${invalidFields.join(",")}` },
    };
  }

  if (data.itemName !== undefined) {
    if (!validator.isLength(data.itemName.trim(), { min: 1, max: 50 })) {
      errors.itemName = "Item name must be between 1 and 50 characters long";
    } else {
      sanitizedData.itemName = validator.escape(data.itemName.trim());
    }
  }

  if (data.pricePerUnit !== undefined) {
    if (!validator.isFloat(data.pricePerUnit, { min: 0 })) {
      errors.pricePerUnit = "Price must be positive";
    } else {
      sanitizedData.pricePerUnit = validator.escape(data.pricePerUnit);
    }
  }

  if (data.category !== undefined) {
    if (!validator.isLength(data.category.trim(), { min: 1, max: 50 })) {
      errors.category =
        "Category name must be between 1 and 50 characters long";
    } else {
      sanitizedData.category = validator.escape(data.category.trim());
    }
  }

  if (data.description !== undefined) {
    if (!validator.isLength(data.description.trim(), { max: 200 })) {
      errors.description = "Description must be only 200 characters long";
    } else {
      sanitizedData.description = validator.escape(data.description.trim());
    }
  }

  if (data.quantity !== undefined) {
    if (!validator.isInt(data.quantity, { min: 0 })) {
      errors.quantity = "Quantity must be 0 or above 0";
    } else {
      sanitizedData.quantity = validator.escape(data.quantity);
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

module.exports = {
  sanitizeReqBody,
  validateReqBody,
  encrptPass,
  validateItemEditFields,
};
