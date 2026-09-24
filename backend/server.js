const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Client, PrivateKey, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
require("dotenv").config();

const Voter = require("./models/Voter");
const Candidate = require("./models/Candidate");
const Election = require("./models/Election");
const { login } = require("./controllers/auth");

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
  .then(() => console.log("Connected to MongoDB."))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Hedera Client Initialization
let client;
if (process.env.HEDERA_NETWORK === "localnet") {
  client = Client.forLocalnet();
} else {
  client = Client.forTestnet();
}
client.setOperator(
  process.env.HEDERA_ACCOUNT_ID,
  process.env.HEDERA_PRIVATE_KEY.startsWith('0x') || process.env.HEDERA_PRIVATE_KEY.length === 66 
    ? PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY)
    : PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY)
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
        title: "General Campus Election",
        isActive: false, // Default to false as per requirement
        topicId: process.env.HCS_TOPIC_ID
      });
    }
    const candidates = await Candidate.find().sort({ candidateId: 1 });
    res.json({ election, candidates });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve election data." });
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

    // Atomically update voter if they haven't voted yet
    const voter = await Voter.findOneAndUpdate(
      { voterId: voterId, hasVoted: false },
      { hasVoted: true, votedAt: new Date() },
      { new: true }
    );

    if (!voter) {
      // Check if the voter exists at all (to give appropriate error)
      const existingVoter = await Voter.findOne({ voterId: voterId });
      if (!existingVoter) {
        return res.status(401).json({ error: "Voter ID not found in electoral roll." });
      } else {
        return res.status(403).json({ error: "Duplicate ballot: You have already cast a vote." });
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
      return res.status(500).json({ error: "Failed to broadcast vote to ledger. Voter participation reset." });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));