// ── Statuts communs ───────────────────────────────────────────────────────────
export type StatutTravaux  = 'planifie' | 'en_cours' | 'termine' | 'suspendu';
export type StatutPanne    = 'signalee' | 'en_intervention' | 'resolue';
export type Priorite       = 'normale' | 'haute' | 'urgente';
export type StatutIntervention = 'ouverte' | 'assignee' | 'en_cours' | 'terminee' | 'cloturee';
export type StatutMaintenance  = 'programme' | 'en_cours' | 'effectue' | 'en_retard';

// ── Voirie ────────────────────────────────────────────────────────────────────
export interface Route {
  id: string;
  nom: string;
  quartier: string;
  longueur: number;           // mètres
  type: 'bitumee' | 'laterite' | 'piste';
  etat: 'bon' | 'moyen' | 'degrade' | 'critique';
  dateDernierEntretien?: string;
}

export interface EntretienVoirie {
  id: string;
  route: string;
  typeEntretien: string;
  dateDebut: string;
  dateFin?: string;
  equipe: string;
  coutEstime: number;
  coutReel?: number;
  statut: StatutTravaux;
}

export interface ReparationVoirie {
  id: string;
  route: string;
  description: string;
  priorite: Priorite;
  signalePar: string;
  dateSignalement: string;
  dateIntervention?: string;
  statut: StatutPanne;
}

// ── Éclairage public ──────────────────────────────────────────────────────────
export interface Lampadaire {
  id: string;
  reference: string;        // ECL-001
  localisation: string;
  quartier: string;
  typeLampe: string;
  puissance: number;        // Watts
  statut: 'fonctionnel' | 'en_panne' | 'en_maintenance';
  datePosee?: string;
  dateDernierControle?: string;
}

export interface PanneEclairage {
  id: string;
  reference: string;
  localisation: string;
  description: string;
  dateSignalement: string;
  technicien?: string;
  dateResolution?: string;
  statut: StatutPanne;
}

export interface MaintenanceEclairage {
  id: string;
  zone: string;
  nbLampadaires: number;
  typeIntervention: string;
  datePrevue: string;
  technicien: string;
  statut: StatutMaintenance;
}

// ── Eau & Assainissement ──────────────────────────────────────────────────────
export interface Caniveau {
  id: string;
  localisation: string;
  quartier: string;
  longueur: number;           // mètres
  etat: 'bon' | 'colmate' | 'degrade';
  dateDernierNettoyage?: string;
}

export interface InterventionDrainage {
  id: string;
  localisation: string;
  type: 'curage' | 'debouchage' | 'reparation' | 'construction';
  dateIntervention: string;
  equipe: string;
  statut: StatutTravaux;
  observations?: string;
}

export interface CollecteDechet {
  id: string;
  zone: string;
  frequence: string;          // 'Quotidienne' | 'Hebdomadaire'
  prochaineCollecte: string;
  tonnage?: number;
  statut: 'planifie' | 'effectue' | 'manque';
}

// ── Bâtiments communaux ───────────────────────────────────────────────────────
export type TypeBatiment = 'mairie' | 'ecole' | 'centre_social' | 'marche' | 'autre';

export interface BatimentCommunal {
  id: string;
  nom: string;
  type: TypeBatiment;
  adresse: string;
  superficie: number;         // m²
  anneeConstrucion?: number;
  etat: 'bon' | 'moyen' | 'degrade';
  responsable?: string;
  dateDerniereInspection?: string;
}

export interface TravauxBatiment {
  id: string;
  batiment: string;
  description: string;
  type: 'reparation' | 'renovation' | 'construction' | 'entretien';
  dateDebut: string;
  dateFin?: string;
  coutEstime: number;
  prestataire?: string;
  statut: StatutTravaux;
}

// ── Interventions (gestion des demandes) ─────────────────────────────────────
export interface DemandeIntervention {
  id: string;
  reference: string;          // DI-2025-001284
  typeService: string;        // 'voirie' | 'eclairage' | 'eau' | 'batiment'
  description: string;
  localisation: string;
  demandeur: string;
  telephone?: string;
  dateDepot: string;
  priorite: Priorite;
  statut: StatutIntervention;
  assigneA?: string;
  dateAssignation?: string;
  dateResolution?: string;
}

export interface BonTravail {
  id: string;
  reference: string;          // BT-2025-000847
  demande?: string;           // ref DI liée
  description: string;
  service: string;
  equipe: string;
  chef: string;
  dateDebut: string;
  dateFin?: string;
  materiaux?: string;
  statut: StatutTravaux;
}

export interface SuiviEquipe {
  id: string;
  nom: string;
  chef: string;
  membres: number;
  bonEnCours?: string;
  localisation?: string;
  statut: 'disponible' | 'en_intervention' | 'repos';
}

// ── Maintenance ───────────────────────────────────────────────────────────────
export interface PlanningMaintenance {
  id: string;
  equipement: string;
  service: string;
  typeMaintenance: string;
  datePrevue: string;
  periodicite: string;
  responsable: string;
  coutEstime?: number;
  statut: StatutMaintenance;
}

export interface MaintenanceCorrective {
  id: string;
  equipement: string;
  service: string;
  panne: string;
  priorite: Priorite;
  technicien?: string;
  dateSignalement: string;
  dateResolution?: string;
  coutReel?: number;
  statut: 'signale' | 'en_cours' | 'resolu';
}

// ── KPIs ──────────────────────────────────────────────────────────────────────
export interface KpiServicesTechniques {
  interventionsEnCours: number;
  pannesSignalees: number;
  travauxPlanifies: number;
  demandesCitoyennes: number;
  tauxResolution: number;     // %
  delaiMoyenJours: number;
}
