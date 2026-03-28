// controllers/conversationsController.js

const { prisma } = require("../lib/prisma");
const { sendSuccess, sendError } = require("../utils/response");

const createConversation = async (req, res, next) => {
    try {
        const { recipientId } = req.body;
        const senderId = req.userId;

        if (recipientId === senderId) {
            return sendError(res, "Cannot create conversation with yourself", 400);
        }

        // Check if recipient exists
        const recipient = await prisma.user.findUnique({
            where: { id: recipientId },
        });

        if (!recipient) {
            return sendError(res, "Recipient not found", 404);
        }

        // enforce ordering
        const user1Id = Math.min(senderId, recipientId);
        const user2Id = Math.max(senderId, recipientId);


        // Check if conversation already exists
        let conversation = await prisma.conversation.findUnique({
        where: {
            user1Id_user2Id: {
            user1Id,
            user2Id,
            },
        },
        });

        // create if not exists
        if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
            user1Id,
            user2Id,
            },
        });
        }

        sendSuccess(res, conversation, "Conversation created successfully", 201);
    } catch (err) {
        next(err);
    }
};

const getConversations = async (req, res, next) => {
  try {
    const userId = req.userId;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        lastMessage: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    sendSuccess(res, conversations, "Conversations retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check if conversation exists and belongs to user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        lastMessage: true,
      },
    });

    if (!conversation) {
      return sendError(res, "Conversation not found", 404);
    }

    sendSuccess(res, conversation, "Conversation retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getConversationMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { cursor, limit = 20 } = req.query;

    const parsedLimit = Math.min(parseInt(limit, 10) || 20, 50);

    // 1. Authorization check
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: parseInt(id),
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      select: { id: true }
    });

    if (!conversation) {
      return sendError(res, "Conversation not found", 404);
    }

    // 2. Fetch paginated messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(id)
      },
      take: parsedLimit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { id: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // 3. Compute next cursor
    const nextCursor =
      messages.length === parsedLimit
        ? messages[messages.length - 1].id
        : null;

    // 4. Return in consistent shape
    sendSuccess(res, {
      messages,
      nextCursor,
    }, "Messages retrieved successfully");

  } catch (err) {
    next(err);
  }
};

module.exports = { createConversation, getConversations, getConversation, getConversationMessages };