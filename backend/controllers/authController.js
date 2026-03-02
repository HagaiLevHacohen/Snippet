// controllers/authController.js

const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { prisma } = require("../lib/prisma");
const jwt = require("jsonwebtoken");



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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      errors: errors.array(),
    });
  }

  // Only use matchedData when validation PASSES
  const { username, email, name, password } = matchedData(req);
  const passwordHashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username: username,
      name: name,
      email: email,
      passwordHashed: passwordHashed
    }
  })
  res.json({ success: true, message: "Signup successful" });
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Sign the JWT
    const token = jwt.sign(
      { userId: user.id},
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    // Send the token to the client
    return res.json({ token });
  })(req, res, next);
};

const getUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
        where: {id: req.userId},
        });
        res.json(user);
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