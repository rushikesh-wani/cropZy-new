const mongoose = require("mongoose");

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  mongoose.set("debug", true);
  const options = {
    dbName: "cropZy",
  };
  await mongoose.createConnection(
    "mongodb+srv://rushi11:rushi11@cluster0.1ubgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    options
  );
};

module.exports = { connectDB };
