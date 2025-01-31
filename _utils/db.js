const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
	try {
		await mongoose.connect(
			`${process.env.db_server}://${process.env.db_user}:${process.env.db_password}@${process.env.db_host}/${process.env.db_name}`
		);
		console.log("[MongoDB] Connected successfully");
		console.log("----------");
		console.log();
		console.log();
	} catch (err) {
		console.error("[Failed] to connect to MongoDB", err);
		console.log();
		process.exit(1);
	}
};

module.exports = connectDB;
