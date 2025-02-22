const express = require("express");
const router = express.Router();

const { testController } = require("../_controllers/testController/test");

// Routes pour les tests
router.get("/", testController);

module.exports = router;
