const { prisma } = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response");



function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log('[verifyToken] Authorization header:', authHeader);
  if (!authHeader) return sendError(res, "Missing token", 401);

  const token = authHeader.split(" ")[1];
  if (!token) return sendError(res, "Missing token", 401);

  try {
    const payload = jwt.verify(token, process.env.SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    sendError(res, "Invalid token", 401);
  }
}

module.exports = {verifyToken};