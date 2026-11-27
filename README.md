# TeamFlow — Plateforme de gestion collaborative de projets

TeamFlow est une application web de gestion collaborative conçue pour aider les équipes à organiser leurs projets, répartir les tâches, suivre leur avancement et gérer les membres selon leurs rôles et permissions.

## Fonctionnalités principales

- **Authentification :** connexion et gestion des accès utilisateurs.
- **Gestion des projets :** création, modification et suppression selon les permissions.
- **Gestion des tâches :** organisation des tâches et suivi de leur progression.
- **Gestion des équipes :** ajout et gestion des membres des projets.
- **Notifications :** suivi des activités et des notifications.
- **Tableau de bord :** affichage des indicateurs et statistiques de suivi.
- **Gestion des rôles :** contrôle des autorisations selon le profil utilisateur.

## Technologies utilisées

### Frontend
- React 19
- Vite 8
- JavaScript
- Tailwind CSS 4
- Lucide React

### Backend
- PHP 8.2
- Laravel 12
- Laravel Sanctum 4
- API REST

### Base de données
- MySQL

## Rôles utilisateurs

| Rôle | Description |
|---|---|
| Admin | Administration et gestion globale de la plateforme |
| Chef de projet | Gestion des projets et suivi des activités selon ses permissions |
| Membre | Participation aux projets et gestion des tâches autorisées |

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- PHP 8.2 ou supérieur
- Composer
- MySQL
- Node.js compatible avec Vite 8
- npm
- Git

## Installation du projet

### 1. Cloner le dépôt GitHub

```bash
git clone https://github.com/FATIMA19ARSMOUK/gestion-projets.git
cd gestion-projets
```

### 2. Installer les dépendances Laravel

À la racine du projet, exécuter :

```bash
composer install
```

Créer le fichier `.env` à partir du fichier d'exemple :

```bash
copy .env.example .env
```

Générer la clé de l'application :

```bash
php artisan key:generate
```

### 3. Configurer la base de données

Démarrer MySQL (par exemple avec XAMPP), puis créer une base de données nommée :

```text
gestion_projets
```

Ouvrir le fichier `.env` et vérifier les paramètres suivants :

```env
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_projets
DB_USERNAME=root
DB_PASSWORD=
```

Adapter le nom d'utilisateur et le mot de passe selon la configuration MySQL utilisée.

### 4. Exécuter les migrations

Créer les tables de la base de données :

```bash
php artisan migrate
```

### 5. Créer les comptes de démonstration

Exécuter la commande suivante :

```bash
php artisan db:seed --class=DemoAccountsSeeder
```

Cette commande crée trois comptes de démonstration correspondant aux rôles Admin, Chef de projet et Membre.

### 6. Installer les dépendances du Frontend

Depuis la racine du projet :

```bash
cd frontend
npm install
```

## Lancement de l'application

### Lancer le Backend et l'application

Revenir au dossier principal du projet :

```bash
cd ..
```

Démarrer le serveur Laravel :

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Ouvrir ensuite l'application dans le navigateur :

http://127.0.0.1:8000

La version frontend compilée est incluse dans le dépôt GitHub.

### Mode développement du Frontend

Pour travailler sur le code React, ouvrir un deuxième terminal :

```bash
cd frontend
npm run dev
```

Ouvrir l'adresse locale affichée par Vite dans le terminal, généralement :

http://localhost:5173

Après toute modification du frontend destinée à la version compilée, exécuter depuis le dossier `frontend` :

```bash
npm run build
```

## Comptes de démonstration

Les comptes suivants permettent de tester les différents rôles de la plateforme en environnement local.

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | demo.admin@teamflow.test | DemoAdmin2026! |
| Chef de projet | demo.manager@teamflow.test | DemoManager2026! |
| Membre | demo.member@teamflow.test | DemoMember2026! |

**Important :** ces identifiants sont réservés à la démonstration locale. Ils ne doivent pas être utilisés sur une installation publique ou en production.

## Tests

Pour exécuter les tests Laravel :

```bash
php artisan test
```

## Auteur

Projet réalisé dans le cadre d'un parcours de développement digital Full Stack.

**Stack : React — Laravel — MySQL**