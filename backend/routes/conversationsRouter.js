// routes/conversationsRouter.js
const { Router } = require("express");
const { createConversation, getConversations, getConversation, getConversationMessages } = require('../controllers/conversationsController');
const {verifyToken} = require('../middleware/auth');

const conversationsRouter = Router();

// Routes: /conversations
conversationsRouter.get("/", verifyToken, getConversations);
conversationsRouter.post("/", verifyToken, createConversation);
conversationsRouter.get("/:id", verifyToken, getConversation);
conversationsRouter.get("/:id/messages", verifyToken, getConversationMessages);



module.exports = conversationsRouter;