// routes/usersRouter.js
const { Router } = require("express");
const {getUsers, getUserByUsername, getUserById,  getFollowRequests, getFollowers, getFollowing, getUserLikes, updateUser, getUserComments, validateUserUpdate} = require('../controllers/usersController');
const {verifyToken} = require('../middleware/auth');
const { combinedRateLimit } = require('../middleware/limiters');

const usersRouter = Router();

usersRouter.use(verifyToken);
usersRouter.use(combinedRateLimit);


// Routes: /users
usersRouter.get("/", getUsers);
usersRouter.get("/username/:username", getUserByUsername);
usersRouter.get("/follow-requests", getFollowRequests);
usersRouter.get("/:id/followers", getFollowers);
usersRouter.get("/:id/following", getFollowing);
usersRouter.get("/:id/likes", getUserLikes);
usersRouter.get("/:id/comments", getUserComments);
usersRouter.get("/:id", getUserById);
usersRouter.put("/:id", validateUserUpdate, updateUser);




module.exports = usersRouter;