// ── Agent ──────────────────────────────────────────────────────────────────
export type TypeContrat = 'fonctionnaire' | 'contractuel' | 'stage';
export type StatutAgent = 'actif' | 'conge' | 'suspendu';
export type Categorie  = 'A' | 'B' | 'C' | 'Stagiaire';

export interface Agent {
  id: string;
  matricule: string;
  nomComplet: string;
  nom?: string;
  prenom?: string;
  poste: string;
  direction: string;
  typeContrat: TypeContrat;
  categorie: Categorie;
  specialite?: string;
  grade: string;
  dateEmbauche: string;
  dateNaissance: string;
  genre: 'M' | 'F';
  telephone: string;
  email: string;
  statut: StatutAgent;
  salaireBrut: number;
  congesRestants: number;
  situationFamiliale?: string;
  diplome?: string;
}

// ── Congé ──────────────────────────────────────────────────────────────────
export type TypeConge = 'annuel' | 'maladie' | 'maternite' | 'paternite' | 'deces' | 'autre';
export type StatutConge = 'soumis' | 'approuve' | 'refuse' | 'en_cours';

export interface Conge {
  id: string;
  matricule: string;
  agent: string;
  type: TypeConge;
  dateDebut: string;
  duree: number;
  motif?: string;
  pieceJointe?: string; 
  statut: StatutConge;
}

// ── Absence ────────────────────────────────────────────────────────────────
export interface Absence {
  matricule: string;
  agent: string;
  date: string;
  motif: string;
  justifie: boolean;
}

// ── Recrutement ────────────────────────────────────────────────────────────
export type StatutRecrutement = 'en_cours' | 'termine' | 'annule';

export interface Recrutement {
  id: string;
  poste: string;
  direction: string;
  nbPostes: number;
  type: 'concours' | 'direct' | 'stage';
  cloture: string;
  candidatures: number;
  statut: StatutRecrutement;
}

// ── Formation ──────────────────────────────────────────────────────────────
export interface Formation {
  id: string;
  titre: string;
  organisme: string;
  formateur?: string;
  dateDebut: string;
  dateFin: string;
  agents: string;
  cout: number;
  statut: 'programme' | 'en_cours' | 'termine';
}

// ── Paie ───────────────────────────────────────────────────────────────────
export interface LignePaie {
  matricule: string;
  nomComplet: string;
  poste: string;
  brut: number;
  retenues: number;
  net: number;
  mode: string;
  statut: string;
}

// ── Prime ──────────────────────────────────────────────────────────────────
export interface Prime {
  matricule: string;
  type: string;
  montant: number;
  mois: string;
  justification?: string;
}

// ── Evaluation ────────────────────────────────────────────────────────────
export interface Evaluation {
  matricule: string;
  evaluateur: string;
  noteResultat: number;
  noteComportement: number;
  mention: string;
  commentaires: string;
}


