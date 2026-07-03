# Guide de Testing - Fonctionnalité d'Impression

## 🧪 Tests unitaires

### Test du PrintService

```typescript
import { TestBed } from '@angular/core/testing';
import { PrintService } from './print.service';

describe('PrintService', () => {
  let service: PrintService;
  let windowOpenSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintService);
    windowOpenSpy = spyOn(window, 'open').and.returnValue({
      document: {
        write: jasmine.createSpy('write'),
        close: jasmine.createSpy('close')
      },
      onload: null,
      print: jasmine.createSpy('print'),
      close: jasmine.createSpy('close')
    } as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a window when printDocument is called', () => {
    const html = '<html><body>Test</body></html>';
    service.printDocument(html, 'Test');
    expect(windowOpenSpy).toHaveBeenCalled();
  });

  it('should write HTML to window document', () => {
    const html = '<html><body>Test</body></html>';
    const mockWindow = {
      document: {
        write: jasmine.createSpy('write'),
        close: jasmine.createSpy('close')
      },
      onload: null,
      print: jasmine.createSpy('print'),
      close: jasmine.createSpy('close'),
      focus: jasmine.createSpy('focus')
    };
    windowOpenSpy.and.returnValue(mockWindow as any);

    service.printDocument(html, 'Test');
    expect(mockWindow.document.write).toHaveBeenCalledWith(html);
  });

  it('should call print after document loads', (done) => {
    const html = '<html><body>Test</body></html>';
    const mockWindow = {
      document: {
        write: jasmine.createSpy('write'),
        close: jasmine.createSpy('close')
      },
      onload: null,
      print: jasmine.createSpy('print'),
      close: jasmine.createSpy('close'),
      focus: jasmine.createSpy('focus')
    };
    windowOpenSpy.and.returnValue(mockWindow as any);

    service.printDocument(html, 'Test');
    
    // Simulate onload
    setTimeout(() => {
      expect(mockWindow.print).toHaveBeenCalled();
      done();
    }, 300);
  });
});
```

---

## 🎯 Tests manuels

### Test 1: Impression des naissances

**Prérequis:**
- Application en cours d'exécution
- Au moins un acte de naissance enregistré

**Étapes:**
1. Accédez au module Naissances
2. Cliquez sur l'onglet "Registre"
3. Localisez un acte dans la liste
4. Cliquez sur le bouton "Imprimer"

**Résultats attendus:**
- ✅ Une nouvelle fenêtre s'ouvre
- ✅ L'acte s'affiche correctement
- ✅ La boîte de dialogue d'impression s'ouvre automatiquement
- ✅ Le document contient tous les détails
- ✅ Les images (logo, QR code) s'affichent
- ✅ La mise en page est correcte (format A4)

**Si les résultats ne sont pas attendus:**
```
Problem: Pas de fenêtre
Solution: Vérifiez les bloqueurs de pop-up

Problem: Boîte de dialogue ne s'ouvre pas
Solution: Vérifiez que JavaScript est activé

Problem: Images manquantes
Solution: Vérifiez la connexion Internet
```

### Test 2: Impression des décès

**Étapes:**
1. Module Décès → Onglet "Registre"
2. Sélectionner un acte de décès
3. Cliquer sur "Imprimer"

**Résultats attendus:**
- ✅ Document de décès s'affiche correctement
- ✅ Les informations du défunt sont présentes
- ✅ La date et le lieu de décès s'affichent

### Test 3: Impression des mariages

**Étapes:**
1. Module Mariages → Onglet "Registre"
2. Sélectionner un acte de mariage
3. Cliquer sur "Imprimer"

**Résultats attendus:**
- ✅ Document de mariage s'affiche
- ✅ Les informations des époux sont correctes
- ✅ La date et le lieu du mariage s'affichent

### Test 4: Impression des certificats

**Étapes:**
1. Module Certificats → Sélectionner un type (Célibat, Résidence, Vie)
2. Trouver un certificat dans la liste
3. Cliquer sur "Imprimer"

**Résultats attendus:**
- ✅ Le type de certificat correct s'affiche
- ✅ Les informations du bénéficiaire sont correctes
- ✅ Le certificat est formaté correctement

### Test 5: Enregistrement en PDF

**Étapes:**
1. Suivre les étapes du Test 1
2. Dans la boîte de dialogue d'impression
3. Sélectionner "Enregistrer en tant que PDF"
4. Choisir l'emplacement et cliquer "Enregistrer"

**Résultats attendus:**
- ✅ Le fichier PDF est téléchargé
- ✅ Le nom du fichier est descriptif
- ✅ Le PDF peut être ouvert et visualisé
- ✅ Tous les contenus sont présents dans le PDF

### Test 6: Impression physique

**Étapes:**
1. Avoir une imprimante connectée
2. Suivre les étapes du Test 1
3. Sélectionner votre imprimante
4. Cliquer sur "Imprimer"

**Résultats attendus:**
- ✅ Le document s'imprime correctement
- ✅ La mise en page A4 est correcte
- ✅ Les images s'impriment en couleur
- ✅ Aucun texte ne chevauche

### Test 7: Impression sur mobile

**Équipement:** Téléphone ou tablette

**Étapes:**
1. Accédez à l'application sur mobile
2. Naviguez vers un acte
3. Cliquez sur "Imprimer"

**Résultats attendus:**
- ✅ Le document s'affiche sur mobile
- ✅ La mise en page est adaptée à l'écran
- ✅ Les utilisateurs peuvent imprimer via AirPrint/Google Cloud Print
- ✅ Les utilisateurs peuvent enregistrer en PDF

---

## 🔍 Tests de compatibilité navigateur

### Navigateurs à tester

| Navigateur | Version | Status | Notes |
|-----------|---------|--------|-------|
| Chrome | Latest | ✅ | Support complet |
| Firefox | Latest | ✅ | Support complet |
| Safari | Latest | ✅ | Support complet |
| Edge | Latest | ✅ | Support complet |
| Opera | Latest | ✅ | Support complet |
| IE 11 | - | ❌ | Non supporté |
| Mobile Chrome | Latest | ✅ | Limitations mobiles |
| Mobile Safari | Latest | ✅ | Limitations mobiles |

**Comment tester:**

```bash
# Utiliser BrowserStack ou Sauce Labs pour les tests cross-browser
# Ou utiliser les outils de développement locaux:

# Chrome DevTools
F12 → Device Toolbar → Tester sur mobile

# Firefox DevTools
F12 → Responsive Design Mode

# Safari DevTools
Develop → Enter Responsive Design Mode
```

---

## ⚙️ Tests de performance

### Test de vitesse d'impression

```typescript
// Ajouter au composant pour tester
ngOnInit() {
  console.time('Impression');
  this.imprimer();
  console.timeEnd('Impression');
}
```

**Résultats attendus:**
- ✅ Ouverture de la fenêtre: < 500ms
- ✅ Rendu du document: < 1000ms
- ✅ Ouverture de la boîte de dialogue: < 1500ms
- ✅ Total: < 2000ms

### Test de mémoire

```bash
# Ouvrir Chrome DevTools
F12 → Memory → Take heap snapshot

# Avant impression:
# - Noter la mémoire utilisée

# Imprimer 10 documents

# Après:
# - La mémoire devrait revenir à peu près au niveau initial
# - Pas de fuites mémoire
```

---

## 🔐 Tests de sécurité

### Test 1: Vérification du contenu

```typescript
// S'assurer que aucune donnée sensible n'est exposée
// Vérifier dans la source de la page (F12 → Elements)
imprimerDocument() {
  // ❌ NE PAS INCLURE:
  // - Mots de passe
  // - Tokens d'authentification
  // - Données confidentielles

  // ✅ INCLURE SEULEMENT:
  // - Informations d'acte publiques
  // - Informations légalement requises
}
```

### Test 2: Protection du QR code

- ✅ Le QR code est valide
- ✅ Scannage du QR code fonctionne
- ✅ Le code de vérification est correct

### Test 3: Signature numérique

- ✅ La signature est présente
- ✅ Le timbre numérique s'affiche
- ✅ Le watermark "EXEMPLE" est visible (en dev)

---

## 📋 Checklist de validation complète

### Avant le déploiement en production

- [ ] Tous les tests unitaires passent
- [ ] Tous les tests manuels passent
- [ ] Aucune erreur de console
- [ ] Les images s'affichent correctement
- [ ] L'impression fonctionne sur tous les navigateurs
- [ ] Le PDF se télécharge correctement
- [ ] La mise en page A4 est correcte
- [ ] Les données sont correctement affichées
- [ ] Aucune fuite mémoire
- [ ] Les pop-up blockers ne causent pas de problèmes
- [ ] La performance est acceptable
- [ ] Les données sensibles ne sont pas exposées
- [ ] Le QR code fonctionne
- [ ] La signature numérique est présente
- [ ] Tous les modules (naissances, décès, mariages, certificats) fonctionnent
- [ ] Les versions mobiles fonctionnent
- [ ] La documentation est à jour
- [ ] Les erreurs sont gérées gracieusement
- [ ] L'UX est intuitive
- [ ] Les raccourcis clavier (Ctrl+P) fonctionnent

### Après le déploiement

- [ ] Monitorer les erreurs en production
- [ ] Collecter les retours utilisateurs
- [ ] Vérifier les statistiques d'utilisation
- [ ] Mettre à jour la documentation si nécessaire
- [ ] Planifier les améliorations futures

---

## 🐛 Rapport de bug

Si vous trouvez un bug, créez un rapport:

**Format:**
```
Titre: [Module] Problème d'impression

Description:
- Navigateur: [Chrome v120]
- Module: [Naissances]
- Action: [Cliquer sur Imprimer]
- Résultat attendu: [Document s'imprime]
- Résultat réel: [Erreur: xxx]
- Capture d'écran: [Joint]

Étapes pour reproduire:
1. ...
2. ...
3. ...

Fréquence: [Toujours/Parfois/Rarement]
```

---

## 📞 Support et escalade

- **Bug mineur:** Créer une issue GitHub
- **Bug majeur:** Contacter le responsable technique
- **Question:** Consulter la documentation
- **Amélioration:** Suggérer en réunion planning

---

*Document de test - Dernière mise à jour: 2024*
