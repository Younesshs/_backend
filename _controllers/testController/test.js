const testController = async (req, res) => {
	return res.status(201).json({
		response: true,
		message: "Test ok",
	});
};

module.exports = {
	testController,
};
