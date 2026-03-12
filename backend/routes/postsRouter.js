// routes/postsRouter.js
const { Router } = require("express");
const {getPosts, getPost, validatePost, createPost, deletePost, validateComment, createComment} = require('../controllers/postsController');
const {verifyToken} = require('../middleware/auth');

const postsRouter = Router();

// Routes: /posts
postsRouter.get("/", verifyToken, getPosts);
postsRouter.post("/", verifyToken, validatePost, createPost);
postsRouter.get("/:id", verifyToken, getPost);
postsRouter.delete("/:id", verifyToken, deletePost);
postsRouter.post("/:id/comments", verifyToken, validateComment, createComment);



module.exports = postsRouter;