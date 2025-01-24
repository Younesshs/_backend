const userModel = require("../../_models/userModel");
const companyModel = require("../../_models/companyModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const serverInfo = require("../../_config/config");

const loginUserController = async (req, res) => {
	try {
		const { email, password, stayLogin } = req.body;

		// Vérification des paramètres
		if (!email || !password) {
			return res.status(400).json({
				response: false,
				errorType: "missing",
			});
		}

		// Recherche de l'utilisateur dans la base de données
		const user = await userModel.findOne({ email });

		// Si l'utilisateur n'existe pas
		if (!user) {
			return res.status(401).json({
				response: false,
				errorType: "user_not_found",
			});
		}

		// Vérification du mot de passe
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({
				response: false,
				errorType: "wrong",
			});
		}

		// Mise à jour du champ updatedAt
		user.updatedAt = new Date();
		await user.save();

		// Récupérer les données company avec le nom de l'entreprise
		const companyData = await companyModel.findOne({
			companyName: user.companyName,
		});

		if (!companyData) {
			return res.status(404).json({
				response: false,
				errorType: "company_not_found",
				message: "Entreprise non trouvée.",
			});
		}

		// Génération du token JWT
		const tokenPayload = {
			userId: user._id,
			lastname: user.lastname,
			firstname: user.firstname,
			role: user.role,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt, // Vous pouvez ajouter des propriétés spécifiques de l'utilisateur
		};

		const token = jwt.sign(tokenPayload, serverInfo.jwt.secret, {
			expiresIn: stayLogin ? "24h" : "2h", // Expiration du token (2 heures dans cet exemple)
		});

		// Si la connexion est réussie
		return res.status(200).json({
			response: true,
			message: "Connexion réussie !",
			token,
			tokenExpiration: stayLogin ? 86400000 : 7200000, // En ms (24 ou 2 heures)
			company: {
				companyIsConfirmed: companyData.isConfirmed,
				companyName: user.companyName,
			},
		});
	} catch (error) {
		console.error("Erreur lors de la connexion :", error);
		return res.status(500).json({
			response: false,
			message: "Erreur serveur",
			error: error.message,
		});
	}
};

const getUserController = async (req, res) => {};
const addUserController = async (req, res) => {};
const updateUserController = async (req, res) => {};
const removeUserController = async (req, res) => {};

module.exports = {
	loginUserController,
	getUserController,
	addUserController,
	updateUserController,
	removeUserController,
};
