const mongoose = require("mongoose");

const campusIssueSchema = new mongoose.Schema({
  issueId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ["High", "Medium", "Critical"],
    default: "High"
  },
  description: {
    type: String,
    required: true
  },
  currentStatus: {
    type: String,
    default: "Unresolved / Needs Urgent Council Action"
  },
  studentSentiment: {
    type: String,
    default: ""
  },
  solutions: [
    {
      candidateId: { type: String, required: true },
      candidateName: { type: String, required: true },
      proposedApproach: { type: String, required: true },
      manifestoPromiseTitle: { type: String, default: "" },
      timelineTarget: { type: String, default: "" }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("CampusIssue", campusIssueSchema);
