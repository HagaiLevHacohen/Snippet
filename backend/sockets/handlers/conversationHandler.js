const { prisma } = require("../../lib/prisma");


async function autoJoin(socket) {
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

  console.log(`User ${userId} joined ${conversations.length} conversations`);

  } catch (err) {
    console.error(`Auto-join failed for user ${socket.userId}`, err);
    socket.emit("error", "Failed to auto-join conversations");
  }
}


module.exports = autoJoin;