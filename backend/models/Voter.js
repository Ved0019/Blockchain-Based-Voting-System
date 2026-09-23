const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  voterId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    default: "Enrolled Voter"
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("Voter", voterSchema);