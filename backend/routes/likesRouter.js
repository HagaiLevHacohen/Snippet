// routes/likesRouter.js
const { Router } = require("express");
const {postLike, deleteLike, toggleLike} = require('../controllers/likesController');
const {verifyToken} = require('../middleware/auth');

const likesRouter = Router({ mergeParams: true });

// Routes: /posts/:id/like
likesRouter.post("/", verifyToken, postLike);
likesRouter.put("/", verifyToken, toggleLike);
likesRouter.delete("/", verifyToken, deleteLike);



module.exports = likesRouter;