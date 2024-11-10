const express = require("express");
const router = express.Router();

const {
	getLocationsVehicleController,
	getLocationVehicleController,
	readFileController,
} = require("../_controllers/locationController/location");

router.get("/list/:gpsTrackerNumberList", getLocationsVehicleController);
router.get("/:gpsTrackerNumber", getLocationVehicleController);
router.get(
	"/readFile/:gpsTrackerNumber/:numberOfLocationHistories",
	readFileController
);

module.exports = router;
