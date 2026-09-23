const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Client, PrivateKey, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
require("dotenv").config();

const Voter = require("./models/Voter");
const Candidate = require("./models/Candidate");
const Election = require("./models/Election");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/evoting_db";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB."))
  .catch(err => console.error("MongoDB Connection Error:", err));

// 2. Hedera Client Initialization
let client;
if (process.env.HEDERA_NETWORK === "localnet") {
  client = Client.forLocalnet();
} else {
  client = Client.forTestnet();
}
client.setOperator(
  process.env.HEDERA_ACCOUNT_ID,
  PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY)
);
const topicId = process.env.HCS_TOPIC_ID;

// 3. Role-Based Middleware
function requireRole(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing authorization token." });

    const token = authHeader.split(" ")[1];

    if (token === "mock-admin-token" && requiredRole === "Admins") {
      req.user = { sub: "admin-root", group: "Admins" };
      return next();
    }

    if (token.startsWith("mock-voter-token-") && requiredRole === "Voters") {
      const voterId = token.replace("mock-voter-token-", "").toUpperCase();
      req.user = { sub: voterId, group: "Voters" };
      return next();
    }

    return res.status(403).json({ error: "Insufficient permissions." });
  };
}

// ------------------- ROUTES -------------------

// Public: Get API Information
app.get("/api/info", (req, res) => {
  res.json({
    name: "Blockchain-Based Voting System API",
    version: "1.0.0",
    description: "Hybrid Web2.5 architecture for secure electronic voting",
    endpoints: {
      "GET /api/election": "Get election status and candidate list",
      "POST /castVote": "Submit a vote (requires voter authentication)",
      "GET /api/config": "Get frontend configuration",
      "POST /api/admin/candidates": "Register a new candidate (admin only)",
      "POST /api/admin/voters": "Enroll a new voter (admin only)",
      "POST /api/admin/toggle-status": "Toggle election active status (admin only)",
      "POST /api/admin/reset": "Reset voter participation (admin only)"
    },
    authentication: {
      "admin": "Authorization: Bearer mock-admin-token",
      "voter": "Authorization: Bearer mock-voter-token-[VOTER_ID]"
    }
  });
}

// Public: Get Configuration
app.get("/api/config", (req, res) => {
  res.json({
    hederaTopicId: process.env.HCS_TOPIC_ID,
    mirrorNodeUrl: `https://testnet.mirrornode.hedera.com/api/v1/topics/${process.env.HCS_TOPIC_ID}/messages`,
    backendUrl: process.env.BACKEND_URL || "http://localhost:5000"
  });
}

// Public: Get Election State & Candidates
app.get("/api/election", async (req, res) => {
  try {
    let election = await Election.findOne();
    if (!election) {
      election = await Election.create({ title: "General Campus Election", isActive: true });
    }
    const candidates = await Candidate.find().sort({ candidateId: 1 });
    res.json({ election, candidates });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve election data." });
  }
});

// Voter: Submit Ballot to Hedera HCS
app.post("/castVote", requireRole("Voters"), async (req, res) => {
  try {
    const election = await Election.findOne();
    if (!election || !election.isActive) {
      return res.status(403).json({ error: "Voting is currently closed." });
    }

    const voterId = req.user.sub;
    const { candidateId } = req.body;

    // Validate candidate
    const candidate = await Candidate.findOne({ candidateId });
    if (!candidate) {
      return res.status(400).json({ error: "Invalid candidate selected." });
    }

    // Atomically update voter if they haven't voted yet
    const voter = await Voter.findOneAndUpdate(
      { voterId, hasVoted: false },
      { hasVoted: true, votedAt: new Date() },
      { new: true }
    );

    if (!voter) {
      // Check if the voter exists at all (to give appropriate error)
      const existingVoter = await Voter.findOne({ voterId });
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

    const txResponse = await new TopicMessageSubmitTransaction({
      topicId,
      message: payload,
    }).execute(client);

    const receipt = await txResponse.getReceipt(client);

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
app.post("/api/admin/candidates", requireRole("Admins"), async (req, res) => {
  try {
    const { name, party } = req.body;
    if (!name || !party) return res.status(400).json({ error: "Name and Party are required." });

    const count = await Candidate.countDocuments();
    const candidateId = (count + 1).toString();

    const newCandidate = await Candidate.create({ candidateId, name, party });
    res.json({ message: "Candidate registered.", candidate: newCandidate });
  } catch (err) {
    res.status(500).json({ error: "Could not create candidate." });
  }
});

// Admin: Enroll Voter
app.post("/api/admin/voters", requireRole("Admins"), async (req, res) => {
  try {
    const { voterId, name } = req.body;
    if (!voterId) return res.status(400).json({ error: "Voter ID required." });

    const cleanId = voterId.trim().toUpperCase();
    const existing = await Voter.findOne({ voterId: cleanId });
    if (existing) return res.status(409).json({ error: "Voter already registered." });

    await Voter.create({ voterId: cleanId, name: name || "Verified Voter" });
    res.json({ message: `Voter ${cleanId} enrolled.` });
  } catch (err) {
    res.status(500).json({ error: "Could not enroll voter." });
  }
});

// Admin: Toggle Poll Status
app.post("/api/admin/toggle-status", requireRole("Admins"), async (req, res) => {
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
app.post("/api/admin/reset", requireRole("Admins"), async (req, res) => {
  try {
    await Voter.updateMany({}, { hasVoted: false, votedAt: null });
    res.json({ message: "Voter participation registry reset." });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset registry." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));