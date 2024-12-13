const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const API_BASE_URL = "/api/v1";

// Middlewares
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.get(`${API_BASE_URL}/home`, async (req, res) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Hello World",
  });
});
// Connect to DB
connectDB()
  .then(() => {
    console.log("Successfully connected to DB");
    app.listen(5000, () => {
      console.log("Server running on PORT: 5000");
    });
  })
  .catch((err) => {
    console.log("Failed to connect to DB");
    console.log("Error message : ", err);
  });
