const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  createNotification
} = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getNotifications);
router.patch("/read", auth, markAsRead);
router.post("/", auth, createNotification);

module.exports = router;
