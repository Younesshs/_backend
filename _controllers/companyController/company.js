const companyModels = require("../../_models/companyModel");
const bcrypt = require("bcrypt");

const newAccountController = async (req, res) => {
	// TODO: FINIR LA PARTIE FRONTEND - CREE USER PROFILE (ADMIN DE L'ENTREPRISE)
	try {
		const { company } = req.body;

		if (!company) {
			return res
				.status(400)
				.json({ message: "Champs obligatoires 'company' manquant" });
		}

		// Vérification si la entreprise existe déjà
		const existingCompany = await companyModels.findOne({ name: company });
		if (existingCompany) {
			return res
				.status(409)
				.json({ message: "Cette entreprise est déjà utilisé" });
		}

		// Génération d'un mot de passe temporaire unique
		const timestamp = Math.floor(Date.now() / 1000); // Horodatage en secondes
		const tempPassword = `${company}-${timestamp}`;

		// Hash du mot de passe temporaire
		const hashedPassword = await bcrypt.hash(tempPassword, 10);

		// Création d'une company
		const newCompany = new companyModels({
			name: company,
			password: hashedPassword, // Enregistrement du mot de passe hashé
		});

		await newCompany.save();

		return res.status(201).json({
			message: "Entreprise créé avec succès !",
			company: company,
			tempPassword: hashedPassword,
		});
	} catch (error) {
		console.error("Erreur lors de l'ajout de l'entreprise :", error);
		return res.status(500).json({ message: "Erreur serveur", error });
	}
};

module.exports = {
	newAccountController,
};
