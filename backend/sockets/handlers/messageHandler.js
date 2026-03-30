const { prisma } = require("../../lib/prisma");


function registerMessageHandler(io, socket) {
  socket.on("send_message", async (data) => {
    try {
      const userId = socket.userId;
      const { conversationId, content, imageUrl } = data;
      
      // Basic validation
      if (!conversationId || (!content && !imageUrl)) {
        return socket.emit("error", "Invalid message");
      }

      // Check if user is part of the conversation
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

      // 1. Save to DB
      const message = await prisma.$transaction(async (tx) => {
        const createdMessage = await tx.message.create({
          data: {
            conversationId,
            senderId: userId,
            content,
            imageUrl,
          },
        });

        await tx.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date(), lastMessageId: createdMessage.id },
        });

        return createdMessage; // ✅ return it
      });

      // 2. Emit to room
      io.to(`conversation:${conversationId}`).emit("new_message", message);
    } catch (err) {
      console.error(err);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("mark_as_read", async ({ conversationId }) => {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [
            { user1Id: socket.userId },
            { user2Id: socket.userId }
          ]
        }
      });

      if (!conversation) {
        return socket.emit("error", "Unauthorized");
      }

      await prisma.message.updateMany({
        where: {
          conversationId,
          isRead: false,
          NOT: { senderId: socket.userId }
        },
        data: { isRead: true }
      });

      socket.to(`conversation:${conversationId}`).emit("messages_read", conversationId);
    } catch (err) {
      console.error(err);
      socket.emit("error", "Failed to mark messages as read");
    }
  });

  socket.on("typing", ({ conversationId }) => {
    try {
      // Check if user is part of the conversation (lightweight check)
      if (!socket.rooms.has(`conversation:${conversationId}`)) return;

      socket.to(`conversation:${conversationId}`).emit("typing", {
        userId: socket.userId
      });
    } catch (err) {
      console.error(err);
      socket.emit("error", "Failed to send typing status");
    }
  });
}

module.exports = registerMessageHandler;