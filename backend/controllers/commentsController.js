// controllers/commentsController.js

const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");

const getComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);

    if (isNaN(commentId)) {
      return res.status(400).json({ error: "Invalid comment id" });
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
        return res.status(404).json({ error: "Comment not found" });
    }

    res.json(comment);
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
      return res.status(400).json({ error: "Invalid comment id" });
    }

    // Fetch the comment first
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Check if the user owns the comment
    if (comment.userId !== req.userId) return res.status(403).json({ error: "Forbidden" });


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
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

    res.json(updatedComment);
  } catch (err) {
    next(err);
  }
};


const deleteComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);
    if (isNaN(commentId)) {
      return res.status(400).json({ error: "Invalid comment id" });
    }

    // Fetch the comment first
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Check if the user owns the comment
    if (comment.userId !== req.userId) return res.status(403).json({ error: "Forbidden" });

    // Delete
    const deletedComment = await prisma.comment.delete({ where: { id: commentId } });
    res.status(200).json(deletedComment);

  } catch (err) {
    next(err);
  }
};



module.exports = { getComment, validateComment, updateComment, deleteComment};
