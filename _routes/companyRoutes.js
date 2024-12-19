const express = require("express");
const router = express.Router();

const {
	newAccountController,
} = require("../_controllers/companyController/company");

// Routes pour les utilisateurs
router.post("/", newAccountController);

module.exports = router;
