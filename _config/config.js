const serverInfo = {
	port: {
		server: process.env.PORT || 3000,
		database: process.env.DB_PORT || 3306,
	},
	db: {
		server: process.env.DB_SERVER || "mongodb+srv",
		host: process.env.DB_HOST || "locatethem.psh17.mongodb.net",
		user: process.env.DB_USER || "gormgaming31",
		password: process.env.DB_PASSWORD || "manager",
		database: process.env.DB_NAME || "new",
	},
	jwt: {
		secret: "manager",
	},
};

module.exports = serverInfo;
