// routes/followRouter.js
const { Router } = require("express");
const {createRequest, acceptRequest, rejectRequest, deleteFollow} = require('../controllers/followController');
const {verifyToken} = require('../middleware/auth');
const { combinedRateLimit } = require('../middleware/limiters');

const followRouter = Router();

followRouter.use(verifyToken);
followRouter.use(combinedRateLimit);


// Routes: /follow
followRouter.post("/:id", createRequest);
followRouter.post("/:id/accept", acceptRequest);
followRouter.post("/:id/reject", rejectRequest);
followRouter.delete("/:id", deleteFollow);




module.exports = followRouter;