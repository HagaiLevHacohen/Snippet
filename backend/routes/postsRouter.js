// routes/postsRouter.js
const { Router } = require("express");
const {getPosts, getPost, validatePost, createPost, deletePost} = require('../controllers/postsController');
const {verifyToken} = require('../middleware/auth');

const postsRouter = Router();

// Routes: /posts
postsRouter.get("/", verifyToken, getPosts);
postsRouter.post("/", verifyToken, validatePost, createPost);
postsRouter.get("/:id", verifyToken, getPost);
postsRouter.delete("/:id", verifyToken, deletePost);



module.exports = postsRouter;