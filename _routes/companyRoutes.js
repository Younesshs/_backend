const express = require("express");
const router = express.Router();

const {
	newCompanyController,
} = require("../_controllers/companyController/company");

// Routes pour les utilisateurs
router.post("/", newCompanyController);

module.exports = router;
