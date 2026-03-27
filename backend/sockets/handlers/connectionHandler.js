const registerMessageHandler = require("./messageHandler");
const registerConnectionHandler = require("./connectionHandler");

function connectionHandler(io, socket) {
  console.log("User connected:", socket.id);

  // Register feature handlers
  registerMessageHandler(io, socket);
  registerConnectionHandler(io, socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}

module.exports = connectionHandler;