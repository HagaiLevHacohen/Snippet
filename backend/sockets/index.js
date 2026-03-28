const { Server } = require("socket.io");
const registerConnectionHandler = require("./handlers/connectionHandler");
const authSocket = require("./middleware/authSocket");
const autoJoin = require("./handlers/conversationHandler");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // restrict later
    },
  });

  // Middleware for authentication
  io.use(authSocket);
  
  // Register connection handler
  io.on("connection", async (socket) => {
    await autoJoin(socket);
    registerConnectionHandler(io, socket);
  });

  return io;
}

module.exports = initSocket;