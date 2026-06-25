# GMDI Finances — Full-stack (Angular 21 + Laravel 11 + MySQL)

Deux projets :
- **gmdi-backend/**          → API Laravel 11 (auth Sanctum, MySQL)
- **gmdi-finances-angular/** → votre front, mock retiré, connecté à l'API + auth

## 1) Backend
```bash
composer create-project laravel/laravel gmdi-backend "11.*"   # si projet neuf
# puis copiez le contenu de gmdi-backend/ par-dessus (app, database, routes, config, bootstrap, .env.example)
cd gmdi-backend
composer require laravel/sanctum
cp .env.example .env            # renseignez DB_DATABASE / DB_USERNAME / DB_PASSWORD
php artisan key:generate
# créez la base MySQL 'gmdi_finances' puis :
php artisan migrate --seed
php artisan serve               # http://localhost:8000
```
Détails : voir `gmdi-backend/README.md`.

## 2) Frontend
```bash
cd gmdi-finances-angular
npm install
ng serve                        # http://localhost:4200
```
Détails : voir `gmdi-finances-angular/INTEGRATION.md`.

## 3) Connexion
`directeur@gmdi.ci` / `password` (ou admin@, agent@, maire@).

Les données affichées proviennent désormais de MySQL (seedées au départ
avec vos anciennes données), plus aucune donnée n'est codée en dur dans le front.
