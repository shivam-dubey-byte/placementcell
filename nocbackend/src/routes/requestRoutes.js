const express = require("express");
const router = express.Router();
//const { extractEmail } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { extractEmail } = require("../middleware/authMiddleware");
const {
    addActiveRequest,
    getActiveRequest,
    getHistory,
    actionLorRequest
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

// ActiveRequest Routes
router.post("/active-request", extractEmail, addActiveRequest); // Email from token
router.get("/active-request", extractEmail, getActiveRequest); // Email from body


router.post("/action",extractEmail,actionLorRequest)

// History Routes
router.get("/history", extractEmail, getHistory); // Email from body

module.exports = router;
