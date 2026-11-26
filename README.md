# TeamFlow — Plateforme de gestion collaborative de projets

TeamFlow est une application web de gestion collaborative permettant aux équipes d'organiser leurs projets, suivre les tâches et gérer les membres selon leurs rôles et permissions.

## Fonctionnalités principales

- Authentification des utilisateurs.
- Gestion des projets : création, modification et suppression selon les permissions.
- Gestion des tâches et suivi de leur avancement.
- Gestion des membres et des équipes.
- Notifications.
- Tableau de bord avec indicateurs de suivi.
- Gestion des rôles et des autorisations.

## Technologies utilisées

**Frontend**
- React 19
- Vite 8
- JavaScript
- Tailwind CSS 4
- Lucide React

**Backend**
- PHP 8.2
- Laravel 12
- Laravel Sanctum 4
- API REST

**Base de données**
- MySQL

## Rôles utilisateurs

| Rôle | Description |
|---|---|
| Admin | Administration et gestion globale de la plateforme |
| Chef de projet | Gestion des projets et suivi des activités selon ses permissions |
| Membre | Participation aux projets et gestion des tâches autorisées |

## Prérequis

Avant l'installation, assurez-vous de disposer de :

- PHP 8.2 ou supérieur
- Composer
- MySQL
- Node.js compatible avec Vite 8
- npm
- Git

## Installation du projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/FATIMA19ARSMOUK/gestion-projets.git
cd gestion-projets
```

### 2. Installer le Backend Laravel

```bash
composer install
```

Créer le fichier `.env` :

```bash
copy .env.example .env
```

Générer la clé de l'application :

```bash
php artisan key:generate
```

### 3. Configurer la base de données

Créer une base de données MySQL, par exemple :

`gestion_projets`

Modifier les paramètres suivants dans le fichier `.env` :

```env
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_projets
DB_USERNAME=root
DB_PASSWORD=
```

Adapter le nom d'utilisateur et le mot de passe selon votre configuration MySQL.

### 4. Exécuter les migrations

```bash
php artisan migrate
```

### 5. Créer les comptes de démonstration

```bash
php artisan db:seed --class=DemoAccountsSeeder
```

Cette commande crée trois comptes de démonstration correspondant aux rôles Admin, Chef de projet et Membre.

### 6. Installer le Frontend React

Ouvrir un deuxième terminal :

```bash
cd frontend
npm install
```

## Lancement de l'application

### Terminal 1 — Backend Laravel

Depuis le dossier principal :

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

### Terminal 2 — Frontend React

Depuis le dossier `frontend` :

```bash
npm run dev
```

Ouvrir ensuite l'adresse affichée par Vite dans le navigateur, généralement :

`http://localhost:5173`

## Comptes de démonstration

Les comptes suivants sont destinés aux tests en environnement local.

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