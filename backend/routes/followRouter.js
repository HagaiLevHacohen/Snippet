// routes/followRouter.js
const { Router } = require("express");
const {createRequest, acceptRequest, rejectRequest, deleteFollow} = require('../controllers/followController');
const {verifyToken} = require('../middleware/auth');

const followRouter = Router();

// Routes: /follow
followRouter.post("/:id", verifyToken, createRequest);
followRouter.post("/:id/accept", verifyToken, acceptRequest);
followRouter.post("/:id/reject", verifyToken, rejectRequest);
followRouter.delete("/:id", verifyToken, deleteFollow);




module.exports = followRouter;