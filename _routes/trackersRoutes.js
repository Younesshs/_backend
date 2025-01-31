const express = require("express");
const router = express.Router();

const {
	activeGpsTrackerController,
	desactiveGpsTrackerController,
} = require("../_controllers/trackersController/trackers");

// Routes pour les trackers
router.post("/active", activeGpsTrackerController);
router.post("/desactive", desactiveGpsTrackerController);

module.exports = router;
