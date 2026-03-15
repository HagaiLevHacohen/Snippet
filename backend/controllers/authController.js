// controllers/authController.js

const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { prisma } = require("../lib/prisma");
const jwt = require("jsonwebtoken");
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


const postSignup = async (req, res) => {
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
      return sendSuccess(res, { token }, "Login successful");

    } catch (jwtErr) {
      // Any JWT signing error
      return next(jwtErr);
    }
  })(req, res, next);
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
 };