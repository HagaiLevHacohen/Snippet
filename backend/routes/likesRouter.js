// routes/likesRouter.js
const { Router } = require("express");
const {postLike, deleteLike, toggleLike} = require('../controllers/likesController');
const {verifyToken} = require('../middleware/auth');
const { combinedRateLimit } = require('../middleware/limiters');

const likesRouter = Router({ mergeParams: true });

likesRouter.use(verifyToken);
likesRouter.use(combinedRateLimit);

// Routes: /posts/:id/like
likesRouter.post("/", postLike);
likesRouter.put("/", toggleLike);
likesRouter.delete("/", deleteLike);



module.exports = likesRouter;