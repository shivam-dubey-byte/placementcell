const express = require("express");
const router = express.Router();
const { extractEmail } = require("../middleware/authMiddleware"); // Uncomment this line
const { uploadResume, handleUpdateResume, getResume } = require("../controllers/resumeController"); // Uncomment this line
const multer = require("multer");

// Use memory storage instead of disk storage
//const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Construct the correct file URL with the extension
        const fileUrl = req.file.path.includes("raw/upload") 
            ? `${req.file.path}` // Manually append `.pdf` for raw uploads
            : req.file.path;

        res.json({
            message: "File uploaded successfully",
            fileUrl: fileUrl, 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Upload failed" });
    }
});

// Routes
//router.post("/upload-resume", extractEmail, upload.single("resume"), uploadResume);
router.post("/upload-resume",extractEmail,uploadResume);
router.post("/update-resume", extractEmail, upload.single("resume"), handleUpdateResume);
router.get("/get-resume", extractEmail, getResume);

module.exports = router;