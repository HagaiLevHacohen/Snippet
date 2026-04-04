// routes/commentsRouter.js
const { Router } = require("express");
const {getComment, validateComment, updateComment, deleteComment, getComments} = require('../controllers/commentsController');
const {verifyToken} = require('../middleware/auth');
const { combinedRateLimit } = require('../middleware/limiters');

const commentsRouter = Router();

commentsRouter.use(verifyToken);
commentsRouter.use(combinedRateLimit);


// Routes: /comments
commentsRouter.get("/:id", getComment);
commentsRouter.put("/:id", validateComment, updateComment);
commentsRouter.delete("/:id", deleteComment);




module.exports = commentsRouter;