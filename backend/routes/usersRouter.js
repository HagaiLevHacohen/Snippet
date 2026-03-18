// routes/usersRouter.js
const { Router } = require("express");
const {getUserById,  getFollowers, getFollowing, getUserLikes, updateUser, getUserComments, validateUserUpdate} = require('../controllers/usersController');
const {verifyToken} = require('../middleware/auth');

const usersRouter = Router();

// Routes: /users
usersRouter.get("/:id", verifyToken, getUserById);
usersRouter.get("/:id/followers", verifyToken, getFollowers);
usersRouter.get("/:id/following", verifyToken, getFollowing);
usersRouter.get("/:id/likes", verifyToken, getUserLikes);
usersRouter.get("/:id/comments", verifyToken, getUserComments);
usersRouter.put("/:id", verifyToken, validateUserUpdate, updateUser);




module.exports = usersRouter;