// controllers/likesController.js

const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");


const postLike = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    // Fetch the post first
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const like = await prisma.like.create({ data: { userId: req.userId, postId: postId} });

    res.status(201).json(like);
    } catch (err) {
        next(err);
    }
};

const deleteLike = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    // Fetch the post first
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: "Post not found" });


    // Delete
    const deletedLike = await prisma.like.delete({
    where: {
        userId_postId: {
        userId: req.userId,
        postId: postId,
        },
    },
    });
    res.status(200).json(deletedLike);

  } catch (err) {
    next(err);
  }
};




module.exports = { postLike, deleteLike};