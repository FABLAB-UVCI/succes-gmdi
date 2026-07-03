# Service d'Impression - Extraits d'Actes (Etat Civil)

## Overview

Un service d'impression centralisé a été créé pour gérer l'impression et le téléchargement des extraits d'actes civils (naissances, décès, mariages, certificats) côté frontend.

## Service PrintService

Le service `PrintService` est located in `/src/app/services/print.service.ts`.

### Méthodes disponibles

#### 1. `printDocument(html: string, titre: string)`
Ouvre un document HTML dans une nouvelle fenêtre et déclenche **automatiquement** l'impression.

```typescript
this.printService.printDocument(html, 'Extrait-Acte-Naissance');
```

**Comportement:**
- Ouvre une nouvelle fenêtre avec le contenu HTML
- Attend que le DOM soit complètement chargé
- Déclenche automatiquement `window.print()` après un court délai
- L'utilisateur peut immédiatement imprimer ou enregistrer en PDF

#### 2. `downloadAsPDF(html: string, nomFichier: string)`
Prépare un document HTML pour le téléchargement en PDF.

```typescript
this.printService.downloadAsPDF(html, 'extrait-acte');
```

**Comportement:**
- Ouvre une nouvelle fenêtre avec le contenu HTML
- Déclenche la boîte de dialogue d'impression système
- L'utilisateur peut enregistrer directement en PDF

#### 3. `previewDocument(html: string, titre: string)`
Affiche un aperçu du document **sans** imprimer automatiquement.

```typescript
this.printService.previewDocument(html, 'Aperçu Acte Naissance');
```

**Comportement:**
- Ouvre une nouvelle fenêtre avec le contenu HTML
- L'utilisateur doit manuellement cliquer sur le bouton d'impression

#### 4. `printDirectly(html: string)`
Imprime directement sans ouvrir de fenêtre visible (utilise un iframe caché).

```typescript
this.printService.printDirectly(html);
```

## Modules implémentés

### 1. Naissances (`naissances.ts`)
- Méthode principale: `genererPDF(data)`
- Intégration: Appelle automatiquement `this.printService.printDocument(html, 'Extrait-Acte-Naissance')`
- Bouton HTML: "Imprimer" dans le registre

```html
<button class="btn-s" (click)="imprimer('Naissance', item.numero)">
  <i class="ti ti-printer"></i>Imprimer
</button>
```

### 2. Décès (`deces.ts`)
- Méthode principale: `genererActeDecesPDF(data)`
- Intégration: Appelle automatiquement `this.printService.printDocument(html, 'Extrait-Acte-Deces')`

### 3. Mariages (`mariages.ts`)
- Méthode principale: `genererActeMariagePDF(data)`
- Intégration: Appelle automatiquement `this.printService.printDocument(html, 'Extrait-Acte-Mariage')`

### 4. Certificats (`certificats.ts`)
- Méthode principale: `genererCertificatPDF(type, data)`
- Intégration: Appelle automatiquement `this.printService.printDocument(html, 'Certificat-${type}')`

## Flux utilisateur

### Scénario 1: Impression directe
1. L'utilisateur clique sur le bouton "Imprimer"
2. Le document s'affiche dans une nouvelle fenêtre
3. La boîte de dialogue d'impression s'ouvre **automatiquement**
4. L'utilisateur peut:
   - Imprimer directement
   - Enregistrer en PDF (via "Enregistrer en tant que PDF")
   - Annuler et fermer la fenêtre

### Scénario 2: Prévisualisation
```typescript
// Code pour activer la prévisualisation au lieu de l'impression
this.printService.previewDocument(html, 'Aperçu');
```
1. Une nouvelle fenêtre s'ouvre avec le document
2. L'utilisateur peut voir le rendu final
3. Puis l'utilisateur clique manuellement sur Ctrl+P ou le bouton d'impression du navigateur

## Style d'impression

Le HTML généré inclut:
- Un style `@media print` pour optimiser l'affichage à l'impression
- Une mise en page professionnelle avec:
  - En-tête avec l'armoirie et les détails administratifs
  - Bordure verte décorative
  - Filigrane "EXEMPLE DOCUMENT FICTIF"
  - QR code et code de vérification
  - Section signatures et sceaux
  - Mentions légales en bas

## Améliorations futures possibles

1. **Téléchargement PDF avec jsPDF/html2pdf**
   ```typescript
   // Installer: npm install html2pdf
   // Permet le téléchargement direct sans boîte de dialogue
   ```

2. **Impression multiple en batch**
   ```typescript
   printBatch(documents: any[]): void {
     // Imprimer plusieurs actes successivement
   }
   ```

3. **Prévisualisation avec zoom et options avancées**
   - Sélection de l'imprimante
   - Options de marges et d'orientation
   - Aperçu avant/après

4. **Watermark personnalisable**
   - Ajouter le logo/sceau officiel
   - Numéro de série ou référence unique

5. **Export vers d'autres formats**
   - Word (.docx)
   - Excel (.xlsx)
   - Image (.png, .jpg)

## Débogage

Si le document n'imprime pas:

1. **Vérifiez la console du navigateur** pour les erreurs
2. **Vérifiez les pop-up blockers** - Le service ouvre une nouvelle fenêtre
3. **Testez previewDocument()** pour vérifier que le HTML est correct
4. **Augmentez le délai** dans le service si needed:
   ```typescript
   setTimeout(() => {
     win.print();
   }, 500); // Augmenter de 250ms à 500ms
   ```

## Exemple d'utilisation personnalisée

```typescript
import { PrintService } from '../../../../services/print.service';

export class MonComposant {
  constructor(private printService: PrintService) {}

  actionImprimer() {
    const html = this.genererHTML();
    
    // Option 1: Impression automatique
    this.printService.printDocument(html, 'Mon-Document');
    
    // Option 2: Téléchargement PDF
    this.printService.downloadAsPDF(html, 'mon-document');
    
    // Option 3: Aperçu seulement
    this.printService.previewDocument(html, 'Aperçu');
  }

  genererHTML(): string {
    return `<!DOCTYPE html>...`;
  }
}
```

## Support navigateur

Le service fonctionne avec tous les navigateurs modernes qui supportent:
- `window.open()`
- `window.print()`
- ES6+ (async/await compatible)

✅ Chrome, Firefox, Safari, Edge
✅ Mobile browsers (avec limitations)
❌ Internet Explorer (deprecated)

---

**Dernière mise à jour:** 2024
