const express = require("express");
const router = express.Router();
//const { extractEmail } = require("../middleware/authMiddleware");
//const { uploadResume, handleUpdateResume, getResume } = require("../controllers/resumeController");
const multer = require("multer");

//const upload = multer({ dest: "uploads/" });

router.post("/upload-resume", extractEmail, upload.single("resume"), uploadResume);
router.post("/update-resume", extractEmail, upload.single("resume"), handleUpdateResume);
router.get("/get-resume", extractEmail, getResume);

module.exports = router;
