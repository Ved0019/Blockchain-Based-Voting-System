const express = require('express');
const cors = require('cors');
const { Client, PrivateKey, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Initialize Hedera Client from .env variables
const myAccountId = process.env.HEDERA_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
const topicId = process.env.HCS_TOPIC_ID;

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// 2. Simulate Amazon DynamoDB (In-memory Set for local testing)
const voterRegistry = new Set();

// 3. Create the API endpoint to cast a vote
app.post('/castVote', async (req, res) => {
    try {
        const { voterId, candidateId } = req.body;

        if (!voterId || !candidateId) {
            return res.status(400).json({ error: "Missing voterId or candidateId" });
        }

        // AWS Lambda Step: Prevent Double Voting
        if (voterRegistry.has(voterId)) {
            return res.status(403).json({ error: "This user has already cast a vote." });
        }

        // Construct the vote payload
        const votePayload = JSON.stringify({
            candidateId: candidateId,
            timestamp: new Date().toISOString()
        });

        console.log(`Submitting vote for Candidate ${candidateId} to Hedera...`);

        // Hedera Step: Submit to Consensus Service
        const sendResponse = await new TopicMessageSubmitTransaction({
            topicId: topicId,
            message: votePayload,
        }).execute(client);

        const getReceipt = await sendResponse.getReceipt(client);
        
        // Lock the voter's ID so they can't vote again
        voterRegistry.add(voterId);

        console.log(`Success! Transaction ID: ${sendResponse.transactionId.toString()}`);

        res.status(200).json({
            message: "Vote successfully recorded on Hedera!",
            transactionId: sendResponse.transactionId.toString(),
            status: getReceipt.status.toString()
        });

    } catch (error) {
        console.error("Error casting vote:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 4. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});