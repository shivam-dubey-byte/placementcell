const express = require("express");
const router = express.Router();
const { extractEmail } = require("../middleware/authMiddleware");
const { sendEmails, sendSingleEmail } = require("../controllers/sendMailController");

router.post("/sendEmails", extractEmail, sendEmails);
router.post("/sendEmail", extractEmail, sendSingleEmail);

module.exports = router;
