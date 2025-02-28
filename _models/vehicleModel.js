const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, auto: true },
	navigation: {
		showDetails: { type: Boolean, default: false },
	},
	options: {
		autoGpsEnabled: { type: Boolean, default: false },
	},
	gpsTracker: {
		number: { type: String, required: true },
		initialLocation: {
			latitude: { type: String, required: true },
			longitude: { type: String, required: true },
		},
		lastLocation: {
			latitude: { type: String, required: false },
			longitude: { type: String, required: false },
			timestamp: { type: Date, required: false },
		},
	},
	vehicleInformations: {
		licensePlate: { type: String, required: true },
		year: { type: Number, required: true },
		capacity: { type: Number, required: true },
		color: { type: String, required: true },
		manufacturer: { type: String, required: true },
		model: { type: String, required: true },
	},
	assignedEmployee: {
		id: { type: Number, required: true },
		name: { type: String, required: true },
		role: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		email: { type: String, required: true },
	},
	vehicleStatus: {
		engineOn: { type: Boolean, default: false },
	},
	companyInformations: {
		id: { type: String, required: true },
	},
});

const VehicleModel = mongoose.model("vehicle", vehicleSchema);

module.exports = VehicleModel;
