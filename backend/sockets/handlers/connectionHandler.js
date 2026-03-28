const registerMessageHandler = require("./messageHandler");
const registerConversationHandler = require("./conversationHandler");

function connectionHandler(io, socket) {
  console.log("User connected:", socket.id);

  // Register feature handlers
  registerMessageHandler(io, socket);
  registerConversationHandler(io, socket);


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}

module.exports = connectionHandler;