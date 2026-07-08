// ─────────────────────────────────────────────────────────────────────────────
//  Contrats API Laravel ↔ Angular — GMDI Module Communication
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

// ── Actualités ────────────────────────────────────────────────────────────────
export interface ActualiteApi {
  id: number; type: string; titre: string; contenu: string;
  auteur: string; date: string; statut: string; categorie: string | null;
  created_at: string;
}
export interface ActualiteCreateRequest {
  type: string; titre: string; contenu: string;
  auteur?: string; statut?: string; categorie?: string; date?: string;
}

// ── Réseaux sociaux ───────────────────────────────────────────────────────────
export interface CompteReseauApi {
  id: number; plateforme: string; nom: string; handle: string;
  abonnes: number; publications: number; taux_engagement: number;
  porte_mois: number; dernier_post: string | null; created_at: string;
}
export interface PostProgrammeApi {
  id: number; date: string; contenu: string; plateformes: string;
  responsable: string; statut: string; created_at: string;
}

// ── Partenaires ───────────────────────────────────────────────────────────────
export interface PartenaireApi {
  id: number; nom: string; nom_contact: string | null; type: string; domaine: string;
  contact: string; date_debut: string; statut: string; created_at: string;
}
export interface PartenaireCreateRequest {
  nom: string; nom_contact?: string; type: string; domaine: string; contact: string; date_debut: string;
}

// ── Articles presse ───────────────────────────────────────────────────────────
export interface ArticlePresseApi {
  id: number; date: string; media: string; titre: string;
  type: string; tonalite: string; created_at: string;
}

// ── Documents ─────────────────────────────────────────────────────────────────
export interface DocumentApi {
  id: number; titre: string; type: string; categorie: string;
  date: string; auteur: string | null; url: string | null;
  droits: string | null; created_at: string;
}
export interface DocumentCreateRequest {
  titre: string; type: string; categorie: string; date?: string;
  auteur?: string; url?: string; droits?: string;
}

// ── Réclamations ──────────────────────────────────────────────────────────────
export interface ReclamationApi {
  id: number; reference: string; objet: string; demandeur: string;
  service: string; canal: string; date: string; statut: string; created_at: string;
}
export interface ReclamationCreateRequest {
  objet: string; demandeur: string; service: string; canal: string;
}

// ── Suggestions ───────────────────────────────────────────────────────────────
export interface SuggestionApi {
  id: number; reference: string; objet: string; citoyen: string;
  description: string | null; date: string; statut: string; created_at: string;
}
export interface SuggestionCreateRequest {
  objet: string; citoyen?: string; description?: string;
}

// ── Consultations ─────────────────────────────────────────────────────────────
export interface ConsultationApi {
  id: number; titre: string; theme: string; date_ouverture: string;
  date_cloture: string; participants: number; statut: string;
  canaux: string | null; created_at: string;
}
export interface ConsultationCreateRequest {
  titre: string; theme: string; date_ouverture: string;
  date_cloture: string; canaux?: string;
}

// ── SMS / Campagnes ───────────────────────────────────────────────────────────
export interface CampagneSmsApi {
  id: number; nom: string; type: string; message: string;
  destinataires: string; nb_destinataires: number; date_envoi: string;
  statut: string; taux_livraison: number; created_at: string;
}
export interface CampagneSmsCreateRequest {
  nom: string; type: string; message: string;
  destinataires: string; date_envoi?: string; programme?: boolean;
}
export interface AlerteRequest {
  message: string; cible: string; quartier?: string; priorite?: string;
}

// ── Statistiques ──────────────────────────────────────────────────────────────
export interface StatsCommunicationApi {
  kpi: {
    publications_mois: number; abonnes_totaux: number;
    taux_livraison_sms: number; reclamations_ouvertes: number;
    partenaires_actifs: number; documents_archives: number;
  };
  actualites_par_type: { type: string; nb: number }[];
  sms_par_mois: { mois: string; nb: number; taux: number }[];
}
