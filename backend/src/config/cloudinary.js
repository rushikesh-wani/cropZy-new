const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "rushikeshwani",
  api_key: 249871974624352,
  api_secret: "SbWn5zjmzJsycmsZSbbXGi_MhqA",
});

module.exports = cloudinary;
