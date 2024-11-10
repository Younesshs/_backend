const mongoose = require("mongoose");
const VehicleModel = require("../../_models/vehicleModel");
const ArchivedVehicleModel = require("../../_models/archivedVehicleModel");
const locationsController = require("../locationController/location");

/**
 * Fonction getAllVehicles()
 *
 * Récupère toutes les informations des véhicules depuis la base de données MongoDB
 * et y ajoute les informations de localisation GPS actuelles pour chaque véhicule.
 *
 * @returns {Object[]} Liste des véhicules avec leurs informations et localisations
 */
const getAllVehiclesController = async (req, res) => {
	try {
		const vehicles = await VehicleModel.find({});

		const gpsTrackerNumberList = vehicles.map(
			(vehicle) => vehicle.gpsTracker.number
		);

		// Récupère les localisations pour chaque numéro de tracker via locationOfVehicleController
		const locations = await locationsController.getLocationsVehicleController(
			gpsTrackerNumberList
		);

		// Intègre les informations de localisation dans les données des véhicules
		const vehiclesWithLocations = vehicles.map((vehicle) => {
			const vehicleLocation = locations.find(
				(location) => location.gpsTrackerNumber === vehicle.gpsTracker.number
			);

			return {
				...vehicle.toObject(),
				gpsTracker: {
					...vehicle.gpsTracker,
					locationHistory: vehicleLocation
						? vehicleLocation.locationHistory
						: [],
				},
				vehicleStatus: {
					...vehicle.vehicleStatus,
					lastLocation: vehicleLocation ? vehicleLocation.lastLocation : null,
				},
			};
		});

		res.status(200).json(vehiclesWithLocations);
	} catch (error) {
		console.error("Erreur lors de la récupération des véhicules :", error);
		res.status(500).json({
			message: "Erreur serveur lors de la récupération des véhicules.",
		});
	}
};

/**
 * Fonction getVehiclesController()
 *
 * Récupère une liste de véhicules en fonction de leurs identifiants et y ajoute
 * les informations de localisation GPS actuelles pour chaque véhicule.
 *
 * @param {Array} req.params.vehicleIdsList Liste des identifiants des véhicules à récupérer
 * @returns {Object[]} Liste des véhicules avec leurs informations et localisations
 */
const getVehiclesController = async (req, res) => {
	try {
		const vehicleIdsList = req.params.vehicleIdsList.split(",").map((id) => {
			return new mongoose.Types.ObjectId(id);
		});

		const vehicles = await VehicleModel.find({ _id: { $in: vehicleIdsList } });

		const gpsTrackerNumbers = vehicles.map(
			(vehicle) => vehicle.gpsTracker.number
		);

		// Récupération des informations de localisation pour chaque tracker
		const locations = await locationsController.getLocationsVehicleController(
			gpsTrackerNumbers
		);

		// Ajout de la localisation actuelle à chaque véhicule
		const vehiclesWithLocations = vehicles.map((vehicle) => {
			const vehicleLocation = locations.find(
				(location) => location.gpsTrackerNumber === vehicle.gpsTracker.number
			);

			return {
				...vehicle.toObject(),
				gpsTracker: {
					...vehicle.gpsTracker,
					locationHistory: vehicleLocation
						? vehicleLocation.locationHistory
						: [],
				},
				vehicleStatus: {
					...vehicle.vehicleStatus,
					lastLocation: vehicleLocation ? vehicleLocation.lastLocation : null,
				},
			};
		});

		res.status(200).json(vehiclesWithLocations);
	} catch (error) {
		console.error("Erreur lors de la récupération des véhicules :", error);
		res.status(500).json({
			message: "Erreur serveur lors de la récupération des véhicules.",
		});
	}
};

/**
 * Fonction getVehicleController()
 *
 * Récupère les informations d'un véhicule spécifique en fonction de son identifiant
 * et y ajoute les informations de localisation GPS actuelles pour ce véhicule.
 *
 * @param {String} req.params.vehicleId Identifiant du véhicule à récupérer
 * @returns {Object} Informations complètes du véhicule avec sa localisation actuelle et son historique de localisation
 */
const getVehicleController = async (req, res) => {
	try {
		const vehicleId = new mongoose.Types.ObjectId(req.params.vehicleId);

		// Récupérer le véhicule depuis la base de données
		const vehicle = await VehicleModel.findById(vehicleId);
		if (!vehicle) {
			return res.status(404).json({
				message: "Véhicule non trouvé.",
			});
		}

		// Récupérer le numéro du tracker GPS associé au véhicule
		const gpsTrackerNumber = vehicle.gpsTracker.number;

		// Obtenir la localisation du véhicule via le contrôleur de localisation
		const locations = await locationsController.getLocationVehicleController(
			gpsTrackerNumber
		);

		// Extraire la localisation actuelle et l'historique du véhicule
		const vehicleLocation =
			locations.gpsTrackerNumber === gpsTrackerNumber ? locations : null;

		// Ajouter les informations de localisation au véhicule
		const vehicleWithLocation = {
			...vehicle.toObject(),
			gpsTracker: {
				...vehicle.gpsTracker,
				locationHistory: vehicleLocation ? vehicleLocation.locationHistory : [],
			},
			vehicleStatus: {
				...vehicle.vehicleStatus,
				lastLocation: vehicleLocation ? vehicleLocation.lastLocation : null,
			},
		};

		// Retourner la réponse avec les données du véhicule et ses informations de localisation
		res.status(200).json(vehicleWithLocation);
	} catch (error) {
		console.error("Erreur lors de la récupération du véhicule :", error);
		res.status(500).json({
			message: "Erreur serveur lors de la récupération du véhicule.",
		});
	}
};

/**
 * Fonction addVehicleController()
 *
 * Ajoute un nouveau véhicule à la base de données MongoDB en utilisant les informations
 * fournies dans le corps de la requête.
 *
 * @param {Object} req.body - Informations du nouveau véhicule à ajouter
 * @returns {Object} Message confirmant l'ajout du véhicule ou un message d'erreur
 */
const addVehicleController = async (req, res) => {
	try {
		const vehicleData = req.body;

		// Créer une nouvelle instance du modèle de véhicule avec les données fournies
		let newVehicle = new VehicleModel(vehicleData);

		const timestampISO = new Date().toISOString(); // Horodatage au format ISO
		newVehicle.gpsTracker.lastLocation = {
			latitude: newVehicle.gpsTracker.initialLocation.latitude,
			longitude: newVehicle.gpsTracker.initialLocation.longitude,
			timestamp: timestampISO,
		};

		// Sauvegarder le nouveau véhicule dans la base de données
		const savedVehicle = await newVehicle.save();

		// Vérifier si une localisation initiale est fournie pour créer le fichier de localisation
		if (vehicleData.gpsTracker.initialLocation) {
			const { latitude, longitude } = vehicleData.gpsTracker.initialLocation;
			const gpsTrackerNumber = savedVehicle.gpsTracker.number;

			await locationsController.addInitialFile(gpsTrackerNumber, {
				latitude,
				longitude,
				timestampISO,
			});
		}

		res.status(201).json({
			message: "Véhicule ajouté avec succès !",
		});
	} catch (error) {
		console.error("Erreur lors de l'ajout du véhicule :", error);
		res.status(500).json({
			message: "Erreur serveur lors de l'ajout du véhicule.",
		});
	}
};

/**
 * Fonction updateVehicleController()
 *
 * Description
 *
 * @param {String} req.params.vehicleId - Identifiant du véhicule à mettre à jour
 * @param {Object} req.body - Nouvelles informations du véhicule
 * @returns {Object} Message confirmant la mise à jour réussie ou un message d'erreur
 */
const updateVehicleController = async (req, res) => {
	const vehicleId = req.params.vehicleId;
	const newVehicleData = req.body;
	try {
		await updateVehicle(vehicleId, newVehicleData);

		// Retourner une réponse avec les nouvelles données du véhicule
		res.status(200).json({
			message: "Véhicule mis à jour avec succès !",
		});
	} catch (error) {
		console.error("Erreur lors de la mise à jour du véhicule :", error);
		res.status(500).json({
			message: "Erreur serveur lors de la mise à jour du véhicule.",
		});
	}
};

async function updateVehicle(vehicleId, newVehicleData) {
	// Mettre à jour les informations du véhicule dans la base de données
	const updatedVehicle = await VehicleModel.findByIdAndUpdate(
		vehicleId,
		newVehicleData,
		{ new: true }
	);

	// Vérifier si le véhicule existe
	if (!updatedVehicle) {
		return res.status(404).json({
			message: "Véhicule non trouvé.",
		});
	}
}

/**
 * Fonction removeVehicleController()
 *
 * Supprime un véhicule spécifique de la base de données en fonction de son identifiant.
 *
 * @param {String} req.params.vehicleId - Identifiant du véhicule à supprimer
 * @returns {Object} Message confirmant la suppression réussie ou un message d'erreur
 */
const removeVehicleController = async (req, res) => {
	try {
		const vehicleId = new mongoose.Types.ObjectId(req.params.vehicleId);

		// Récupérer le véhicule depuis la base de données
		const vehicle = await VehicleModel.findById(vehicleId);

		// Achivage du fichier de localisation
		const archivedFile = locationsController.archiveFile(
			vehicle.gpsTracker.number
		);

		// Créer une nouvelle instance pour le véhicule archivé, sans l'ID
		const vehicleData = vehicle.toObject();
		delete vehicleData._id;
		const newArchivedVehicle = new ArchivedVehicleModel(vehicleData);

		const archivedVehicle = await newArchivedVehicle.save();

		if (archivedVehicle) {
			if (vehicle) {
				// Supprimer le véhicule de la base de données
				const deletedVehicle = await VehicleModel.findByIdAndDelete(vehicleId);

				// Vérifier si le véhicule existe
				if (!deletedVehicle) {
					return res.status(404).json({
						message: "Véhicule non trouvé.",
					});
				}

				res.status(200).json({
					message: "Véhicule supprimé avec succès !",
				});
			} else {
				console.error("Erreur lors de la récupération du véhicule");
			}
		} else {
			console.error("Erreur lors de l'archivement du véhicule");
		}
	} catch (error) {
		console.error("Erreur lors de la suppression du véhicule :", error);
		res.status(500).json({
			message: "Erreur serveur lors de la suppression du véhicule.",
		});
	}
};

module.exports = {
	getAllVehiclesController,
	getVehiclesController,
	getVehicleController,
	addVehicleController,
	updateVehicleController,
	updateVehicle,
	removeVehicleController,
};
