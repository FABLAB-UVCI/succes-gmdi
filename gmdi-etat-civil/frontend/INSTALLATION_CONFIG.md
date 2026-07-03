# 🔧 Installation et Configuration - Système d'Impression

## 📦 Prérequis

- Angular 17+ (ou votre version)
- TypeScript 5+
- Node.js 18+
- npm ou yarn

## 🚀 Installation

### Étape 1: Copier le service

Assurez-vous que le fichier suivant existe:

```
src/app/services/print.service.ts
```

Si le fichier n'existe pas, créez-le avec le contenu de `print.service.ts`.

**Vérification:**
```bash
cd frontend
ls -la src/app/services/print.service.ts
```

### Étape 2: Vérifier les imports dans les composants

Les fichiers suivants doivent importer le PrintService:

```
src/app/modules/etat-civil/pages/naissances/naissances.ts
src/app/modules/etat-civil/pages/deces/deces.ts
src/app/modules/etat-civil/pages/mariages/mariages.ts
src/app/modules/etat-civil/pages/certificats/certificats.ts
```

**Vérification:**
```typescript
import { PrintService } from '../../../../services/print.service';
```

### Étape 3: Vérifier les injections

Chaque composant doit avoir le PrintService injecté:

```typescript
constructor(private api: ApiService, private printService: PrintService) {}
```

### Étape 4: Compiler et tester

```bash
# Compiler l'application
npm run build

# Ou en mode développement
npm start

# Les erreurs TypeScript doivent être éliminées
```

## ✅ Vérification post-installation

### Checklist

- [ ] Service créé: `src/app/services/print.service.ts` ✓
- [ ] Import dans naissances.ts ✓
- [ ] Import dans deces.ts ✓
- [ ] Import dans mariages.ts ✓
- [ ] Import dans certificats.ts ✓
- [ ] Injection dans naissances.ts ✓
- [ ] Injection dans deces.ts ✓
- [ ] Injection dans mariages.ts ✓
- [ ] Injection dans certificats.ts ✓
- [ ] Build sans erreurs ✓
- [ ] Fonctionnalité testée ✓

## 🔍 Diagnostic

### Erreur: Cannot find module 'print.service'

**Cause:** Le service n'existe pas ou est au mauvais endroit

**Solution:**
```bash
# Vérifier le chemin exact
find . -name "print.service.ts"

# Si le fichier n'existe pas, créez-le
touch src/app/services/print.service.ts
```

### Erreur: ERROR in src/app/modules/etat-civil/pages/naissances/naissances.ts

**Cause:** L'import du PrintService est incorrect

**Solution:**
```typescript
// Vérifier que le chemin relatif est correct
import { PrintService } from '../../../../services/print.service';

// Compter les ../ :
// naissances.ts → app → modules → etat-civil → pages → naissances
// Retour: naissances → pages → etat-civil → modules → app → services
// Donc: ../../.. → app → services = ../../../../services
```

### Erreur: Provider not found for PrintService

**Cause:** Le service n'est pas fourni

**Solution:**
```typescript
// Option 1: Global (recommandé)
// Dans print.service.ts:
@Injectable({
  providedIn: 'root'  // ← Cette ligne autorise l'injection automatique
})
export class PrintService { }

// Option 2: Module
// Dans le module:
import { PrintService } from './services/print.service';

@NgModule({
  providers: [PrintService]
})
export class YourModule { }
```

## 🧪 Tests d'installation

### Test 1: Vérifier que le service est accessible

```typescript
// Dans un composant
import { PrintService } from './services/print.service';

export class TestComponent {
  constructor(private printService: PrintService) {
    console.log('PrintService injecté:', printService);
  }
}
```

### Test 2: Test d'impression simple

```typescript
// Dans le composant
testPrint() {
  const html = '<html><body><h1>Test d\'impression</h1></body></html>';
  this.printService.printDocument(html, 'Test');
}

// Puis dans le template
<button (click)="testPrint()">Test Print</button>
```

### Test 3: Vérifier dans la console

```javascript
// Dans la console du navigateur (F12)
// Si le service fonctionne:
// Une nouvelle fenêtre devrait s'ouvrir
// Et la boîte de dialogue d'impression devrait apparaître
```

## 🔧 Configuration avancée

### Personnaliser le délai d'impression

Dans `print.service.ts`, modifier le délai (en ms):

```typescript
// Valeur par défaut: 250ms
setTimeout(() => {
  win.print();
}, 250);  // ← Modifier ce nombre
```

**Recommandations:**
- **100-250ms:** Documents simples
- **250-500ms:** Documents complexes avec images
- **500-1000ms:** Documents très volumineux

### Personnaliser le titre de la fenêtre

```typescript
// Dans les composants:
this.printService.printDocument(html, 'Mon-Titre-Personnalisé');
```

### Ajouter des styles CSS personnalisés

```typescript
// Avant d'appeler printService:
const html = `
  <html>
  <head>
    <style>
      @media print {
        body { margin: 1cm; }
        .noprint { display: none; }
      }
    </style>
  </head>
  <body>
    <!-- Contenu -->
  </body>
  </html>
`;

this.printService.printDocument(html, 'Titre');
```

## 🚀 Déploiement

### Environnement de développement

```bash
# Démarrer le serveur de développement
npm start

# Naviguer vers: http://localhost:4200
# Tester l'impression depuis l'interface
```

### Environnement de staging

```bash
# Build de production
npm run build

# Serveur de staging
# Adresse: https://staging.example.com

# Tester l'impression sur staging
```

### Environnement de production

```bash
# Build final
npm run build -- --prod

# Déployer le dossier dist/
# Vérifier que l'impression fonctionne en production
# Monitorer les erreurs
```

## 📊 Monitoring

### Vérifier les performances

```javascript
// Dans la console du navigateur
console.time('Impression');
// Cliquer sur "Imprimer"
// La durée s'affichera dans la console
console.timeEnd('Impression');
```

### Vérifier les erreurs

```javascript
// F12 → Console
// Chercher les messages d'erreur
// Chercher les avertissements

// Les erreurs courantes incluent:
// - "Uncaught TypeError: PrintService is not defined"
// - "window.open is blocked"
// - Erreurs de chargement d'images
```

### Analytics (optionnel)

```typescript
// Tracker l'utilisation de l'impression
printDocument() {
  console.log('Print action');
  // Ajouter analytics ici si souhaité
  // gtag('event', 'print', { type: 'naissances' });
}
```

## 🔐 Sécurité

### Points de sécurité à vérifier

- [ ] Aucune donnée sensible n'est exposée dans le HTML
- [ ] Les URLs d'images sont sécurisées (HTTPS)
- [ ] Les tokens d'authentification ne sont pas inclus
- [ ] Le contenu HTML est validé
- [ ] Les pop-up ne sont pas utilisés pour du contenu malveillant

### Content Security Policy (CSP)

Si vous utilisez une CSP stricte, vous devrez peut-être la modifier:

```html
<!-- Dans index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 📝 Documentation d'architecture

### Flux d'exécution

```
1. Utilisateur clique sur "Imprimer"
   ↓
2. Composant appelle imprimer()
   ↓
3. imprimer() appelle genererPDF()
   ↓
4. genererPDF() génère le HTML
   ↓
5. genererPDF() appelle this.printService.printDocument(html)
   ↓
6. PrintService ouvre une nouvelle fenêtre
   ↓
7. PrintService écrit le HTML dans la fenêtre
   ↓
8. PrintService appelle window.print() après chargement
   ↓
9. Boîte de dialogue d'impression s'ouvre
   ↓
10. Utilisateur imprime ou enregistre en PDF
```

### Dépendances

```
PrintService (Injectable)
    ↓
    Dépend uniquement de:
    - @angular/core (Injectable)
    - APIs native du navigateur (window.open, window.print)
```

**Avantage:** Aucune dépendance externe, très léger.

## 🐛 Troubleshooting rapide

| Problème | Solution |
|----------|----------|
| Le service n'existe pas | Vérifier le chemin d'import |
| L'impression ne fonctionne pas | Vérifier que le PrintService est injecté |
| Pas de fenêtre qui s'ouvre | Vérifier les bloqueurs de pop-up |
| Erreur TypeScript | Vérifier les imports et types |
| Mise en page incorrecte | Vérifier les CSS @media print |
| Images manquantes | Vérifier les URLs d'images |
| Performance lente | Augmenter le délai setTimeout |

## 📞 Support d'installation

Si vous rencontrez des problèmes:

1. **Consultez le [Guide Technique](./PRINT_SERVICE_README.md)**
2. **Consultez le [Guide de Testing](./TESTING_GUIDE_PRINT.md)**
3. **Vérifiez la [Checklist](#-vérification-post-installation)**
4. **Contactez le responsable technique**

## ✅ Installation confirmée

Quand vous verrez ce message, l'installation est réussie:

```
✅ Service PrintService créé et accessible
✅ Tous les composants ont importé le service
✅ Tous les composants ont injecté le service
✅ Build sans erreurs TypeScript
✅ Fonctionnalité d'impression testée et fonctionnelle
```

---

**Installation date:** [À compléter]  
**Installé par:** [À compléter]  
**Version:** 2.0.0  
**Status:** ✅ Installation complète
