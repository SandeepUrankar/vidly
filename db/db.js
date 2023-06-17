const mongoose = require("mongoose");
const dbDebugger = require("debug")("app:db");
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => dbDebugger("Connected to DB..."))
  .catch((err) => dbDebugger("Error", err));
module.exports.mongoose = mongoose;
