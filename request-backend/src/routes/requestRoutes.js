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
router.get("/active-request", getActiveRequest); // Email from body
//router.delete("/active-request", deleteActiveRequest); // Email from body

// History Routes
//router.post("/history", extractEmail, addHistory); // Email from token
//router.get("/history", getHistory); // Email from body

module.exports = router;
