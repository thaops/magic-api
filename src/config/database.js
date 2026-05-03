const mongoose = require("mongoose");

const connect = async () => {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

module.exports = { connect };
