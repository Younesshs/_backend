const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
	name: { type: String, required: true },
	password: { type: String, required: false }, // Vous devrez hasher ce mot de passe avant de l'enregistrer
	isConfirmed: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

const companyModel = mongoose.model("companys", companySchema);

module.exports = companyModel;
