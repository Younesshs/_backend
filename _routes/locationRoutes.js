const express = require("express");
const router = express.Router();

const {
	getLocationsVehicleController,
	getLocationVehicleController,
	readFile,
	writeFile,
	addInitialFile,
} = require("../_controllers/locationController/location");

router.get("/list/:gpsTrackerNumberList", getLocationsVehicleController);
router.get("/:gpsTrackerNumber", getLocationVehicleController);
router.get("/readFile/:gpsTrackerNumber/:numberOfLocationHistories", readFile);
router.post("/writeFile/:gpsTrackerNumber", writeFile);
router.post("/addInitialFile/:gpsTrackerNumber", addInitialFile);

module.exports = router;
