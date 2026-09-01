# Frontend GMDI — build multi-stage (évite d'embarquer node_modules/devDependencies
# dans l'image finale, qui faisait échouer le builder railpack par manque d'espace disque)
# Frontend GMDI

FROM node:24-alpine AS build
WORKDIR /app
# Désactive le prompt/ping de télémétrie Angular CLI (peut bloquer indéfiniment
# sans TTY) et augmente la limite mémoire Node pour éviter un blocage silencieux
# sur un environnement de build aux ressources restreintes.
ENV CI=true
ENV NG_CLI_ANALYTICS=false
ENV NODE_OPTIONS=--max-old-space-size=4096
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund
COPY . .

RUN npm run build:prod

# nginx plutôt qu'un serveur statique npm (ex. `serve`) : évite tout accès au
# registre npm dans le stage final, qui bloquait indéfiniment le build sur le
# réseau de build Voisilab alors que le stage `build` ci-dessus, lui, passait.
FROM nginx:alpine AS runtime
COPY --from=build /app/dist/gmdi-communication/browser /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV PORT=3000
# Limite la substitution envsubst aux SEULES variables ci-dessous, afin de
# préserver les variables internes nginx ($host, $remote_addr, $scheme, ...)
# utilisées dans le bloc /api/ (proxy vers le backend Laravel). Sans cette
# liste, l'entrypoint nginx substitue toutes les variables du template et vide
# $host/$remote_addr/$proxy_add_x_forwarded_for → header Host vide en proxy.
ENV NGINX_ENVSUBST_VARS='$PORT $BACKEND_URL'
EXPOSE 3000