const { uploadResumeData, findUserResume, updateResume } = require("../models/userModel");
const { uploadResumeToCloudinary, deleteResumeFromCloudinary } = require("../utils/cloudinaryUtils");

// Upload Resume
const uploadResume = async (req, res) => {
  const { email } = req; // Extracted from the token
  const file = req.file; // Uploaded file

  try {
    // Upload the resume to Cloudinary
    const resumeUrl = await uploadResumeToCloudinary(file);

    // Save the resume URL in MongoDB
    const result = await uploadResumeData(email, resumeUrl);

    res.status(200).json({ message: "Resume uploaded successfully", url: resumeUrl });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Failed to upload resume" });
  }
};

// Update Resume
const handleUpdateResume = async (req, res) => {
  const { email } = req; // Extracted from the token
  const file = req.file; // New uploaded file

  try {
    // Find the user's existing resume
    const userResume = await findUserResume(email);

    if (userResume) {
      // Delete the old resume from Cloudinary
      await deleteResumeFromCloudinary(userResume.resume);
    }

    // Upload the new resume to Cloudinary
    const resumeUrl = await uploadResumeToCloudinary(file);

    // Update the resume URL in MongoDB
    const result = await updateResume(email, resumeUrl);

    res.status(200).json({ message: "Resume updated successfully", url: resumeUrl });
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