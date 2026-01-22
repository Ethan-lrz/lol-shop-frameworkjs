# LoL Shop - React Explorer

Projet réalisé dans le cadre du Fil Rouge (Jour 4).

## Thème
Une boutique interactive pour explorer les objets du jeu League of Legends.

## API Utilisée
- **Nom :** Riot Data Dragon
- **Lien :** https://developer.riotgames.com/docs/lol#data-dragon
- **Usage :** Récupération des items, prix, statistiques et images.

## Installation et Lancement
1. `npm install` (pour installer les dépendances comme react-router-dom)
2. `npm run dev` (pour lancer le serveur local)

## Fonctionnalités
- **Accueil :** Liste filtrable via une barre de recherche.
- **Détails :** Fiche complète de l'objet (prix de vente, stats, tags).
- **Favoris :** Système de sauvegarde locale (localStorage) avec compteur dynamique dans la barre de navigation.
- **Navigation :** Expérience fluide avec React Router et remontée automatique en haut de page.
