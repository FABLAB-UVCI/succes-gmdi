// recherche.component.ts
import { Component, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ActeNaissance {
  id: string;
  numero: string;
  nomComplet: string;
  dateNaissance: string;
  lieu: string;
  statut: string;
  qrCode: string;
}

interface Mariage {
  id: string;
  numero: string;
  epoux: string;
  epouse: string;
  dateMariage: string;
  regime: string;
  statut: string;
}

interface Deces {
  id: string;
  numero: string;
  defunt: string;
  dateDeces: string;
  lieu: string;
  cause: string;
  statut: string;
}

interface Certificat {
  id: string;
  numero: string;
  type: string;
  demandeur: string;
  dateDelivrance: string;
  dateExpiration: string;
  statut: string;
}

interface Adoption {
  id: string;
  numero: string;
  enfantNom: string;
  enfantDateNaissance: string;
  adoptantNom: string;
  dateJugement: string;
  tribunal: string;
  statut: string;
  qrCode: string;
}

interface ResultatRecherche {
  id: string;
  typeLabel: string;
  type: string;
  numero: string;
  nomComplet: string;
  date: string;
  lieu: string;
  statut: string;
}

@Component({
  selector: 'app-recherche',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recherche.html',
  styleUrls: ['./recherche.css']
})
export class RechercheComponent {
  // Inputs reçus du parent (AppComponent)
  @Input() naissances: ActeNaissance[] = [];
  @Input() mariages: Mariage[] = [];
  @Input() deces: Deces[] = [];
  @Input() certificats: Certificat[] = [];
  @Input() adoptions: Adoption[] = [];
  
  // Outputs pour communiquer avec le parent
  @Output() showToast = new EventEmitter<string>();
  @Output() imprimer = new EventEmitter<{type: string, numero: string}>();

  // État local
  currentTab = signal<string>('global');
  
  // Formulaires de recherche
  searchGlobal = { 
    num: '', 
    nom: '', 
    type: 'tous',
    dateDebut: '',
    dateFin: ''
  };
  
  searchNaissance = { num: '', nom: '', date: '' };
  searchMariage = { num: '', epoux: '', epouse: '', date: '' };
  searchDeces = { num: '', defunt: '', date: '', lieu: '' };
  searchCertificat = { num: '', demandeur: '', type: '' };
  searchAdoption = { num: '', enfantNom: '', adoptantNom: '' };
  
  // Résultats
  resultatsRecherche = signal<ResultatRecherche[]>([]);
  rechercheEffectuee = signal<boolean>(false);

  toast(msg: string) {
    this.showToast.emit(msg);
  }

  // Recherche globale multicritère
  rechercherGlobale() {
    const num = this.searchGlobal.num.trim().toLowerCase();
    const nom = this.searchGlobal.nom.trim().toLowerCase();
    const type = this.searchGlobal.type;
    const dateDebut = this.searchGlobal.dateDebut;
    const dateFin = this.searchGlobal.dateFin;
    
    let results: ResultatRecherche[] = [];

    // Recherche dans les naissances
    if (type === 'tous' || type === 'naissance') {
      this.naissances.forEach(r => {
        let correspond = true;
        if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
        if (nom && !r.nomComplet.toLowerCase().includes(nom)) correspond = false;
        if (dateDebut && r.dateNaissance < dateDebut) correspond = false;
        if (dateFin && r.dateNaissance > dateFin) correspond = false;
        
        if (correspond) {
          results.push({
            id: r.id,
            typeLabel: 'Naissance',
            type: 'naissance',
            numero: r.numero,
            nomComplet: r.nomComplet,
            date: r.dateNaissance,
            lieu: r.lieu,
            statut: r.statut
          });
        }
      });
    }

    // Recherche dans les mariages
    if (type === 'tous' || type === 'mariage') {
      this.mariages.forEach(r => {
        let correspond = true;
        if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
        if (nom && !r.epoux.toLowerCase().includes(nom) && !r.epouse.toLowerCase().includes(nom)) correspond = false;
        if (dateDebut && r.dateMariage < dateDebut) correspond = false;
        if (dateFin && r.dateMariage > dateFin) correspond = false;
        
        if (correspond) {
          results.push({
            id: r.id,
            typeLabel: 'Mariage',
            type: 'mariage',
            numero: r.numero,
            nomComplet: `${r.epoux} & ${r.epouse}`,
            date: r.dateMariage,
            lieu: '-',
            statut: r.statut
          });
        }
      });
    }

    // Recherche dans les décès
    if (type === 'tous' || type === 'deces') {
      this.deces.forEach(r => {
        let correspond = true;
        if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
        if (nom && !r.defunt.toLowerCase().includes(nom)) correspond = false;
        if (dateDebut && r.dateDeces < dateDebut) correspond = false;
        if (dateFin && r.dateDeces > dateFin) correspond = false;
        
        if (correspond) {
          results.push({
            id: r.id,
            typeLabel: 'Décès',
            type: 'deces',
            numero: r.numero,
            nomComplet: r.defunt,
            date: r.dateDeces,
            lieu: r.lieu,
            statut: r.statut
          });
        }
      });
    }

    // Recherche dans les certificats
    if (type === 'tous' || type === 'certificat') {
      this.certificats.forEach(r => {
        let correspond = true;
        if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
        if (nom && !r.demandeur.toLowerCase().includes(nom)) correspond = false;
        
        if (correspond) {
          results.push({
            id: r.id,
            typeLabel: r.type,
            type: 'certificat',
            numero: r.numero,
            nomComplet: r.demandeur,
            date: r.dateDelivrance,
            lieu: '-',
            statut: r.statut
          });
        }
      });
    }

    // Recherche dans les adoptions
    if (type === 'tous' || type === 'adoption') {
      this.adoptions.forEach(r => {
        let correspond = true;
        if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
        if (nom && (!r.enfantNom.toLowerCase().includes(nom) && !r.adoptantNom.toLowerCase().includes(nom))) correspond = false;
        
        if (correspond) {
          results.push({
            id: r.id,
            typeLabel: 'Adoption',
            type: 'adoption',
            numero: r.numero,
            nomComplet: `${r.enfantNom} (adopté par ${r.adoptantNom})`,
            date: r.dateJugement,
            lieu: r.tribunal,
            statut: r.statut
          });
        }
      });
    }

    this.resultatsRecherche.set(results);
    this.rechercheEffectuee.set(true);
    
    if (results.length === 0) {
      this.toast("Aucun résultat trouvé pour votre recherche");
    } else {
      this.toast(`${results.length} résultat(s) trouvé(s)`);
    }
  }

  // Recherche spécifique naissances
  rechercherNaissance() {
    const num = this.searchNaissance.num.trim().toLowerCase();
    const nom = this.searchNaissance.nom.trim().toLowerCase();
    const date = this.searchNaissance.date;
    
    let results: ResultatRecherche[] = [];
    
    this.naissances.forEach(r => {
      let correspond = true;
      if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
      if (nom && !r.nomComplet.toLowerCase().includes(nom)) correspond = false;
      if (date && r.dateNaissance !== date) correspond = false;
      
      if (correspond) {
        results.push({
          id: r.id,
          typeLabel: 'Naissance',
          type: 'naissance',
          numero: r.numero,
          nomComplet: r.nomComplet,
          date: r.dateNaissance,
          lieu: r.lieu,
          statut: r.statut
        });
      }
    });
    
    this.resultatsRecherche.set(results);
    this.rechercheEffectuee.set(true);
    
    if (results.length === 0) {
      this.toast("Aucune naissance trouvée");
    } else {
      this.toast(`${results.length} naissance(s) trouvée(s)`);
    }
  }

  // Recherche spécifique mariages
  rechercherMariage() {
    const num = this.searchMariage.num.trim().toLowerCase();
    const epoux = this.searchMariage.epoux.trim().toLowerCase();
    const epouse = this.searchMariage.epouse.trim().toLowerCase();
    const date = this.searchMariage.date;
    
    let results: ResultatRecherche[] = [];
    
    this.mariages.forEach(r => {
      let correspond = true;
      if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
      if (epoux && !r.epoux.toLowerCase().includes(epoux)) correspond = false;
      if (epouse && !r.epouse.toLowerCase().includes(epouse)) correspond = false;
      if (date && r.dateMariage !== date) correspond = false;
      
      if (correspond) {
        results.push({
          id: r.id,
          typeLabel: 'Mariage',
          type: 'mariage',
          numero: r.numero,
          nomComplet: `${r.epoux} & ${r.epouse}`,
          date: r.dateMariage,
          lieu: '-',
          statut: r.statut
        });
      }
    });
    
    this.resultatsRecherche.set(results);
    this.rechercheEffectuee.set(true);
    
    if (results.length === 0) {
      this.toast("Aucun mariage trouvé");
    } else {
      this.toast(`${results.length} mariage(s) trouvé(s)`);
    }
  }

  // Recherche spécifique décès
  rechercherDeces() {
    const num = this.searchDeces.num.trim().toLowerCase();
    const defunt = this.searchDeces.defunt.trim().toLowerCase();
    const date = this.searchDeces.date;
    const lieu = this.searchDeces.lieu.trim().toLowerCase();
    
    let results: ResultatRecherche[] = [];
    
    this.deces.forEach(r => {
      let correspond = true;
      if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
      if (defunt && !r.defunt.toLowerCase().includes(defunt)) correspond = false;
      if (date && r.dateDeces !== date) correspond = false;
      if (lieu && !r.lieu.toLowerCase().includes(lieu)) correspond = false;
      
      if (correspond) {
        results.push({
          id: r.id,
          typeLabel: 'Décès',
          type: 'deces',
          numero: r.numero,
          nomComplet: r.defunt,
          date: r.dateDeces,
          lieu: r.lieu,
          statut: r.statut
        });
      }
    });
    
    this.resultatsRecherche.set(results);
    this.rechercheEffectuee.set(true);
    
    if (results.length === 0) {
      this.toast("Aucun décès trouvé");
    } else {
      this.toast(`${results.length} décès trouvé(s)`);
    }
  }

  // Recherche spécifique certificats
  rechercherCertificat() {
    const num = this.searchCertificat.num.trim().toLowerCase();
    const demandeur = this.searchCertificat.demandeur.trim().toLowerCase();
    const type = this.searchCertificat.type;
    
    let results: ResultatRecherche[] = [];
    
    this.certificats.forEach(r => {
      let correspond = true;
      if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
      if (demandeur && !r.demandeur.toLowerCase().includes(demandeur)) correspond = false;
      if (type && r.type !== type) correspond = false;
      
      if (correspond) {
        results.push({
          id: r.id,
          typeLabel: r.type,
          type: 'certificat',
          numero: r.numero,
          nomComplet: r.demandeur,
          date: r.dateDelivrance,
          lieu: '-',
          statut: r.statut
        });
      }
    });
    
    this.resultatsRecherche.set(results);
    this.rechercheEffectuee.set(true);
    
    if (results.length === 0) {
      this.toast("Aucun certificat trouvé");
    } else {
      this.toast(`${results.length} certificat(s) trouvé(s)`);
    }
  }

  // Recherche spécifique adoptions
  rechercherAdoption() {
    const num = this.searchAdoption.num.trim().toLowerCase();
    const enfantNom = this.searchAdoption.enfantNom.trim().toLowerCase();
    const adoptantNom = this.searchAdoption.adoptantNom.trim().toLowerCase();
    
    let results: ResultatRecherche[] = [];
    
    this.adoptions.forEach(r => {
      let correspond = true;
      if (num && !r.numero.toLowerCase().includes(num)) correspond = false;
      if (enfantNom && !r.enfantNom.toLowerCase().includes(enfantNom)) correspond = false;
      if (adoptantNom && !r.adoptantNom.toLowerCase().includes(adoptantNom)) correspond = false;
      
      if (correspond) {
        results.push({
          id: r.id,
          typeLabel: 'Adoption',
          type: 'adoption',
          numero: r.numero,
          nomComplet: `${r.enfantNom} (adopté par ${r.adoptantNom})`,
          date: r.dateJugement,
          lieu: r.tribunal,
          statut: r.statut
        });
      }
    });
    
    this.resultatsRecherche.set(results);
    this.rechercheEffectuee.set(true);
    
    if (results.length === 0) {
      this.toast("Aucune adoption trouvée");
    } else {
      this.toast(`${results.length} adoption(s) trouvée(s)`);
    }
  }

  // Réinitialiser la recherche
  resetRecherche() {
    this.searchGlobal = { num: '', nom: '', type: 'tous', dateDebut: '', dateFin: '' };
    this.searchNaissance = { num: '', nom: '', date: '' };
    this.searchMariage = { num: '', epoux: '', epouse: '', date: '' };
    this.searchDeces = { num: '', defunt: '', date: '', lieu: '' };
    this.searchCertificat = { num: '', demandeur: '', type: '' };
    this.searchAdoption = { num: '', enfantNom: '', adoptantNom: '' };
    this.resultatsRecherche.set([]);
    this.rechercheEffectuee.set(false);
    this.toast("Recherche réinitialisée");
  }
}