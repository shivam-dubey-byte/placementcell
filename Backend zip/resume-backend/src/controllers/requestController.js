const {
    findUserResumeByEmail,
    updateUserResume
} = require('../models/requestModel.js');

const upload = require("../middleware/uploadMiddleware");

const getUserResume = async (req, res) => {
    try {
        const email = req.email; // Extracted from middleware
        const resumeUrl = await findUserResumeByEmail(email);

        if (!resumeUrl) {
            return res.status(404).json({ message: "No resume found" });
        }

        res.json({ fileUrl: resumeUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching resume" });
    }
};


const resumeUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Extract email from middleware
        const email = req.email;


        // Construct the correct file URL with the extension
        const fileUrl = req.file.path.includes("raw/upload") 
            ? `${req.file.path}` // Manually append `.pdf` for raw uploads
            : req.file.path;


       // Check if the user has an existing resume
       const existingResume = await findUserResumeByEmail(email);
       if (!existingResume) {
        // No resume found, insert a new record
        console.log("User resume does not exist, creating new entry...");
       } else {
        // Resume exists, updating the record
        console.log("Updating existing user resume...");
       }
       // Update or insert resume in UserResume collection
        await updateUserResume(email, fileUrl);

        res.json({
            message: "Resume uploaded and saved successfully",
            fileUrl: fileUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Upload process failed" });
    }
};

module.exports = {
    resumeUpload,
    getUserResume
};
