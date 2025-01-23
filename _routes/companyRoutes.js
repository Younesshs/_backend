const express = require("express");
const {
	getConfirmCompanyFormController,
} = require("../_controllers/companyController/company");
const router = express.Router();

const {
	newCompanyController,
	regeneratePasswordCompanyController,
	archiveCompanyController,
	restoreCompanyArchivedController,
	firstConnectionCompanyController,
	confirmCompanyController,
} = require("../_controllers/companyController/company");

// Routes pour les utilisateurs
router.get("/confirm/form", getConfirmCompanyFormController);
router.post("/", newCompanyController);
router.post("/regeneratePassword", regeneratePasswordCompanyController);
router.post("/archive", archiveCompanyController);
router.post("/restore", restoreCompanyArchivedController);
router.post("/firstConnection", firstConnectionCompanyController);
router.post("/confirm", confirmCompanyController);

module.exports = router;
