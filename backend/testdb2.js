require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

const Voter = require("./models/Voter");
const Candidate = require("./models/Candidate");
const Election = require("./models/Election");

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/evoting_db";
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB for testing");
    return testModels();
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

const testModels = async () => {
  try {
    // Test Election model
    console.log("Testing Election model...");
    let election = await Election.findOne();
    console.log("Election.findOne() result:", election);
    
    if (!election) {
      console.log("Creating default election...");
      election = await Election.create({ 
        title: "General Election Test", 
        isActive: true,
        topicId: process.env.HCS_TOPIC_ID
      });
      console.log("Created election:", election);
    }
    
    // Test Candidate model
    console.log("Testing Candidate model...");
    const candidates = await Candidate.find().sort({ candidateId: 1 });
    console.log("Candidate.find() result:", candidates);
    
    // Test Voter model
    console.log("Testing Voter model...");
    const voters = await Voter.find({});
    console.log("Voter.find() result:", voters);
    
    mongoose.disconnect();
    console.log("Test completed successfully");
  } catch (err) {
    console.error("Model test error:", err);
    mongoose.disconnect();
    process.exit(1);
  }
};

testModels();
