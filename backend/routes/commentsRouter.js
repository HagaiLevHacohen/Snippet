// routes/commentsRouter.js
const { Router } = require("express");
const {getComment, validateComment, updateComment, deleteComment, getComments} = require('../controllers/commentsController');
const {verifyToken} = require('../middleware/auth');

const commentsRouter = Router();

// Routes: /comments
commentsRouter.get("/", verifyToken, getComments);
commentsRouter.get("/:id", verifyToken, getComment);
commentsRouter.put("/:id", verifyToken, validateComment, updateComment);
commentsRouter.delete("/:id", verifyToken, deleteComment);




module.exports = commentsRouter;