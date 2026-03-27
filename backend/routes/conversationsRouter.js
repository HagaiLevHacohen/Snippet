// routes/conversationsRouter.js
const { Router } = require("express");
const { createConversation } = require('../controllers/conversationsController');
const {verifyToken} = require('../middleware/auth');

const conversationsRouter = Router();

// Routes: /conversations
conversationsRouter.post("/", verifyToken, createConversation);




module.exports = conversationsRouter;