const userModel = require("../../_models/userModel");
const bcrypt = require("bcrypt");

const getUserController = async (req, res) => {
	try {
		const userId = req.params.id;
		if (userId) {
			// Récupérer un utilisateur spécifique
			const user = await userModel.findById(userId);
			if (!user) {
				return res.status(404).json({ message: "Utilisateur non trouvé" });
			}
			return res.status(200).json(user);
		} else {
			// Récupérer tous les utilisateurs
			const users = await userModel.find();
			return res.status(200).json(users);
		}
	} catch (error) {
		console.error("Erreur lors de la récupération des utilisateurs :", error);
		return res.status(500).json({ message: "Erreur serveur", error });
	}
};

// TODO: APRES DEV ADD COMPANY GERER LA CREATION D'UN COMPTE ADMIN
const addUserController = async (req, res) => {
	try {
		const { email, firstname, lastname, pseudonyme, sexe, password, company } =
			req.body;

		if (
			(!company, !email, !firstname, !lastname, !pseudonyme, !sexe, !password)
		) {
			return res
				.status(400)
				.json({ message: "Champs obligatoires manquant !" });
		}

		const configurations = {
			theme: "light",
			language: "fr",
			timeAutoReload: true,
		};

		// Vérification si l'utilisateur existe déjà
		const existingUser = await userModel.findOne({ firstname });
		if (existingUser) {
			return res
				.status(409)
				.json({ message: "Cette utilisateur existe déja !" });
		}

		// Hash du mot de passe
		const hashedPassword = await bcrypt.hash(password, 10);

		const role = "admin";

		// Création d'un nouvel utilisateur
		const newUser = new userModel({
			email,
			configurations,
			firstname,
			lastname,
			pseudonyme,
			sexe,
			password: hashedPassword,
			company,
			role,
		});

		await newUser.save();

		return res
			.status(201)
			.json({ message: "Utilisateur créé avec succès", user: newUser });
	} catch (error) {
		console.error("Erreur lors de l'ajout de l'utilisateur :", error);
		return res.status(500).json({ message: "Erreur serveur", error });
	}
};

const updateUserController = async (req, res) => {
	try {
		const userId = req.params.id;
		const updateData = req.body;

		if (!userId) {
			return res.status(400).json({ message: "ID utilisateur manquant" });
		}

		const updatedUser = await userModel.findByIdAndUpdate(
			userId,
			{ ...updateData, updatedAt: new Date() },
			{ new: true, runValidators: true } // Retourne le document mis à jour et applique les validateurs
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}

		return res.status(200).json({
			message: "Utilisateur mis à jour avec succès",
			user: updatedUser,
		});
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
		return res.status(500).json({ message: "Erreur serveur", error });
	}
};

const removeUserController = async (req, res) => {
	try {
		const userId = req.params.id;

		if (!userId) {
			return res.status(400).json({ message: "ID utilisateur manquant" });
		}

		const deletedUser = await userModel.findByIdAndDelete(userId);

		if (!deletedUser) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}

		return res
			.status(200)
			.json({ message: "Utilisateur supprimé avec succès", user: deletedUser });
	} catch (error) {
		console.error("Erreur lors de la suppression de l'utilisateur :", error);
		return res.status(500).json({ message: "Erreur serveur", error });
	}
};

module.exports = {
	getUserController,
	addUserController,
	updateUserController,
	removeUserController,
};
