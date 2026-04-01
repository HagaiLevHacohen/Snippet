// routes/authRouter.js
const { Router } = require("express");
const { postLogin, postSignup, validateUser, getUser, handleGoogleAuth, handleGoogleCallback} = require('../controllers/authController');
const {verifyToken} = require('../middleware/auth');

const authRouter = Router();

// Routes: /auth
authRouter.post("/signup", validateUser, postSignup);
authRouter.post("/login", postLogin);
authRouter.get("/google", handleGoogleAuth);
authRouter.get("/google/callback", handleGoogleCallback);
authRouter.get("/me", verifyToken, getUser);




module.exports = authRouter;