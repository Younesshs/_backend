const express = require("express");
const session = require("express-session");
const bodyparser = require("body-parser");
const cors = require("cors");
const vehicleRoutes = require("./_routes/vehicleRoutes");
const companyRoutes = require("./_routes/companyRoutes");
const locationRoutes = require("./_routes/locationRoutes");
const userRoutes = require("./_routes/userRoutes");
const serverInfo = require("./_config/config.js");
const connectDB = require("./_utils/db");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(bodyparser.json());

app.use(
	session({
		secret: "manage",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false }, // HTTPS
	})
);

app.use("/vehicle", vehicleRoutes);
app.use("/location", locationRoutes);
app.use("/company", companyRoutes);
app.use("/user", userRoutes);

app.listen(serverInfo.port.server, () => {
	console.log();
	console.info(
		"[SERVER] Server started on port " + serverInfo.port.server + " ..."
	);
	console.log();
});
