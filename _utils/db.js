const mongoose = require("mongoose");
const serverInfo = require("../_config/config");

const connectDB = async () => {
	try {
		await mongoose.connect(
			`${serverInfo.db.server}://${serverInfo.db.user}:${serverInfo.db.password}@${serverInfo.db.host}/${serverInfo.db.database}`
		);
		console.log("[MongoDB] Connected successfully");
	} catch (err) {
		console.error("[Failed] to connect to MongoDB", err);
		process.exit(1);
	}
};

module.exports = connectDB;
