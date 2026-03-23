// routes/usersRouter.js
const { Router } = require("express");
const {getUsers, getUserByUsername, getUserById,  getFollowRequests, getFollowers, getFollowing, getUserLikes, updateUser, getUserComments, validateUserUpdate} = require('../controllers/usersController');
const {verifyToken} = require('../middleware/auth');

const usersRouter = Router();

// Routes: /users
usersRouter.get("/", verifyToken, getUsers);
usersRouter.get("/username/:username", verifyToken, getUserByUsername);
usersRouter.get("/follow-requests", verifyToken, getFollowRequests);
usersRouter.get("/:id/followers", verifyToken, getFollowers);
usersRouter.get("/:id/following", verifyToken, getFollowing);
usersRouter.get("/:id/likes", verifyToken, getUserLikes);
usersRouter.get("/:id/comments", verifyToken, getUserComments);
usersRouter.get("/:id", verifyToken, getUserById);
usersRouter.put("/:id", verifyToken, validateUserUpdate, updateUser);




module.exports = usersRouter;