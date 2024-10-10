const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController"); 

// Route pour l'inscription d'un utilisateur
router.post("/register", authController.register);


module.exports = router;
