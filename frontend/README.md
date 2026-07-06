# GMDI — Frontend unifié (Angular 21)

Application Angular unique regroupant les 7 modules de la plateforme municipale GMDI,
chargés en **lazy-loading**, avec **login unique** partagé.

## Architecture

```
src/app/
├── app.routes.ts          # routing unifié : login + accueil + 1 route lazy par module
├── app.config.ts          # providers (router, httpClient + intercepteurs partagés)
├── app.component.ts        # shell racine (router-outlet + toasts globaux)
├── portal/                 # page d'accueil (portail des modules)
├── communication/          # module (auto-contenu : core, modules, pages)
├── etat-civil/             # module (auto-contenu)
├── finances/               # module (features/*)
├── patrimoine/             # module (auto-contenu)
├── rh/                     # module (auto-contenu)
├── services-techniques/    # module (auto-contenu)
└── urbanisme/              # module (auto-contenu)
```

- **Chaque module est auto-contenu** : il conserve son propre `core/` (services, guards,
  intercepteurs), ses modèles et ses pages. Aucune fusion de code entre modules → pas de
  collision de noms (`api.models.ts`, `api.service.ts`, etc.).
- **Login unique** : tous les modules lisent la même clé de token `localStorage` (`gmdi_token`).
  Se connecter une fois via `/login` authentifie toute la plateforme.
- **API** : un seul `environment` (`src/environments/environment.ts`) avec `apiUrl: '/api'`,
  importé partout via l'alias TypeScript `@env` (voir `tsconfig.json`). Le proxy
  (`proxy.conf.json`) route `/api` vers le backend Laravel `http://localhost:8000`.

## Démarrage

```bash
cd frontend
npm install          # nécessite un accès au registre npm
npm start            # ng serve (proxy /api -> :8000)
# build production :
npm run build:prod
```

Le backend unifié doit tourner en parallèle :
```bash
cd ../backend && php artisan serve   # http://localhost:8000
```

## Points à vérifier au premier build (fusion réalisée sans compilation)

Cette fusion a été effectuée hors environnement de build (registre npm inaccessible +
`node_modules` d'origine compilés pour Windows). À valider lors du premier `ng build` :

1. **Versions Angular** — tous les modules sont alignés sur **21**. Les composants issus
   d'`etat-civil` (écrit en 22) et de `services-techniques` (écrit en 19) peuvent nécessiter
   de petits ajustements d'API.
2. **Styles globaux** — seuls les styles de base + icônes Tabler sont déclarés dans
   `angular.json`. Si un module utilise des styles globaux (SCSS, thèmes), les ajouter aux
   `styles` du projet.
3. **Libs spécifiques** — regroupées dans `package.json` : `@tabler/icons-webfont`, `qrcode`,
   `angularx-qrcode`, `chart.js` + `ng2-charts`.
4. **Providers runtime** — ex. `ng2-charts` (RH) peut requérir un provider ; vérifier le
   démarrage de chaque module après login.
```
