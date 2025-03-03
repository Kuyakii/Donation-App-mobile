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

## Branches  
### FixComponents :
Ici, les pages index et userPage n'utilisent pas de composants React => on perd l'intérêt du langage et il y aura du code dupliqué et difficile à maintenir.
Cette branche va fix ça, utiliser donx les composants pour les pages futures.
Aussi, j'ai fixe la navigation en utilisant le rooter de base => à revoir le style de la NavBar mais c'est bien plus fiable comme ça.

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

## Routes : \
GET /associations : Récupère toutes les associations. \
GET /associations/:id : Récupère une association par son ID. \
POST /associations : Crée une nouvelle association. \
PUT /associations/:id : Met à jour une association existante. \
POST /register : inscription avec en body email, password et pseudo. \
POST /login : connexion avec en body : email et password. \
POST /mdpOublie : pour changer de password avec en body : email et password => non encore utilisée. \

Ces routes permettent de gérer les données de l’application via des requêtes HTTP (GET, POST, PUT).
