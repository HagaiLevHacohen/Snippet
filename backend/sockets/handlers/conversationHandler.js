const { prisma } = require("../../lib/prisma");

function registerConversationHandler(io, socket) {
    socket.on("join_conversation", async (conversationId) => {
    const userId = socket.userId;

    const conversation = await prisma.conversation.findFirst({
        where: {
        id: conversationId,
        OR: [
            { user1Id: userId },
            { user2Id: userId }
        ]
        }
    });

    if (!conversation) {
        return socket.emit("error", "Unauthorized");
    }

    socket.join(`conversation:${conversationId}`);
    console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

  socket.on("leave_conversation", (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`User ${socket.userId} left conversation ${conversationId}`);
  });
}


module.exports = registerConversationHandler;