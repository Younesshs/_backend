const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
	originalCompanyId: {
		type: Schema.Types.ObjectId,
		ref: "companys",
		required: true,
	},
	companyName: { type: String, required: true },
	password: { type: String, required: false }, // Vous devrez hasher ce mot de passe avant de l'enregistrer
	isConfirmed: { type: Boolean, default: false },
	userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
	siret: { type: String, sparse: true },
	createdAt: { type: Date, required: true },
	updatedAt: { type: Date, required: true },
	archivedAt: { type: Date, default: Date.now },
});

const archivedCompanyModel = mongoose.model("company_archiveds", companySchema);

module.exports = archivedCompanyModel;
