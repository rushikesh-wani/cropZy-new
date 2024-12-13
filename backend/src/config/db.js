const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("debug", true);
  const options = {
    dbName: "cropZy",
  };
  await mongoose.connect(process.env.MONGO_URI, options);
};

module.exports = { connectDB };
