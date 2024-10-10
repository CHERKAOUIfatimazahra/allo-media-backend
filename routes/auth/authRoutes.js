const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController"); 

// Route pour l'inscription d'un utilisateur
router.post("/register", authController.register);

// Route pour la vérification de l'email via un token
router.get("/verify-email", authController.verifyEmail);

// Route pour la connexion d'un utilisateur
router.post("/login", authController.login);

// Route pour la verification d'un OTP
router.post("/verify-otp", authController.verifyOTP);

// Route pour le renvoit de otp
router.post("/resend-otp", authController.resendOTP);

// Route pour demander la réinitialisation du mot de passe (oubli de mot de passe)
router.post("/forgot-password", authController.forgetPassword);

// Route pour réinitialiser le mot de passe à l'aide d'un token
router.post("/reset-password", authController.resetPassword);

// Route pour la déconnexion d'un utilisateur
router.post("/logout", verifyToken, authController.logout);

module.exports = router;
