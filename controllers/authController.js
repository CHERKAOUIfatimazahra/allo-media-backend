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

// Modifiez la fonction login pour inclure la logique de l'OTP
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.isVerified) {
    return res
      .status(403)
      .json({ message: "Please verify your email before logging in." });
  }

  // Logic for OTP sending only if required
  if (!user.otp || user.otpExpires < Date.now()) {
    const lastOTPSentAt = user.lastOTPSentAt;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; 
    if (lastOTPSentAt && lastOTPSentAt > oneWeekAgo) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      // Generate a new OTP and send it to the user
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = Date.now() + 3 * 60 * 1000; 
      user.lastOTPSentAt = Date.now(); 
      await user.save();

      sendEmail(user.email, "Your OTP", `Your OTP is ${otp}`);
      res.json({ message: "OTP sent to email" });
    }
  } else {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  }
};

// Route pour la verification d'un OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body; 

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vérifiez si l'OTP est valide et s'il n'a pas expiré
    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.otp = undefined; 
      user.otpExpires = undefined; 
      await user.save();

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "OTP verified successfully", token });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Route pour le renvoi d'un OTP
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.otp || user.otpExpires < Date.now()) {
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 3 * 60 * 1000; // 10 minutes
    await user.save();

    sendEmail(user.email, "Your OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent to email" });
  } else {
    res.status(400).json({ message: "OTP already sent" });
  }
};
