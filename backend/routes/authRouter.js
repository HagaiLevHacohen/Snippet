// routes/authRouter.js
const { Router } = require("express");
const { postLogin, postSignup, validateUser, logout, refreshTokenHandler, getUser, handleGoogleAuth, handleGoogleCallback} = require('../controllers/authController');
const {verifyToken} = require('../middleware/auth');
const { authRateLimit, combinedRateLimit } = require('../middleware/limiters');

const authRouter = Router();

// Routes: /auth
authRouter.post("/signup", authRateLimit, validateUser, postSignup);
authRouter.post("/login", authRateLimit, postLogin);
authRouter.post("/refresh", refreshTokenHandler);
authRouter.post("/logout", logout);
authRouter.get("/google", authRateLimit, handleGoogleAuth);
authRouter.get("/google/callback", authRateLimit, handleGoogleCallback);
authRouter.get("/me", verifyToken, combinedRateLimit, getUser);




module.exports = authRouter;