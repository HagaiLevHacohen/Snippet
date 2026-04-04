// routes/uploadRouter.js
const { Router } = require("express");
const { verifyToken } = require("../middleware/auth");
const { uploadFile } = require("../controllers/uploadController");
const { combinedRateLimit } = require('../middleware/limiters');

const uploadRouter = Router();

uploadRouter.use(verifyToken);
uploadRouter.use(combinedRateLimit);

// Routes: /upload
uploadRouter.post("/avatar", uploadFile);
uploadRouter.post("/post-image", uploadFile);

module.exports = uploadRouter;