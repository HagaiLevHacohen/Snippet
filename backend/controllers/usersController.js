// controllers/usersController.js

const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");



const getUserById = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({
      where: { id : userId },
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
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};


const getFollowers = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    
    const followers = await prisma.userFollow.findMany({
      where: { followingId: userId },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json(followers.map(f => f.follower));
  } catch (err) {
    next(err);
  }
};


const getFollowing = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    
    const following = await prisma.userFollow.findMany({
      where: { followerId: userId },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json(following.map(f => f.following));
  } catch (err) {
    next(err);
  }
};


const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be between 1 and 50 characters"),
  body("status")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Status must be at most 150 characters"),
  body("avatarUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("Avatar URL must be a valid URL"),
];

const updateUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    if (req.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const validatedData = matchedData(req, { includeOptionals: true });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
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

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};



module.exports = { getUserById, getFollowers, getFollowing, validateUserUpdate, updateUser};
