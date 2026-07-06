# SUCCES-GMDI — Plateforme municipale unifiée

Application unique de **Gestion Municipale Digitale Intégrée**, regroupant 7 modules
métier autour d'une seule API, d'une seule base et d'un **login unique**.

## Architecture

```
succes-gmdi/
├── backend/     # API Laravel 12 unique (Sanctum + Spatie) — modules sous app/Modules/
└── frontend/    # SPA Angular 21 unique — 7 modules lazy, portail d'accueil
```

### Modules

| Module | Front (route) | API (préfixe) |
|--------|---------------|---------------|
| Communication | `/communication` | `/api/com/*` |
| État civil | `/etat-civil` | `/api/etat-civil/*` |
| Finances | `/finances` | `/api/recettes`, `/api/budget`, … |
| Patrimoine | `/patrimoine` | `/api/patrimoine/*` |
| Ressources humaines | `/rh` | `/api/rh/*` |
| Services techniques | `/services-techniques` | `/api/st/*` |
| Urbanisme / SIG | `/urbanisme` | `/api/urb/*` |

Authentification partagée : `POST /api/auth/login` → token Sanctum unique
(`gmdi_token` côté front, valable pour tous les modules).

## Démarrage rapide

```bash
./start-dev.sh          # démarre backend (:8000) + frontend (:4200)
```

### Manuellement

**Backend** (Laravel 12, PHP 8.2+) :
```bash
cd backend
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate:fresh --seed        # compte: admin@gmdi.ci / password
php artisan serve                        # http://localhost:8000
```

**Frontend** (Angular 21, Node 20+) :
```bash
cd frontend
npm install
npm start                                # http://localhost:4200 (proxy /api -> :8000)
```

## Base de données

Le backend fonctionne en **SQLite** par défaut (dev). Pour MySQL/MariaDB, renseigner
`backend/.env` (`DB_CONNECTION=mysql`, `DB_DATABASE=gmdi_unified`, …) puis
`php artisan migrate:fresh --seed`. Certaines requêtes statistiques
(Patrimoine, Services techniques, Urbanisme) utilisent des fonctions SQL MySQL
(`DATE_FORMAT`) et requièrent MySQL/MariaDB.

## Notes

- Consolidation depuis 8 dépôts séparés vers ce mono-dépôt (voir historique `consolidation`).
- Le frontend a été assemblé hors environnement de build : voir `frontend/README.md`
  pour les points à valider au premier `ng build`.
```
