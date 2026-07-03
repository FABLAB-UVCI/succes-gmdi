# 📐 Format A4 Portrait et Données Dynamiques - Guide d'Utilisation

## ✅ Améliorations apportées

### 1. Format A4 Portrait 

**Avant:**
- Format personnalisé (800px × 1130px)
- Padding fixe (40px)
- Aspect ratio pas standardisé

**Après:**
- Format officiel A4: **210mm × 297mm**
- Marges standardisées: **20mm** (haut, bas, gauche, droite)
- Orientation: **Portrait**
- CSS @media print optimisé
- Support impression native

### 2. Données dynamiques

**Avant:**
- Données codées en dur dans le template HTML
- Exemple: "Doukouré", "Kévin Alexis", "2024-02-12"
- Pas de lien avec les formulaires d'entrée

**Après:**
- Les données sont injectées dynamiquement depuis les formulaires
- Utilisation de template literals (`${data.nom}`)
- Formatage automatique des dates et heures
- Valeurs par défaut ("......................") si champ vide

---

## 🎯 Utilisation

### Remplir un formulaire de naissance

```
1. Module Naissances → Onglet "Déclaration"
2. Remplir les champs:
   - Nom de famille: KONAN
   - Prénoms: Yao Emmanuel
   - Date de naissance: 2024-12-15
   - Heure de naissance: 08:45
   - Sexe: Masculin
   - Lieu de naissance: CHU Cocody
   - Commune: Cocody
   - Père: Konan Youssouf
   - Profession Père: Ingénieur
   - Nationalité Père: Ivoirienne
   - Mère: Koné Aminata
   - Profession Mère: Enseignante
   - Nationalité Mère: Ivoirienne

3. Cliquer "Valider et générer l'acte"
```

### Imprimer un acte

```
1. Module Naissances → Onglet "Registre"
2. Localiser l'acte dans la liste
3. Cliquer sur le bouton "Imprimer"
```

### Résultat

Le PDF affichera:
- ✅ **Nom:** KONAN
- ✅ **Prénoms:** Yao Emmanuel
- ✅ **Date de naissance:** 15 décembre 2024 *(format français)*
- ✅ **Heure:** 8 heures 45 minutes *(formatée)*
- ✅ **Sexe:** Masculin
- ✅ **Lieu:** CHU Cocody
- ✅ **Commune:** Cocody
- ✅ **Père:** Konan Youssouf
- ✅ **Profession Père:** Ingénieur
- ✅ **Nationalité Père:** Ivoirienne
- ✅ **Mère:** Koné Aminata
- ✅ **Profession Mère:** Enseignante
- ✅ **Nationalité Mère:** Ivoirienne

---

## 🔄 Formatage des données

### Dates

```typescript
// Entrée: "2024-12-15"
// Sortie: "15 décembre 2024"

formatDate(dateString: string): string {
  // Format français avec jour, mois, année
  // Exemple: "15 décembre 2024"
}
```

### Heures

```typescript
// Entrée: "08:45"
// Sortie: "8 heures 45 minutes"

formatHeure(heureString: string): string {
  // Format français grammaticalement correct
  // Exemple: "8 heures 45 minutes"
  // Gère le singulier/pluriel
}
```

### Champs vides

```
// Si un champ n'est pas rempli
// La sortie affiche: "...................."
// Au lieu de: "undefined" ou "null"
```

---

## 📐 Format A4 Portrait - Spécifications

### Dimensions

| Paramètre | Valeur | Notes |
|-----------|--------|-------|
| Largeur | 210 mm | Standard ISO 216 |
| Hauteur | 297 mm | Standard ISO 216 |
| Orientation | Portrait | Vertical |
| Marge haut | 20 mm | Padding interne |
| Marge bas | 20 mm | Padding interne |
| Marge gauche | 20 mm | Padding interne |
| Marge droite | 20 mm | Padding interne |

### CSS pour impression

```css
/* Format A4 Portrait */
.document-container {
    width: 210mm;      /* Largeur A4 */
    height: 297mm;     /* Hauteur A4 */
    padding: 20mm;     /* Marges internes */
}

/* Media query pour impression */
@media print {
    body {
        background: white;
        margin: 0;
        padding: 0;
    }
    
    .document-container {
        box-shadow: none;      /* Pas d'ombre à l'impression */
        page-break-after: always;
        width: 100%;
        height: 100%;
    }
}
```

---

## 📋 Modules supportés

### ✅ Naissances
- [x] Format A4 Portrait
- [x] Données dynamiques
- [x] Formatage dates/heures
- [x] Impression automatique

### ✅ Décès  
- [x] Format A4 Portrait
- [x] Données dynamiques
- [x] Impression automatique

### ✅ Mariages
- [x] Format A4 Portrait
- [x] Données dynamiques
- [x] Impression automatique

### ✅ Certificats
- [x] Format A4 Portrait
- [x] Données dynamiques (Célibat, Résidence, Vie)
- [x] Impression automatique

---

## 🧪 Tester les changements

### Test 1: Format A4

**Étapes:**
1. Imprimer un acte
2. Ouvrir la boîte de dialogue d'impression (Ctrl+P)
3. Vérifier le format de papier: **Devrait être "A4"**
4. Vérifier l'orientation: **Devrait être "Portrait"**

**Résultats attendus:**
- ✅ Le document s'affiche en portrait
- ✅ Les marges sont uniformes (20mm)
- ✅ Le texte n'est pas coupé
- ✅ La mise en page est centrée

### Test 2: Données dynamiques

**Étapes:**
1. Remplir un formulaire avec des données:
   ```
   Nom: DUPONT
   Prenom: Jean Pierre
   Date: 2024-06-15
   Heure: 14:30
   ```
2. Générer l'acte
3. Cliquer sur "Imprimer"
4. Vérifier le contenu du PDF

**Résultats attendus:**
- ✅ Nom affiche: "DUPONT"
- ✅ Prenom affiche: "Jean Pierre"  
- ✅ Date affiche: "15 juin 2024"
- ✅ Heure affiche: "14 heures 30 minutes"
- ✅ Pas de données d'exemple ("Doukouré", "Kévin")

### Test 3: Champs vides

**Étapes:**
1. Laisser certains champs vides
2. Générer l'acte
3. Vérifier le PDF

**Résultats attendus:**
- ✅ Les champs vides affichent "......................."
- ✅ Pas d'erreur ou de valeur indéfinie
- ✅ La mise en page reste intacte

### Test 4: Impression physique

**Équipement:** Imprimante, papier A4 blanc

**Étapes:**
1. Imprimer un acte sur papier physique
2. Vérifier le résultat

**Résultats attendus:**
- ✅ Format standard A4
- ✅ Orientation portrait
- ✅ Marges corrects
- ✅ Pas de texte coupé
- ✅ Pas de déformation
- ✅ Qualité d'impression correcte

---

## 🎨 Personnalisation (optionnel)

### Modifier les marges

```typescript
// Dans le CSS:
.document-container {
    width: 210mm;
    height: 297mm;
    padding: 25mm;  // Changer de 20mm à 25mm
}
```

### Modifier le formatage des dates

```typescript
// Dans formatDate():
// Avant: "15 décembre 2024"
// Après: "15/12/2024"

formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('fr-FR'); // Format court
}
```

### Ajouter plus d'informations

Modifiez le template HTML pour ajouter des champs supplémentaires:
```html
<tr>
    <td class="label-cell">Nationalité Père</td>
    <td class="separator-cell">:</td>
    <td class="value-cell">${data.pereNat || '.......................'}</td>
</tr>
```

---

## 🔍 Dépannage

### Problème: Le format n'est pas A4

**Cause possible:** Les paramètres d'impression ne sont pas corrects

**Solution:**
1. Ouvrir Ctrl+P
2. Cliquer sur "Paramètres plus"
3. Vérifier "Format de papier": **A4**
4. Vérifier "Orientation": **Portrait**

### Problème: Les données ne s'affichent pas

**Cause possible:** Les champs du formulaire ne sont pas remplis

**Solution:**
1. Remplir tous les champs du formulaire
2. Vérifier que les données sont correctes
3. Générer l'acte à nouveau

### Problème: Les dates ne sont pas formatées

**Cause possible:** Format de date incorrecte dans le formulaire

**Solution:**
1. Vérifier que la date est au format: **YYYY-MM-DD**
2. Exemple: **2024-12-15** (correct) vs **15/12/2024** (incorrect)
3. Utiliser le sélecteur de date du navigateur (input type="date")

### Problème: La mise en page est déformée

**Cause possible:** Les marges ne sont pas respectées

**Solution:**
1. Vérifier l'orientation: Portrait
2. Vérifier le zoom: 100%
3. Vérifier "Arrière-plan graphique": Activé

---

## 📊 Comparaison avant/après

| Aspect | Avant | Après |
|--------|-------|-------|
| **Format** | 800×1130px | A4 (210×297mm) |
| **Orientation** | Personnalisée | Portrait standard |
| **Marges** | 40px | 20mm |
| **Données** | Codées en dur | Dynamiques |
| **Dates** | "2024-02-12" | "12 février 2024" |
| **Heures** | "08:45" | "8 heures 45 minutes" |
| **Champs vides** | Vides | "........................." |
| **Impression** | Manuelle | Automatique |
| **Modules** | Naissances | Tous (4 modules) |

---

## 🎯 Prochaines étapes

### Immédiatement
- [ ] Tester l'impression sur papier A4
- [ ] Vérifier les formats de données
- [ ] Valider le rendu final

### Bientôt
- [ ] Ajouter plus de champs dynamiques
- [ ] Améliorer le formatage
- [ ] Ajouter des validations

### Futur
- [ ] Export PDF direct (sans impression)
- [ ] Enregistrement des actes
- [ ] Signatures électroniques

---

## ✅ Checklist d'utilisation

- [ ] Tous les champs du formulaire sont remplis
- [ ] Les données sont correctes
- [ ] Le format d'impression est A4 Portrait
- [ ] Les marges sont correctes (20mm)
- [ ] Les dates sont formatées en français
- [ ] Les heures sont formatées en français
- [ ] Pas de données d'exemple dans le résultat
- [ ] L'impression fonctionne
- [ ] Le PDF téléchargé est lisible
- [ ] La mise en page est correcte

---

**Version:** 2.1.0  
**Date:** 2024  
**Status:** Production Ready ✅

**Améliorations:**
- ✅ Format A4 Portrait standardisé
- ✅ Données dynamiques depuis les formulaires
- ✅ Formatage français automatique
- ✅ Tous les modules supportés
- ✅ Marges standardisées (20mm)
- ✅ CSS @media print optimisé
