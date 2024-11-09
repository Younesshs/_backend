const express = require("express");
const router = express.Router();

const {
	getAllVehiclesController,
	addVehicleController,
	getVehiclesController,
	getVehicleController,
	updateVehicleController,
	removeVehicleController,
} = require("../_controllers/vehicleController/vehicle");

router.get("/", getAllVehiclesController);
router.post("/", addVehicleController);
router.get("/list/:vehicleIdsList", getVehiclesController);
router.get("/:vehicleId", getVehicleController);
router.put("/:vehicleId", updateVehicleController);
router.delete("/:vehicleId", removeVehicleController);

module.exports = router;
