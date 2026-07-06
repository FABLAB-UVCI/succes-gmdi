// ── Statuts ───────────────────────────────────────────────────────────────────
export type StatutActu       = 'publie' | 'brouillon';
export type TypeActu         = 'communique' | 'annonce' | 'evenement';
export type StatutRec        = 'en_traitement' | 'repondu' | 'cloture';
export type StatutSug        = 'recu' | 'en_etude' | 'transmis' | 'rejete';
export type StatutCons       = 'programme' | 'actif' | 'cloture';
export type StatutSms        = 'envoye' | 'programme' | 'echec';
export type TypeSms          = 'info' | 'fiscal' | 'sante' | 'travaux' | 'evenement' | 'alerte';

// ── Actualités ────────────────────────────────────────────────────────────────
export interface Actualite {
  id: string;
  type: TypeActu;
  titre: string;
  contenu: string;
  auteur: string;
  date: string;
  statut: StatutActu;
  categorie?: string;
}

// ── Réseaux sociaux ───────────────────────────────────────────────────────────
export interface CompteReseau {
  id: string;
  plateforme: 'facebook' | 'twitter' | 'instagram' | 'whatsapp';
  nom: string;
  handle: string;
  abonnes: number;
  publications: number;
  tauxEngagement: number;
  porteMois: number;
  dernierPost?: string;
}

export interface PostProgramme {
  id: string;
  date: string;
  contenu: string;
  plateformes: string[];
  responsable: string;
  statut: 'programme' | 'publie' | 'a_rediger' | 'a_confirmer';
}

// ── Relations publiques ───────────────────────────────────────────────────────
export interface Partenaire {
  id: string;
  nom: string;
  type: string;
  domaine: string;
  contact: string;
  dateDebut: string;
  statut: 'actif' | 'inactif' | 'suspendu';
}

export interface ArticlePresse {
  id: string;
  date: string;
  media: string;
  titre: string;
  type: 'TV' | 'Radio' | 'Presse écrite' | 'Web';
  tonalite: 'Positive' | 'Neutre' | 'Mitigée' | 'Négative';
}

export interface Media {
  id: string;
  nom: string;
  type: string;
  audience: string;
  contactJournaliste: string;
  accredite: boolean;
}

// ── Gestion documentaire ──────────────────────────────────────────────────────
export interface Document {
  id: string;
  titre: string;
  type: 'photo' | 'video' | 'pdf' | 'arrete' | 'deliberation';
  categorie: string;
  date: string;
  auteur?: string;
  url?: string;
  droits?: string;
}

// ── Participation citoyenne ───────────────────────────────────────────────────
export interface Reclamation {
  id: string;
  reference: string;          // RCL-2025-042
  objet: string;
  demandeur: string;
  service: string;
  canal: string;
  date: string;
  statut: StatutRec;
}

export interface Suggestion {
  id: string;
  reference: string;          // SUG-2025-015
  objet: string;
  citoyen: string;
  description?: string;
  date: string;
  statut: StatutSug;
}

export interface ConsultationPublique {
  id: string;
  titre: string;
  theme: string;
  dateOuverture: string;
  dateCloture: string;
  participants: number;
  statut: StatutCons;
  canaux?: string;
}

// ── SMS & Notifications ───────────────────────────────────────────────────────
export interface CampagneSms {
  id: string;
  nom: string;
  type: TypeSms;
  message: string;
  destinataires: string;
  nbDestinataires: number;
  dateEnvoi: string;
  statut: StatutSms;
  tauxLivraison: number;
}

// ── KPIs ──────────────────────────────────────────────────────────────────────
export interface KpiCommunication {
  publicationsMois: number;
  abonnesTotaux: number;
  tauxLivraisonSms: number;
  reclamationsOuvertes: number;
  partenairesActifs: number;
  documentsArchives: number;
}
