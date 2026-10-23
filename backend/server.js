const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Client, PrivateKey, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const Voter = require("./models/Voter");
const Candidate = require("./models/Candidate");
const Election = require("./models/Election");
const CampusIssue = require("./models/CampusIssue");
const EvidenceDoc = require("./models/EvidenceDoc");
const { seedManifestoData } = require("./seedData");
const { login } = require("./controllers/auth");
const { getVoteBroadcastErrorMessage } = require("./lib/voteErrors");

// Environment validation
const requiredEnvVars = [
  'MONGO_URI',
  'HEDERA_NETWORK',
  'HEDERA_ACCOUNT_ID',
  'HEDERA_PRIVATE_KEY',
  'HCS_TOPIC_ID',
  'JWT_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    // Seed manifesto demo data if no candidates exist yet
    try {
      const candidateCount = await Candidate.countDocuments();
      if (candidateCount === 0) {
        console.log("No candidates found. Seeding manifesto demonstration data...");
        await seedManifestoData();
        console.log("Manifesto seed data loaded successfully.");
      } else {
        console.log(`Database already contains ${candidateCount} candidate(s). Skipping seed.`);
      }
    } catch (seedErr) {
      console.error("Manifesto seed warning (non-fatal):", seedErr.message);
    }
  })
  .catch(err => console.error("MongoDB Connection Error:", err));

// Hedera Client Initialization
let client;
if (process.env.HEDERA_NETWORK === "localnet") {
  client = Client.forLocalnet();
} else {
  client = Client.forTestnet();
}
const hederaAccountId = process.env.HEDERA_ACCOUNT_ID.trim();
const hederaPrivateKey = process.env.HEDERA_PRIVATE_KEY.trim();
client.setOperator(
  hederaAccountId,
  hederaPrivateKey.startsWith('0x') || hederaPrivateKey.length === 66
    ? PrivateKey.fromStringECDSA(hederaPrivateKey)
    : PrivateKey.fromString(hederaPrivateKey)
);
const topicId = process.env.HCS_TOPIC_ID;

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    // Set voterId and role from token claims
    req.voterId = user.sub;
    req.role = user.role;
    next();
  });
};

// Role-based middleware
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.voterId || !req.role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    if (req.role !== requiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

app.post('/api/auth/login', login);

// Public: Get API Information
app.get("/api/info", (req, res) => {
  res.json({
    name: "Blockchain-Based Voting System API",
    version: "1.0.0",
    description: "Hybrid Web2.5 architecture for secure electronic voting",
    endpoints: {
      "POST /api/auth/login": "Login with voterId and password to obtain JWT token",
      "GET /api/election": "Get election status and candidate list",
      "POST /castVote": "Submit a vote (requires voter authentication)",
      "GET /api/config": "Get frontend configuration",
      "POST /api/admin/candidates": "Register a new candidate (admin only)",
      "POST /api/admin/voters": "Enroll a new voter (admin only)",
      "POST /api/admin/toggle-status": "Toggle election active status (admin only)",
      "POST /api/admin/reset": "Reset voter participation (admin only)"
    },
    authentication: {
      "JWT": "Authorization: Bearer <access_token>",
      "token_obtainment": "POST /api/auth/login with { voterId, password }"
    }
  });
});

// Public: Get Configuration
app.get("/api/config", (req, res) => {
  res.json({
    hederaTopicId: process.env.HCS_TOPIC_ID,
    mirrorNodeUrl: `https://testnet.mirrornode.hedera.com/api/v1/topics/${process.env.HCS_TOPIC_ID}/messages`,
    backendUrl: process.env.BACKEND_URL || "http://localhost:5000"
  });
});

// Public: Get Election State & Candidates
app.get("/api/election", async (req, res) => {
  try {
    let election = await Election.findOne();
    if (!election) {
      election = await Election.create({
        title: "Student Council General Election 2026",
        isActive: true,
        topicId: process.env.HCS_TOPIC_ID
      });
    }
    const candidates = await Candidate.find().sort({ candidateId: 1 });
    res.json({ election, candidates });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve election data." });
  }
});

// Authenticated: Get Current Voter Status & Eligibility
app.get("/api/voter/status", authenticateToken, async (req, res) => {
  try {
    const voter = await Voter.findOne({ voterId: req.voterId });
    if (!voter) {
      return res.status(404).json({ error: "Voter record not found." });
    }
    res.json({
      voterId: voter.voterId,
      name: voter.name,
      role: voter.role,
      hasVoted: voter.hasVoted,
      votedAt: voter.votedAt,
      isEligible: true
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch voter status." });
  }
});

// Public: Get Full Manifesto Overview (Elections, Candidates, Issues, Evidence)
app.get("/api/manifesto/overview", async (req, res) => {
  try {
    let election = await Election.findOne();
    if (!election) {
      election = await Election.create({
        title: "Student Council General Election 2026",
        institutionName: "Apex Institute of Technology & Engineering",
        academicYear: "2025–2026",
        electionPhase: "Official Voting Phase",
        votingDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        isActive: true,
        topicId: process.env.HCS_TOPIC_ID
      });
    }
    const candidates = await Candidate.find().sort({ candidateId: 1 });
    const campusIssues = await CampusIssue.find();
    const evidenceDocs = await EvidenceDoc.find().sort({ date: -1 });

    res.json({
      election,
      candidates,
      campusIssues,
      evidenceDocs,
      totalCandidates: candidates.length,
      incumbentsCount: candidates.filter(c => c.isIncumbent).length
    });
  } catch (err) {
    console.error("Manifesto overview error:", err);
    res.status(500).json({ error: "Failed to fetch manifesto overview data." });
  }
});

// Public: Get Detailed Manifesto & Track Record for a Specific Candidate
app.get("/api/candidates/:id/manifesto", async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ candidateId: req.params.id });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found." });
    }
    const relatedEvidence = await EvidenceDoc.find({ candidateId: req.params.id });
    res.json({ candidate, relatedEvidence });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch candidate manifesto." });
  }
});

// Public: Get Campus Priority Issues
app.get("/api/issues", async (req, res) => {
  try {
    const issues = await CampusIssue.find();
    res.json({ issues });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch campus issues." });
  }
});

// Public: Get Verified Evidence Archive
app.get("/api/evidence", async (req, res) => {
  try {
    const documents = await EvidenceDoc.find().sort({ date: -1 });
    res.json({ documents });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch evidence documents." });
  }
});

// Create default test accounts if no voters exist
const createDefaultAccounts = async () => {
  try {
    const voterCount = await Voter.countDocuments();
    if (voterCount === 0) {
      console.log("No voters found. Creating default test accounts...");

      // Hash passwords for default accounts
      const salt = await bcrypt.genSalt(10);
      const adminPasswordHash = await bcrypt.hash("admin123", salt);
      const voterPasswordHash = await bcrypt.hash("voter123", salt);

      // Create admin voter
      await Voter.create({
        voterId: "ADMIN001",
        name: "Admin User",
        password: adminPasswordHash,
        role: "admin"
      });

      // Create regular voter
      await Voter.create({
        voterId: "VOTER001",
        name: "Test Voter",
        password: voterPasswordHash,
        role: "voter"
      });

      console.log("Default test accounts created:");
      console.log("Admin - VoterID: ADMIN001, Password: admin123");
      console.log("Voter - VoterID: VOTER001, Password: voter123");
    }
  } catch (err) {
    console.error("Error creating default accounts:", err);
  }
};

// Call the function to create default accounts
createDefaultAccounts();

// Voter: Submit Ballot to Hedera HCS
app.post("/castVote", authenticateToken, requireRole("Voters"), async (req, res) => {
  try {
    const election = await Election.findOne();
    if (!election || !election.isActive) {
      return res.status(403).json({ error: "Voting is currently closed." });
    }

    const voterId = req.voterId; // Extract from JWT sub claim
    const { candidateId } = req.body;

    // Validate candidate
    const candidate = await Candidate.findOne({ candidateId });
    if (!candidate) {
      return res.status(400).json({ error: "Invalid candidate selected." });
    }

    // Atomically claim the voter's ballot before broadcasting it.
    const voter = await Voter.findOneAndUpdate(
      { voterId: voterId, hasVoted: false },
      { hasVoted: true, votedAt: new Date() },
      { returnDocument: 'after' }
    );

    if (!voter) {
      // Check if the voter exists at all (to give appropriate error)
      const existingVoter = await Voter.findOne({ voterId: voterId });
      if (!existingVoter) {
        return res.status(401).json({ error: "Voter ID not found in electoral roll." });
      } else {
        return res.status(403).json({ error: "This voter has already voted." });
      }
    }

    // Submit payload to Hedera Consensus Service
    const payload = JSON.stringify({
      candidateId,
      timestamp: new Date().toISOString()
    });

    let txResponse;
    let receipt;
    try {
      txResponse = await new TopicMessageSubmitTransaction({
        topicId,
        message: payload,
      }).execute(client);
      receipt = await txResponse.getReceipt(client);
    } catch (hederaErr) {
      // Revert voter update on Hedera failure
      await Voter.findOneAndUpdate(
        { voterId: voterId },
        { hasVoted: false, votedAt: null }
      );
      console.error("Hedera transaction failed, voter rollback executed:", hederaErr);
      return res.status(502).json({ error: getVoteBroadcastErrorMessage(hederaErr) });
    }

    res.json({
      message: "Vote recorded on Hedera!",
      transactionId: txResponse.transactionId.toString(),
      status: receipt.status.toString()
    });
  } catch (err) {
    console.error("Ballot submission error:", err);
    res.status(500).json({ error: "Failed to broadcast vote to ledger." });
  }
});

// Admin: Add Candidate
app.post("/api/admin/candidates", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const { name, party, avatarIpfs } = req.body;
    if (!name || !party) return res.status(400).json({ error: "Name and Party are required." });

    const count = await Candidate.countDocuments();
    const candidateId = (count + 1).toString();

    const newCandidate = await Candidate.create({ candidateId, name, party, avatarIpfs: avatarIpfs || "" });
    res.json({ message: "Candidate registered.", candidate: newCandidate });
  } catch (err) {
    res.status(500).json({ error: "Could not create candidate." });
  }
});

// Admin: Enroll Voter
app.post("/api/admin/voters", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const { voterId, name, password } = req.body;
    if (!voterId || !password) return res.status(400).json({ error: "Voter ID and password are required." });

    const cleanId = voterId.trim().toUpperCase();
    const existing = await Voter.findOne({ voterId: cleanId });
    if (existing) return res.status(409).json({ error: "Voter already registered." });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Voter.create({ voterId: cleanId, name: name || "Verified Voter", password: hashedPassword });
    res.json({ message: `Voter ${cleanId} enrolled.` });
  } catch (err) {
    res.status(500).json({ error: "Could not enroll voter." });
  }
});

// Admin: Toggle Poll Status
app.post("/api/admin/toggle-status", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const election = await Election.findOne();
    if (election) {
      election.isActive = !election.isActive;
      await election.save();
      res.json({ message: "Status updated.", isActive: election.isActive });
    } else {
      res.status(404).json({ error: "Election record not found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Toggle status failed." });
  }
});

// Admin: Reset Ballots
app.post("/api/admin/reset", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    await Voter.updateMany({}, { hasVoted: false, votedAt: null });
    res.json({ message: "Voter participation registry reset." });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset registry." });
  }
});

// Admin: Get voter statistics
app.get("/api/admin/stats", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const totalVoters = await Voter.countDocuments();
    const votedVoters = await Voter.countDocuments({ hasVoted: true });
    const turnoutPercentage = totalVoters > 0 ? (votedVoters / totalVoters) * 100 : 0;

    res.json({ totalVoters, votedVoters, turnoutPercentage: turnoutPercentage.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch voter statistics." });
  }
});

// Admin: Update Candidate Profile
app.put("/api/admin/candidates/:id", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const { id } = req.params;
    let candidate = await Candidate.findOne({ candidateId: id });
    if (!candidate && mongoose.Types.ObjectId.isValid(id)) {
      candidate = await Candidate.findById(id);
    }
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found." });
    }

    const {
      name,
      party,
      department,
      year,
      position,
      bio,
      tagline,
      experience,
      priorities,
      isIncumbent,
      avatarUrl,
      avatarIpfs
    } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "Candidate name cannot be empty." });
      }
      candidate.name = name.trim();
    }
    if (party !== undefined) {
      if (typeof party !== "string" || !party.trim()) {
        return res.status(400).json({ error: "Party cannot be empty." });
      }
      candidate.party = party.trim();
    }
    if (department !== undefined) candidate.department = department;
    if (year !== undefined) candidate.year = year;
    if (position !== undefined) candidate.position = position;
    if (bio !== undefined) candidate.bio = bio;
    if (tagline !== undefined) candidate.tagline = tagline;
    if (experience !== undefined) {
      candidate.experience = Array.isArray(experience) ? experience : [experience].filter(Boolean);
    }
    if (priorities !== undefined) {
      candidate.priorities = Array.isArray(priorities) ? priorities : [priorities].filter(Boolean);
    }
    if (isIncumbent !== undefined) candidate.isIncumbent = Boolean(isIncumbent);
    if (avatarUrl !== undefined) candidate.avatarUrl = avatarUrl;
    if (avatarIpfs !== undefined) candidate.avatarIpfs = avatarIpfs;

    await candidate.save();
    res.json({ message: "Candidate profile updated successfully.", candidate });
  } catch (err) {
    console.error("Candidate update error:", err);
    res.status(500).json({ error: "Failed to update candidate profile: " + err.message });
  }
});

// Admin: Replace Candidate Manifesto
app.put("/api/admin/candidates/:id/manifesto", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const { id } = req.params;
    let candidate = await Candidate.findOne({ candidateId: id });
    if (!candidate && mongoose.Types.ObjectId.isValid(id)) {
      candidate = await Candidate.findById(id);
    }
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found." });
    }

    const { manifesto } = req.body;
    if (!Array.isArray(manifesto)) {
      return res.status(400).json({ error: "Manifesto must be an array of promises." });
    }

    for (let i = 0; i < manifesto.length; i++) {
      const p = manifesto[i];
      if (!p || typeof p !== "object") {
        return res.status(400).json({ error: `Manifesto promise at index ${i} is invalid.` });
      }
      if (!p.title || !p.category) {
        return res.status(400).json({ error: `Manifesto promise at index ${i} requires a title and category.` });
      }
    }

    const formattedManifesto = manifesto.map((item, idx) => ({
      id: item.id || `P-${candidate.candidateId}-${idx + 1}`,
      category: item.category,
      title: item.title,
      currentProblem: item.currentProblem || "Needs improvement.",
      proposedSolution: item.proposedSolution || item.title,
      expectedBenefit: item.expectedBenefit || "Enhances student campus life.",
      targetTimeline: item.targetTimeline || "Academic Year 2025–2026",
      implementationSteps: Array.isArray(item.implementationSteps) ? item.implementationSteps : [],
      dependenciesAndBudget: item.dependenciesAndBudget || "",
      measurableMetrics: item.measurableMetrics || "",
      status: item.status || "Proposed",
      evidenceRef: item.evidenceRef || ""
    }));

    candidate.manifesto = formattedManifesto;
    await candidate.save();
    res.json({ message: "Manifesto updated successfully.", candidate });
  } catch (err) {
    console.error("Manifesto update error:", err);
    res.status(500).json({ error: "Failed to update manifesto: " + err.message });
  }
});

// Admin: Replace Candidate Performance Records
app.put("/api/admin/candidates/:id/performance", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const { id } = req.params;
    let candidate = await Candidate.findOne({ candidateId: id });
    if (!candidate && mongoose.Types.ObjectId.isValid(id)) {
      candidate = await Candidate.findById(id);
    }
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found." });
    }

    const { performanceRecords } = req.body;
    if (!Array.isArray(performanceRecords)) {
      return res.status(400).json({ error: "performanceRecords must be an array of records." });
    }

    const validStatuses = ["Completed", "Partially Completed", "In Progress", "Not Started", "Unable to Verify"];
    const formattedRecords = performanceRecords.map((item, idx) => {
      const status = validStatuses.includes(item.status) ? item.status : "In Progress";
      return {
        id: item.id || `PR-${candidate.candidateId}-${idx + 1}`,
        originalPromise: item.originalPromise || "Initiative tracked",
        category: item.category || "General",
        actionTaken: item.actionTaken || "Action recorded",
        actualOutcome: item.actualOutcome || "Outcome recorded",
        evidenceRef: item.evidenceRef || "",
        studentImpact: item.studentImpact || "Positive impact",
        status,
        remainingWork: item.remainingWork || "",
        delayExplanation: item.delayExplanation || ""
      };
    });

    candidate.performanceRecords = formattedRecords;
    await candidate.save();
    res.json({ message: "Performance records updated successfully.", candidate });
  } catch (err) {
    console.error("Performance records update error:", err);
    res.status(500).json({ error: "Failed to update performance records: " + err.message });
  }
});

// Admin: Create Evidence Document
app.post("/api/admin/evidence", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const {
      docId,
      title,
      documentType,
      date,
      issuingAuthority,
      summary,
      verificationStatus,
      candidateId,
      relatedCategory,
      fileNumber,
      keyFindings,
      fileSnippet
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }
    if (!summary || typeof summary !== "string" || !summary.trim()) {
      return res.status(400).json({ error: "Summary is required." });
    }

    const finalDocId = docId && docId.trim() ? docId.trim() : `DOC-${Date.now().toString(36).toUpperCase()}`;
    const existing = await EvidenceDoc.findOne({ docId: finalDocId });
    if (existing) {
      return res.status(409).json({ error: `Evidence document with ID ${finalDocId} already exists.` });
    }

    const evidence = await EvidenceDoc.create({
      docId: finalDocId,
      title: title.trim(),
      documentType: documentType || "Official Report",
      date: date || new Date().toISOString().split("T")[0],
      issuingAuthority: issuingAuthority || "Student Affairs Office",
      summary: summary.trim(),
      verificationStatus: verificationStatus || "Officially Verified",
      candidateId: candidateId || "",
      relatedCategory: relatedCategory || "",
      fileNumber: fileNumber || "",
      keyFindings: Array.isArray(keyFindings) ? keyFindings : [],
      fileSnippet: fileSnippet || ""
    });

    res.status(201).json({ message: "Evidence document created successfully.", evidence });
  } catch (err) {
    console.error("Evidence creation error:", err);
    res.status(500).json({ error: "Failed to create evidence document: " + err.message });
  }
});

// Admin: Delete Evidence Document
app.delete("/api/admin/evidence/:docId", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const { docId } = req.params;
    let deleted = await EvidenceDoc.findOneAndDelete({ docId });
    if (!deleted && mongoose.Types.ObjectId.isValid(docId)) {
      deleted = await EvidenceDoc.findByIdAndDelete(docId);
    }
    if (!deleted) {
      return res.status(404).json({ error: "Evidence document not found." });
    }
    res.json({ message: `Evidence document ${docId} deleted successfully.`, docId });
  } catch (err) {
    console.error("Evidence delete error:", err);
    res.status(500).json({ error: "Failed to delete evidence document: " + err.message });
  }
});

// Admin: Create Campus Issue
app.post("/api/admin/issues", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const {
      issueId,
      title,
      category,
      urgency,
      description,
      currentStatus,
      studentSentiment,
      solutions
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Issue title is required." });
    }
    if (!category || typeof category !== "string" || !category.trim()) {
      return res.status(400).json({ error: "Category is required." });
    }
    if (!description || typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ error: "Description is required." });
    }

    const finalIssueId = issueId && issueId.trim() ? issueId.trim() : `ISSUE-${Date.now().toString(36).toUpperCase()}`;
    const existing = await CampusIssue.findOne({ issueId: finalIssueId });
    if (existing) {
      return res.status(409).json({ error: `Campus issue with ID ${finalIssueId} already exists.` });
    }

    const issue = await CampusIssue.create({
      issueId: finalIssueId,
      title: title.trim(),
      category: category.trim(),
      urgency: urgency || "High",
      description: description.trim(),
      currentStatus: currentStatus || "Unresolved / Needs Urgent Council Action",
      studentSentiment: studentSentiment || "",
      solutions: Array.isArray(solutions) ? solutions : []
    });

    res.status(201).json({ message: "Campus issue created successfully.", issue });
  } catch (err) {
    console.error("Issue creation error:", err);
    res.status(500).json({ error: "Failed to create campus issue: " + err.message });
  }
});

// Admin: Delete Campus Issue
app.delete("/api/admin/issues/:issueId", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    const { issueId } = req.params;
    let deleted = await CampusIssue.findOneAndDelete({ issueId });
    if (!deleted && mongoose.Types.ObjectId.isValid(issueId)) {
      deleted = await CampusIssue.findByIdAndDelete(issueId);
    }
    if (!deleted) {
      return res.status(404).json({ error: "Campus issue not found." });
    }
    res.json({ message: `Campus issue ${issueId} deleted successfully.`, issueId });
  } catch (err) {
    console.error("Issue delete error:", err);
    res.status(500).json({ error: "Failed to delete campus issue: " + err.message });
  }
});

// Admin: Reseed Manifesto Demo Data
app.post("/api/admin/seed-manifesto", authenticateToken, requireRole("Admins"), async (req, res) => {
  try {
    await seedManifestoData();
    res.json({ message: "Manifesto demo data successfully seeded." });
  } catch (err) {
    console.error("Seed manifesto error:", err);
    res.status(500).json({ error: "Failed to seed manifesto data: " + err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));