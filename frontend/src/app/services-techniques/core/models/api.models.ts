// ─────────────────────────────────────────────────────────────────────────────
//  Contrats API Laravel ↔ Angular — GMDI Module Services Techniques
// ─────────────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number; from: number | null; to: number | null; };
  links: { first: string; last: string; prev: string | null; next: string | null; };
}

export interface ApiResponse<T = null> { success: boolean; message: string; data: T; }

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginRequest  { email: string; password: string; }
export interface LoginResponse { token: string; token_type: 'Bearer'; expires_in: number; user: UserApi; }
export interface UserApi { id: number; name: string; email: string; role: string; permissions: string[]; }

// ── Routes ────────────────────────────────────────────────────────────────────
export interface RouteApi {
  id: number; nom: string; quartier: string; longueur: number;
  type: string; etat: string;
  date_dernier_entretien: string | null; created_at: string;
}
export interface RouteCreateRequest { nom: string; quartier: string; longueur: number; type: string; etat?: string; }

// ── Entretien voirie ──────────────────────────────────────────────────────────
export interface EntretienVoirieApi {
  id: number; route: string; type_entretien: string; date_debut: string;
  date_fin: string | null; equipe: string; cout_estime: number;
  cout_reel: number | null; statut: string; created_at: string;
}
export interface EntretienVoirieCreateRequest { route: string; type_entretien: string; date_debut: string; date_fin?: string; equipe: string; cout_estime?: number; }

// ── Réparation voirie ─────────────────────────────────────────────────────────
export interface ReparationVoirieApi {
  id: number; route: string; description: string; priorite: string;
  signale_par: string; date_signalement: string;
  date_intervention: string | null; statut: string; created_at: string;
}
export interface ReparationVoirieCreateRequest { route: string; description: string; priorite?: string; signale_par: string; }

// ── Lampadaires ───────────────────────────────────────────────────────────────
export interface LampadaireApi {
  id: number; reference: string; localisation: string; quartier: string;
  type_lampe: string; puissance: number; statut: string;
  date_posee: string | null; date_dernier_controle: string | null; created_at: string;
}
export interface LampadaireCreateRequest { localisation: string; quartier: string; type_lampe: string; puissance?: number; date_posee?: string; }

// ── Panne éclairage ───────────────────────────────────────────────────────────
export interface PanneEclairageApi {
  id: number; reference: string; localisation: string; description: string;
  date_signalement: string; technicien: string | null;
  date_resolution: string | null; statut: string; created_at: string;
}
export interface PanneEclairageCreateRequest { localisation: string; description: string; }

// ── Maintenance éclairage ─────────────────────────────────────────────────────
export interface MaintenanceEclairageApi {
  id: number; zone: string; nb_lampadaires: number;
  type_intervention: string; date_prevue: string;
  technicien: string; statut: string; created_at: string;
}

// ── Caniveaux ─────────────────────────────────────────────────────────────────
export interface CaniveauApi {
  id: number; localisation: string; quartier: string; longueur: number;
  etat: string; date_dernier_nettoyage: string | null; created_at: string;
}
export interface CaniveauCreateRequest { localisation: string; quartier: string; longueur: number; etat?: string; }

// ── Intervention drainage ─────────────────────────────────────────────────────
export interface InterventionDrainageApi {
  id: number; localisation: string; type: string; date_intervention: string;
  equipe: string; statut: string; observations: string | null; created_at: string;
}

// ── Collecte déchets ──────────────────────────────────────────────────────────
export interface CollecteDechetApi {
  id: number; zone: string; frequence: string;
  prochaine_collecte: string; tonnage: number | null; statut: string; created_at: string;
}

// ── Bâtiments communaux ───────────────────────────────────────────────────────
export interface BatimentCommunalApi {
  id: number; nom: string; type: string; adresse: string;
  superficie: number; annee_construction: number | null;
  etat: string; responsable: string | null;
  date_derniere_inspection: string | null; created_at: string;
}
export interface BatimentCreateRequest { nom: string; type: string; adresse: string; superficie: number; annee_construction?: number; etat?: string; responsable?: string; }

// ── Travaux bâtiment ──────────────────────────────────────────────────────────
export interface TravauxBatimentApi {
  id: number; batiment: string; description: string; type: string;
  date_debut: string; date_fin: string | null;
  cout_estime: number; prestataire: string | null; statut: string; created_at: string;
}
export interface TravauxBatimentCreateRequest { batiment: string; description: string; type: string; date_debut: string; cout_estime?: number; prestataire?: string; }

// ── Demandes citoyennes ───────────────────────────────────────────────────────
export interface DemandeInterventionApi {
  id: number; reference: string; type_service: string; description: string;
  localisation: string; demandeur: string; telephone: string | null;
  date_depot: string; priorite: string; statut: string;
  assigne_a: string | null; date_assignation: string | null;
  date_resolution: string | null; created_at: string;
}
export interface DemandeCreateRequest { type_service: string; description: string; localisation: string; demandeur: string; telephone?: string; priorite?: string; }

// ── Bons de travail ───────────────────────────────────────────────────────────
export interface BonTravailApi {
  id: number; reference: string; demande_ref: string | null;
  description: string; service: string; equipe: string; chef: string;
  date_debut: string; date_fin: string | null;
  materiaux: string | null; statut: string; created_at: string;
}
export interface BonTravailCreateRequest { demande_ref?: string; description: string; service: string; equipe: string; chef: string; date_debut: string; materiaux?: string; }

// ── Équipes ───────────────────────────────────────────────────────────────────
export interface EquipeApi {
  id: number; nom: string; chef: string; membres: number;
  bon_en_cours: string | null; localisation: string | null;
  statut: string; created_at: string;
}

// ── Planning maintenance ──────────────────────────────────────────────────────
export interface PlanningMaintenanceApi {
  id: number; equipement: string; service: string; type_maintenance: string;
  date_prevue: string; periodicite: string; responsable: string;
  cout_estime: number | null; statut: string; created_at: string;
}
export interface PlanningCreateRequest { equipement: string; service: string; type_maintenance: string; date_prevue: string; periodicite?: string; responsable: string; cout_estime?: number; }

// ── Maintenance corrective ────────────────────────────────────────────────────
export interface MaintenanceCorrectiveApi {
  id: number; equipement: string; service: string; panne: string;
  priorite: string; technicien: string | null; date_signalement: string;
  date_resolution: string | null; cout_reel: number | null; statut: string; created_at: string;
}
export interface MaintenanceCorrectiveCreateRequest { equipement: string; service: string; panne: string; priorite?: string; }

// ── Statistiques ──────────────────────────────────────────────────────────────
export interface StatsServicesTechniquesApi {
  kpi: {
    interventions_en_cours: number;
    pannes_signalees: number;
    travaux_planifies: number;
    demandes_citoyennes: number;
    taux_resolution: number;
    delai_moyen_jours: number;
  };
  repartition_par_service: { service: string; nb: number }[];
  demandes_par_statut: { statut: string; nb: number }[];
  maintenance: { planifiees: number; en_retard: number; effectuees_mois: number };
}
