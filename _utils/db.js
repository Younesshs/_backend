const mongoose = require("mongoose");
require("dotenv").config({
	path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const connectDB = async () => {
	try {
		await mongoose.connect(
			`${process.env.db_server || "DB_SERVER_UNDEFINED"}://${
				process.env.db_user || "DB_USER_UNDEFINED"
			}:${process.env.db_password || "DB_PASSWORD_UNDEFINED"}@${
				process.env.db_host || "DB_HOST_UNDEFINED"
			}/${process.env.db_name || "DB_NAME_UNDEFINED"}`
		);
		console.log(
			'[MongoDB] Connected successfully on "' +
				`${process.env.db_server || "DB_SERVER_UNDEFINED"}://${
					process.env.db_user || "DB_USER_UNDEFINED"
				}:***********@${process.env.db_host || "DB_HOST_UNDEFINED"}/${
					process.env.db_name || "DB_NAME_UNDEFINED"
				}"`
		);
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
