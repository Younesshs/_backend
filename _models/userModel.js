const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: { type: String, required: false, unique: true },
		configurations: {
			theme: { type: String, enum: ["light", "dark"], default: "light" },
			language: { type: String, default: "fr" },
			autoLocationTime: { type: Boolean, default: false },
		},
		firstname: { type: String, required: false },
		lastname: { type: String, required: false },
		pseudonyme: { type: String, unique: false, sparse: true }, // sparse pour autoriser les valeurs nulles/vides
		sexe: { type: String, default: "other", enum: ["male", "female", "other"] },
		password: { type: String, required: true }, // Vous devrez hasher ce mot de passe avant de l'enregistrer
		companyName: { type: String, required: true },
		role: { type: String, default: "user", enum: ["user", "admin"] },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true, // Ajoute automatiquement createdAt et updatedAt
	}
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
