require("dotenv").config({
	path: ".env",
});

const express = require("express");
const session = require("express-session");
const bodyparser = require("body-parser");
const cors = require("cors");
const vehicleRoutes = require("./_routes/vehicleRoutes");
const companyRoutes = require("./_routes/companyRoutes");
const locationRoutes = require("./_routes/locationRoutes");
const testsRoutes = require("./_routes/testsRoutes");
const userRoutes = require("./_routes/userRoutes");
const connectDB = require("./_utils/db");
const dgram = require("dgram"); // UDP library
const fs = require("fs"); // File system to log data
const path = require("path");
const trackersRoutes = require("./_routes/trackersRoutes");
const udpServer = dgram.createSocket("udp4");
const app = express();

// Connect server udp
// Gestion des données reçues
udpServer.on("message", (message, remote) => {
	// Décodage et traitement des données
	const data = message.toString();
	const parts = data.split(",");
	const imei = parts[0].split(":")[1];
	const latitude = parts[5];
	const longitude = parts[7];
	const speed = parts[9];

	console.log(
		`Données reçues de ${remote.address}:${remote.port} - ${message}`
	);
	console.log(`Données brutes : ${data}`);
	console.log(
		`IMEI: ${imei}, Latitude: ${latitude}, Longitude: ${longitude}, Vitesse: ${speed}`
	);

	const timestamp = new Date().toISOString();
	const dataLine = `${longitude},${latitude},${timestamp}`;

	console.log(`Ligne de données pour fichier`, dataLine);

	const folderPath = "../_backend/data/vehiclesLocations/";
	const filePath = path.join(folderPath, `${imei}.txt`);

	// Vérifier si le dossier existe, sinon le créer
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true });
	}

	// Écrire ou ajouter les données dans le fichier
	fs.appendFile(filePath, dataLine, (err) => {
		if (err) {
			console.error(`Erreur lors de l'écriture des données trackers : ${err}`);
		} else {
			console.log(`Ecriture des données réussie pour le tracker IMEI: ${imei}`);
		}
	});
});

// Gestion des erreurs du serveur UDP
udpServer.on("error", (err) => {
	console.error(`Erreur du serveur UDP: ${err.message}`);
	udpServer.close();
});

// Démarrer le serveur UDP
udpServer.bind(
	process.env.PORT_UDP || 8080,
	process.env.HOST_UDP || "0.0.0.0",
	() => {
		const now = new Date();
		console.log("######", now.toTimeString().split(" ")[0]); // afficher la date hh:mm:ss
		console.log(
			`[SERVER] UDP Server started on ${
				process.env.HOST_UDP || "HOST_UDP_UNDEFINED"
			}:${process.env.PORT_UDP || "PORT_UDP_UNDEFINED"}`
		);
	}
);

// Connect to MongoDB
connectDB();

// Connect express server

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
app.use("/trackers", trackersRoutes);
app.use("/tests", testsRoutes);

app.listen(process.env.PORT || 3000, () => {
	console.info(
		"[SERVER] Server (locate-them) started on port " + process.env.PORT ||
			"PORT_UNDEFINED" + " ..."
	);
});
