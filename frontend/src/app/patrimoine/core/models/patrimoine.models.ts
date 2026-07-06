// ── Bien patrimonial ──────────────────────────────────────────────────────────
export type CategorieBien = 'mobilier' | 'informatique' | 'vehicule' | 'equipement' | 'immobilier' | 'terrain';
export type StatutBien    = 'occupe' | 'disponible' | 'loue' | 'en_maintenance';

export interface Bien {
  id: string;
  reference: string;
  designation: string;
  categorie: CategorieBien;
  localisation: string;
  superficie?: number;
  valeurAcquisition: number;
  valeurActuelle: number;
  dateAcquisition: string;
  affectation: string;
  statut: StatutBien;
  tauxAmortissement: number;
  qrCode?: string;
}

// ── Véhicule ──────────────────────────────────────────────────────────────────
export interface Vehicule {
  id: string;
  modele: string;
  immatriculation: string;
  kilometrage: number;
  affectation: string;
  valeur: number;
  finAssurance: string;
  finVisiteTechnique: string;
  statut: 'occupe' | 'en_maintenance' | 'en_panne';
}

// ── Terrain ───────────────────────────────────────────────────────────────────
export interface Terrain {
  id: string;
  localisation: string;
  superficie: number;
  valeur: number;
  usage: string;
  titreFoncier: string;
  statut: string;
  dateAcquisition?: string;
}

// ── Bâtiment ──────────────────────────────────────────────────────────────────
export interface Batiment {
  id: string;
  nom: string;
  superficie: number;
  valeurActuelle: number;
  affectation: string;
  etat: 'bon' | 'moyen' | 'degrade';
  derniereInspection: string;
}

// ── Marché ────────────────────────────────────────────────────────────────────
export interface Marche {
  id: string;
  nom: string;
  superficie: number;
  nombreBoutiques: number;
  loyerMoyenBoutique: number;
  revenusMenusuels: number;
  statut: 'actif' | 'rehabilitation' | 'ferme';
}

// ── Affectation ───────────────────────────────────────────────────────────────
export interface MouvementAffectation {
  id: string;
  date: string;
  reference: string;
  bien: string;
  origine: string;
  destination: string;
  responsable: string;
  motif: string;
}

// ── Entretien ─────────────────────────────────────────────────────────────────
export type StatutEntretien = 'programme' | 'en_cours' | 'effectue' | 'urgent';

export interface Entretien {
  id: string;
  bien: string;
  typeEntretien: string;
  datePrevue: string;
  periodicite: string;
  coutEstime: number;
  statut: StatutEntretien;
}

// ── Réparation ────────────────────────────────────────────────────────────────
export type Priorite = 'normale' | 'haute' | 'urgente';
export type StatutReparation = 'en_cours' | 'resolue' | 'annulee';

export interface Reparation {
  id: string;
  bien: string;
  description: string;
  priorite: Priorite;
  prestataire: string;
  coutEstime: number;
  statut: StatutReparation;
  dateDeclaration?: string;
}

// ── Amortissement ─────────────────────────────────────────────────────────────
export interface LigneAmortissement {
  id: string;
  bien: string;
  valeurAcquisition: number;
  tauxAnnuel: number;
  anneeDebut: number;
  amortissementCumule: number;
  valeurNette: number;
}

// ── KPIs ──────────────────────────────────────────────────────────────────────
export interface KpiPatrimoine {
  totalBiens: number;
  valeurTotale: number;
  loyersMensuel: number;
  urgences: number;
}

export interface StatsAmortissement {
  valeurAcquisitionTotale: number;
  valeurNetteTotale: number;
  amortissementsCumules: number;
  biensAmortis: number;
}
