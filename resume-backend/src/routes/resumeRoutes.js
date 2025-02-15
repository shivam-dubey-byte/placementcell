const express = require("express");
const router = express.Router();
const { extractEmail } = require("../middleware/authMiddleware"); // Uncomment this line
const { uploadResume, handleUpdateResume, getResume } = require("../controllers/resumeController"); // Uncomment this line
const multer = require("multer");

// Use memory storage instead of disk storage
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post("/upload-resume", extractEmail, upload.single("resume"), uploadResume);
router.post("/update-resume", extractEmail, upload.single("resume"), handleUpdateResume);
router.get("/get-resume", extractEmail, getResume);

module.exports = router;