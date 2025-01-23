const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companysSchema = new Schema({
	companyName: { type: String, required: true },
	password: { type: String, required: false }, // Vous devrez hasher ce mot de passe avant de l'enregistrer
	isConfirmed: { type: Boolean, default: false },
	userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
	updatedAt: { type: Date, default: Date.now },
	createdAt: { type: Date, default: Date.now },
});

const companyModel = mongoose.model("companys", companysSchema);

module.exports = companyModel;
