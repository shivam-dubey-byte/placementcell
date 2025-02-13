const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

let currentResume = null; // Store the current resume (for demo purposes)

// Upload resume endpoint
app.post("/api/upload-resume", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Delete the previous resume (if any)
  if (currentResume) {
    fs.unlinkSync(currentResume.path);
  }

  // Save the new resume
  currentResume = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    path: req.file.path,
    url: `/uploads/${req.file.filename}`, // Public URL for the file
  };

  res.status(200).json({ message: "File uploaded successfully!", resumeUrl: currentResume.url });
});

// Get resume endpoint
app.get("/api/get-resume", (req, res) => {
  if (currentResume) {
    res.status(200).json({ resumeUrl: currentResume.url });
  } else {
    res.status(404).json({ message: "No resume found." });
  }
});

// Delete resume endpoint
app.delete("/api/delete-resume", (req, res) => {
  if (currentResume) {
    fs.unlinkSync(currentResume.path);
    currentResume = null;
    res.status(200).json({ message: "Resume deleted successfully!" });
  } else {
    res.status(404).json({ message: "No resume found." });
  }
});

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});