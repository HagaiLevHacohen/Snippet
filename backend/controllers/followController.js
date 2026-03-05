// controllers/followController.js

const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");


const createRequest = async (req, res, next) => {
  try {
    const receiverId = Number(req.params.id);

    if (isNaN(receiverId)) {
      return res.status(400).json({ error: "Invalid receiver id" });
    }

    if (receiverId === req.userId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!user) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    // Already following?
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: receiverId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({ error: "Already following this user" });
    }

    const existingRequest = await prisma.followRequest.findUnique({
      where: {
        outgoingRequestId_incomingRequestId: {
          outgoingRequestId: req.userId,
          incomingRequestId: receiverId,
        },
      },
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Follow request already exists" });
    }

    // Create request
    const request = await prisma.followRequest.create({
      data: {
        outgoingRequestId: req.userId,
        incomingRequestId: receiverId,
      },
    });

    res.status(201).json(request);

  } catch (err) {
    if (err.code === "P2002") {
      // Catch duplicate request (composite key violation)
      return res.status(400).json({ error: "Follow request already sent" });
    }
    next(err);
  }
};


const acceptRequest = async (req, res, next) => {
  try {
    const senderId = Number(req.params.id); // user who sent request

    if (isNaN(senderId)) {
      return res.status(400).json({ error: "Invalid sender id" });
    }

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const followRequest = await prisma.followRequest.findUnique({
      where: {
        outgoingRequestId_incomingRequestId: {
          outgoingRequestId: senderId,
          incomingRequestId: req.userId,
        },
      },
    });

    if (!followRequest) {
      return res.status(400).json({ error: "Follow request doesn't exist" });
    }

    const [, follow] = await prisma.$transaction([
      prisma.followRequest.delete({
        where: {
          outgoingRequestId_incomingRequestId: {
            outgoingRequestId: senderId,
            incomingRequestId: req.userId,
          },
        },
      }),
      prisma.userFollow.create({
        data: {
          followerId: senderId,
          followingId: req.userId,
        },
      }),
    ]);

    res.status(201).json(follow);
  } catch (err) {
    next(err);
  }
};

const rejectRequest = async (req, res, next) => {
  try {
    const senderId = Number(req.params.id); // user who sent request

    if (isNaN(senderId)) {
      return res.status(400).json({ error: "Invalid sender id" });
    }

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const followRequest = await prisma.followRequest.findUnique({
      where: {
        outgoingRequestId_incomingRequestId: {
          outgoingRequestId: senderId,
          incomingRequestId: req.userId,
        },
      },
    });

    if (!followRequest) {
      return res.status(400).json({ error: "Follow request doesn't exist" });
    }

    const deletedRequest = await prisma.followRequest.update({
      where: {
        outgoingRequestId_incomingRequestId: {
          outgoingRequestId: senderId,
          incomingRequestId: req.userId,
        },
      },
      data: {
        status: "REJECTED"
      }
    })

    res.status(200).json(deletedRequest);
  } catch (err) {
    next(err);
  }
};



const deleteFollow = async (req, res, next) => {
  try {
    const receiverId = Number(req.params.id);
    if (isNaN(receiverId)) {
      return res.status(400).json({ error: "Invalid receiver id" });
    }

    // Delete
    const deletedFollow = await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: receiverId,
        },
      },
    });
    res.status(200).json(deletedFollow);

  } catch (err) {
    if (err.code === "P2025") {
    return res.status(404).json({ error: "Follow not found" });
    }
    next(err);
  }
};




module.exports = { createRequest, acceptRequest, rejectRequest, deleteFollow};