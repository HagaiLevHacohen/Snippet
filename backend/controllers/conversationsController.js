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

module.exports = { createConversation };