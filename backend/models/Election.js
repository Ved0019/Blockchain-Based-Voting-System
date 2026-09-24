const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Institutional Election"
  },
  isActive: {
    type: Boolean,
    default: false
  },
  topicId: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Election", electionSchema);