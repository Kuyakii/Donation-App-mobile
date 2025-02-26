# SaeS4

## Pour lancer l'application en dev :
### Lancer le serveur web qui gère le backend 
#### Ouvrir un terminal dans projet/backend et lancer : npx ts-node server.tsx
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

Routes : \
GET /associations : Récupère toutes les associations. \
GET /associations/:id : Récupère une association par son ID. \
POST /associations : Crée une nouvelle association. \
PUT /associations/:id : Met à jour une association existante. \
Ces routes permettent de gérer les données de l’application via des requêtes HTTP (GET, POST, PUT).
