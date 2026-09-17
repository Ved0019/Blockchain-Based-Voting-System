const express = require('express');
const cors = require('cors');
const { Client, PrivateKey, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Hedera Client
const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID, PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY));
const topicId = process.env.HCS_TOPIC_ID;

// Local Memory Database (Simulating DynamoDB)
const voterRegistry = new Set();

// ----------------------------------------------------
// MOCK AUTHENTICATION MIDDLEWARE (Simulating Cognito)
// ----------------------------------------------------
function requireRole(requiredRole) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Unauthorized: No token provided" });

        const token = authHeader.split(" ")[1];

        // Simulate decoding an Admin JWT
        if (token === "mock-admin-token" && requiredRole === "Admins") {
            req.user = { sub: "admin-system", group: "Admins" };
            return next();
        }
        
        // Simulate decoding a Voter JWT (Format: mock-voter-token-[ID])
        if (token.startsWith("mock-voter-token") && requiredRole === "Voters") {
            const extractedId = token.split("token-")[1];
            req.user = { sub: extractedId, group: "Voters" };
            return next();
        }
        
        return res.status(403).json({ error: "Forbidden: Insufficient privileges for this action." });
    };
}

// ----------------------------------------------------
// SECURE ENDPOINTS
// ----------------------------------------------------

// 1. Voter Endpoint (Strictly for Voters)
app.post('/castVote', requireRole("Voters"), async (req, res) => {
    try {
        const voterId = req.user.sub; // Identity is strictly pulled from the token
        const { candidateId } = req.body;

        if (voterRegistry.has(voterId)) {
            return res.status(403).json({ error: "Transaction Denied: You have already cast a vote." });
        }

        const votePayload = JSON.stringify({ candidateId, timestamp: new Date().toISOString() });
        const sendResponse = await new TopicMessageSubmitTransaction({
            topicId,
            message: votePayload,
        }).execute(client);
        
        voterRegistry.add(voterId);

        res.status(200).json({
            message: "Vote successfully recorded on Hedera!",
            transactionId: sendResponse.transactionId.toString()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. Admin Endpoint (Strictly for Admins)
app.post('/api/admin/reset', requireRole("Admins"), (req, res) => {
    voterRegistry.clear(); // Clears the local database for the next election
    res.status(200).json({ message: "Election registry reset. Ready for new voters." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));