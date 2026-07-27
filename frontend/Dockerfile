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
FROM node:24-alpine AS runtime
WORKDIR /app
RUN npm install -g serve@14

COPY --from=build /app/dist/gmdi-communication/browser ./browser
EXPOSE 3000
CMD ["sh", "-c", "serve -s browser -l ${PORT:-3000}"]