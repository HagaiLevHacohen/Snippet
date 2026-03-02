// routes/authRouter.js
const { Router } = require("express");
const { postLogin, postSignup, validateUser, getUser} = require('../controllers/authController');

const authRouter = Router();

// Routes: /auth
authRouter.post("/signup", validateUser, postSignup);
authRouter.post("/login", postLogin);
authRouter.post("/me", getUser);



module.exports = authRouter;