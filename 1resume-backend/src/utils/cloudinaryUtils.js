const cloudinary = require("../config/cloudinaryConfig");

const uploadResumeToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "resumes", // Optional: Organize files into a folder
    resource_type: "auto", // Automatically detect file type (PDF, DOCX, etc.)
  });
  return result.secure_url; // Returns the publicly accessible URL
};

const deleteResumeFromCloudinary = async (fileUrl) => {
  const publicId = fileUrl.split("/").pop().split(".")[0]; // Extract public ID from URL
  await cloudinary.uploader.destroy(`resumes/${publicId}`);
};

module.exports = { uploadResumeToCloudinary, deleteResumeFromCloudinary };