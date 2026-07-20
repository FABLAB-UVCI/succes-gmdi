# Frontend GMDI — build multi-stage (évite d'embarquer node_modules/devDependencies
# dans l'image finale, qui faisait échouer le builder railpack par manque d'espace disque)

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM node:24-alpine AS runtime
WORKDIR /app
RUN npm install -g serve@14
COPY --from=build /app/dist/gmdi-communication/browser ./browser

EXPOSE 4200

CMD ["sh", "-c", "serve -s browser -l ${PORT:-4200}"]
