const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, default: "Registered Voter" },
  hasVoted: { type: Boolean, default: false },
  votedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Voter", voterSchema);