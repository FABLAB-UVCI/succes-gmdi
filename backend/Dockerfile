# Backend GMDI — image légère (contourne le builder railpack lourd)
# PHP 8.4 : requis par les dépendances verrouillées (spatie/laravel-permission ^8.3, symfony 8.1)
FROM php:8.4-cli-alpine

# Extensions PHP requises par Laravel + MySQL/SQLite (l'installeur gère les deps système)
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions pdo_mysql pdo_sqlite mbstring bcmath tokenizer xml ctype dom curl fileinfo

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

CMD ["sh", "-c", "php artisan config:cache && php artisan serve --host=0.0.0.0 --port=${PORT:-3000}"]