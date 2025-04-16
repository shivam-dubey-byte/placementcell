const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");
const {extractEmail} = require("../middleware/authMiddleware");


router.post("/students/filter", extractEmail, controller.getStudentFilter);
router.post("/placements/filter", extractEmail, controller.getOfferFilter);
router.post("/recruiters/filter", extractEmail, controller.getPlacementFilter);
router.post("/pacementtrend/filter", extractEmail, controller.getPlacementTrendFilter);
router.post("/companies/filter", extractEmail, controller.getCompaniesFilter)

module.exports = router;
