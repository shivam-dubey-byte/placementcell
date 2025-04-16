const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { extractEmail } = require("../middleware/authMiddleware");
const {
    resumeUpload,
    getUserResume
} = require("../controllers/requestController");


router.post("/upload", upload.single("resume"), async (req, res) => {
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

//Resume Upload Route
router.post('/resume-upload',extractEmail, upload.single("resume"), resumeUpload);
router.get("/resume", extractEmail, getUserResume);

module.exports = router;
