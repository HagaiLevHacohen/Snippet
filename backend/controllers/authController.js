// controllers/authController.js

const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { prisma } = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { verifyToken, generateAccessToken, generateRefreshToken, hashToken} = require("../utils/tokens");
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
  passport.authenticate("local", { session: false }, async (err, user) => {
    if (err) return next(err);
    if (!user) return sendError(res, "Invalid credentials", 401);

    try {
      const accessToken = generateAccessToken(user.id);

      const refreshToken = generateRefreshToken();
      const tokenHash = hashToken(refreshToken);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.refreshToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt
        }
      });

      // Send refresh token as HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth/refresh"
      });

      return sendSuccess(res, accessToken, "Login successful");

    } catch (err) {
      next(err);
    }
  })(req, res, next);
};


const refreshTokenHandler = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return sendError(res, "No refresh token", 401);

    const tokenHash = hashToken(token);

    const dbToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!dbToken || dbToken.revoked || dbToken.expiresAt < new Date()) {
      return sendError(res, "Invalid refresh token", 403);
    }

    //  Rotate token
    const newRefreshToken = generateRefreshToken();
    const newHash = hashToken(newRefreshToken);

    await prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { revoked: true, replacedByToken: newHash }
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: { tokenHash: newHash, userId: dbToken.userId, expiresAt }
    });

    const newAccessToken = generateAccessToken(dbToken.userId);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth/refresh"
    });

    return sendSuccess(res, newAccessToken, "Token refreshed");

  } catch (err) {
    next(err);
  }
};


const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      // Nothing to revoke, just return success
      return sendSuccess(res, null, "Logged out");
    }

    const tokenHash = hashToken(token);

    // Find the token in DB
    const dbToken = await prisma.refreshToken.findUnique({
      where: { tokenHash }
    });

    if (dbToken) {
      await prisma.refreshToken.update({
        where: { id: dbToken.id },
        data: { revoked: true }
      });
    }

    // Clear the cookie
    res.clearCookie("refreshToken", { path: "/auth/refresh", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });

    return sendSuccess(res, null, "Logged out successfully");

  } catch (err) {
    next(err);
  }
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

    // Check if user exists
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

    // Generate access token
    const accessToken = generateAccessToken(user.id);

    // Generate refresh token
    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt
      }
    });

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth/refresh"
    });

    // Redirect with access token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}`);

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
                    refreshTokenHandler,
                    logout,
                    getUser,
                    handleGoogleAuth,
                    handleGoogleCallback
 };