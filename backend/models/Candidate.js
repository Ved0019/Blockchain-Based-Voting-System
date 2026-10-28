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
  partyDescription: {
    type: String,
    default: ""
  },
  partyFounded: {
    type: String,
    default: ""
  },
  partyIdeology: {
    type: String,
    default: ""
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
  timelineMilestones: [timelineMilestoneSchema],

  // --- NEW: Comprehensive Profile Fields ---

  // Criticisms & Downsides
  criticisms: [{
    category: { type: String, required: true }, // e.g., "Governance", "Transparency", "Inclusivity"
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ["Minor", "Moderate", "Major", "Critical"], default: "Moderate" },
    source: { type: String, default: "" }, // e.g., "Student Survey", "RTI Response", "Council Minutes"
    evidenceRef: { type: String, default: "" },
    acknowledgedByCandidate: { type: Boolean, default: false },
    candidateResponse: { type: String, default: "" }
  }],

  // Controversies & Pending Cases
  controversies: [{
    caseId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Under Investigation", "Pending Hearing", "Resolved - Cleared", "Resolved - Penalty", "Dismissed", "Appealed"],
      required: true
    },
    filedBy: { type: String, default: "" }, // e.g., "Proctorial Board", "Student Grievance Cell", "RTI Activist"
    filedDate: { type: String, default: "" },
    hearingDate: { type: String, default: "" },
    outcome: { type: String, default: "" },
    penalty: { type: String, default: "" },
    evidenceRef: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  }],

  // Financial Disclosures
  financialDisclosures: [{
    year: { type: String, required: true },
    totalExpenditure: { type: Number, default: 0 },
    totalIncome: { type: Number, default: 0 },
    majorExpenses: [{
      category: { type: String },
      amount: { type: Number },
      description: { type: String }
    }],
    fundingSources: [{
      source: { type: String },
      amount: { type: Number },
      type: { type: String, enum: ["Personal", "Party Fund", "Donation", "Sponsorship", "University Grant"] }
    }],
    auditStatus: { type: String, enum: ["Audited", "Pending Audit", "Flagged", "Rejected"], default: "Pending Audit" },
    auditRef: { type: String, default: "" }
  }],

  // Voting Record (for incumbents)
  votingRecord: [{
    motionId: { type: String },
    motionTitle: { type: String },
    date: { type: String },
    vote: { type: String, enum: ["For", "Against", "Abstained", "Absent"] },
    category: { type: String },
    controversyLevel: { type: String, enum: ["None", "Low", "Medium", "High"], default: "None" },
    notes: { type: String, default: "" }
  }],

  // Attendance & Participation
  attendanceRecord: [{
    sessionType: { type: String, enum: ["Council Meeting", "Senate", "Committee", "Town Hall", "Emergency Session"] },
    date: { type: String },
    attended: { type: Boolean },
    reasonIfAbsent: { type: String, default: "" },
    totalSessions: { type: Number },
    sessionsAttended: { type: Number }
  }],

  // Public Feedback & Ratings
  publicFeedback: {
    overallRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    categoryRatings: [{
      category: { type: String },
      rating: { type: Number, min: 0, max: 5 },
      reviewCount: { type: Number }
    }],
    sentimentBreakdown: {
      positive: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 },
      negative: { type: Number, default: 0 }
    },
    topPraises: [{ type: String }],
    topComplaints: [{ type: String }],
    lastUpdated: { type: String, default: "" }
  },

  // Source References for all claims
  sources: [{
    claimType: { type: String, enum: ["Manifesto Promise", "Performance Record", "Criticism", "Controversy", "Financial", "Voting Record", "Attendance", "Feedback"] },
    claimRef: { type: String }, // e.g., "C1-P01", "C1-PERF-01", "CRIT-C1-01"
    sourceType: { type: String, enum: ["Official Document", "RTI Response", "Council Minutes", "Mirror Node", "Student Survey", "Media Report", "University Portal", "Self-Declared", "Third-Party Audit"] },
    sourceTitle: { type: String },
    sourceUrl: { type: String, default: "" },
    sourceDate: { type: String },
    verificationStatus: { type: String, enum: ["Verified", "Partially Verified", "Unverified", "Disputed", "Retracted"], default: "Unverified" },
    verifiedBy: { type: String, default: "" }
  }],

  // Completeness Score
  profileCompleteness: {
    manifestoComplete: { type: Boolean, default: false },
    performanceComplete: { type: Boolean, default: false },
    criticismsDocumented: { type: Boolean, default: false },
    controversiesDocumented: { type: Boolean, default: false },
    financialsDisclosed: { type: Boolean, default: false },
    votingRecordDisclosed: { type: Boolean, default: false },
    attendanceDisclosed: { type: Boolean, default: false },
    feedbackCollected: { type: Boolean, default: false },
    sourcesVerified: { type: Boolean, default: false },
    overallScore: { type: Number, default: 0, min: 0, max: 100 }
  }

}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);