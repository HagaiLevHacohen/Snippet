// routes/authRouter.js
const { Router } = require("express");
const { postLogin, postSignup, validateUser, getUser} = require('../controllers/authController');
const {verifyToken} = require('../middleware/auth');

const authRouter = Router();

// Routes: /auth
authRouter.post("/signup", validateUser, postSignup);
authRouter.post("/login", postLogin);
authRouter.get("/me", verifyToken, getUser);



module.exports = authRouter;