const express = require("express");
const router = express.Router();
//const { extractEmail } = require("../middleware/authMiddleware");
const { extractEmail } = require("../middleware/authMiddleware");
const {
    addActiveRequest,
    getActiveRequest,
    deleteActiveRequest,
    addHistory,
    getHistory
} = require("../controllers/requestController");

// ActiveRequest Routes
router.post("/active-request", extractEmail, addActiveRequest); // Email from token
router.get("/active-request", extractEmail, getActiveRequest); // Email from body
router.delete("/active-request", extractEmail, deleteActiveRequest); // Email from body

// History Routes
router.post("/history", extractEmail, addHistory); // Email from token
router.get("/history", extractEmail, getHistory); // Email from body

module.exports = router;
