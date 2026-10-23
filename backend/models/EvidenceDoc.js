const mongoose = require("mongoose");

const evidenceDocSchema = new mongoose.Schema({
  docId: {
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
  documentType: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  issuingAuthority: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ["Officially Verified", "Council Record", "Under Review", "Self-Reported"],
    default: "Officially Verified"
  },
  candidateId: {
    type: String,
    default: ""
  },
  relatedCategory: {
    type: String,
    default: ""
  },
  fileNumber: {
    type: String,
    default: ""
  },
  keyFindings: [{ type: String }],
  fileSnippet: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("EvidenceDoc", evidenceDocSchema);
