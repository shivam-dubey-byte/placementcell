const {
    addToActiveRequest,
    fetchFromActiveRequest,
    removeFromActiveRequest,
    addToHistory,
    fetchFromHistory,
    findUserResumeByEmail,
    updateUserResume
} = require('../models/requestModel.js');

const upload = require("../middleware/uploadMiddleware");
const {googleFormRequest} = require('../utils/googleform');



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

// Add data to ActiveRequest (email from token)
const addActiveRequest = async (req, res) => {
    console.log(req.email);
    const email = req.email; // Email extracted from token
    const { message, noc = "NUL", lor = "NUL", fileUrl } = req.body;
    const file = noc !== "NUL" ? 'noc' : 'lor';
    try {
        await googleFormRequest(file,email,message);
        const newRequest = await addToActiveRequest(email, message, noc, lor,fileUrl);
        await addToHistory(email, message, noc, lor,fileUrl);
        res.status(201).json({ message: 'Data added to ActiveRequest', request: newRequest });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Fetch data from ActiveRequest (email from body)
const getActiveRequest = async (req, res) => {
    const { email, page = 0, limit = 5 } = req.body;

    try {
        const data = await fetchFromActiveRequest(email, parseInt(page), parseInt(limit));
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Remove data from ActiveRequest (email from body)
const deleteActiveRequest = async (req, res) => {
    const { email, field } = req.body;

    try {
        const result = await removeFromActiveRequest(email, field);
        res.status(200).json({ message: 'Data removed from ActiveRequest', result });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Add data to History (email from token) Not being used just made for emergency
const addHistory = async (req, res) => {
    const email = req.user; // Email extracted from token
    const { message, noc = "NUL", lor = "NUL", time } = req.body;
    const role = req.role;
    try {
        if(role=='admin'){
        const newHistory = await addToHistory(email, message, noc, lor, time);
        res.status(201).json({ message: 'Data added to History', history: newHistory });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}; 

// Fetch data from History (email from body)
const getHistory = async (req, res) => {
    const { email, page = 0, limit = 5 } = req.body;

    try {
        const data = await fetchFromHistory(email, parseInt(page), parseInt(limit));
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    addActiveRequest,
    getActiveRequest,
    deleteActiveRequest,
    addHistory,
    getHistory,
    resumeUpload,
    getUserResume
};
