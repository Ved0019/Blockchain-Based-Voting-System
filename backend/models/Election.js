const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Student Council General Election"
  },
  institutionName: {
    type: String,
    default: "Apex Institute of Technology & Engineering"
  },
  academicYear: {
    type: String,
    default: "2025–2026"
  },
  electionPhase: {
    type: String,
    default: "Official Voting Phase"
  },
  votingDeadline: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
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