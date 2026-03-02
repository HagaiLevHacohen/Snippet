// routes/usersRouter.js
const { Router } = require("express");
const {getUserById,  getFollowers, getFollowing, updateUser, validateUserUpdate} = require('../controllers/usersController');

const usersRouter = Router();

// Routes: /users
usersRouter.get("/:id", getUserById);
usersRouter.get("/:id/followers", getFollowers);
usersRouter.get("/:id/following", getFollowing);
usersRouter.put("/:id", validateUserUpdate, updateUser);




module.exports = usersRouter;