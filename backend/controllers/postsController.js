// controllers/usersController.js

const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");



const getPosts = async (req, res, next) => {
  try {
    const section = req.query.section || "recent"; // recent OR following
    const search = req.query.search || "";

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const skip = (page - 1) * limit;

    const where = {
        content: {
            contains: search,
            mode: "insensitive",
        },
    };

    if (section === "following") {
        where.user = {
            followers: {
            some: {
                followerId: req.userId,
            },
            },
        };
    }

    const posts = await prisma.post.findMany({
    where: where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
    include: {
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
    },
    });

    res.json(posts);
    } catch (err) {
        next(err);
    }
};


const getPost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    const post = await prisma.post.findUnique({
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
    },
    });

    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
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
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const validatedData = matchedData(req, { includeOptionals: true });
    if (!validatedData.content && !validatedData.imageUrl) {
      return res.status(400).json({ error: "Post must have either content or image" });
    }

    const post = await prisma.post.create({
    data: {
        ...validatedData,
        userId: req.userId,
    },
    })

    res.status(201).json(post);
    } catch (err) {
        next(err);
    }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    // Fetch the post first
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check if the user owns the post
    if (post.userId !== req.userId) return res.status(403).json({ error: "Forbidden" });

    // Delete
    const deletedPost = await prisma.post.delete({ where: { id: postId } });
    res.status(200).json(deletedPost);

  } catch (err) {
    next(err);
  }
};




module.exports = { getPosts, getPost, validatePost, createPost, deletePost};
