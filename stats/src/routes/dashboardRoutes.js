const express = require("express");
const router = express.Router();
const { extractEmail } = require("../middleware/authMiddleware");
const controller = require("../controllers/dashboardController");

router.get("/trends", extractEmail, controller.getPlacementTrends);
router.get("/current-year-stats", extractEmail, controller.getCurrentYearStats);
router.get("/offers-vs-placements", extractEmail, controller.getOffersVsPlacements);

module.exports = router;