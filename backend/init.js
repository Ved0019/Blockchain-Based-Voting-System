const mongoose = require("mongoose");
require("dotenv").config();

const Voter = require("./models/Voter");

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/evoting_db";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB for initialization"))
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Hash password function
const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const initData = async () => {
  try {
    // Check if we already have an admin user
    const adminExists = await Voter.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists");
    } else {
      // Create admin user
      const adminPassword = await hashPassword("admin123"); // default password
      const adminUser = new Voter({
        voterId: "ADMIN",
        name: "Administrator",
        password: adminPassword,
        role: "admin"
      });
      await adminUser.save();
      console.log("Admin user created: voterId=ADMIN, password=admin123");
    }

    // Check if we already have a test voter
    const voterExists = await Voter.findOne({ voterId: "VOTER001", role: "voter" });
    if (voterExists) {
      console.log("Test voter already exists");
    } else {
      // Create test voter
      const voterPassword = await hashPassword("voter123"); // default password
      const testVoter = new Voter({
        voterId: "VOTER001",
        name: "Test Voter",
        password: voterPassword,
        role: "voter"
      });
      await testVoter.save();
      console.log("Test voter created: voterId=VOTER001, password=voter123");
    }

    // Create another test voter for double-voting test
    const voter2Exists = await Voter.findOne({ voterId: "VOTER002", role: "voter" });
    if (!voter2Exists) {
      const voter2Password = await hashPassword("voter123"); // default password
      const testVoter2 = new Voter({
        voterId: "VOTER002",
        name: "Test Voter 2",
        password: voter2Password,
        role: "voter"
      });
      await testVoter2.save();
      console.log("Test voter 2 created: voterId=VOTER002, password=voter123");
    }

    mongoose.disconnect();
    console.log("Initialization complete");
  } catch (err) {
    console.error("Initialization error:", err);
    mongoose.disconnect();
    process.exit(1);
  }
};

initData();