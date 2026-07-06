// src/app/core/models/finances.models.ts

export type StatutRecette = 'en_attente' | 'valide' | 'paye' | 'retard';
export type StatutDepense = 'en_attente' | 'valide' | 'engage' | 'paye';
export type StatutBudget = 'provisoire' | 'approuve' | 'rejete';
export type Chapitre = 'recettes' | 'personnel' | 'fonctionnement' | 'investissement';
export type TypeMouvementCaisse = 'encaissement' | 'decaissement';
export type ModePaiement = 'especes' | 'virement' | 'mobile_money' | 'cheque';

// src/app/core/models/finances.models.ts

export interface Recette {
  id: string;
  reference: string;
  contribuable: string;
  adresse?: string;
  serviceEmetteur?: string;
  operateur?: string;
  numeroTransaction?: string;  // ← Ajoutez cette ligne
  typeTaxe: string;
  montant: number;
  dateEcheance: string;
  modePaiement: ModePaiement;
  statut: StatutRecette;
  datePaiement?: string;
}

export interface Depense {
  id: string;
  reference: string;
  objet: string;
  fournisseur: string;
  montant: number;
  chapitre: Chapitre;
  article: string;
  dateEngagement: string;
  description: string;
  statut: StatutDepense;
  datePaiement?: string;
}

export interface LigneBudget {
  id: string;
  chapitre: Chapitre;
  article: string;
  designation: string;
  montantPrevisionnel: number;
  montantConsomme: number;
  statut: StatutBudget;
}

export interface EcritureComptable {
  numero: string;
  date: string;
  journal: string;
  libelle: string;
  compte: string;
  debit: number;
  credit: number;
  piece: string;
}

export interface CompteGL {
  compte: string;
  intitule: string;
  debit: number;
  credit: number;
  solde: number;
}

export interface RecetteParService {
  service: string;
  type: string;
  montant: number;
  pct: number;
}

export interface MouvementCaisse {
  date: string;
  libelle: string;
  type: TypeMouvementCaisse;
  montant: number;
  soldeApres: number;
}

export interface MouvementBanque {
  date: string;
  libelle: string;
  debit: number;
  credit: number;
  solde: number;
}