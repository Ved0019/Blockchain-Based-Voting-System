const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Voter = require("../models/Voter");

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  try {
    const { voterId, password } = req.body;

    if (!voterId || !password) {
      return res.status(400).json({ error: "Voter ID and password are required" });
    }

    const cleanVoterId = voterId.trim().toUpperCase();
    const voter = await Voter.findOne({ voterId: cleanVoterId });

    if (!voter) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, voter.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Determine role for token
    const role = voter.role === "admin" ? "Admins" : "Voters";

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: voter.voterId,
        role: role
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        voterId: voter.voterId,
        role: role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login };