// routes/postsRouter.js
const { Router } = require("express");
const {getPosts, getPost, validatePost, createPost, deletePost, validateComment, createComment} = require('../controllers/postsController');
const {verifyToken} = require('../middleware/auth');
const { combinedRateLimit } = require('../middleware/limiters');

const postsRouter = Router();

postsRouter.use(verifyToken);
postsRouter.use(combinedRateLimit);

// Routes: /posts
postsRouter.get("/", getPosts);
postsRouter.post("/", validatePost, createPost);
postsRouter.get("/:id", getPost);
postsRouter.delete("/:id", deletePost);
postsRouter.post("/:id/comments", validateComment, createComment);



module.exports = postsRouter;