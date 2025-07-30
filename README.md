# Donation App - SAE S4

> Réalisé en équipe dans le cadre de la formation à l'IUT Paris Rives-de-Seine.  
> Application mobile de gestion de dons aux associations, avec back-end en Node.js/TypeScript et base de données MariaDB.

## 🚀 Lancement de l'application en développement

1. **Mettre à jour l'adresse IP dans `./config.tsx`**
   - Ouvrir un terminal et faire `ipconfig` pour récupérer l'adresse **IPv4**.

2. **Lancer le serveur backend**
   ```bash
   cd backend
   npx ts-node server.tsx
   ```
   - Si le port 3000 est déjà utilisé :
     ```powershell
     netstat -ano | findstr :3000
     taskkill /PID <PID> /F
     ```

3. **Lancer l'application mobile**
   ```bash
   npx expo start
   # ou utiliser le script "start" dans package.json
   ```

4. **Scanner le QR Code avec l'application Expo Go**
   - Télécharger l'appli **Expo Go** sur votre téléphone.

---

## 📂 Configuration de la base de données (MariaDB)

1. **Installer MariaDB**
   - [Lien de téléchargement](https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.7.2&os=windows&cpu=x86_64&pkg=msi&mirror=icam)

2. **Créer la base de données**
   ```bash
   mysql -u root -p
   CREATE DATABASE donation_app_dev;
   USE donation_app_dev;
   ```
   - Si `mysql` est introuvable, ajouter `C:\Program Files\MariaDB 11.7\bin` à la variable `PATH`.

3. **Créer les tables avec le script SQL**
   - Disponible sur le [Trello](https://trello.com/c/P7fmOcc3).

4. **Configurer les identifiants dans `./backend/config.js`**

---

## 🌐 Génération des QR Codes

1. **QR Code de l'application**
   - Modifier `APP_URL` et `SERVER_URL` dans le backend avec votre **IPv4**.
   - Accéder à : `http://<ipv4>:3000/generate-qrcode-app`
   - Copier le champ `data:image/png...` et coller dans un navigateur pour scanner.

2. **QR Codes des associations**
   - Accéder à : `http://<ipv4>:3000/generate-qrcodes`
   - Scanner un QR Code d'association avec le scanneur de l'application.

---

## 👁️ Fonctionnalités principales

- Authentification (login/register/logout, changement de mot de passe)
- Navigation avec React Router
- Page utilisateur dynamique (dons, badges, statistiques, favoris)
- Liste et détails des associations (carte, description, logo)
- Dons via **Stripe** : don unique ou récurrent avec vérification de dates
- Admin application et association : statistiques, gestion utilisateurs et associations
- Accessibilité : tailles de police ajustables sur toutes les pages
- QR Codes pour rediriger vers l'application ou une association
- Multilingue : support pour les langues (en/fr) et traduction dynamique

---

## 🏛️ Architecture technique

- **Frontend** : React Native (Expo), Typescript
- **Backend** : Node.js, Express.js, Typescript
- **Base de données** : MariaDB (SQL)
- **API REST** respectant les principes **SOLID**
- **Stripe** pour le paiement sécurisé des dons
- **Auth** : bcrypt, JWT
- **Gestion de session** : AsyncStorage
---

## 🔄 Principales routes de l'API

```http
GET /associations : Récupère toutes les associations.
GET /associations/:id : Récupère une association par son ID.
POST /associations : Crée une nouvelle association.
PUT /associations/:id : Met à jour une association existante.

POST /register : inscription avec en body email, password et pseudo.
POST /login : connexion avec en body : email et password.
POST /mdpOublie : pour changer de password avec en body : email et password => non encore utilisée.
POST /changePassword : pour changer le password via le settings en saisissant l'ancien password
POST /changePseudonyme : pour changer le pseudo via le settings en saisissant le password pour vérifier
POST /deleteAccount : pour supprimer le compte en confirmant et saisir le password, déconnexion automatique

POST /favorites : Associe une association à un utilisateur pour la liste des favorites
DELETE /favorites : Supprime un couple (utilisateur/association) des associations favorites
GET /favorites/:id : Récupère toutes les associations favorites d'un utilisiateur par son userID.

POST /dons : pour faire un don avec en body : id (idAssos) , idUser, montant, typeDon, startDate, endDate, frequency (avec les params en fonction de si c'est un don unique ou récurrent)
POST /create-payment-intent : pour paiement avec stripe : générer un "client secret" nécessaire à la confirmation du paiement avec confirmPayment


GET /generate-qrcodes : permet de générer un QR code pour chaque Association de la base de données
GET /generate-qrcode/:id permet de générer un QR code pour une association avec son id
GET /open-expo-app redirige vers l'application Expo Go et lance l'application après avoir scanné le QR Code de l'appli
GET /generate-qrcode-app permet de générer un QR code pour accéder à l'application via un scanner externe
```
Ces routes permettent de gérer les données de l’application via des requêtes HTTP (GET, POST, PUT).

---

| Branche                       | Description                               |
| ----------------------------- | ----------------------------------------- |
| `FixComponents`               | Refonte des composants React              |
| `backAppTablesEtConnexionBDD` | Connexion BDD + API REST                  |
| `Authentification`            | Login, register, logout                   |
| `userPageDynamique`           | Infos dynamiques utilisateur              |
| `map`                         | Localisation association avec Marker      |
| `detailAssociation`           | Détail complet d’une asso                 |
| `pageDons`                    | Paiement avec Stripe                      |
| `favoriteAsso`                | Système de favoris                        |
| `qrCode`                      | Scanner + QR association/app              |
| `PageUserDynamique`           | Badges, stats, historique dons            |
| `adminAssosPage`              | Admin : utilisateurs, stats, associations |
| `pageAdminApplication`        | Admin : utilisateurs, stats, associations |
| `pageSettings`                | Paramètres du compte complet              |
| `grosTextes`                  | Accessibilité (text size)                 |

---

## 📷 Screenshots

<img width="363" height="302" alt="image" src="https://github.com/user-attachments/assets/7a29e32a-5e49-44f5-b043-4e58e1ee0707" />
```md
![Page utilisateur](./assets/screens/user-page.png)
![Carte des associations](./assets/screens/map.png)
```

---

## 📄 Auteur
---

*Ce projet a été réalisé dans un contexte d'apprentissage mais reflète une véritable application mobile connectée à une base de données, dotée de fonctionnalités complètes et professionelles.*
