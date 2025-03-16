const fs = require("fs");
const path = require("path");
const { uploadResumeData, findUserResume, updateResume } = require("../models/userModel");

// Directory to store uploaded files
const uploadDir = path.join(__dirname, "../uploads");

// Make sure the "uploads" folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create the folder if it doesn't exist
}

// Upload Resume
const uploadResume = async (req, res) => {
  const { email } = req; // Extracted from the token
  const file = req.file; // Uploaded file

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Save the file locally
    const fileName = `${Date.now()}-${file.originalname}`; // Unique filename
    const filePath = path.join(uploadDir, fileName); // Full path to save the file

    console.log("Saving file to:", filePath); // Debug: Check where the file is being saved

    fs.writeFileSync(filePath, file.buffer); // Save the file

    // Generate a local URL for the file
    const fileUrl = `http://localhost:3000/uploads/${fileName}`;

    // Save the file URL in MongoDB
    await uploadResumeData(email, fileUrl);

    res.status(200).json({ message: "Resume uploaded successfully", url: fileUrl });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Failed to upload resume" });
  }
};

// Update Resume
const handleUpdateResume = async (req, res) => {
  const { email } = req; // Extracted from the token
  const file = req.file; // New uploaded file

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Find the user's existing resume
    const userResume = await findUserResume(email);

    if (userResume) {
      // Delete the old resume file from local storage
      const oldFileName = userResume.resume.split("/").pop();
      const oldFilePath = path.join(uploadDir, oldFileName);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Save the new file locally
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    // Generate a local URL for the new file
    const fileUrl = `http://localhost:3000/uploads/${fileName}`;

    // Update the resume URL in MongoDB
    await updateResume(email, fileUrl);

    res.status(200).json({ message: "Resume updated successfully", url: fileUrl });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ message: "Failed to update resume" });
  }
};

// Get Resume
const getResume = async (req, res) => {
  const { email } = req; // Extracted from the token

  try {
    // Find the user's resume in MongoDB
    const userResume = await findUserResume(email);

    if (!userResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ resumeUrl: userResume.resume });
  } catch (error) {
    console.error("Error retrieving resume:", error);
    res.status(500).json({ message: "Failed to retrieve resume" });
  }
};

module.exports = { uploadResume, handleUpdateResume, getResume };