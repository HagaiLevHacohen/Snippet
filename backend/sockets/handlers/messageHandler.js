const messageService = require("../../services/messageService");

function registerMessageHandler(io, socket) {
  socket.on("send_message", async (data) => {
    try {
      const { conversationId, senderId, content } = data;

      // 1. Save to DB
      const message = await messageService.createMessage({
        conversationId,
        senderId,
        content,
      });

      // 2. Emit to room
      io.to(`conversation:${conversationId}`).emit("new_message", message);
    } catch (err) {
      console.error(err);
      socket.emit("error", "Failed to send message");
    }
  });
}

module.exports = registerMessageHandler;