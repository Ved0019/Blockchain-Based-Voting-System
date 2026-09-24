const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  candidateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  party: {
    type: String,
    required: true,
    trim: true
  },
  avatarIpfs: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);