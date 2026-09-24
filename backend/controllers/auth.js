const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Voter = require("../models/Voter");

const JWT_SECRET = process.env.JWT_SECRET;

// Admin override credentials from environment variables
const ADMIN_VOTER_ID = process.env.ADMIN_VOTER_ID || "ADMIN";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Must be set in .env

/**
 * Login controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { voterId, password } = req.body;

    if (!voterId || !password) {
      return res.status(400).json({ error: "Voter ID and password are required" });
    }

    const cleanVoterId = voterId.trim().toUpperCase();
    let user = null;
    let role = "";

    // Check for admin override credentials
    if (
      ADMIN_PASSWORD &&
      cleanVoterId === ADMIN_VOTER_ID.toUpperCase() &&
      password === ADMIN_PASSWORD
    ) {
      // Admin override successful
      user = { voterId: ADMIN_VOTER_ID };
      role = "Admins";
    } else {
      // Find voter in database
      user = await Voter.findOne({ voterId: cleanVoterId });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set role based on voter's role field (default to voter)
      role = user.role === "admin" ? "Admins" : "Voters";
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: user.voterId,
        role: role
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        voterId: user.voterId,
        role: role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login };