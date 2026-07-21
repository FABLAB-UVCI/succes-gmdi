# Frontend GMDI — build multi-stage (évite d'embarquer node_modules/devDependencies
# dans l'image finale, qui faisait échouer le builder railpack par manque d'espace disque)

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build:prod

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist/gmdi-communication/browser ./browser
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["sh", "-c", "npx serve -s browser -l ${PORT:-3000}"]
