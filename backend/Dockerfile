# Backend GMDI — image légère (contourne le builder railpack lourd)
# PHP 8.4 : requis par les dépendances verrouillées (spatie/laravel-permission ^8.3, symfony 8.1)
FROM php:8.4-cli-alpine

# Extensions PHP requises par Laravel + MySQL/SQLite/PostgreSQL (l'installeur gère les deps système)
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions pdo_mysql pdo_sqlite pdo_pgsql mbstring bcmath tokenizer xml ctype dom curl fileinfo

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts \
    && composer dump-autoload --optimize --no-dev \
    && php artisan package:discover --ansi \
    && php artisan storage:link \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 3000

# Migration exécutée avant serve (séquentiel, pas en tâche de fond en
# parallèle) : les deux processus PHP simultanés se disputaient le CPU limité
# du conteneur au démarrage, empêchant serve de répondre dans les 40s du
# health-check Voisilab. Aucun job n'est jamais mis en file d'attente dans
# l'app (vérifié) : queue:work retiré, pur gaspillage de ressources.
CMD ["sh", "-c", "php artisan migrate --force; php artisan serve --host=0.0.0.0 --port=${PORT:-3000}"]