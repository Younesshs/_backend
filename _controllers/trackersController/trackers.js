const activeGpsTrackerController = async (req, res) => {
	console.log("request", req);
	return res.status(200).json({
		response: true,
		message: "Activation gps du tracker '1245667886445' !",
	});
};

const desactiveGpsTrackerController = async (req, res) => {
	console.log("request", req);
	return res.status(200).json({
		response: true,
		message: "Désactivation gps du tracker '1245667886445' !",
	});
};

module.exports = {
	activeGpsTrackerController,
	desactiveGpsTrackerController,
};
