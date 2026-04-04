// routes/conversationsRouter.js
const { Router } = require("express");
const { createConversation, getConversations, getConversation, getConversationMessages } = require('../controllers/conversationsController');
const {verifyToken} = require('../middleware/auth');
const { combinedRateLimit } = require('../middleware/limiters');

const conversationsRouter = Router();

conversationsRouter.use(verifyToken);
conversationsRouter.use(combinedRateLimit);


// Routes: /conversations
conversationsRouter.get("/", getConversations);
conversationsRouter.post("/", createConversation);
conversationsRouter.get("/:id", getConversation);
conversationsRouter.get("/:id/messages", getConversationMessages);


module.exports = conversationsRouter;