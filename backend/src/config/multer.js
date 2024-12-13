const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // Import cloudinary config

// Configure storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cropZy/products", // Folder where files will be uploaded
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
