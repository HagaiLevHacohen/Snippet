// controllers/usersController.js

const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");
const { sendSuccess, sendError } = require("../utils/response");



const getUserById = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return sendError(res, "Invalid user id", 400);
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
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, user, "User retrieved successfully");
  } catch (err) {
    next(err);
  }
};


const getFollowers = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return sendError(res, "Invalid user id", 400);
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

    // Extract follower objects and send in standardized format
    const followerData = followers.map(f => f.follower);

    return sendSuccess(res, followerData, "Followers retrieved successfully");
  } catch (err) {
    next(err);
  }
};


const getFollowing = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return sendError(res, "Invalid user id", 400);
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

    const followingData = following.map(f => f.following);
    return sendSuccess(res, followingData, "Following retrieved successfully");

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
      return sendError(res, "Invalid user id", 400);
    }

    if (req.userId !== userId) {
      return sendError(res, "Forbidden", 403);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, "Validation failed", 400, errors.array());
    }

    const validatedData = matchedData(req);

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

    return sendSuccess(res, updatedUser, "User updated successfully");
  } catch (err) {
    next(err);
  }
};



module.exports = { getUserById, getFollowers, getFollowing, validateUserUpdate, updateUser};
