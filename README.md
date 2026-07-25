# E-Mairie 🇨🇮 — Plateforme Municipale Digitale Intégrée (GMDI)

Application web complète de **Gestion Municipale Digitale Intégrée**, regroupant 7 modules métiers pour les agents de la mairie, et un **Portail Citoyen** innovant pour la population, le tout centralisé autour d'une seule API et d'une seule base de données.

## 🌟 Nouvelles Fonctionnalités Majeures

- **Portail Citoyen** : Un espace sécurisé pour les citoyens (suivi des démarches, téléchargement de documents officiels, centre de notifications).
- **Tableau de Bord du Maire** : Vue d'ensemble avec KPIs consolidés sur les finances, les RH, et l'état des démarches.
- **Documents Officiels (PDF)** : Génération automatique et sécurisée d'Actes de Naissance, Mariage et Décès avec code QR de vérification.
- **Notifications & E-mails** : Envoi automatique d'e-mails (ex: mot de passe oublié) et de notifications en temps réel pour l'avancement des démarches.
- **Thème Ivoirien (UI/UX)** : Interface moderne et responsive reprenant fièrement les couleurs nationales (Orange, Blanc, Vert) avec du Glassmorphism.

## 🏗️ Architecture

```
succes-gmdi/
├── backend/     # API Laravel 12 (Sanctum, DomPDF, Mailtrap)
└── frontend/    # SPA Angular 21 (Standalone Components, UI Ivoirienne)
```

### 🧩 Modules & Routes

| Module | Interface (Front) | API (Backend) | Utilisateurs cibles |
|--------|-------------------|---------------|---------------------|
| **Portail Citoyen** | `/citoyen/*` | `/api/demarches`, `/api/notifications` | Citoyens |
| **Accueil E-Mairie** | `/` (Landing) | - | Tout public |
| **Communication** | `/communication` | `/api/com/*` | Agents Com |
| **État civil** | `/etat-civil` | `/api/etat-civil/*` | Officiers État Civil |
| **Finances** | `/finances` | `/api/recettes`, `/api/budget` | Trésoriers |
| **Patrimoine** | `/patrimoine` | `/api/patrimoine/*` | Gestionnaires |
| **RH** | `/rh` | `/api/rh/*` | DRH |
| **Services Techniques** | `/services-techniques`| `/api/st/*` | Agents Techniques |
| **Urbanisme / SIG** | `/urbanisme` | `/api/urb/*` | Agents Urbanisme |

*Authentification unifiée : `POST /api/auth/login` gère de manière transparente les Maires, Agents, et Citoyens.*

## 🚀 Démarrage Rapide

### Prérequis
- **Backend** : PHP 8.2+, Composer, SQLite (ou MySQL)
- **Frontend** : Node 20+, Angular CLI 21+

### 1. Configuration du Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Lancer les migrations et créer les comptes de test
php artisan migrate:fresh --seed

# Lancer le serveur API (port 8000)
php artisan serve
```
*(Optionnel : Configurez vos identifiants Mailtrap dans le `.env` pour tester l'envoi d'e-mails)*

### 2. Configuration du Frontend
```bash
cd frontend
npm install

# Lancer le serveur Angular (port 4200)
ng serve
```

## 👥 Comptes de test générés
L'application utilise un système de rôles stricts :
- **Maire** : Accès global et tableau de bord décisionnel.
- **Gestionnaires / Agents** : Accès limité à leurs modules métier (ex: État Civil).
- **Citoyens** : Espace restreint à leurs propres démarches.

*(Vérifiez les seeders Laravel pour les identifiants générés par défaut).*

## 🗄️ Base de données
Le backend fonctionne en **SQLite** par défaut pour faciliter le développement. Pour passer en production, configurez MySQL/MariaDB dans `backend/.env`. Certaines requêtes analytiques poussées du Maire exploitent mieux les fonctionnalités natives de MySQL.
