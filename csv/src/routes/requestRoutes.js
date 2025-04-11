const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { extractEmail } = require("../middleware/authMiddleware");
const controller = require("../controllers/requestController");

router.post("/upload-placement", extractEmail, upload.single("file"), controller.uploadPlacementCSV);
router.post("/upload-students", extractEmail, upload.single("file"), controller.uploadStudentCSV);

module.exports = router;
