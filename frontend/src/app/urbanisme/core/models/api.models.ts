// ─────────────────────────────────────────────────────────────────────────────
//  Contrats API Laravel ↔ Angular — GMDI Urbanisme & SIG
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

// ── Parcelles ─────────────────────────────────────────────────────────────────
export interface ParcelleApi {
  id: number; reference: string; section: string; numero: number;
  superficie: number; localisation: string; quartier: string;
  proprietaire: string | null; titre_foncier: string | null;
  usage: string | null;
  statut: string; valeur_estimee: number | null;
  date_enregistrement: string | null;
  lat: number | null; lng: number | null;
  created_at: string;
}
export interface ParcelleCreateRequest {
  section: string; numero: number; superficie: number;
  localisation: string; quartier: string; proprietaire?: string;
  titre_foncier?: string; statut?: string; usage?: string; valeur_estimee?: number;
  lat?: number; lng?: number;
}

// ── Lots ──────────────────────────────────────────────────────────────────────
export interface LotApi {
  id: number; reference: string; lotissement: string; numero: number;
  superficie: number; usage: string; attribue_a: string | null;
  date_attribution: string | null; statut: string; prix: number | null;
  created_at: string;
}
export interface LotCreateRequest {
  lotissement: string; numero: number; superficie: number;
  usage: string; prix?: number; attribue_a?: string;
}

// ── Titres fonciers ───────────────────────────────────────────────────────────
export interface TitreFoncierApi {
  id: number; numero: string; proprietaire: string; parcelle: string | null;
  superficie: number; date_delivrance: string;
  date_expiration: string | null; statut: string; observation: string | null;
  localisation: string | null; type: string | null;
  lat: number | null; lng: number | null;
  created_at: string;
}
export interface TitreFoncierCreateRequest {
  proprietaire: string; parcelle?: string; superficie: number;
  date_delivrance: string; date_expiration?: string; observation?: string;
  localisation?: string; type?: string; numero?: string;
  lat?: number | null; lng?: number | null;
}

// ── Réserves administratives ──────────────────────────────────────────────────
export interface ReserveAdministrativeApi {
  id: number; designation: string | null; denomination: string | null;
  usage: string; superficie: number; localisation: string; statut: string;
  administration: string | null;
  lat: number | null; lng: number | null;
  created_at: string;
}
export interface ReserveAdministrativeCreateRequest {
  designation?: string; denomination?: string; usage: string;
  superficie: number; localisation: string; administration?: string | null;
  lat?: number | null; lng?: number | null;
}

// ── Permis de construire ──────────────────────────────────────────────────────
export interface PermisConstruireApi {
  id: number; reference: string; demandeur: string; adresse_travaux: string;
  type_construire: string; nombre_etages: number | null;
  superficie: number | null; cout_estime: number | null;
  date_depot: string; date_instruction: string | null;
  date_decision: string | null; instructeur: string | null;
  statut: string; motif_refus: string | null; created_at: string;
}
export interface PermisConstruireCreateRequest {
  demandeur: string; adresse_travaux?: string; type_construire?: string;
  localisation?: string; quartier?: string;
  ilot?: string | null; lot?: string | null; section?: string | null;
  telephone?: string | null;
  numero_piece?: string | null; type_piece?: string | null;
  lat?: number | null; lng?: number | null;
  agent?: string | null; observations?: string | null;
  surface_plancher?: number | null;
  nombre_etages?: number; superficie?: number; cout_estime?: number;
}

// ── Permis & autorisations (route générique, tous types confondus) ───────────
export interface PermisApi {
  id: number; reference: string; type: string; demandeur: string; beneficiaire: string;
  telephone: string | null; localisation: string; adresse_travaux: string; adresse: string;
  quartier: string; surface_plancher: number | null; superficie: number | null;
  nombre_etages: number | null; cout_estime: number | null; instructeur: string | null;
  motif_refus: string | null; date_depot: string; date_instruction: string | null;
  date_decision: string | null; date_expiration: string | null; statut: string;
  agent: string | null; observations: string | null; created_at: string;
}
export interface PermisCreateRequest {
  type: string; demandeur: string; telephone?: string | null; localisation?: string;
  quartier?: string; ilot?: string | null; lot?: string | null; section?: string | null;
  numero_piece?: string | null; type_piece?: string | null;
  surface_plancher?: number | null; lat?: number | null; lng?: number | null;
  agent?: string | null; observations?: string | null;
}

// ── Permis de démolir ─────────────────────────────────────────────────────────
export interface PermisDemolirApi {
  id: number; reference: string; demandeur: string;
  adresse_travaux: string; description_batiment: string;
  date_depot: string; statut: string; created_at: string;
}

// ── Certificats d'urbanisme ───────────────────────────────────────────────────
export interface CertificatUrbanismeApi {
  id: number; reference: string; demandeur: string; adresse: string;
  type: string; date_depot: string; date_delivrance: string | null;
  date_expiration: string | null; statut: string; created_at: string;
}

// ── Autorisations d'occupation ────────────────────────────────────────────────
export interface AutorisationOccupationApi {
  id: number; reference: string; beneficiaire: string;
  type_occupation: string; localisation: string;
  superficie: number | null; date_debut: string; date_fin: string;
  montant_redevance: number | null; statut: string; created_at: string;
}
export interface AutorisationCreateRequest {
  beneficiaire: string; type_occupation: string; localisation: string;
  superficie?: number; date_debut: string; date_fin: string; montant_redevance?: number;
}

// ── SIG — Quartiers ───────────────────────────────────────────────────────────
export interface QuartierSIGApi {
  id: number; nom: string; population: number | null;
  superficie: number; nb_parcelles: number | null;
  lat: number | null; lng: number | null; statut: string; created_at: string;
}

// ── SIG — Voiries ─────────────────────────────────────────────────────────────
export interface VoirieSIGApi {
  id: number; nom: string; quartier: string; longueur: number;
  largeur: number | null; type: string; statut: string; created_at: string;
}

// ── SIG — Réseaux ─────────────────────────────────────────────────────────────
export interface ReseauSIGApi {
  id: number; designation: string; type: string; quartier: string;
  longueur: number | null; capacite: string | null; statut: string; created_at: string;
}

// ── Lotissements ──────────────────────────────────────────────────────────────
export interface LotissementApi {
  id: number; nom: string; localisation: string; promoteur: string;
  nb_lots: number; superficie_totale: number;
  date_agrement: string | null; date_debut: string | null; date_fin: string | null;
  avancement: number; statut: string; created_at: string;
}
export interface LotissementCreateRequest {
  nom: string; localisation: string; promoteur: string;
  nb_lots: number; superficie_totale: number;
  date_agrement?: string; date_debut?: string;
}

// ── Aménagements urbains ──────────────────────────────────────────────────────
export interface AmenagementUrbainApi {
  id: number; designation: string; type: string;
  localisation: string; budget: number; bailleur: string;
  date_debut: string; date_fin: string | null;
  avancement: number; statut: string; created_at: string;
}
export interface AmenagementCreateRequest {
  designation: string; type: string; localisation: string;
  budget: number; bailleur: string; date_debut: string;
}

// ── Suivi chantiers ───────────────────────────────────────────────────────────
export interface SuiviChantierApi {
  id: number; projet: string; entrepreneur: string;
  date_visite: string; avancement: number; observations: string;
  recommandations: string | null; controleur: string; statut: string; created_at: string;
}
export interface SuiviChantierCreateRequest {
  projet: string; entrepreneur: string; date_visite: string;
  avancement: number; observations: string; recommandations?: string; controleur: string;
}

// ── Équipements publics ───────────────────────────────────────────────────────
export interface EquipementPublicApi {
  id: number; nom: string; type: string; adresse: string; quartier: string;
  capacite: string | null; responsable: string | null;
  lat: number | null; lng: number | null; statut: string; created_at: string;
}
export interface EquipementCreateRequest {
  nom: string; type: string; adresse: string; quartier: string;
  capacite?: string; responsable?: string; lat?: number; lng?: number;
}

// ── Statistiques ──────────────────────────────────────────────────────────────
export interface StatsUrbanismeApi {
  kpi: {
    total_parcelles: number; parcelles_libres: number;
    permis_en_cours: number; permis_accordes: number;
    chantiers_en_cours: number; equipements_publics: number;
    taux_urbanisation: number;
  };
  repartition_parcelles: { statut: string; nb: number; superficie: number }[];
  permis_par_statut: { statut: string; nb: number }[];
  equipements_par_type: { type: string; nb: number }[];
  projets_avancement: { projet: string; avancement: number; statut: string }[];
}
