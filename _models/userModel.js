const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		configurations: {
			theme: { type: String, enum: ["light", "dark"], default: "light" },
			language: { type: String, default: "fr" },
			autoLocationTime: { type: Boolean, default: false },
		},
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		pseudonyme: { type: String, unique: true, sparse: true }, // sparse pour autoriser les valeurs nulles/vides
		sexe: { type: String, enum: ["male", "female", "other"], required: false },
		password: { type: String, required: true }, // Vous devrez hasher ce mot de passe avant de l'enregistrer
		company: { type: String, required: true },
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
