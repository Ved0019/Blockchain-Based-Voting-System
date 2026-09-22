const express = require('express');
const cors = require('cors');
const { Client, PrivateKey, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID, PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY));
const topicId = process.env.HCS_TOPIC_ID;

const voterRegistry = new Set();

// Mock Authentication Middleware
function requireRole(requiredRole) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Unauthorized: No token provided" });

        const token = authHeader.split(" ")[1];

        if (token === "mock-admin-token" && requiredRole === "Admins") {
            req.user = { sub: "admin-system", group: "Admins" };
            return next();
        }
        
        if (token.startsWith("mock-voter-token") && requiredRole === "Voters") {
            const extractedId = token.split("token-")[1];
            req.user = { sub: extractedId, group: "Voters" };
            return next();
        }
        
        return res.status(403).json({ error: "Forbidden: Insufficient privileges." });
    };
}

// Voter Endpoint
app.post('/castVote', requireRole("Voters"), async (req, res) => {
    try {
        const voterId = req.user.sub; 
        const { candidateId } = req.body;

        if (voterRegistry.has(voterId)) {
            return res.status(403).json({ error: "You have already cast a vote." });
        }

        const votePayload = JSON.stringify({ candidateId, timestamp: new Date().toISOString() });
        const sendResponse = await new TopicMessageSubmitTransaction({
            topicId, message: votePayload,
        }).execute(client);
        
        voterRegistry.add(voterId);

        res.status(200).json({
            message: "Vote recorded on Hedera!",
            transactionId: sendResponse.transactionId.toString()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Admin Endpoint
app.post('/api/admin/reset', requireRole("Admins"), (req, res) => {
    voterRegistry.clear();
    res.status(200).json({ message: "Registry reset. Ready for new voters." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));