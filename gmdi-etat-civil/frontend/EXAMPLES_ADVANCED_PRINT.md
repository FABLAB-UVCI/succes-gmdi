# Exemples Avancés - PrintService

## Table des matières
1. [Implémentations de base](#implémentations-de-base)
2. [Cas d'usage avancés](#cas-dusage-avancés)
3. [Personnalisations](#personnalisations)
4. [Intégrations](#intégrations)
5. [Performance et optimisation](#performance-et-optimisation)

---

## Implémentations de base

### Exemple 1: Impression simple

```typescript
import { Component } from '@angular/core';
import { PrintService } from './services/print.service';

@Component({
  selector: 'app-simple-print',
  template: `<button (click)="imprimer()">Imprimer</button>`
})
export class SimplePrintComponent {
  constructor(private printService: PrintService) {}

  imprimer() {
    const html = `
      <html>
        <body>
          <h1>Mon Document</h1>
          <p>Contenu à imprimer</p>
        </body>
      </html>
    `;
    this.printService.printDocument(html, 'Mon-Document');
  }
}
```

### Exemple 2: Impression avec données

```typescript
export class ListePrintComponent {
  items = [
    { nom: 'Item 1', valeur: 100 },
    { nom: 'Item 2', valeur: 200 }
  ];

  constructor(private printService: PrintService) {}

  imprimerListe() {
    const html = this.genererTableHTML(this.items);
    this.printService.printDocument(html, 'Liste-Items');
  }

  private genererTableHTML(items: any[]): string {
    const rows = items.map(item => 
      `<tr><td>${item.nom}</td><td>${item.valeur}</td></tr>`
    ).join('');
    
    return `
      <html>
        <body>
          <table border="1">
            <tr><th>Nom</th><th>Valeur</th></tr>
            ${rows}
          </table>
        </body>
      </html>
    `;
  }
}
```

---

## Cas d'usage avancés

### Exemple 3: Impression avec événements

```typescript
export class PrintWithEventsComponent {
  constructor(private printService: PrintService) {}

  imprimerAvecNotification() {
    const html = this.genererHTML();
    
    console.log('📄 Préparation du document pour impression...');
    this.printService.printDocument(html, 'Document');
    console.log('✅ Document envoyé à l\'imprimante');
    
    // Notification utilisateur
    alert('Veuillez confirmer l\'impression dans la boîte de dialogue');
  }

  private genererHTML(): string {
    return `<html><body><h1>Test</h1></body></html>`;
  }
}
```

### Exemple 4: Impression conditionnelle

```typescript
export class PrintConditionComponent {
  documentReady = false;
  data: any = {};

  constructor(private printService: PrintService) {}

  imprimerSiPret() {
    if (!this.documentReady) {
      alert('Le document n\'est pas prêt');
      return;
    }

    if (!this.data || !this.data.contenu) {
      alert('Pas de contenu à imprimer');
      return;
    }

    const html = this.data.contenu;
    this.printService.printDocument(html, 'Document');
  }

  chargerDocument() {
    // Simulation du chargement
    setTimeout(() => {
      this.documentReady = true;
      this.data = { contenu: '<html><body>Document chargé</body></html>' };
    }, 1000);
  }
}
```

### Exemple 5: Téléchargement au lieu d'impression

```typescript
export class DownloadPDFComponent {
  constructor(private printService: PrintService) {}

  telechargerEnPDF() {
    const html = this.genererHTML();
    
    // Au lieu de print(), utilise la boîte de dialogue "Enregistrer en PDF"
    this.printService.downloadAsPDF(html, 'mon-document');
  }

  private genererHTML(): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; }
            .header { color: #1e5c33; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">En-tête</div>
          <p>Contenu du document</p>
        </body>
      </html>
    `;
  }
}
```

---

## Personnalisations

### Exemple 6: HTML personnalisé avec CSS

```typescript
export class StyledPrintComponent {
  constructor(private printService: PrintService) {}

  imprimerDocumentStylise() {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* Styles d'écran */
          body {
            font-family: 'Times New Roman', serif;
            margin: 20px;
            background: #f5f5f5;
          }
          
          .container {
            max-width: 800px;
            background: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          
          h1 {
            color: #1e5c33;
            border-bottom: 3px solid #1e5c33;
            padding-bottom: 10px;
          }
          
          /* Styles d'impression spécifiques */
          @media print {
            body {
              background: white;
              margin: 0;
            }
            
            .container {
              box-shadow: none;
              max-width: 100%;
              padding: 0;
            }
            
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Document Officiel</h1>
          <p>Contenu important</p>
          <button class="no-print">N'apparaîtra pas à l'impression</button>
        </div>
      </body>
      </html>
    `;
    
    this.printService.printDocument(html, 'Document-Stylise');
  }
}
```

### Exemple 7: Génération dynamique d'HTML

```typescript
export class DynamicHTMLComponent {
  constructor(private printService: PrintService) {}

  imprimerRapport(rapport: any) {
    const html = this.genererRapportHTML(rapport);
    this.printService.printDocument(html, `Rapport-${rapport.id}`);
  }

  private genererRapportHTML(rapport: any): string {
    const sections = rapport.sections
      .map(section => `
        <section>
          <h2>${section.titre}</h2>
          <p>${section.contenu}</p>
        </section>
      `)
      .join('');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${rapport.titre}</title>
        <style>
          section { page-break-after: always; margin: 20px 0; }
          h2 { color: #333; }
        </style>
      </head>
      <body>
        <h1>${rapport.titre}</h1>
        <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
        ${sections}
      </body>
      </html>
    `;
  }
}
```

---

## Intégrations

### Exemple 8: Intégration avec formulaire

```typescript
@Component({
  selector: 'app-form-to-print',
  template: `
    <form [formGroup]="form">
      <input formControlName="nom" placeholder="Nom">
      <input formControlName="email" placeholder="Email">
      <button (click)="imprimerFormulaire()">Imprimer</button>
    </form>
  `
})
export class FormToPrintComponent {
  form = this.fb.group({
    nom: [''],
    email: ['']
  });

  constructor(
    private printService: PrintService,
    private fb: FormBuilder
  ) {}

  imprimerFormulaire() {
    if (this.form.invalid) {
      alert('Veuillez remplir le formulaire');
      return;
    }

    const data = this.form.getRawValue();
    const html = this.genererHTMLFormulaire(data);
    this.printService.printDocument(html, 'Formulaire-Rempli');
  }

  private genererHTMLFormulaire(data: any): string {
    return `
      <html>
      <body>
        <h1>Formulaire Complété</h1>
        <p><strong>Nom:</strong> ${data.nom}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <hr>
        <p>Date d'impression: ${new Date().toLocaleString('fr-FR')}</p>
      </body>
      </html>
    `;
  }
}
```

### Exemple 9: Intégration avec API

```typescript
@Component({
  selector: 'app-api-print'
})
export class APIPrintComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private printService: PrintService
  ) {}

  ngOnInit() {
    this.chargerEtImprimer();
  }

  chargerEtImprimer() {
    this.http.get('/api/document/123')
      .subscribe(
        doc => {
          const html = this.genererHTML(doc);
          this.printService.printDocument(html, 'Document-API');
        },
        error => {
          console.error('Erreur lors du chargement du document', error);
          alert('Impossible de charger le document');
        }
      );
  }

  private genererHTML(doc: any): string {
    return `<html><body>${doc.contenu}</body></html>`;
  }
}
```

---

## Performance et optimisation

### Exemple 10: Mise en cache des documents

```typescript
export class CachedPrintComponent {
  private cache = new Map<string, string>();

  constructor(private printService: PrintService) {}

  imprimerAvecCache(docId: string) {
    // Vérifier le cache
    if (this.cache.has(docId)) {
      const html = this.cache.get(docId)!;
      this.printService.printDocument(html, docId);
      return;
    }

    // Générer et mettre en cache
    const html = this.genererDocument(docId);
    this.cache.set(docId, html);
    this.printService.printDocument(html, docId);
  }

  private genererDocument(docId: string): string {
    return `<html><body>Document ${docId}</body></html>`;
  }
}
```

### Exemple 11: Impression par lot

```typescript
export class BatchPrintComponent {
  constructor(private printService: PrintService) {}

  imprimerPlusieursDocuments(documents: any[]) {
    let index = 0;

    const imprimerSuivant = () => {
      if (index >= documents.length) {
        alert('Tous les documents ont été imprimés');
        return;
      }

      const doc = documents[index];
      const html = this.genererHTML(doc);
      
      console.log(`Impression du document ${index + 1}/${documents.length}`);
      this.printService.printDocument(html, `Document-${index}`);

      index++;
      // Attendre avant le suivant (éviter les conflits)
      setTimeout(imprimerSuivant, 3000);
    };

    imprimerSuivant();
  }

  private genererHTML(doc: any): string {
    return `<html><body><h1>${doc.titre}</h1></body></html>`;
  }
}
```

### Exemple 12: Service réactif pour l'impression

```typescript
export class ReactivePrintService {
  private printSubject = new Subject<PrintRequest>();

  constructor(private printService: PrintService) {
    this.printSubject.pipe(
      debounceTime(300), // Éviter les clics multiples rapides
      distinctUntilChanged()
    ).subscribe(request => {
      this.printService.printDocument(request.html, request.titre);
    });
  }

  print(html: string, titre: string) {
    this.printSubject.next({ html, titre });
  }
}

interface PrintRequest {
  html: string;
  titre: string;
}
```

---

## Bonnes pratiques

### ✅ À faire

```typescript
// 1. Toujours utiliser le PrintService
this.printService.printDocument(html, 'Doc');

// 2. Valider les données avant impression
if (!html || html.length === 0) {
  alert('Contenu vide');
  return;
}

// 3. Fournir des titres descriptifs
this.printService.printDocument(html, 'Acte-Naissance-2024-00123');

// 4. Gérer les erreurs
try {
  const html = this.genererHTML();
  this.printService.printDocument(html, 'Doc');
} catch (error) {
  console.error('Erreur impression:', error);
}
```

### ❌ À éviter

```typescript
// ❌ Ne pas utiliser window.open directement
const win = window.open();
win.document.write(html);

// ❌ Ne pas utiliser des titres vagues
this.printService.printDocument(html, 'Document');

// ❌ Ne pas oublier de validation
this.printService.printDocument(data.html, 'Doc');

// ❌ Ne pas ignorer les erreurs
this.printService.printDocument(html, 'Doc');
// Sans gestion d'erreur
```

---

## FAQ

**Q: Comment imprimer plusieurs pages?**
R: Utilisez `<div style="page-break-after: always;"></div>` en CSS.

**Q: Comment personnaliser les marges?**
R: Ajoutez un style `@media print { body { margin: 1cm; } }`

**Q: Comment imprimer sans la boîte de dialogue?**
R: Utilisez la méthode `printDirectly()` (mais les utilisateurs peuvent ne pas voir l'aperçu).

**Q: Comment vérifier si l'impression a réussi?**
R: Malheureusement, les navigateurs n'exposent pas cette information par sécurité.

---

## Ressources

- [MDN: Window.open()](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)
- [MDN: Window.print()](https://developer.mozilla.org/en-US/docs/Web/API/Window/print)
- [CSS @media print](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/print)
- [Angular Services](https://angular.io/guide/dependency-injection)

---

*Dernière mise à jour: 2024*
