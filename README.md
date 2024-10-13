# allo-media-backend

## Table des matières

1. [Description du projet](#description-du-projet)
2. [Technologies utilisées](#technologies-utilisées)
3. [Installation](#installation)
4. [Configuration de l'environnement](#configuration-de-lenvironnement)
5. [Utilisation](#Utilisation)
6. [API Endpoints](#API-Endpoints)
7. [Tests](#Tests)

## Description du projet

AlloMedia est une application de livraison à domicile. Ce projet constitue le backend de l'application, basé sur ExpressJS avec une authentification via JWT et 2FA (Authentification à deux facteurs). L'objectif est de gérer les utilisateurs (clients, livreurs, managers), les commandes, et les livraisons, tout en assurant la sécurité des accès grâce à JWT et 2FA. Ce backend expose une API REST pour les opérations CRUD sur les utilisateurs et les commandes.

## Technologies utilisées

- **Node.js** - Runtime JavaScript pour le backend.
- **Express.js** - Framework pour créer des API REST.
- **MongoDB** - Base de données NoSQL pour stocker les utilisateurs et les commandes.
- **Mongoose** - ODM (Object Data Modeling) pour MongoDB.
- **JWT (JsonWebToken)** - Gestion des sessions et authentification des utilisateurs.
- **Bcrypt.js** - Hachage des mots de passe pour sécuriser les comptes utilisateurs.
- **Nodemailer** - Envoi d'e-mails pour la validation et la 2FA.
- **AWS SNS** - Envoi des OTP via SMS.
- **Dotenv** - Gestion des variables d'environnement.
- **Jest** - Framework de test pour les tests unitaires.

## Installation

1. **Cloner le repository** :
   ```bash
   git clone https://github.com/CHERKAOUIfatimazahra/allo-media-backend
   cd allo-media-backend
2. **Installer les dépendances** :
   ```bash
   npm install
3. **Configurer les variables d'environnement** :
   Créez un fichier .env à la racine du projet et ajoutez-y les variables suivantes :
   ```bash
   MONGO_URI=mongodb:votre_uri_mongodb
   PORT=5000
   JWT_SECRET=votre_secret_jwt
   JWT_EXPIRES_IN=1h
   EMAIL=votre_service_email
   EMAIL_PASSWORD=mot_de_passe
   BASE_URL=http://localhost:5000
   VITE_APP_BASE_URL=http://localhost:5000/auth

4. **Démarrer l'application** :
   ```bash
   npm start

## Configurer les variables d'environnement 
 Ce projet utilise les variables d'environnement pour des configurations sensibles comme l'URI MongoDB et le secret JWT. Assurez-vous de définir les valeurs dans un fichier .env comme mentionné ci-dessus.
### Utilisation :
#### Pour démarrer l'application :
    ```bash
    npm start

#### Pour exécuter les tests :
    ```bash
    npm test

## API Endpoints :

-Authentification

**POST /auth/register**
Enregistre un nouvel utilisateur avec vérification par e-mail.

**POST /auth/login**
Authentification avec JWT et envoi d'un code OTP pour 2FA.

**POST /auth/verify-otp**
Vérification du code OTP pour la 2FA.

**POST /auth/forgetpassword**
Envoie un e-mail pour réinitialiser le mot de passe.

**POST /auth/resetpassword/**
Réinitialisation du mot de passe avec un token envoyé par e-mail.

## Tests:
Ce projet inclut des tests unitaires pour garantir la sécurité et la robustesse de l'application, notamment pour l'inscription, la connexion, et la gestion de la 2FA.
   ```bash
   npm test

 
