const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			sparse: true,
		},
		configurations: {
			theme: { type: String, enum: ["light", "dark"], default: "light" },
			language: { type: String, default: "fr" },
			autoLocationTime: { type: Boolean, default: false },
		},
		firstname: { type: String, sparse: true },
		lastname: { type: String, sparse: true },
		pseudonyme: { type: String, unique: true, sparse: true },
		gender: { type: String, enum: ["male", "female", "other"], sparse: true },
		phone: { type: String, sparse: true },
		address: { type: String, sparse: true },
		password: { type: String, required: true }, // Vous devrez hasher ce mot de passe avant de l'enregistrer
		companyName: { type: String, required: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true, // Ajoute automatiquement createdAt et updatedAt
	}
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
