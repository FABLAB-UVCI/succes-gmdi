#!/usr/bin/env bash
# Démarre le backend Laravel (:8000) et le frontend Angular (:4200) en parallèle.
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

cleanup() { echo; echo "Arrêt…"; kill 0; }
trap cleanup INT TERM

echo "▶ Backend Laravel  → http://localhost:8000"
( cd "$ROOT/backend" && php artisan serve --port=8000 ) &

echo "▶ Frontend Angular → http://localhost:4200"
( cd "$ROOT/frontend" && npm start ) &

wait
