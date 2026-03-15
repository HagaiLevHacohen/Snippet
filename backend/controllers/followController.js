// controllers/followController.js

const { prisma } = require("../lib/prisma");
const { sendSuccess, sendError } = require("../utils/response");



const createRequest = async (req, res, next) => {
  try {
    const receiverId = Number(req.params.id);

    if (isNaN(receiverId)) {
      return sendError(res, "Invalid receiver id", 400);
    }

    if (receiverId === req.userId) {
      return sendError(res, "You cannot follow yourself", 400);
    }

    // Check if the receiver exists
    const user = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!user) return sendError(res, "Receiver not found", 404);

    // Already following?
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: receiverId,
        },
      },
    });

    if (existingFollow) return sendError(res, "Already following this user", 400);

    const existingRequest = await prisma.followRequest.findUnique({
      where: {
        outgoingRequestId_incomingRequestId: {
          outgoingRequestId: req.userId,
          incomingRequestId: receiverId,
        },
      },
    });

    if (existingRequest) return sendError(res, "Follow request already exists", 400);


    // Create request
    const request = await prisma.followRequest.create({
      data: {
        outgoingRequestId: req.userId,
        incomingRequestId: receiverId,
      },
    });

    sendSuccess(res, request, "Follow request created successfully", 201);

  } catch (err) {
    if (err.code === "P2002") {
      // Catch duplicate request (composite key violation)
      return sendError(res, "Follow request already sent", 400);
    }
    next(err);
  }
};


const acceptRequest = async (req, res, next) => {
  try {
    const senderId = Number(req.params.id); // user who sent request

    if (isNaN(senderId)) {
      return sendError(res, "Invalid sender id", 400);
    }

    // Check if sender exists
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });
    if (!sender) return sendError(res, "Sender not found", 404);

    // Check if the follow request exists
    const followRequest = await prisma.followRequest.findUnique({
      where: {
        outgoingRequestId_incomingRequestId: {
          outgoingRequestId: senderId,
          incomingRequestId: req.userId,
        },
      },
    });
    if (!followRequest) return sendError(res, "Follow request doesn't exist", 400);


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

    sendSuccess(res, follow, "Follow request accepted successfully", 201);
  } catch (err) {
    next(err);
  }
};

const rejectRequest = async (req, res, next) => {
  try {
    const senderId = Number(req.params.id); // user who sent request

    if (isNaN(senderId)) {
      return sendError(res, "Invalid sender id", 400);
    }

    // Check if sender exists
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });
    if (!sender) return sendError(res, "Sender not found", 404);

    // Check if follow request exists
    const followRequest = await prisma.followRequest.findUnique({
      where: {
        outgoingRequestId_incomingRequestId: {
          outgoingRequestId: senderId,
          incomingRequestId: req.userId,
        },
      },
    });
    if (!followRequest) return sendError(res, "Follow request doesn't exist", 400);


    const rejectedRequest = await prisma.followRequest.update({
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

    sendSuccess(res, rejectedRequest, "Follow request rejected successfully");
    
  } catch (err) {
    next(err);
  }
};



const deleteFollow = async (req, res, next) => {
  try {
    const receiverId = Number(req.params.id);
    if (isNaN(receiverId)) {
      return sendError(res, "Invalid receiver id", 400);
    }

    // Delete the follow relationship
    const deletedFollow = await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId: req.userId,
          followingId: receiverId,
        },
      },
    });

    sendSuccess(res, deletedFollow, "Follow deleted successfully");

  } catch (err) {
    if (err.code === "P2025") {
      // Follow not found
      return sendError(res, "Follow not found", 404);
    }
    next(err); // forward unexpected errors to global handler
  }
};




module.exports = { createRequest, acceptRequest, rejectRequest, deleteFollow};