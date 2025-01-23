const companyModel = require("../../_models/companyModel");
const userModel = require("../../_models/userModel");
const archivedCompanyModel = require("../../_models/archivedCompanyModel");
const archivedUserModel = require("../../_models/archivedUserModel");
const bcrypt = require("bcrypt");
const { addUserController } = require("../userController/user");

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
			email: `${companyName}.temp@temp.temp`,
			firstname: `${companyName}.tempfname`,
			lastname: `${companyName}.templname`,
			pseudonyme: `${companyName}.temppseudo`,
			password: hashedPassword,
			companyName: companyName,
			role: "admin",
		});

		// Create a new company
		const newCompany = new companyModel({
			companyName,
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
				sexe: user.sexe,
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
				sexe: archivedUser.sexe,
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

// TODO: FINIR LA FONCTION FIRSTCONNECTIONCOMPANYCONTROLLER
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

		// TODO: FINIR LA FONCTION FIRSTCONNECTIONCOMPANYCONTROLLER

		// Mise à jour du champ updatedAt
		company.updatedAt = new Date();
		await company.save();

		// Si la connexion est réussie
		return res.status(200).json({
			response: true,
			message: "Connexion réussie !",
			companyToken: "fake-jwt-first-connection",
			companyExpiration: 600000, // 2 heures 7200000
			companyId: company._id,
			companyName: company.name,
			companyCreatedAt: company.createdAt,
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

const confirmCompanyController = async (req, res) => {
	try {
		const {
			companyId,
			email,
			firstname,
			lastname,
			pseudonyme,
			sexe,
			password,
		} = req.body;

		if (
			!companyId ||
			!email ||
			!firstname ||
			!lastname ||
			!pseudonyme ||
			!sexe ||
			!password
		) {
			return res.status(400).json({
				response: false,
				errorType: "missing",
				message: "Champs obligatoires manquant !",
				isConfirmed: false,
			});
		}

		const company = await companyModel.findById(companyId);

		if (!company) {
			return res.status(404).json({
				response: false,
				errorType: "company_not_found",
				message: "Entreprise non trouvée !",
				isConfirmed: false,
			});
		}

		// Create admin user for the company
		const reqForUser = {
			body: {
				email,
				firstname,
				lastname,
				pseudonyme,
				sexe,
				password,
				company: company.companyName,
			},
		};

		const resForUser = {
			status: (statusCode) => ({
				json: (data) => ({ statusCode, data }),
			}),
		};

		const userResponse = await addUserController(reqForUser, resForUser);

		if (userResponse.statusCode !== 201) {
			return res.status(userResponse.statusCode).json({
				response: false,
				errorType: "user_creation_from_company",
				message: "Erreur lors de la création de l'utilisateur admin !",
				isConfirmed: false,
			});
		}

		company.isConfirmed = true;
		company.updatedAt = new Date();
		await company.save();

		return res.status(200).json({
			response: true,
			message: "Donnée 'company' mise à jour avec succès !",
			isConfirmed: true,
		});
	} catch (error) {
		console.error("Erreur lors de la confirmation de l'entreprise :", error);
		return res.status(500).json({
			response: false,
			message: "Erreur serveur",
			isConfirmed: false,
			error: error.message,
		});
	}
};

// TODO: AFTER
const getConfirmCompanyFormController = async (req, res) => {
	console.log("Requête reçue depuis Angular:", req.query.companyId);
	res.status(200).json({
		response: true,
		message: "Formulaire de confirmation de l'entreprise",
	});
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
