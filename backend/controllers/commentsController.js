// controllers/commentsController.js

const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");
const { sendSuccess, sendError } = require("../utils/response");


const getComments = async (req, res, next) => {
  try {
    const userId = Number(req.query.userId);

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where = {};

    // Specific user comments
    if (userId) {
      where.userId = userId;
    }

    // Total count for pagination
    const totalCount = await prisma.comment.count({ where });
    const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

    // Fetch comments
    const comments = await prisma.comment.findMany({
      where: where,
      include: {
        user: {
          select: { id: true, username: true, name: true, avatarUrl: true },
        },
        post: {
          select: {
            id: true,
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    sendSuccess(
      res,
      {
        comments,
        page,
        totalPages,
        totalCount,
      },
      "Comments retrieved successfully"
    );
  } catch (err) {
    next(err);
  }
};



const getComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);

    if (isNaN(commentId)) {
      return sendError(res, "Invalid comment id", 400);
    }
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
          user: {
          select: { id: true, username: true, name: true, avatarUrl: true },
          },
      },
    });

    if (!comment) {
        return sendError(res, "Comment not found", 404);
    }

    sendSuccess(res, comment, "Comment retrieved successfully");

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


const updateComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);

    if (isNaN(commentId)) {
      return sendError(res, "Invalid comment id", 400);
    }

    // Fetch the comment first
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return sendError(res, "Comment not found", 404);

    // Check if the user owns the comment
    if (comment.userId !== req.userId) return sendError(res, "Forbidden", 403);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, "Validation failed", 400, errors.array());
    }

    const validatedData = matchedData(req);

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: validatedData,
      include: {
          user: {
          select: { id: true, username: true, name: true, avatarUrl: true },
          },
      },
    });

    sendSuccess(res, updatedComment, "Comment updated successfully");

  } catch (err) {
    next(err);
  }
};


const deleteComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);
    if (isNaN(commentId)) {
      return sendError(res, "Invalid comment id", 400);
    }

    // Fetch the comment first
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return sendError(res, "Comment not found", 404);

    // Check if the user owns the comment
    if (comment.userId !== req.userId) return sendError(res, "Forbidden", 403);

    // Delete
    const deletedComment = await prisma.comment.delete({ where: { id: commentId } });
    return sendSuccess(res, deletedComment, "Comment deleted successfully");

  } catch (err) {
    next(err);
  }
};



module.exports = { getComment, validateComment, updateComment, deleteComment, getComments};
