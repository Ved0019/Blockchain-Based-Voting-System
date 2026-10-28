const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const Voter = require("./models/Voter");
const bcrypt = require("bcrypt");

const seedUsers = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // Create default admin voter
    const adminExists = await Voter.findOne({ voterId: "ADMIN001" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const adminPasswordHash = await bcrypt.hash("admin123", salt);

      await Voter.create({
        voterId: "ADMIN001",
        name: "Admin User",
        password: adminPasswordHash,
        role: "admin"
      });
      console.log("✅ Created admin user: ADMIN001 / admin123");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    // Create default regular voter
    const voterExists = await Voter.findOne({ voterId: "VOTER001" });
    if (!voterExists) {
      const salt = await bcrypt.genSalt(10);
      const voterPasswordHash = await bcrypt.hash("voter123", salt);

      await Voter.create({
        voterId: "VOTER001",
        name: "Test Voter",
        password: voterPasswordHash,
        role: "voter"
      });
      console.log("✅ Created test voter: VOTER001 / voter123");
    } else {
      console.log("ℹ️ Test voter already exists");
    }

    // Create additional test voters
    const testVoters = [
      { voterId: "VOTER002", name: "Alice Johnson" },
      { voterId: "VOTER003", name: "Bob Smith" },
      { voterId: "VOTER004", name: "Carol Davis" },
      { voterId: "VOTER005", name: "David Wilson" }
    ];

    for (const tv of testVoters) {
      const exists = await Voter.findOne({ voterId: tv.voterId });
      if (!exists) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("voter123", salt);
        await Voter.create({
          voterId: tv.voterId,
          name: tv.name,
          password: passwordHash,
          role: "voter"
        });
        console.log(`✅ Created test voter: ${tv.voterId} / voter123`);
      }
    }

    console.log("\n🎉 Database initialization complete!");
    console.log("Admin: ADMIN001 / admin123");
    console.log("Voters: VOTER001-005 / voter123");

  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

seedUsers();