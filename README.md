# Projet de Bibliothèque Virtuelle - Frontend

Ce projet est l'interface utilisateur d'une application de bibliothèque virtuelle qui permet aux utilisateurs de rechercher des livres, de gérer leur bibliothèque personnelle et de laisser des avis sur les livres qu'ils ont lus. L'application est construite avec Next.js et utilise Material-UI pour le design.

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [API](#api)
- [Contributions](#contributions)
- [Licence](#licence)

## Fonctionnalités

- Recherche de livres via l'API Google Books.
- Gestion de la bibliothèque personnelle des utilisateurs (ajout, mise à jour, suppression de livres).
- Système d'avis pour les livres.
- Authentification des utilisateurs.

## Technologies Utilisées

- **Frontend**: Next.js, React, Material-UI
- **Gestion d'état**: Context API de React
- **API externe**: Google Books API

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Hallou-G-Y/project_biblio_front.git
   cd project_biblio_front
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

4. Ouvrez votre navigateur et accédez à `http://localhost:3000`.

## Lien vers le Backend

Le code source de la partie back de ce projet est disponible ici : [Backend GitHub Repository](https://github.com/Hallou-G-Y/project_biblio_back)

## Utilisation

- **Inscription**: Les utilisateurs peuvent s'inscrire pour créer un compte.
- **Connexion**: Les utilisateurs peuvent se connecter pour accéder à leur bibliothèque personnelle.
- **Recherche de livres**: Utilisez la barre de recherche pour trouver des livres via l'API Google Books.
- **Gestion de la bibliothèque**: Ajoutez des livres à votre bibliothèque, mettez à jour leur statut ou supprimez-les.
- **Laisser un avis**: Évaluez les livres et laissez des commentaires.

## API

### Endpoints

- **GET /api/books/search**: Recherche de livres.
- **GET /api/books/:googleBookId**: Récupérer les détails d'un livre.
- **GET /api/library**: Récupérer la bibliothèque de l'utilisateur.
- **POST /api/library/add**: Ajouter un livre à la bibliothèque.
- **PUT /api/library/:bookId**: Mettre à jour le statut d'un livre.
- **DELETE /api/library/:bookId**: Supprimer un livre de la bibliothèque.
- **POST /api/reviews**: Créer une nouvelle review.
- **GET /api/reviews/book/:bookId**: Récupérer les reviews d'un livre.
- **DELETE /api/reviews/:reviewId**: Supprimer une review.

## Contributions

Les contributions sont les bienvenues ! Veuillez soumettre une demande de tirage (pull request) pour toute amélioration ou correction.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.