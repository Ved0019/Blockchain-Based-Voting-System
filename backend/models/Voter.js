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
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter"
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