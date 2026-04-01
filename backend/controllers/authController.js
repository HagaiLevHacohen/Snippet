// controllers/authController.js

const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { prisma } = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { sendSuccess, sendError } = require("../utils/response");




const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .custom(async (username) => {
        const user = await prisma.user.findUnique({ where: { username } });
        if (user) throw new Error("Username already exists");
        return true;
    }),

  body("email")
    .trim()
    .normalizeEmail() // makes email lowercase & safe
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (email) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) throw new Error("Email already exists");
        return true;
    }),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be between 1 and 50 characters"),
    

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom(async (password) => {
        // Regex patterns
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUpperCase) throw new Error("Password must contain at least one uppercase letter");
        if (!hasLowerCase) throw new Error("Password must contain at least one lowercase letter");
        if (!hasNumber) throw new Error("Password must contain at least one number");
        if (!hasSpecialChar) throw new Error("Password must contain at least one special character");

        return true; // All checks passed
    }),

  body("confirm_password")
    .custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.password) {
            throw new Error("Password confirmation doesn't match");
        }
        return true;
    }),
];


const postSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendError(res, "Validation failed", 400, errors.array());
    }

    const { username, email, name, password } = matchedData(req);
    const passwordHashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        passwordHashed,
      },
      select: { id: true, username: true, name: true, email: true } 
    });

    sendSuccess(res, user, "Signup successful", 201);

  } catch (err) {
    next(err);
  }
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err); // unexpected errors go to global handler

    if (!user) {
      return sendError(res, "Invalid credentials", 401);
    }

    try {
      // Sign the JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.SECRET,
        { expiresIn: "1h" }
      );

      // Return token in standardized format
      return sendSuccess(res, token, "Login successful");

    } catch (jwtErr) {
      // Any JWT signing error
      return next(jwtErr);
    }
  })(req, res, next);
};


const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const handleGoogleAuth = (req, res) => {
  // Generate random state
  const state = crypto.randomBytes(16).toString("hex");

  // Save state in a cookie (or session)
  res.cookie("oauth_state", state, { httpOnly: true, sameSite: "lax" });

  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "consent",
    state // send it to Google
  });

  res.redirect(url);
};

const handleGoogleCallback = async (req, res, next) => {
  try {
    const returnedState = req.query.state;
    const savedState = req.cookies.oauth_state;
    if (!returnedState || returnedState !== savedState) {
      return res.status(403).send("Invalid state");
    }
    res.clearCookie("oauth_state");

    const code = req.query.code;
    // Exchange code for tokens
    const { tokens } = await client.getToken(code);

    // Verify ID token & get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (!payload || !payload.sub) {
      return sendError(res, "Invalid Google response", 400);
    }

    const userAuth = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    };

    let user = await prisma.user.findUnique({
      where: { googleId: userAuth.googleId },
      select: { id: true, username: true, name: true, email: true }
    });

    if (!user) {
      // Create new user if not exists
      const generatedUsername = `${userAuth.name.toLowerCase().replace(/\s+/g, "")}${Math.floor(Math.random() * 10000)}`;
      user = await prisma.user.create({
        data: {
          googleId: userAuth.googleId,
          authProvider: "google",
          username: generatedUsername,
          name: userAuth.name,
          email: userAuth.email,
        },
        select: { id: true, username: true, name: true, email: true } 
      });
    }

    // Sign the JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);

  } catch (err) {
    next(err);
  }
};


const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
            likes: true
          }
        }
      }
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, user, "User retrieved successfully");

  } catch (err) {
    next(err);
  }
};

module.exports = { 
                    postLogin,
                    postSignup,
                    validateUser,
                    getUser,
                    handleGoogleAuth,
                    handleGoogleCallback
 };