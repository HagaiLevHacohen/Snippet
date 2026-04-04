// middleware/limiters.js
const { client } = require("../lib/redis");

// ====================
// Helper function
// ====================
async function rateLimit(key, points, duration) {
  try {
    // Try to create the key with initial value 1 and set TTL only if it doesn't exist
    const wasSet = await client.set(key, 1, { NX: true, EX: duration });

    if (wasSet) {
      // Key was just created, so this is the first request
      return true;
    }

    // Key already exists, increment it
    const current = await client.incr(key);

    if (current > points) {
      return false; // limit exceeded
    }

    return true; // allowed
  } catch (err) {
    console.error("Rate limiter Redis error:", err);
    return true; // fail-open
  }
}


// ====================
// Limiters
// ====================

// Auth routes (login/signup)
const authRateLimit = async (req, res, next) => {
  const allowed = await rateLimit(`rate:auth:${req.ip}`, 5, 60);
  if (!allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
}

// Per-user limiter (requires verifyToken before)
const userRateLimit = async (req, res, next) => {
  if (!req.userId) return next(); // skip if not logged in

  const allowed = await rateLimit(`rate:user:${req.userId}`, 200, 60);
  if (!allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
}

// Combined limiter: always check IP, then per-user if logged in
const combinedRateLimit = async (req, res, next) => {
  // First: IP limiter
  const ipAllowed = await rateLimit(`rate:ip:${req.ip}`, 1000, 60);
  if (!ipAllowed) return res.status(429).json({ error: "Too many requests" });

  // Second: per-user limiter
  if (req.userId) {
    const userAllowed = await rateLimit(`rate:user:${req.userId}`, 200, 60);
    if (!userAllowed) return res.status(429).json({ error: "Too many requests" });
  }

  next();
};

module.exports = {
  authRateLimit,
  userRateLimit,
  combinedRateLimit,
};