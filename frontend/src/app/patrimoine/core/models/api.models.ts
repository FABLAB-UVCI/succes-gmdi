// ─────────────────────────────────────────────────────────────────────────────
//  Contrats API Laravel ↔ Angular — GMDI Module Patrimoine
// ─────────────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number; from: number | null; to: number | null; };
  links: { first: string; last: string; prev: string | null; next: string | null; };
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginRequest  { email: string; password: string; }
export interface LoginResponse {
  token: string; token_type: 'Bearer'; expires_in: number;
  user: UserApi;
}
export interface UserApi {
  id: number; name: string; email: string;
  role: string;
  permissions: string[];
}

// ── Bien ──────────────────────────────────────────────────────────────────────
export interface BienApi {
  id: number;
  reference: string;
  designation: string;
  categorie: string;
  localisation: string;
  superficie: number | null;
  valeur_acquisition: number;
  valeur_actuelle: number;
  date_acquisition: string;
  affectation: string;
  statut: string;
  taux_amortissement: number;
  qr_code: string;
  created_at: string;
  updated_at: string;
}

export interface BienCreateRequest {
  categorie: string;
  designation: string;
  localisation: string;
  valeur_acquisition: number;
  date_acquisition: string;
  affectation: string;
  taux_amortissement?: number;
  superficie?: number;
}

export interface BienFilters {
  search?: string;
  categorie?: string;
  statut?: string;
  page?: number;
  per_page?: number;
}

// ── Véhicule ──────────────────────────────────────────────────────────────────
export interface VehiculeApi {
  id: number;
  modele: string;
  immatriculation: string;
  kilometrage: number;
  affectation: string;
  valeur: number;
  fin_assurance: string;
  fin_visite_technique: string;
  statut: string;
  created_at: string;
}

export interface VehiculeCreateRequest {
  modele: string;
  immatriculation: string;
  kilometrage?: number;
  affectation: string;
  valeur?: number;
  fin_assurance?: string;
  fin_visite_technique?: string;
}

// ── Terrain ───────────────────────────────────────────────────────────────────
export interface TerrainApi {
  id: number;
  localisation: string;
  superficie: number;
  valeur: number;
  usage: string;
  titre_foncier: string;
  statut: string;
  date_acquisition: string | null;
  created_at: string;
}

export interface TerrainCreateRequest {
  localisation: string;
  superficie: number;
  valeur?: number;
  usage?: string;
  titre_foncier?: string;
  date_acquisition?: string;
}

// ── Mobilier ──────────────────────────────────────────────────────────────────
export interface MobilierCreateRequest {
  designation: string;
  quantite?: number;
  valeur_unitaire?: number;
  localisation: string;
  date_acquisition?: string;
  etat?: string;
}

// ── Informatique ──────────────────────────────────────────────────────────────
export interface InformatiqueCreateRequest {
  type_materiel: string;
  modele?: string;
  numero_serie?: string;
  affectation: string;
  valeur?: number;
  date_acquisition?: string;
}

// ── Équipement ────────────────────────────────────────────────────────────────
export interface EquipementCreateRequest {
  designation: string;
  marque?: string;
  numero_serie?: string;
  localisation: string;
  valeur?: number;
  date_acquisition?: string;
}

// ── Affectation ───────────────────────────────────────────────────────────────
export interface MouvementApi {
  id: number;
  date: string;
  reference: string;
  bien: string;
  origine: string;
  destination: string;
  responsable: string;
  motif: string;
  created_at: string;
}

export interface AffectationCreateRequest {
  reference: string;
  direction: string;
  responsable?: string;
  date_effet: string;
  motif?: string;
}

// ── Entretien ─────────────────────────────────────────────────────────────────
export interface EntretienApi {
  id: number;
  bien: string;
  type_entretien: string;
  date_prevue: string;
  periodicite: string;
  cout_estime: number;
  statut: string;
  created_at: string;
}

export interface EntretienCreateRequest {
  bien: string;
  type_entretien: string;
  date_prevue: string;
  periodicite?: string;
  cout_estime?: number;
}

// ── Réparation ────────────────────────────────────────────────────────────────
export interface ReparationApi {
  id: number;
  bien: string;
  description: string;
  priorite: string;
  prestataire: string;
  cout_estime: number;
  statut: string;
  date_declaration: string;
  created_at: string;
}

export interface ReparationCreateRequest {
  bien: string;
  description: string;
  priorite?: string;
  prestataire?: string;
  cout_estime?: number;
}

// ── Amortissement ─────────────────────────────────────────────────────────────
export interface AmortissementApi {
  id: number;
  bien: string;
  valeur_acquisition: number;
  taux_annuel: number;
  annee_debut: number;
  amortissement_cumule: number;
  valeur_nette: number;
}

// ── Statistiques ─────────────────────────────────────────────────────────────
export interface StatsPatrimoineApi {
  total_biens: number;
  valeur_totale: number;
  loyers_mensuel: number;
  urgences: number;
  valeur_acquisition_totale: number;
  valeur_nette_totale: number;
  amortissements_cumules: number;
  biens_amortis: number;
  repartition_categorie: { categorie: string; nombre: number; valeur: number; part: number }[];
  repartition_statut: { statut: string; nombre: number; valeur: number }[];
  depreciation_categorie: { categorie: string; valeur_brute: number; taux_moyen: number; depreciation_annuelle: number; valeur_nette: number }[];
}
