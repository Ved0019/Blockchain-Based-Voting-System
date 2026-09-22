const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true, default: "Campus General Election" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Election", electionSchema);