# SaeS4

## Pour lancer l'application en dev :
### Mettre à jour le fichier ./config.tsx avec son adresse ip
Ouvrir un bash et faire ipconfig et copier coller l'IPV4 dans la constante !
### Lancer le serveur web qui gère le backend
#### Ouvrir un terminal dans projet/backend et lancer : npx ts-node server.tsx
Si un processus marche dessus, sur windows, lancer un bash powershell et : \ > récupérer le pid du processus avec netstat -ano | findstr :3000
 \ > kill le processus : taskkill /PID [Le pid récupéré] /F
### Ouvrir un terminal et lancer :  "npx expo start"  
ou alors aller dans package.json et lancer le script "start"
### Ensuite scanner le QrCode avec son téléphone pour lancer l'app
il faut d'abord avoir télécharger l'appli ExpoGo

## Pour créer une base Maria DB :
### Télécharger MariaDB ici : https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.7.2&os=windows&cpu=x86_64&pkg=msi&mirror=icam
### Ouvrir un terminal et créer la BD :
AVEC : mysql -u root -p \
//si l'invite de commande ne trouve pas MySQL, ajouter ça aux var d'env (PAth) : C:\Program Files\MariaDB 11.7\bin \
PUIS : CREATE DATABASE donation_app_dev; \
ENFIN : USE donation_app_dev; 
### Créer les table avec le script (sur Trello : https://trello.com/c/P7fmOcc3)
## Pas oublier d'aussi changer ./backend/config
Mettre à jour les identifiants de connexion à la BDD : surtout user et password. \
#### Pour ajouter une association :
Voir l'exemple d'insertion dans le script (asso : AEJS) => ne pas oublier de bien échapper les ''. \
Aussi, pour les images, mettre en base dans nomImage le  nom + extension du logo de l'assos et aussi : \
Aussi pour les localisation, récupérer latitude et longitude de l'adresse ici par ex : https://geojson.io/#map=16.98/46.657553/0.06602 et utiliser dans le insert  ST_GeomFromText('POINT(0.06604683207572748 46.65740272882837)') => voir exemple.
#### Il faut l'ajouter dans le tableau associatif ./config.tsx en suivant le modèle

## Pour la génération des QR Codes :
### QR code de l'application 
Changer APP_URL et SERVER_URL avec votre IPV4, 
APP_URL est sous format exp://<ipv4>:8081 (le port est le lien que vous voyez lorsque vous lancer expo start)
SERVER_URL est sous format http://<ipv4>:3000

Lancez le server backend ET l'application avec expo start, aller sur le web et mettez le lien localhost:3000/generate-qrcode-app
Un texte brut json vous sera généré et copiez le lien "data:image/png..." et collez le sur le web, vous verrez un qr code apparaître, scannez ce QR Code et vous seriez redirigé vers l'application 

### QR code des associations
Pour générer les QR Codes de l'application c'est pareil, après avoir lancé le server vous mettez sur le web localhost:3000/generate-qrcodes
Choisissez le QR Code d'une asso, scanner le QR Code AVEC LE SCANNER DE L'APPLICATION et vous pouvez être redirigé vers l'association 

## Branches  
### FixComponents :
Ici, les pages index et userPage n'utilisent pas de composants React => on perd l'intérêt du langage et il y aura du code dupliqué et difficile à maintenir.
Cette branche va fix ça, utiliser dons les composants pour les pages futures.
Aussi, j'ai fixe la navigation en uti lisant le rooter de base => à revoir le style de la NavBar mais c'est bien plus fiable comme ça.

### backAppTablesEtConnexionBDD :
Ici, création de la base sous MariaDB et des tables. \
Création du ./backend qui va contenir notre serveur back. \
Respect des principes SOLID au mieux. \
Dans le backend, nous avons créé une API REST qui gère des routes permettant de récupérer, ajouter, modifier et supprimer des associations et autres.

### Authentification
Ici, création du login register et logout. \
Dans le back => crétion du répo pour les utilisateurs et de la logique de connexion. \
Manque peut être le forgot password et la recherche par le pseudo en plus du mail. Aussi c'est moche. \
Les mdps sont chiffrés. \
A voir encore pour respecter notre hiérarchie de classes pour l'héritage. \

### userPageDynamique
Ici, je récupère les données de l'utilisateur depuis le back end. \
Aussi, les associations pareil. \

### detailAssociation
Au clique sur une association de la modale => ouverture de la page de détail avec toutes les infos et la carte aussi.

### fixNav
La page detailsAssos à mtn la NAvBAr => pas possible pour l'instant pour login & register sinon il faut revoir un peu la logique.

### loginPageStyle registerPageStyle
La page login et register est un peu mieux mais faudra trouver un couleur autte que bleu

### map
La map est quasiment complète, Marker qui fait ouvrir une View avec Description Courte de l'Asso et bouton "Aller voir l'asso" qui redirige vers DetailAssos

### ajoutNewAssos
Ajout de nouvelles associations assez pour pouvoir faire des statistiques avec, nouvelle version du script SQL sur trello

### pageDons
#### L'objectif était de permettre aux utilisateurs de faire des dons à des associations directement depuis l'application en utilisant Stripe pour gérer les paiements. Voici un résumé rapide de ce qui a été implémenté :

#### Utilisation de Stripe pour les paiements :

Nous avons intégré Stripe pour permettre de traiter les paiements via carte bancaire. Lorsqu'un utilisateur souhaite effectuer un don, il entre les informations de sa carte et valide le paiement via Stripe.
Nous avons utilisé l'API create-payment-intent pour générer un "client secret" nécessaire à la confirmation du paiement avec confirmPayment.
Si le paiement est validé, un don est enregistré dans la base de données, avec des informations sur le montant et le type (unique ou récurrent).
#### Distinction entre don unique et récurrent :

Les utilisateurs peuvent choisir de faire un don unique ou un don récurrent.
Pour un don récurrent, plusieurs informations sont demandées, comme la date de début, la date de fin, et la fréquence (semaine, mois, trimestre).
Pour valider un don récurrent, le système vérifie que la date de début est égale ou antérieure à aujourd'hui et que la date de fin est supérieure à la date de début.
#### Interaction avec le serveur :

Lorsqu'un utilisateur soumet un don, une requête POST est envoyée au backend pour enregistrer les informations du don dans la base de données. Le backend gère également la logique pour distinguer un don récurrent ou unique.
Le serveur backend récupère les informations de l'utilisateur connecté pour s'assurer que seul un utilisateur authentifié peut réaliser un don récurrent.
#### Modale pour saisir les informations de la carte :

Lorsqu'un utilisateur choisit de faire un don, une modale est affichée pour permettre à l'utilisateur d'entrer ses informations de carte bancaire. Ces informations sont capturées à l'aide du composant CardField de Stripe.
Validation dynamique des dates pour les dons récurrents :

Pour les dons récurrents, les utilisateurs sont invités à sélectionner une date de début et une date de fin via un champ de texte. La logique permet de s'assurer que la date de début n'est pas dans le futur et que la date de fin est après la date de début.
#### Important, les dons unique anonyme sont reliés à l'invité 0, admin, il faut donc le créer

### favoriteAsso

Ajout de la fonctionnalité ajout dans la liste de favoris une association, un boutojn qui s'actualise dans détailAssos 'star", puis qui ajoute dynamiquement dans AssociationListFavorite de l'index et userPage, BD fonctionne correctement, tout fonctionne

### qrCode
Page qrCode fonctionnelle, avec un scanneur corner style et animé, un message s'affiche quand on scan avec le lien du QR Code.

### PageUserDynamique

Récupération des dons de l'utilisateur, affichage des badges selon des seuils; une barre de progrssion vers le badge suivant; les 3 assos les plus données et aussi, la modale avec la liste des dons, filtrable en fonction du type de don et du montant. Aussi, récupération des rôles des users et stockage de ça dans le AsyncStorage.

### adminAssosPage

Développement front et back (endpoint) de la page admin assos, disponible uniquement pour ces derniers, pour leurs associations.

### pageAdminApplication

Développement front et back de la page admin app : des trois onglets : un onglets stats pour toutes les assos et peuvent être triées, une page pour gérer les utilisateurs et une page pour gérer les associations.

### pageSettings

Changer Mot de Passe et Pseudonyme fonctionnel, activier/désactiver notifications à voir, Mode sombe pas encore fait, Langue et traduction fonctionnel, Section a propos fonctionnel, à voir pour le front, bouton suppression du compte fonctionnel

## grosTextes

Taille de polices ajustables avec petit outils d'accessibilité sur toutes les pages => toutes les pages répondent à ça ct dur et long 


## Routes : \
GET /associations : Récupère toutes les associations. \
GET /associations/:id : Récupère une association par son ID. \
POST /associations : Crée une nouvelle association. \
PUT /associations/:id : Met à jour une association existante. \
POST /register : inscription avec en body email, password et pseudo. \
POST /login : connexion avec en body : email et password. \
POST /mdpOublie : pour changer de password avec en body : email et password => non encore utilisée. \
POST /changePassword : pour changer le password via le settings en saisissant l'ancien password \
POST /changePseudonyme : pour changer le pseudo via le settings en saisissant le password pour vérifier \
POST /deleteAccount : pour supprimer le compte en confirmant et saisir le password, déconnexion automatique \
POST /favorites : Associe une association à un utilisateur pour la liste des favorites \
DELETE /favorites : Supprime un couple (utilisateur/association) des associations favorites \
GET /favorites/:id : Récupère toutes les associations favorites d'un utilisiateur par son userID. \
POST /dons : pour faire un don avec en body :  id (idAssos) , idUser, montant, typeDon, startDate, endDate, frequency (avec les params en fonction de si c'est un don unique ou récurrent) \
POST /create-payment-intent : pour paiement avec stripe : générer un "client secret" nécessaire à la confirmation du paiement avec confirmPayment \
GET /generate-qrcodes : permet de générer un QR code pour chaque Association de la base de données \
GET /generate-qrcode/:id permet de générer un QR code pour une association avec son id \
GET /open-expo-app redirige vers l'application Expo Go et lance l'application après avoir scanné le QR Code de l'appli \
GET /generate-qrcode-app permet de générer un QR code pour accéder à l'application via un scanner externe \
Ces routes permettent de gérer les données de l’application via des requêtes HTTP (GET, POST, PUT).
