const mongoose = require("mongoose");

const promiseSchema = new mongoose.Schema({
  id: { type: String },
  category: { type: String, required: true },
  title: { type: String, required: true },
  currentProblem: { type: String, required: true },
  proposedSolution: { type: String, required: true },
  expectedBenefit: { type: String, required: true },
  targetTimeline: { type: String, required: true },
  implementationSteps: [{ type: String }],
  dependenciesAndBudget: { type: String, default: "" },
  measurableMetrics: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Proposed", "Completed", "Partially Completed", "In Progress", "Not Started", "Unable to Verify"],
    default: "Proposed"
  },
  evidenceRef: { type: String, default: "" }
}, { _id: false });

const performanceRecordSchema = new mongoose.Schema({
  id: { type: String },
  originalPromise: { type: String, required: true },
  category: { type: String, required: true },
  actionTaken: { type: String, required: true },
  actualOutcome: { type: String, required: true },
  evidenceRef: { type: String, default: "" },
  studentImpact: { type: String, required: true },
  status: {
    type: String,
    enum: ["Completed", "Partially Completed", "In Progress", "Not Started", "Unable to Verify"],
    required: true
  },
  remainingWork: { type: String, default: "" },
  delayExplanation: { type: String, default: "" }
}, { _id: false });

const timelineMilestoneSchema = new mongoose.Schema({
  phase: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateOrPeriod: { type: String, required: true },
  status: { type: String, default: "Upcoming" }
}, { _id: false });

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
  },
  position: {
    type: String,
    default: "Student Council President"
  },
  department: {
    type: String,
    default: "School of Engineering"
  },
  year: {
    type: String,
    default: "4th Year"
  },
  avatarUrl: {
    type: String,
    default: ""
  },
  isIncumbent: {
    type: Boolean,
    default: false
  },
  tagline: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  experience: [{ type: String }],
  priorities: [{ type: String }],
  keyPromises: [{ type: String }],
  manifesto: [promiseSchema],
  performanceRecords: [performanceRecordSchema],
  timelineMilestones: [timelineMilestoneSchema]
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);