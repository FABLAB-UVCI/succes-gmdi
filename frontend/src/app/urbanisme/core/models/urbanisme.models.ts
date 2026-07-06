// ── Énumérations ─────────────────────────────────────────────────────────────
export type StatutParcelle   = 'libre' | 'attribue' | 'litige' | 'reserve';
export type StatutPermis     = 'depose' | 'en_instruction' | 'instruction' | 'accorde' | 'refuse' | 'expire' | 'retire';
export type StatutChantier   = 'planifie' | 'en_cours' | 'interrompu' | 'termine' | 'retard';
export type TypeEquipement   = 'ecole' | 'centre_sante' | 'marche' | 'espace_vert' | 'mairie' | 'autre'
                             | 'sante' | 'sport' | 'securite' | 'commissariat' | 'gendarmerie' | 'eaux_forets';
export type TypeReseau       = 'electrique' | 'hydraulique' | 'telecom' | 'assainissement';
export type TypePermis       = 'construire' | 'demolir' | 'certificat' | 'autorisation' | 'occupation';

// ── Gestion foncière ──────────────────────────────────────────────────────────
export interface Parcelle {
  id: string;
  reference: string;
  section: string;
  numero: number;
  superficie: number;
  localisation: string;
  quartier: string;
  proprietaire?: string;
  titreFoncier?: string;
  statut: StatutParcelle;
  usage?: string;
  valeurEstimee?: number;
  dateEnregistrement?: string;
  coordonnees?: { lat: number; lng: number };
}

export interface Lot {
  id: string;
  reference: string;
  lotissement: string;
  numero: number;
  superficie: number;
  usage: 'residentiel' | 'commercial' | 'industriel' | 'mixte';
  attribueA?: string;
  attributaire?: string;
  dateAttribution?: string;
  statut: 'disponible' | 'attribue' | 'reserve';
  prix?: number;
}

export interface TitreFoncier {
  id: string;
  numero: string;
  proprietaire: string;
  parcelle?: string;
  superficie: number;
  dateDelivrance: string;
  dateExpiration?: string;
  type?: string;
  localisation?: string;
  statut: 'valide' | 'expire' | 'litige' | 'en_cours';
  observation?: string;
  coordonnees?: { lat: number; lng: number };
}

export interface ReserveAdministrative {
  id: string;
  designation?: string;
  denomination?: string;
  usage: string;
  administration?: string;
  superficie: number;
  localisation: string;
  statut: 'reserve' | 'affecte' | 'libere';
  coordonnees?: { lat: number; lng: number };
}

// ── Permis & Autorisations ────────────────────────────────────────────────────
export interface PermisconstruireBase {
  id: string;
  reference: string;
  demandeur: string;
  adresseTravaux?: string;
  localisation?: string;
  ilot?: string;
  lot?: string;
  section?: string;
  quartier?: string;
  superficie?: number;
  surfacePlancher?: number;
  numeroPiece?: string;
  typePiece?: string;
  lat?: number;
  lng?: number;
  dateDepot: string;
  dateInstruction?: string;
  dateDecision?: string;
  instructeur?: string;
  agent?: string;
  telephone?: string;
  observations?: string;
  statut: StatutPermis;
  motifRefus?: string;
}

export interface PermisConstruire extends PermisconstruireBase {
  typeConstruire: 'villa' | 'immeuble' | 'commerce' | 'industriel' | 'autre';
  nombreEtages?: number;
  coutEstime?: number;
  type?: string;
}

export interface PermisDemlir {
  id: string;
  reference: string;
  demandeur: string;
  adresseTravaux: string;
  descriptionBatiment: string;
  dateDepot: string;
  statut: StatutPermis;
}

export interface CertificatUrbanisme {
  id: string;
  reference: string;
  demandeur: string;
  adresse: string;
  type: 'informatif' | 'operationnel';
  dateDepot: string;
  dateDelivrance?: string;
  dateExpiration?: string;
  statut: 'en_cours' | 'delivre' | 'refuse';
}

export interface AutorisationOccupation {
  id: string;
  reference: string;
  beneficiaire: string;
  typeOccupation: string;
  localisation: string;
  superficie?: number;
  dateDebut: string;
  dateFin: string;
  montantRedevance?: number;
  statut: 'active' | 'expiree' | 'resiliee';
}

// ── Cartographie SIG ──────────────────────────────────────────────────────────
export interface QuartierSIG {
  id: string;
  nom: string;
  code?: string;
  chef?: string;
  population?: number;
  superficie: number;
  nbParcelles?: number;
  nombreParcelles?: number;
  coordCentre?: { lat: number; lng: number };
  statut: 'urbanise' | 'periurbain' | 'rural';
}

export interface VoirieSIG {
  id: string;
  nom: string;
  quartier: string;
  longueur: number;
  largeur?: number;
  type: 'principale' | 'secondaire' | 'voie_acces';
  statut: 'existante' | 'projetee' | 'en_travaux';
  etat?: string;
}

export interface ReseauSIG {
  id: string;
  designation: string;
  type: TypeReseau;
  quartier: string;
  zone?: string;
  operateur?: string;
  longueur?: number;
  capacite?: string;
  tauxCouverture?: number;
  statut: 'operationnel' | 'en_travaux' | 'projete';
}

// ── Projets urbains ───────────────────────────────────────────────────────────
export interface Lotissement {
  id: string;
  nom: string;
  reference?: string;
  denomination?: string;
  localisation: string;
  promoteur: string;
  nbLots: number;
  nombreLots?: number;
  lotsDisponibles?: number;
  superficieTotale: number;
  superficie?: number;
  dateAgrement?: string;
  dateDebut?: string;
  dateFin?: string;
  avancement: number;
  statut: StatutChantier;
}

export interface AmenagementUrbain {
  id: string;
  designation: string;
  intitule?: string;
  type: 'voirie' | 'espace_vert' | 'marche' | 'drainage' | 'eclairage' | 'autre';
  localisation: string;
  budget: number;
  bailleur: string;
  financeur?: string;
  dateDebut: string;
  dateFin?: string;
  avancement: number;
  tauxAvancement?: number;
  statut: StatutChantier;
}

export interface SuiviChantier {
  id: string;
  projet: string;
  entrepreneur: string;
  dateVisite: string;
  dateOuverture?: string;
  datePrevueFin?: string;
  derniereVisite?: string;
  avancement: number;
  tauxAvancement?: number;
  observations: string;
  recommandations?: string;
  controleur: string;
  statut: 'conforme' | 'retard' | 'anomalie';
}

// ── Géolocalisation équipements ───────────────────────────────────────────────
export interface EquipementPublic {
  id: string;
  nom: string;
  type: TypeEquipement;
  adresse: string;
  quartier: string;
  capacite?: string;
  responsable?: string;
  coordonnees?: { lat?: number; lng?: number };
  statut: 'operationnel' | 'en_construction' | 'ferme' | 'renovation';
  etat?: string;
}

// ── KPIs ──────────────────────────────────────────────────────────────────────
export interface KpiUrbanisme {
  totalParcelles: number;
  parcellesLibres: number;
  permisEnCours: number;
  permisAccordes: number;
  permisEnAttente?: number;
  permisPendants?: number;
  permisMois?: number;
  chantierEnCours: number;
  lotissementsActifs?: number;
  equipementsPublics: number;
  equipementsGeolocalisés?: number;
  tauxUrbanisation: number;
}
