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


const getUserLikes = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return sendError(res, "Invalid user id", 400);

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return sendError(res, "User not found", 404);

    // Pagination params
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where = { userId };

    // Get total likes count (for pagination)
    const totalCount = await prisma.like.count({ where });
    const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

    // Get liked posts with pagination
    const likes = await prisma.like.findMany({
      where,
      skip,
      take: limit,
      select: {
        post: {
          include: {
            user: { select: { id: true, username: true, name: true, avatarUrl: true } },
            _count: { select: { likes: true, comments: true } },
            // optional: limit comments for performance
            comments: {
              include: { user: { select: { id: true, username: true, name: true, avatarUrl: true } } },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    const likedPosts = likes.map(l => l.post);

    sendSuccess(
      res,
      { posts: likedPosts, page, totalPages, totalCount },
      "User liked posts retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};


const getUserComments = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return sendError(res, "Invalid user id", 400);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return sendError(res, "User not found", 404);

    // Pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where = { userId };

    const totalCount = await prisma.comment.count({ where });
    const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

    const comments = await prisma.comment.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        post: { select: { id: true, content: true, imageUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, { comments, page, totalPages, totalCount }, "User comments retrieved successfully");
  } catch (err) {
    next(err);
  }
};



module.exports = { getUserById, getFollowers, getFollowing, getUserLikes, getUserComments, validateUserUpdate, updateUser};
