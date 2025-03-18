const express = require("express");
const router = express.Router();
//const { extractEmail } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { extractEmail } = require("../middleware/authMiddleware");
const {
    addActiveRequest,
    getActiveRequest,
    deleteActiveRequest,
    addHistory,
    getHistory,
    resumeUpload,
    getUserResume
} = require("../controllers/requestController");

// File Upload Route
//router.post("/upload", upload.single("file"), (req, res) => {
//    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
//    res.status(200).json({ message: "File uploaded successfully", filePath: `/uploads/${req.file.filename}` });
//});

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

// ActiveRequest Routes
router.post("/active-request", extractEmail, addActiveRequest); // Email from token
router.get("/active-request", extractEmail, getActiveRequest); // Email from body
router.delete("/active-request", extractEmail, deleteActiveRequest); // Email from body

//Resume Upload Route
router.post('/resume-upload',extractEmail, upload.single("resume"), resumeUpload);
router.get("/resume", extractEmail, getUserResume);

// History Routes
router.post("/history", extractEmail, addHistory); // Email from token
router.get("/history", extractEmail, getHistory); // Email from body

module.exports = router;
