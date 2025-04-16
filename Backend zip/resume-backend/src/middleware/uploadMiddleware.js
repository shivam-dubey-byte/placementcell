const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
const path = require("path");

// Define storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "placement_uploads", // Change this to your preferred folder
        allowed_formats: ["pdf", "jpg", "png", "jpeg"], // Allowed file types  , "jpg", "png", "jpeg"
        resource_type: "raw", // Auto-detect file type
        public_id: `${path.parse(file.originalname).name}-${Date.now()}`, // Preserve filename
        //format: path.extname(file.originalname).substring(1), // Ensure extension is included
    }),
});

// Initialize multer
const upload = multer({ storage });

module.exports = upload;
