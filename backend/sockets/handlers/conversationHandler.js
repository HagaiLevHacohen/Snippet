const { prisma } = require("../../lib/prisma");

function registerConversationHandler(io, socket) {
    socket.on("join_conversations", async () => {
        try {
            const userId = socket.userId;

            const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                { user1Id: userId },
                { user2Id: userId }
                ]
            },
            select: { id: true }
            });

            conversations.forEach(c => {
            socket.join(`conversation:${c.id}`);
            });
            
            console.log(`User ${socket.userId} joined all their conversations`);
        } catch (err) {
            console.error(err);
            socket.emit("error", "Failed to join conversations");
        }
    });

  socket.on("leave_conversations", async () => {
    try {
        const userId = socket.userId;

        const conversations = await prisma.conversation.findMany({
        where: {
            OR: [
            { user1Id: userId },
            { user2Id: userId }
            ]
        },
        select: { id: true }
        });

        conversations.forEach(c => {
        socket.leave(`conversation:${c.id}`);
        });

        console.log(`User ${socket.userId} left all their conversations`);
    } catch (err) {
        console.error(err);
        socket.emit("error", "Failed to leave conversations");
    }
  });
}


module.exports = registerConversationHandler;