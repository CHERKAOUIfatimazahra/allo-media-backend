const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mailer");
const { generateOTP } = require("../utils/otpGenerator");
// const crypto = require("crypto");

// l'inscription d'un utilisateur
exports.register = async (req, res) => {
  const { name, email, password, phoneNumber, address } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,  // hashed password
      phoneNumber,
      address,
    });

    await user.save();

    // Génération du token de vérification
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Sauvegardez le token dans le modèle
    user.verificationToken = verificationToken;
    await user.save(); 

    // Envoyer un email de verification
    const verificationLink = `http://localhost:5000/auth/verify-email?token=${verificationToken}`;
    sendEmail(
      user.email,
      "Vérification de votre e-mail",
      `Veuillez cliquer sur ce lien pour vérifier votre e-mail : ${verificationLink}`
    );

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vérification de l'email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  // Vérifiez le token de vérification avec JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); 

    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true; 
    user.verificationToken = undefined; 
    await user.save();

    // Rediriger vers une page spécifique dans le frontend
    return res.redirect("http://localhost:5174/login?verified=true");
  } catch (error) {
    return res.redirect("http://localhost:5174/error?message=invalid-token");
  }
};
