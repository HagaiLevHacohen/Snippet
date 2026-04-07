const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Access token
function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.SECRET, { expiresIn: "1h" });
}

// Refresh token (raw)
function generateRefreshToken() {
  return crypto.randomBytes(40).toString("hex");
}

// Hash refresh token with SHA256
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashToken
};