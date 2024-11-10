const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const VehicleModel = require("./_models/vehicleModel");
const serverInfo = require("./_config/config");

// Connexion à la base de données MongoDB avec Mongoose
const uri = `${serverInfo.db.server}://${serverInfo.db.user}:${serverInfo.db.password}@${serverInfo.db.host}/${serverInfo.db.database}`;
mongoose
	.connect(uri)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch((error) => console.error("Erreur de connexion à MongoDB :", error));

const locationDir = path.join(__dirname, "data/vehiclesLocations");
const intervalInMs = 10000; // Intervalle de 5 secondes

// Fonction pour générer une position GPS aléatoire autour d'un point de référence
function generateRandomPosition(lat, lon) {
	lat = Number(lat);
	lon = Number(lon);

	const latOffset = (Math.random() - 0.5) / 10000;
	const lonOffset = (Math.random() - 0.5) / 10000;

	return {
		latitude: lat + latOffset,
		longitude: lon + lonOffset,
	};
}

// Fonction pour mettre à jour le fichier de localisation
function updateLocationFile(trackerNumber, position) {
	const filePath = path.join(locationDir, `${trackerNumber}.txt`);
	const timestamp = new Date().toISOString();
	const data = `${position.latitude}, ${position.longitude}, ${timestamp}\n`;

	fs.appendFile(filePath, data, (err) => {
		if (err) {
			console.error(
				`Erreur lors de la mise à jour du fichier pour le tracker ${trackerNumber}:`,
				err
			);
		}
	});
}

// Fonction principale pour simuler les mises à jour de localisation
async function simulateGPSUpdates() {
	try {
		// Récupère les véhicules depuis la base de données
		const vehicles = await VehicleModel.find({});

		// Parcours chaque véhicule pour générer et sauvegarder une nouvelle position
		vehicles.forEach((vehicle) => {
			// Vérifie si autoGpsEnabled est activé
			if (vehicle.options && vehicle.options.autoGpsEnabled) {
				const trackerNumber = vehicle.gpsTracker.number;
				const lastLocation =
					vehicle.gpsTracker.lastLocation || vehicle.gpsTracker.initialLocation;

				if (lastLocation) {
					// Générer une nouvelle position aléatoire autour de la dernière position connue
					const newPosition = generateRandomPosition(
						lastLocation.latitude,
						lastLocation.longitude
					);
					// Mettre à jour le fichier de localisation
					updateLocationFile(trackerNumber, newPosition);
				} else {
					console.error(
						`Pas de localisation initiale pour le véhicule avec le tracker ${trackerNumber}`
					);
				}
			}
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des véhicules :", error);
	}
}

// Lancer la simulation en répétant l'opération à intervalles réguliers
setInterval(simulateGPSUpdates, intervalInMs);
