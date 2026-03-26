// routes/uploadRouter.js
const { Router } = require("express");
const { verifyToken } = require("../middleware/auth");
const { uploadFile } = require("../controllers/uploadController");

const router = Router();

// Routes: /upload
router.post("/avatar", verifyToken, uploadFile);
router.post("/post-image", verifyToken, uploadFile);

module.exports = router;