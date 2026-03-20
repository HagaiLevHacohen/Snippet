// controllers/postsController.js

const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");
const { sendSuccess, sendError } = require("../utils/response");



const getPosts = async (req, res, next) => {
  try {
    const section = req.query.section; // "following"
    const search = req.query.search?.trim();
    const userId = Number(req.query.userId);

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where = {};

    // Search filter
    if (search) {
      where.content = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Specific user posts
    if (userId) {
      where.userId = userId;
    }
    // Following feed
    else if (section === "following") {
      where.user = {
        followers: {
          some: {
            followerId: req.userId,
          },
        },
      };
    }

    // Total count for pagination
    const totalCount = await prisma.post.count({ where });
    const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

    // Fetch posts
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        // Only current user's like
        likes: {
          where: {
            userId: req.userId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    // Add isLiked boolean & clean response
    const postsWithLiked = posts.map((post) => ({
      ...post,
      isLiked: post.likes.length > 0,
      likes: undefined, // optional: remove raw likes array
    }));

    sendSuccess(
      res,
      {
        posts: postsWithLiked,
        page,
        totalPages,
        totalCount,
      },
      "Posts retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};


const getPost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    if (isNaN(postId)) {
      return sendError(res, "Invalid post id", 400);
    }
    let post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
        user: {
        select: { id: true, username: true, name: true, avatarUrl: true },
        },
        comments: {
          include: {
              user: { select: { id: true, username: true, name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
        select: { likes: true, comments: true },
        },
        likes: {
          where: {
            userId: req.userId,
          },
          select: {
            userId: true,
          },
        },
    },
    });

    if (!post) return sendError(res, "Post not found", 404);

    // Add isLiked boolean & clean response
    post = {...post, isLiked: post.likes.length > 0, likes: undefined};

    sendSuccess(res, post, "Post retrieved successfully");

    } catch (err) {
        next(err);
    }
};



const validatePost = [
  body("content")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Content must be at most 500 characters"),
  body("imageUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
];


const createPost = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, "Validation failed", 400, errors.array());
    }

    const validatedData = matchedData(req, { includeOptionals: true });
    if (!validatedData.content && !validatedData.imageUrl) {
      return sendError(res, "Post must have either content or image", 400);
    }

    const post = await prisma.post.create({
    data: {
        ...validatedData,
        userId: req.userId,
    },
    })

    sendSuccess(res, post, "Post created successfully", 201);
    
    } catch (err) {
        next(err);
    }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return sendError(res, "Invalid post id", 400);
    }

    // Fetch the post first
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return sendError(res, "Post not found", 404);

    // Check if the user owns the post
    if (post.userId !== req.userId) return sendError(res, "Forbidden", 403);

    // Delete
    const deletedPost = await prisma.post.delete({ where: { id: postId } });
    sendSuccess(res, deletedPost, "Post deleted successfully");

  } catch (err) {
    next(err);
  }
};


const validateComment = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Content must not be empty, and must be at most 500 characters"),
]

const createComment = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return sendError(res, "Invalid post id", 400);
    }

    // Check if the post exists
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) return sendError(res, "Post not found", 404);

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, "Validation failed", 400, errors.array());
    }


    const {content} = matchedData(req);

    const comment = await prisma.comment.create({
    data: {
        content: content,
        userId: req.userId,
        postId: postId
    },
    })

    sendSuccess(res, comment, "Comment created successfully", 201);

    } catch (err) {
        next(err);
    }
};


module.exports = { getPosts, getPost, validatePost, createPost, deletePost, validateComment, createComment};
