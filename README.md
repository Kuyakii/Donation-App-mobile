# SaeS4

## Pour lancer l'application en dev :
### Ouvrir un terminal et lancer :  "npx expo start"  
ou alors aller dans package.json et lancer le script "start"
### Ensuite scanner le QrCode avec son téléphone pour lancer l'app
il faut d'abord avoir télécharger l'appli ExpoGo

## Branches  
### FixComponents :
Ici, les pages index et userPage n'utilisent pas de composants React => on perd l'intérêt du langage et il y aura du code dupliqué et difficile à maintenir.
Cette branche va fix ça, utiliser donx les composants pour les pages futures.
Aussi, j'ai fixe la navigation en utilisant le rooter de base => à revoir le style de la NavBar mais c'est bien plus fiable comme ça.
