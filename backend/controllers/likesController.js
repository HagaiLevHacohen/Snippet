// controllers/likesController.js

const { prisma } = require("../lib/prisma");
const { sendSuccess, sendError } = require("../utils/response");


const postLike = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return sendError(res, "Invalid post id", 400);
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return sendError(res, "Post not found", 404);

    // Create a like
    const like = await prisma.like.create({
      data: { userId: req.userId, postId: postId },
    });

    sendSuccess(res, like, "Post liked successfully", 201);

    } catch (err) {
        next(err);
    }
};

const deleteLike = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return sendError(res, "Invalid post id", 400);
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return sendError(res, "Post not found", 404);



    // Delete the like
    const deletedLike = await prisma.like.delete({
      where: { userId_postId: { userId: req.userId, postId: postId } },
    });


    return sendSuccess(res, deletedLike, "Like removed successfully");

  } catch (err) {
    if (err.code === "P2025") {
      // Like not found
      return sendError(res, "Like not found", 404);
    }
    next(err);
  }
};


const toggleLike = async (req, res, next) => {
  try {
    const userId = req.userId;
    const postId = Number(req.params.id);

    if (isNaN(postId)) {
      return sendError(res, "Invalid post id", 400);
    }

    // Ensure the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return sendError(res, "Post not found", 404);

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    let isLiked;

    if (existingLike) {
      // 👎 unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      isLiked = false;
    } else {
      // 👍 like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      isLiked = true;
    }

    res.json({ isLiked });
  } catch (err) {
    next(err);
  }
};



module.exports = { postLike, deleteLike, toggleLike};