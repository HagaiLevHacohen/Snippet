// routes/usersRouter.js
const { Router } = require("express");
const {getUserById,  getFollowers, getFollowing, updateUser, validateUserUpdate} = require('../controllers/usersController');
const {verifyToken} = require('../middleware/auth');

const usersRouter = Router();

// Routes: /users
usersRouter.get("/:id", verifyToken, getUserById);
usersRouter.get("/:id/followers", verifyToken, getFollowers);
usersRouter.get("/:id/following", verifyToken, getFollowing);
usersRouter.put("/:id", verifyToken, validateUserUpdate, updateUser);




module.exports = usersRouter;