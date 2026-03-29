const jwt = require("jsonwebtoken");

function authSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    if (!decoded?.userId) {
      return next(new Error("Authentication error: Invalid token payload"));
    }

    socket.userId = decoded.userId;
    next();
  } catch (err) { 
    next(new Error("Authentication error: Invalid token"));
  }
}

module.exports = authSocket;