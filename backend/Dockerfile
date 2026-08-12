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

# Migration avant serve (séquentiel, confirmé sous les 40s du health-check
# Voisilab). db:seed retiré d'ici : ajouté à la suite, le total dépassait le
# budget à cause de la latence réseau vers Postgres (chaque requête coûte
# bien plus cher que sur SQLite en local). Le seed se déclenche maintenant
# séparément via la route protégée /api/system/deploy-setup (voir
# routes/api.php), à appeler une fois après déploiement.
# permission:cache-reset : le conteneur est éphémère, donc le cache de
# permissions Spatie (fichier/mémoire local) repart à vide à chaque
# redémarrage même si la base Postgres persiste. Sans ce reset, les rôles
# déjà en base ne sont plus reconnus tant que /deploy-setup n'est pas
# rappelé manuellement. Commande légère (pas de requêtes réseau lourdes),
# reste sous le budget du health-check.
CMD ["sh", "-c", "php artisan migrate --force; php artisan permission:cache-reset; php artisan serve --host=0.0.0.0 --port=${PORT:-3000}"]