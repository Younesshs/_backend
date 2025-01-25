const fs = require("fs");
const path = require("path");

const getLocationsVehicleController = async (req, res) => {
	const gpsTrackerNumberList = req.params.gpsTrackerNumberList.split(",");

	try {
		const locationVehicles = await getLocationsVehicle(gpsTrackerNumberList);

		// Retourner une réponse avec les données des véhicules
		res.status(200).json(locationVehicles);
	} catch (error) {
		console.error("Erreur lors de la mise à jour du véhicule :", error);
		res.status(500).json({
			message: "Erreur serveur lors de la mise à jour du véhicule.",
		});
	}
};

async function getLocationsVehicle(gpsTrackerNumberList) {
	const locations = [];
	try {
		for (const gpsTrackerNumber of gpsTrackerNumberList) {
			const vehicleData = await readFile(gpsTrackerNumber, 5);
			locations.push(vehicleData);
		}
		return locations;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des localisations des véhicules :",
			error
		);
		throw new Error("Erreur lors de la récupération des localisations.");
	}
}

const getLocationVehicleController = async (req, res) => {
	const gpsTrackerNumber = req.params.gpsTrackerNumber;

	try {
		const locationVehicle = await getLocationVehicle(gpsTrackerNumber);

		// Retourner une réponse avec les données du véhicules
		res.status(200).json(locationVehicle);
	} catch (error) {
		console.error("Erreur lors de la mise à jour du véhicule :", error);
		res.status(500).json({
			message: "Erreur serveur lors de la mise à jour du véhicule.",
		});
	}
};

async function getLocationVehicle(gpsTrackerNumber) {
	try {
		// Obtenir les données de localisation pour un seul véhicule
		const vehicleData = await readFile(gpsTrackerNumber, 5);

		return vehicleData;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des données de localisation du véhicule :",
			error
		);
		return error.message;
	}
}

const readFileController = async (req, res) => {
	const gpsTrackerNumber = req.params.gpsTrackerNumber;
	const numberOfLocationHistories = Number(
		req.params.numberOfLocationHistories
	);

	try {
		const vehiclesData = await readFile(
			gpsTrackerNumber,
			numberOfLocationHistories
		);

		// Retourner une réponse avec les données des véhicules
		res.status(200).json(vehiclesData);
	} catch (error) {
		console.error("Erreur lors de la mise à jour des véhicule :", error);
		res.status(500).json({
			message: "Erreur serveur lors de la mise à jour du véhicule.",
		});
	}
};

async function readFile(gpsTrackerNumber, numberOfLocationHistories = 10) {
	const filePath = path.join(
		__dirname,
		"../../data/vehiclesLocations",
		gpsTrackerNumber + ".txt"
	);

	try {
		// Lire le fichier de façon asynchrone
		const data = await fs.promises.readFile(filePath, "utf-8");

		const lines = data.trim().split("\n");

		// Vérifier s'il y a des lignes dans le fichier
		if (lines.length === 0) {
			throw new Error(`No data found for tracker ${gpsTrackerNumber}`);
		}

		// Extraire la position actuelle (dernière ligne du fichier)
		const [lastLatitude, lastLongitude, lastTimestamp] = lines[lines.length - 1]
			.split(",")
			.map((val) => val.trim());

		// Initialiser la liste d’historique de localisation en partant de la fin du fichier
		const locationHistory = [];
		for (
			let i = lines.length - 1;
			i >= Math.max(0, lines.length - numberOfLocationHistories);
			i--
		) {
			const [latitude, longitude, timestamp] = lines[i]
				.split(",")
				.map((val) => val.trim());
			locationHistory.push({
				latitude: latitude,
				longitude: longitude,
				timestamp: new Date(timestamp),
			});
		}

		return {
			number: gpsTrackerNumber,
			lastLocation: {
				latitude: lastLatitude,
				longitude: lastLongitude,
				timestamp: new Date(lastTimestamp),
			},
			locationHistory,
		};
	} catch (error) {
		console.error(
			`Erreur lors de la lecture du fichier ${gpsTrackerNumber}:`,
			error
		);
		throw new Error(
			`Erreur lors de la lecture des données pour ${gpsTrackerNumber}.`
		);
	}
}

async function writeFile(gpsTrackerNumber, locations) {
	const filePath = path.join(
		__dirname,
		"../../data/vehiclesLocations",
		`${gpsTrackerNumber}.txt`
	);

	const lines = locations.map((location) => {
		const timestamp = new Date().toISOString(); // Horodatage au format ISO
		return `${location.latitude},${location.longitude},${timestamp}`;
	});

	try {
		// Écriture des lignes de coordonnées dans le fichier en ajout
		await fs.promises.appendFile(filePath, lines.join("\n") + "\n", "utf-8");
		console.info(`Coordonnées ajoutées pour le tracker ${gpsTrackerNumber}`);
	} catch (error) {
		console.error(
			`Erreur lors de l'écriture dans le fichier ${gpsTrackerNumber}:`,
			error
		);
		throw new Error(
			`Erreur lors de l'ajout des données pour ${gpsTrackerNumber}.`
		);
	}
}

async function archiveFile(gpsTrackerNumber) {
	// Définir le chemin actuel du fichier
	const sourceFilePath = path.join(
		__dirname,
		"../../data/vehiclesLocations",
		`${gpsTrackerNumber}.txt`
	);

	// Définir le chemin du dossier d'archive
	const archiveDirPath = path.join(
		__dirname,
		"../../data/vehiclesLocations/_archive"
	);

	// Vérifier si le dossier d'archive existe, sinon le créer
	try {
		await fs.promises.access(archiveDirPath, fs.constants.F_OK);
	} catch (error) {
		if (error.code === "ENOENT") {
			// Créer le dossier d'archive
			await fs.promises.mkdir(archiveDirPath, { recursive: true });
		} else {
			console.error(`Erreur lors de l'accès au dossier d'archive:`, error);
			throw new Error("Erreur lors de la création du dossier d'archive.");
		}
	}

	// Créer un nom de fichier unique avec horodatage pour éviter les doublons
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	const archiveFilePath = path.join(
		archiveDirPath,
		`${gpsTrackerNumber}_${timestamp}.txt`
	);

	// Déplacer le fichier vers le dossier d'archive
	try {
		await fs.promises.rename(sourceFilePath, archiveFilePath);
		console.info(`Fichier archivé pour le tracker ${gpsTrackerNumber}`);
	} catch (error) {
		console.error(
			`Erreur lors de l'archivage du fichier ${gpsTrackerNumber}:`,
			error
		);
		throw new Error(
			`Erreur lors de l'archivage du fichier pour ${gpsTrackerNumber}.`
		);
	}
}

async function addInitialFile(gpsTrackerNumber, initialLocation) {
	const filePath = path.join(
		__dirname,
		"../../data/vehiclesLocations",
		`${gpsTrackerNumber}.txt`
	);

	const initialLine = `${initialLocation.latitude},${initialLocation.longitude},${initialLocation.timestampISO}`;

	try {
		// Vérifie si le fichier existe déjà
		await fs.promises.access(filePath, fs.constants.F_OK);
		console.info(`Le fichier ${gpsTrackerNumber} existe déjà.`);
	} catch (error) {
		if (error.code === "ENOENT") {
			// Le fichier n'existe pas, le créer avec la ligne initiale
			try {
				await fs.promises.writeFile(filePath, initialLine + "\n", "utf-8");
				console.info(
					`Fichier initial créé pour le tracker ${gpsTrackerNumber}`
				);
			} catch (writeError) {
				console.error(
					`Erreur lors de la création du fichier ${gpsTrackerNumber}:`,
					writeError
				);
				throw new Error(
					`Erreur lors de l'initialisation du fichier pour ${gpsTrackerNumber}.`
				);
			}
		} else {
			console.error(
				`Erreur lors de l'accès au fichier ${gpsTrackerNumber}:`,
				error
			);
			throw new Error(`Erreur d'accès pour le fichier de ${gpsTrackerNumber}.`);
		}
	}
}

module.exports = {
	getLocationsVehicleController,
	getLocationsVehicle,
	getLocationVehicleController,
	getLocationVehicle,
	readFileController,
	readFile,
	writeFile,
	archiveFile,
	addInitialFile,
};
