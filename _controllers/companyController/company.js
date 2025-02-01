const companyModel = require("../../_models/companyModel");
const userModel = require("../../_models/userModel");
const archivedCompanyModel = require("../../_models/archivedCompanyModel");
const archivedUserModel = require("../../_models/archivedUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({
	path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const regeneratePassword = async (companyName) => {
	const timestamp = Math.floor(Date.now() / 1000); // Horodatage en secondes
	const tempPassword = `${companyName}-${timestamp}`;

	// Hash du mot de passe temporaire
	const hashedPassword = await bcrypt.hash(tempPassword, 10);

	return { tempPassword, hashedPassword };
};

const newCompanyController = async (req, res) => {
	try {
		let { companyName } = req.body;

		if (!companyName) {
			return res.status(400).json({
				response: false,
				errorType: "missing",
				message: "Champs obligatoires manquant !",
			});
		} else {
			companyNameForPassword = companyName.toLowerCase().replace(/\s+/g, "");
		}

		// Check if the company already exists
		const existingCompany = await companyModel.findOne({ companyName });
		if (existingCompany) {
			return res.status(400).json({
				response: false,
				errorType: "exist_company",
				message: "La société existe déjà !",
			});
		}

		// Check if the user already exists
		const existingUser = await userModel.findOne({ companyName });
		if (existingUser) {
			return res.status(400).json({
				response: false,
				errorType: "exist_user",
				message: "User existe déjà !",
			});
		}

		// Génération d'un mot de passe temporaire unique
		const timestamp = Math.floor(Date.now() / 1000); // Horodatage en secondes
		const tempPassword = `${companyNameForPassword}-${timestamp}`;

		// Hash du mot de passe temporaire
		const hashedPassword = await bcrypt.hash(tempPassword, 10);

		// Create a new user with the same password as the company
		const newUser = new userModel({
			email: null,
			firstname: null,
			lastname: null,
			pseudonyme: null,
			gender: null,
			phone: null,
			address: null,
			password: hashedPassword,
			companyName: companyName,
			role: "admin",
		});

		// Create a new company
		const newCompany = new companyModel({
			companyName,
			siret: null,
			password: hashedPassword,
			userId: newUser._id,
		});

		// Save the user to the database
		const savedUser = await newUser.save();

		// Save the company to the database
		const savedCompany = await newCompany.save();

		// Update the company with the userId
		savedCompany.userId = savedUser._id;
		await savedCompany.save();

		// Modify the password variable to send front
		savedCompany.password = tempPassword;

		return res.status(201).json({
			response: true,
			message: "Entreprise et utilisateur créés avec succès",
			company: savedCompany,
			user: savedUser,
		});
	} catch (error) {
		console.error("Erreur lors de la création de la société :", error);
		return res
			.status(500)
			.json({ response: false, message: "Erreur serveur", error });
	}
};

const regeneratePasswordCompanyController = async (req, res) => {
	try {
		const { companyName } = req.body;

		if (!companyName) {
			return res.status(400).json({
				response: false,
				errorType: "missing",
				message: "Champs obligatoires manquant !",
			});
		} else {
			companyNameForPassword = companyName.toLowerCase().replace(/\s+/g, "");
		}

		// Recherche de l'entreprise dans la base de données
		const company = await companyModel.findOne({ companyName });

		if (!company) {
			return res.status(404).json({
				response: false,
				errorType: "not_found",
				message: "Entreprise non trouvée !",
			});
		} else {
			const { tempPassword, hashedPassword } = await regeneratePassword(
				companyNameForPassword
			);

			company.password = hashedPassword;
			company.updatedAt = new Date();
			await company.save();

			return res.status(200).json({
				response: true,
				message: "Mot de passe régénéré avec succès !",
				password: tempPassword,
			});
		}
	} catch (error) {
		console.error("Erreur lors de la régénération du mot de passe :", error);
		return res.status(500).json({
			response: false,
			message: "Erreur serveur",
			error: error.message,
		});
	}
};

const archiveCompanyController = async (req, res) => {
	try {
		const { companyName } = req.body;

		if (!companyName) {
			return res.status(400).json({
				response: false,
				errorType: "missing",
				message: "Champs obligatoires manquant !",
			});
		}

		const company = await companyModel.findOne({ companyName });

		if (!company) {
			return res.status(404).json({
				response: false,
				errorType: "not_found",
				message: "Entreprise non trouvée !",
			});
		}

		const archivedCompany = new archivedCompanyModel({
			originalCompanyId: company._id,
			companyName: company.companyName,
			password: company.password,
			isConfirmed: company.isConfirmed,
			userId: company.userId,
			siret: company.siret,
			createdAt: company.createdAt,
			updatedAt: new Date(),
		});
		await archivedCompany.save();

		if (archivedCompany) {
			await companyModel.deleteOne({ _id: company._id });
		}

		// Archive users with the same companyName
		const users = await userModel.find({ companyName });

		for (const user of users) {
			const archivedUser = new archivedUserModel({
				originalUserId: user._id,
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				pseudonyme: user.pseudonyme,
				gender: user.gender,
				phone: user.phone,
				address: user.address,
				password: user.password,
				companyName: user.companyName,
				role: user.role,
				createdAt: user.createdAt,
				updatedAt: new Date(),
			});
			await archivedUser.save();
			await userModel.deleteOne({ _id: user._id });
		}

		return res.status(200).json({
			response: true,
			message: "Entreprise et utilisateurs archivés avec succès !",
		});
	} catch (error) {
		console.error("Erreur lors de l'archivage de l'entreprise :", error);
		return res.status(500).json({
			response: false,
			message: "Erreur serveur",
			error: error.message,
		});
	}
};

const restoreCompanyArchivedController = async (req, res) => {
	try {
		const { companyName } = req.body;

		if (!companyName) {
			return res.status(400).json({
				response: false,
				errorType: "missing",
				message: "Champs obligatoires manquant !",
			});
		}

		const archivedCompany = await archivedCompanyModel.findOne({ companyName });

		if (!archivedCompany) {
			return res.status(404).json({
				response: false,
				errorType: "not_found",
				message: "Entreprise non trouvée !",
			});
		}

		const company = new companyModel({
			companyName: archivedCompany.companyName,
			password: archivedCompany.password,
			isConfirmed: archivedCompany.isConfirmed,
			userId: archivedCompany.userId,
			siret: archivedCompany.siret,
			createdAt: archivedCompany.createdAt,
			updatedAt: new Date(),
		});
		await company.save();

		if (company) {
			await archivedCompanyModel.deleteOne({ _id: archivedCompany._id });
		}

		// Restore users with the same companyName
		const archivedUsers = await archivedUserModel.find({ companyName });

		for (const archivedUser of archivedUsers) {
			const user = new userModel({
				email: archivedUser.email,
				firstname: archivedUser.firstname,
				lastname: archivedUser.lastname,
				pseudonyme: archivedUser.pseudonyme,
				gender: archivedUser.gender,
				phone: archivedUser.phone,
				address: archivedUser.address,
				password: archivedUser.password,
				companyName: archivedUser.companyName,
				role: archivedUser.role,
				createdAt: archivedUser.createdAt,
				updatedAt: new Date(),
			});
			await user.save();
			await archivedUserModel.deleteOne({ _id: archivedUser._id });
		}

		return res.status(200).json({
			response: true,
			message: "Entreprise et utilisateurs restaurés avec succès !",
		});
	} catch (error) {
		console.error("Erreur lors de la restauration de l'entreprise :", error);
		return res.status(500).json({
			response: false,
			message: "Erreur serveur",
			error: error.message,
		});
	}
};

const firstConnectionCompanyController = async (req, res) => {
	try {
		const { companyName, password } = req.body;

		// Vérification des paramètres
		if (!companyName || !password) {
			return res.status(400).json({
				response: false,
				errorType: "missing",
			});
		}

		// Recherche de l'entreprise dans la base de données
		const company = await companyModel.findOne({ companyName });

		// Si l'entreprise n'existe pas
		if (!company) {
			return res.status(404).json({
				response: false,
				errorType: "not_found",
			});
		}

		// Vérification du mot de passe
		const isPasswordValid = await bcrypt.compare(password, company.password);

		if (!isPasswordValid) {
			return res.status(401).json({
				response: false,
				errorType: "wrong",
			});
		}

		// Mise à jour du champ updatedAt
		company.updatedAt = new Date();
		await company.save();

		// Génération du token JWT
		const companyTokenPayload = {
			companyId: company._id,
			companyName: company.companyName,
			companyCreatedAt: company.createdAt,
			companyUpdatedAt: company.updatedAt,
		};

		const companyToken = jwt.sign(companyTokenPayload, process.env.jwt_secret, {
			expiresIn: "2h", // Expiration du token (2 heures dans cet exemple)
		});

		// Si la connexion est réussie
		return res.status(200).json({
			response: true,
			message: "Connexion réussie !",
			companyToken: companyToken,
			companyExpiration: 7200000, // 2 heures
			companyIsConfirmed: company.isConfirmed,
		});
	} catch (error) {
		console.error("Erreur lors de la première connexion :", error);
		return res.status(500).json({
			response: false,
			message: "Erreur serveur",
			error: error.message,
		});
	}
};

// TODO: Simplifier la fonction confirm-company-controller
const confirmCompanyController = async (req, res) => {
	try {
		const { confirmCompanyForm } = req.body;

		// Vérification des paramètres
		if (!confirmCompanyForm.companyId) {
			return res.status(400).json({
				response: false,
				errorType: "missing",
			});
		}

		// Recherche de l'entreprise dans la base de données
		const company = await companyModel.findById(confirmCompanyForm.companyId);

		// Si l'entreprise n'existe pas
		if (!company) {
			return res.status(404).json({
				response: false,
				errorType: "company_not_found",
			});
		}

		// Vérifier que toutes les données obligatoires sont présentes pour passer isConfirmed en true
		const requiredFields = [
			"companyId",
			"companyName",
			"fname",
			"lname",
			"email",
			"password",
			"address",
			"phone",
			"pseudonyme",
		];

		const isFormValid = requiredFields.every(
			(field) => confirmCompanyForm[field]
		);

		if (isFormValid) {
			// Enregistrer les données company & user et passer isConfirmed en true
			company.updatedAt = new Date();
			company.siret = confirmCompanyForm.siret;
			company.isConfirmed = true;
			await company.save();

			const user = await userModel.findOne({
				companyName: company.companyName,
				role: "admin",
			});

			// Hash du mot de passe
			const hashedPassword = await bcrypt.hash(confirmCompanyForm.password, 10);

			if (user) {
				user.firstname = confirmCompanyForm.fname;
				user.lastname = confirmCompanyForm.lname;
				user.email = confirmCompanyForm.email;
				user.password = hashedPassword;
				user.address = confirmCompanyForm.address;
				user.phone = confirmCompanyForm.phone;
				user.pseudonyme = confirmCompanyForm.pseudonyme;
				user.gender = confirmCompanyForm.gender;
				await user.save();
			}

			return res.status(200).json({
				response: true,
				message: "Formulaire de confirmation validé !",
			});
		} else {
			company.updatedAt = new Date();
			company.siret = confirmCompanyForm.siret;
			company.isConfirmed = false;

			// Enregistrer les données company & user sans passer isConfirmed en true
			const user = await userModel.findOne({
				companyName: company.companyName,
				role: "admin",
			});

			// Hash du mot de passe
			const hashedPassword = await bcrypt.hash(confirmCompanyForm.password, 10);

			if (user) {
				user.firstname = confirmCompanyForm.fname;
				user.lastname = confirmCompanyForm.lname;
				user.email = confirmCompanyForm.email;
				user.password = hashedPassword;
				user.address = confirmCompanyForm.address;
				user.phone = confirmCompanyForm.phone;
				user.pseudonyme = confirmCompanyForm.pseudonyme;
				user.gender = confirmCompanyForm.gender;
				await user.save();
			}

			await company.save();
			return res.status(200).json({
				response: true,
				message: "Formulaire de confirmation enregistré !",
			});
		}
	} catch (error) {
		console.error("Erreur lors de la confirmation de l'entreprise :", error);
		return res.status(500).json({
			response: false,
			message: "Erreur serveur",
			error: error.message,
		});
	}
};

const getConfirmCompanyFormController = async (req, res) => {
	try {
		const { companyId } = req.query;

		if (!companyId) {
			return res.status(400).json({
				response: false,
				errorType: "missing",
				message: "companyId est requis !",
			});
		}

		// Récupérer les données company avec l'companyId
		const companyData = await companyModel.findById(companyId);

		if (!companyData) {
			return res.status(404).json({
				response: false,
				errorType: "company_not_found",
				message: "Entreprise non trouvée.",
			});
		}

		// Récupérer les données user avec le companyName & admin
		const userData = await userModel.findOne({
			companyName: companyData.companyName,
			role: "admin",
		});

		if (!userData) {
			return res.status(404).json({
				response: false,
				errorType: "user_not_found",
				message: "Utilisateur non trouvé.",
			});
		}

		return res.status(200).json({
			response: true,
			message: "Données formulaire 'confirmCompany' récupérées avec succès !",
			confirmCompanyForm: {
				companyId: companyData._id,
				companyName: companyData.companyName,
				fname: userData.firstname,
				lname: userData.lastname,
				email: userData.email,
				password: companyData.password,
				address: userData.address,
				phone: userData.phone,
				siret: companyData.siret,
				numberOfEmployees: 1, // TODO: Récupérer le nombre d'employés
				gender: userData.gender,
				pseudonyme: userData.pseudonyme,
			},
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des données:", error);
		res.status(500).json({
			response: false,
			message: "Erreur interne du serveur.",
		});
	}
};

module.exports = {
	newCompanyController,
	regeneratePasswordCompanyController,
	archiveCompanyController,
	restoreCompanyArchivedController,
	firstConnectionCompanyController,
	confirmCompanyController,
	getConfirmCompanyFormController,
};
