const express = require("express");
const router = express.Router();

const {
	getUserController,
	addUserController,
	updateUserController,
	removeUserController,
} = require("../_controllers/userController/user");

// Routes pour les utilisateurs
router.get("/:id?", getUserController);
router.post("/", addUserController);
router.put("/:id", updateUserController);
router.delete("/:id", removeUserController);

module.exports = router;
