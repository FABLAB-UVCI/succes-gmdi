import { Injectable, signal, inject, computed } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import {
  Parcelle, Lot, TitreFoncier, ReserveAdministrative,
  PermisConstruire, PermisDemlir, CertificatUrbanisme, AutorisationOccupation,
  QuartierSIG, VoirieSIG, ReseauSIG,
  Lotissement, AmenagementUrbain, SuiviChantier,
  EquipementPublic, KpiUrbanisme
} from '../models/urbanisme.models';
import {
  ParcelleApiService, LotApiService, TitreFoncierApiService, ReserveApiService,
  PermisConstruireApiService, PermisDemolirApiService,
  CertificatUrbanismeApiService, AutorisationOccupationApiService,
  QuartierSIGApiService, VoirieSIGApiService, ReseauSIGApiService,
  LotissementApiService, AmenagementApiService, SuiviChantierApiService,
  EquipementPublicApiService, StatsUrbanismeApiService
} from './urbanisme-api.service';

@Injectable({ providedIn: 'root' })
export class UrbanismeService {

  // ── Injections ────────────────────────────────────────────────────────────
  private parcelleApi  = inject(ParcelleApiService);
  private lotApi       = inject(LotApiService);
  private titreApi     = inject(TitreFoncierApiService);
  private reserveApi   = inject(ReserveApiService);
  private pcApi        = inject(PermisConstruireApiService);
  private pdApi        = inject(PermisDemolirApiService);
  private cuApi        = inject(CertificatUrbanismeApiService);
  private aoApi        = inject(AutorisationOccupationApiService);
  private quartierApi  = inject(QuartierSIGApiService);
  private voirieApi    = inject(VoirieSIGApiService);
  private reseauApi    = inject(ReseauSIGApiService);
  private lotissApi    = inject(LotissementApiService);
  private amenagApi    = inject(AmenagementApiService);
  private chantierApi  = inject(SuiviChantierApiService);
  private equipApi     = inject(EquipementPublicApiService);
  private statsApi     = inject(StatsUrbanismeApiService);

  // ── Cache réactif ─────────────────────────────────────────────────────────
  readonly parcelles         = signal<Parcelle[]>([]);
  readonly lots              = signal<Lot[]>([]);
  readonly titresFonciers    = signal<TitreFoncier[]>([]);
  readonly reserves          = signal<ReserveAdministrative[]>([]);

  readonly permisConstruire  = signal<PermisConstruire[]>([]);
  readonly permisDemolir     = signal<PermisDemlir[]>([]);
  readonly certificats       = signal<CertificatUrbanisme[]>([]);
  readonly autorisations     = signal<AutorisationOccupation[]>([]);

  readonly quartiers         = signal<QuartierSIG[]>([]);
  readonly voiries           = signal<VoirieSIG[]>([]);
  readonly reseaux           = signal<ReseauSIG[]>([]);

  readonly lotissements      = signal<Lotissement[]>([]);
  readonly amenagements      = signal<AmenagementUrbain[]>([]);
  readonly chantiers         = signal<SuiviChantier[]>([]);

  readonly equipements       = signal<EquipementPublic[]>([]);

  readonly loadingPermis     = signal(false);
  readonly loadingParcelles  = signal(false);

  readonly kpi = signal<KpiUrbanisme>({
    totalParcelles: 0, parcellesLibres: 0, permisEnCours: 0,
    permisAccordes: 0, chantierEnCours: 0, equipementsPublics: 0, tauxUrbanisation: 0
  });

  // ═══════════════════════════════════════════════════════════════════════════
  //  GESTION FONCIÈRE
  // ═══════════════════════════════════════════════════════════════════════════

  loadParcelles(f: { search?: string; statut?: string; quartier?: string } = {}): void {
    this.loadingParcelles.set(true);
    this.parcelleApi.getAll(f).pipe(
      tap(r => {
        this.parcelles.set(r.data.map(x => ({
          id: String(x.id), reference: x.reference, section: x.section,
          numero: x.numero, superficie: x.superficie, localisation: x.localisation,
          quartier: x.quartier, proprietaire: x.proprietaire ?? undefined,
          titreFoncier: x.titre_foncier ?? undefined, usage: x.usage ?? undefined, statut: x.statut as any,
          valeurEstimee: x.valeur_estimee ?? undefined,
          dateEnregistrement: x.date_enregistrement ?? undefined,
          coordonnees: (x.lat && x.lng) ? { lat: x.lat, lng: x.lng } : undefined
        })));
        this.loadingParcelles.set(false);
      })
    ).subscribe({ error: () => this.loadingParcelles.set(false) });
  }

  enregistrerParcelle(f: {
    section: string; numero: number; superficie: number;
    localisation: string; quartier: string; proprietaire?: string;
    titreFoncier?: string; statut?: string; usage?: string; valeurEstimee?: number;
    lat?: number; lng?: number;
  }): Observable<Parcelle> {
    return this.parcelleApi.create({
      section: f.section, numero: f.numero, superficie: f.superficie,
      localisation: f.localisation, quartier: f.quartier,
      proprietaire: f.proprietaire, titre_foncier: f.titreFoncier,
      statut: f.statut, usage: f.usage, valeur_estimee: f.valeurEstimee,
      lat: f.lat, lng: f.lng
    }).pipe(
      map(r => ({
        id: String(r.data.id), reference: r.data.reference, section: r.data.section, numero: r.data.numero,
        superficie: r.data.superficie, localisation: r.data.localisation, quartier: r.data.quartier,
        proprietaire: r.data.proprietaire ?? undefined, titreFoncier: r.data.titre_foncier ?? undefined,
        usage: r.data.usage ?? undefined, valeurEstimee: r.data.valeur_estimee ?? undefined,
        statut: r.data.statut as any,
        coordonnees: (r.data.lat && r.data.lng) ? { lat: r.data.lat, lng: r.data.lng } : undefined,
      })),
      tap(p => this.parcelles.update(l => [p, ...l]))
    );
  }

  updateStatutParcelle(id: string, statut: string): void {
    this.parcelleApi.updateStatut(Number(id), statut).pipe(
      tap(() => this.parcelles.update(l => l.map(p => p.id === id ? { ...p, statut: statut as any } : p)))
    ).subscribe();
  }

  loadLots(f: { statut?: string; lotissement?: string } = {}): void {
    this.lotApi.getAll(f).pipe(
      tap(r => this.lots.set(r.data.map(x => ({
        id: String(x.id), reference: x.reference, lotissement: x.lotissement,
        numero: x.numero, superficie: x.superficie, usage: x.usage as any,
        attribueA: x.attribue_a ?? undefined, dateAttribution: x.date_attribution ?? undefined,
        statut: x.statut as any, prix: x.prix ?? undefined
      }))))
    ).subscribe();
  }

  attribuerLot(id: string, beneficiaire: string): void {
    this.lotApi.attribuer(Number(id), beneficiaire).pipe(
      tap(() => this.lots.update(l => l.map(lot => lot.id === id ? { ...lot, statut: 'attribue' as const, attribueA: beneficiaire } : lot)))
    ).subscribe();
  }

  loadTitresFonciers(): void {
    this.titreApi.getAll().pipe(
      tap(r => this.titresFonciers.set(r.data.map(x => ({
        id: String(x.id), numero: x.numero, proprietaire: x.proprietaire,
        parcelle: x.parcelle ?? undefined, superficie: x.superficie,
        localisation: x.localisation ?? undefined,
        dateDelivrance: x.date_delivrance, dateExpiration: x.date_expiration ?? undefined,
        type: x.type ?? undefined,
        statut: x.statut as any, observation: x.observation ?? undefined,
        coordonnees: (x.lat && x.lng) ? { lat: Number(x.lat), lng: Number(x.lng) } : undefined
      }))))
    ).subscribe();
  }

  enregistrerTitre(f: { proprietaire: string; parcelle?: string; localisation?: string; superficie: number; dateDelivrance: string; dateExpiration?: string; observation?: string; type?: string; numero?: string; lat?: number; lng?: number; [key: string]: any }): Observable<TitreFoncier> {
    return this.titreApi.create({
      proprietaire: f.proprietaire, parcelle: f.parcelle ?? '', localisation: f.localisation,
      superficie: f.superficie, date_delivrance: f.dateDelivrance,
      date_expiration: f.dateExpiration, observation: f.observation,
      type: f.type, numero: f.numero, lat: f.lat || null, lng: f.lng || null
    }).pipe(
      map(r => ({
        id: String(r.data.id), numero: r.data.numero, proprietaire: r.data.proprietaire,
        parcelle: r.data.parcelle ?? undefined, superficie: r.data.superficie,
        localisation: r.data.localisation ?? undefined,
        dateDelivrance: r.data.date_delivrance, statut: r.data.statut as any,
        coordonnees: (r.data.lat && r.data.lng) ? { lat: Number(r.data.lat), lng: Number(r.data.lng) } : undefined
      })),
      tap(t => this.titresFonciers.update(l => [t, ...l]))
    );
  }

  loadReserves(): void {
    this.reserveApi.getAll().pipe(
      tap(r => this.reserves.set(r.data.map(x => ({
        id: String(x.id), denomination: x.denomination ?? undefined, designation: x.designation ?? undefined,
        usage: x.usage, administration: x.administration ?? undefined,
        superficie: x.superficie, localisation: x.localisation, statut: x.statut as any,
        coordonnees: (x.lat && x.lng) ? { lat: Number(x.lat), lng: Number(x.lng) } : undefined
      }))))
    ).subscribe();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PERMIS & AUTORISATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  loadPermisConstruire(f: { statut?: string } = {}): void {
    this.loadingPermis.set(true);
    this.pcApi.getAll(f).pipe(
      tap(r => {
        this.permisConstruire.set(r.data.map(x => ({
          id: String(x.id), reference: x.reference, demandeur: x.demandeur,
          adresseTravaux: x.adresse_travaux, typeConstruire: x.type_construire as any,
          nombreEtages: x.nombre_etages ?? undefined, superficie: x.superficie ?? undefined,
          coutEstime: x.cout_estime ?? undefined, dateDepot: x.date_depot,
          dateDecision: x.date_decision ?? undefined, instructeur: x.instructeur ?? undefined,
          statut: x.statut as any, motifRefus: x.motif_refus ?? undefined,
          type: x.type_construire ?? undefined
        })));
        this.loadingPermis.set(false);
      })
    ).subscribe({ error: () => this.loadingPermis.set(false) });
  }

  deposerPermisConstruire(f: { demandeur: string; adresseTravaux?: string; localisation?: string; quartier?: string; ilot?: string; lot?: string; section?: string; telephone?: string; numeroPiece?: string; typePiece?: string; lat?: number; lng?: number; agent?: string; observations?: string; surfacePlancher?: number; typeConstruire?: string; nombreEtages?: number; superficie?: number; coutEstime?: number; [key: string]: any }): Observable<PermisConstruire> {
    return this.pcApi.create({
      demandeur: f.demandeur,
      adresse_travaux: f.adresseTravaux ?? f.localisation ?? '',
      localisation: f.localisation ?? f.adresseTravaux ?? '',
      quartier: f.quartier ?? '', ilot: f.ilot ?? null, lot: f.lot ?? null, section: f.section ?? null,
      telephone: f.telephone ?? null,
      numero_piece: f.numeroPiece ?? null, type_piece: f.typePiece ?? null,
      lat: f.lat || null, lng: f.lng || null,
      agent: f.agent ?? null, observations: f.observations ?? null,
      surface_plancher: f.surfacePlancher ?? f.superficie ?? null,
      type_construire: f.typeConstruire ?? 'villa', nombre_etages: f.nombreEtages,
      superficie: f.superficie, cout_estime: f.coutEstime
    }).pipe(
      map(r => ({ id: String(r.data.id), reference: r.data.reference, demandeur: r.data.demandeur, adresseTravaux: r.data.adresse_travaux, typeConstruire: r.data.type_construire as any, dateDepot: r.data.date_depot, statut: r.data.statut as any })),
      tap(pc => {
        this.permisConstruire.update(l => [pc, ...l]);
        this.kpi.update(k => ({ ...k, permisEnCours: k.permisEnCours + 1 }));
      })
    );
  }

  deciderPermis(id: string, decision: 'accorde' | 'refuse', motif?: string): void {
    this.pcApi.decider(Number(id), decision, motif).pipe(
      tap(() => {
        this.permisConstruire.update(l => l.map(p => p.id === id ? { ...p, statut: decision as any } : p));
        if (decision === 'accorde') this.kpi.update(k => ({ ...k, permisAccordes: k.permisAccordes + 1, permisEnCours: Math.max(0, k.permisEnCours - 1) }));
      })
    ).subscribe();
  }

  loadPermisDemolir(): void {
    this.pdApi.getAll().pipe(
      tap(r => this.permisDemolir.set(r.data.map(x => ({
        id: String(x.id), reference: x.reference, demandeur: x.demandeur,
        adresseTravaux: x.adresse_travaux, descriptionBatiment: x.description_batiment,
        dateDepot: x.date_depot, statut: x.statut as any
      }))))
    ).subscribe();
  }

  loadCertificats(): void {
    this.cuApi.getAll().pipe(
      tap(r => this.certificats.set(r.data.map(x => ({
        id: String(x.id), reference: x.reference, demandeur: x.demandeur,
        adresse: x.adresse, type: x.type as any, dateDepot: x.date_depot,
        dateDelivrance: x.date_delivrance ?? undefined,
        dateExpiration: x.date_expiration ?? undefined, statut: x.statut as any
      }))))
    ).subscribe();
  }

  delivrerCertificat(id: string): void {
    this.cuApi.delivrer(Number(id)).pipe(
      tap(() => this.certificats.update(l => l.map(c => c.id === id ? { ...c, statut: 'delivre' as const } : c)))
    ).subscribe();
  }

  loadAutorisations(): void {
    this.aoApi.getAll().pipe(
      tap(r => this.autorisations.set(r.data.map(x => ({
        id: String(x.id), reference: x.reference, beneficiaire: x.beneficiaire,
        typeOccupation: x.type_occupation, localisation: x.localisation,
        superficie: x.superficie ?? undefined, dateDebut: x.date_debut, dateFin: x.date_fin,
        montantRedevance: x.montant_redevance ?? undefined, statut: x.statut as any
      }))))
    ).subscribe();
  }

  creerAutorisation(f: { beneficiaire: string; typeOccupation: string; localisation: string; superficie?: number; dateDebut: string; dateFin: string; montantRedevance?: number }): Observable<AutorisationOccupation> {
    return this.aoApi.create({
      beneficiaire: f.beneficiaire, type_occupation: f.typeOccupation,
      localisation: f.localisation, superficie: f.superficie,
      date_debut: f.dateDebut, date_fin: f.dateFin, montant_redevance: f.montantRedevance
    }).pipe(
      map(r => ({ id: String(r.data.id), reference: r.data.reference, beneficiaire: r.data.beneficiaire, typeOccupation: r.data.type_occupation, localisation: r.data.localisation, dateDebut: r.data.date_debut, dateFin: r.data.date_fin, statut: r.data.statut as any })),
      tap(a => this.autorisations.update(l => [a, ...l]))
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  CARTOGRAPHIE SIG
  // ═══════════════════════════════════════════════════════════════════════════

  loadQuartiers(): void {
    this.quartierApi.getAll().pipe(
      tap(r => this.quartiers.set(r.data.map(x => ({
        id: String(x.id), nom: x.nom, population: x.population ?? undefined,
        superficie: x.superficie, nbParcelles: x.nb_parcelles ?? undefined,
        coordCentre: (x.lat && x.lng) ? { lat: x.lat, lng: x.lng } : undefined,
        statut: x.statut as any
      }))))
    ).subscribe();
  }

  loadVoiries(f: { type?: string } = {}): void {
    this.voirieApi.getAll(f).pipe(
      tap(r => this.voiries.set(r.data.map(x => ({
        id: String(x.id), nom: x.nom, quartier: x.quartier,
        longueur: x.longueur, largeur: x.largeur ?? undefined,
        type: x.type as any, statut: x.statut as any
      }))))
    ).subscribe();
  }

  loadReseaux(f: { type?: string } = {}): void {
    this.reseauApi.getAll(f).pipe(
      tap(r => this.reseaux.set(r.data.map(x => ({
        id: String(x.id), designation: x.designation, type: x.type as any,
        quartier: x.quartier, longueur: x.longueur ?? undefined,
        capacite: x.capacite ?? undefined, statut: x.statut as any
      }))))
    ).subscribe();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PROJETS URBAINS
  // ═══════════════════════════════════════════════════════════════════════════

  loadLotissements(): void {
    this.lotissApi.getAll().pipe(
      tap(r => this.lotissements.set(r.data.map(x => ({
        id: String(x.id), nom: x.nom, localisation: x.localisation,
        promoteur: x.promoteur, nbLots: x.nb_lots, superficieTotale: x.superficie_totale,
        dateAgrement: x.date_agrement ?? undefined, dateDebut: x.date_debut ?? undefined,
        dateFin: x.date_fin ?? undefined, avancement: x.avancement, statut: x.statut as any
      }))))
    ).subscribe();
  }

  creerLotissement(f: { nom: string; localisation: string; promoteur: string; nbLots: number; superficieTotale: number; dateAgrement?: string; dateDebut?: string }): Observable<Lotissement> {
    return this.lotissApi.create({
      nom: f.nom, localisation: f.localisation, promoteur: f.promoteur,
      nb_lots: f.nbLots, superficie_totale: f.superficieTotale,
      date_agrement: f.dateAgrement, date_debut: f.dateDebut
    }).pipe(
      map(r => ({ id: String(r.data.id), nom: r.data.nom, localisation: r.data.localisation, promoteur: r.data.promoteur, nbLots: r.data.nb_lots, superficieTotale: r.data.superficie_totale, avancement: r.data.avancement, statut: r.data.statut as any })),
      tap(l => this.lotissements.update(list => [l, ...list]))
    );
  }

  updateAvancementLotissement(id: string, avancement: number): void {
    this.lotissApi.updateAvancement(Number(id), avancement).pipe(
      tap(() => this.lotissements.update(l => l.map(lot => lot.id === id ? { ...lot, avancement } : lot)))
    ).subscribe();
  }

  loadAmenagements(): void {
    this.amenagApi.getAll().pipe(
      tap(r => this.amenagements.set(r.data.map(x => ({
        id: String(x.id), designation: x.designation, type: x.type as any,
        localisation: x.localisation, budget: x.budget, bailleur: x.bailleur,
        dateDebut: x.date_debut, dateFin: x.date_fin ?? undefined,
        avancement: x.avancement, statut: x.statut as any
      }))))
    ).subscribe();
  }

  loadChantiers(): void {
    this.chantierApi.getAll().pipe(
      tap(r => this.chantiers.set(r.data.map(x => ({
        id: String(x.id), projet: x.projet, entrepreneur: x.entrepreneur,
        dateVisite: x.date_visite, avancement: x.avancement,
        observations: x.observations, recommandations: x.recommandations ?? undefined,
        controleur: x.controleur, statut: x.statut as any
      }))))
    ).subscribe();
  }

  enregistrerVisite(f: { projet: string; entrepreneur: string; dateVisite: string; avancement: number; observations: string; recommandations?: string; controleur: string }): Observable<SuiviChantier> {
    return this.chantierApi.create({
      projet: f.projet, entrepreneur: f.entrepreneur, date_visite: f.dateVisite,
      avancement: f.avancement, observations: f.observations,
      recommandations: f.recommandations, controleur: f.controleur
    }).pipe(
      map(r => ({ id: String(r.data.id), projet: r.data.projet, entrepreneur: r.data.entrepreneur, dateVisite: r.data.date_visite, avancement: r.data.avancement, observations: r.data.observations, controleur: r.data.controleur, statut: r.data.statut as any })),
      tap(c => this.chantiers.update(l => [c, ...l]))
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  GÉOLOCALISATION
  // ═══════════════════════════════════════════════════════════════════════════

  loadEquipements(f: { type?: string; statut?: string; quartier?: string } = {}): void {
    this.equipApi.getAll(f).pipe(
      tap(r => this.equipements.set(r.data.map(x => ({
        id: String(x.id), nom: x.nom, type: x.type as any,
        adresse: x.adresse, quartier: x.quartier,
        capacite: x.capacite ?? undefined, responsable: x.responsable ?? undefined,
        coordonnees: (x.lat && x.lng) ? { lat: x.lat, lng: x.lng } : undefined,
        statut: x.statut as any
      }))))
    ).subscribe();
  }

  enregistrerEquipement(f: { nom: string; type: string; adresse: string; quartier: string; capacite?: string; responsable?: string; lat?: number; lng?: number }): Observable<EquipementPublic> {
    return this.equipApi.create(f).pipe(
      map(r => ({ id: String(r.data.id), nom: r.data.nom, type: r.data.type as any, adresse: r.data.adresse, quartier: r.data.quartier, statut: r.data.statut as any })),
      tap(e => {
        this.equipements.update(l => [e, ...l]);
        this.kpi.update(k => ({ ...k, equipementsPublics: k.equipementsPublics + 1 }));
      })
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  STATISTIQUES
  // ═══════════════════════════════════════════════════════════════════════════

  loadStats(): void {
    this.statsApi.getDashboard().pipe(
      tap(s => this.kpi.set({
        totalParcelles:    s.kpi.total_parcelles,
        parcellesLibres:   s.kpi.parcelles_libres,
        permisEnCours:     s.kpi.permis_en_cours,
        permisAccordes:    s.kpi.permis_accordes,
        chantierEnCours:   s.kpi.chantiers_en_cours,
        equipementsPublics:s.kpi.equipements_publics,
        tauxUrbanisation:  s.kpi.taux_urbanisation,
      }))
    ).subscribe();
  }

  // ── Alias pour compatibilité composants ───────────────────────────────────

  /** Alias de permisConstruire */
  readonly permis = this.permisConstruire;

  /** Réseaux filtrés par type électrique */
  readonly reseauxElec = computed(() => this.reseaux().filter(r => r.type === 'electrique'));
  /** Réseaux filtrés par type hydraulique */
  readonly reseauxHydro = computed(() => this.reseaux().filter(r => r.type === 'hydraulique'));

  loadPermis(f: { statut?: string; type?: string } = {}): void {
    this.loadPermisConstruire(f);
  }

  loadReseauxElec(): void { this.loadReseaux({ type: 'electrique' }); }
  loadReseauxHydro(): void { this.loadReseaux({ type: 'hydraulique' }); }

  ajouterParcelle(f: { section?: string; numero?: number; superficie: number; localisation: string; quartier: string; proprietaire?: string; titreFoncier?: string; statut?: string; usage?: string; valeurEstimee?: number; lat?: number; lng?: number; [key: string]: any }): Observable<Parcelle> {
    return this.enregistrerParcelle({
      section: f.section ?? 'A',
      numero: f.numero ?? 0,
      superficie: f.superficie,
      localisation: f.localisation,
      quartier: f.quartier,
      proprietaire: f.proprietaire,
      titreFoncier: f.titreFoncier,
      statut: f.statut,
      usage: f.usage,
      valeurEstimee: f.valeurEstimee,
      lat: f.lat, lng: f.lng,
    });
  }

  ajouterLot(f: { reference?: string; lotissement: string; numero?: number; superficie: number; usage?: string; attribueA?: string; attributaire?: string; prix?: number; [key: string]: any }): Observable<Lot> {
    const payload = { ...f, numero: f.numero ?? 0, usage: f.usage ?? 'residentiel', attribue_a: f.attribueA ?? f.attributaire };
    return this.lotApi.create(payload).pipe(
      map(r => ({ id: String(r.data.id), reference: r.data.reference, lotissement: r.data.lotissement, numero: r.data.numero, superficie: r.data.superficie, usage: r.data.usage as any, statut: r.data.statut as any })),
      tap(l => this.lots.update(list => [l, ...list]))
    );
  }

  ajouterTitreFoncier(f: { proprietaire: string; parcelle?: string; localisation?: string; superficie: number; dateDelivrance: string; dateExpiration?: string; observation?: string; type?: string; numero?: string; lat?: number; lng?: number; coordonnees?: { lat: number; lng: number }; [key: string]: any }): Observable<TitreFoncier> {
    return this.enregistrerTitre({
      proprietaire: f.proprietaire,
      parcelle: f.parcelle ?? '',
      localisation: f.localisation,
      superficie: f.superficie,
      dateDelivrance: f.dateDelivrance,
      dateExpiration: f.dateExpiration,
      observation: f.observation,
      type: f.type, numero: f.numero,
      lat: f.lat ?? f.coordonnees?.lat,
      lng: f.lng ?? f.coordonnees?.lng,
    });
  }

  ajouterReserve(f: { designation?: string; denomination?: string; usage: string; superficie: number; localisation: string; statut?: string; administration?: string; lat?: number; lng?: number; coordonnees?: { lat: number; lng: number }; [key: string]: any }): Observable<ReserveAdministrative> {
    return this.reserveApi.create({
      denomination: f.denomination ?? f.designation ?? '',
      designation: f.designation ?? f.denomination ?? '',
      usage: f.usage, superficie: f.superficie, localisation: f.localisation,
      administration: f.administration ?? null,
      lat: f.lat ?? f.coordonnees?.lat ?? null,
      lng: f.lng ?? f.coordonnees?.lng ?? null,
    }).pipe(
      map(r => ({
        id: String(r.data.id), denomination: r.data.denomination ?? undefined,
        designation: r.data.designation ?? undefined,
        usage: r.data.usage, superficie: r.data.superficie, localisation: r.data.localisation,
        administration: r.data.administration ?? undefined,
        statut: r.data.statut as any,
        coordonnees: (r.data.lat && r.data.lng) ? { lat: Number(r.data.lat), lng: Number(r.data.lng) } : undefined
      })),
      tap(r => this.reserves.update(l => [r, ...l]))
    );
  }

  ajouterEquipement(f: { nom: string; type: string; adresse: string; quartier: string; capacite?: string; responsable?: string; lat?: number; lng?: number; coordonnees?: { lat?: number; lng?: number }; etat?: string; [key: string]: any }): Observable<EquipementPublic> {
    return this.enregistrerEquipement({
      nom: f.nom, type: f.type, adresse: f.adresse, quartier: f.quartier,
      capacite: f.capacite, responsable: f.responsable,
      lat: f.lat ?? f.coordonnees?.lat,
      lng: f.lng ?? f.coordonnees?.lng,
    });
  }

  ajouterLotissement(f: { nom?: string; denomination?: string; localisation: string; promoteur: string; nbLots?: number; nombreLots?: number; superficieTotale?: number; superficie?: number; dateAgrement?: string; dateApprob?: string; dateDebut?: string; statut?: string }): Observable<Lotissement> {
    return this.creerLotissement({
      nom: f.nom ?? f.denomination ?? '',
      localisation: f.localisation,
      promoteur: f.promoteur,
      nbLots: f.nbLots ?? f.nombreLots ?? 0,
      superficieTotale: f.superficieTotale ?? f.superficie ?? 0,
      dateAgrement: f.dateAgrement ?? f.dateApprob,
      dateDebut: f.dateDebut,
    });
  }

  ajouterAmenagement(f: { designation?: string; intitule?: string; type: string; localisation: string; budget: number; bailleur?: string; financeur?: string; dateDebut: string; tauxAvancement?: number; avancement?: number }): Observable<AmenagementUrbain> {
    const body = { designation: f.designation ?? f.intitule ?? '', type: f.type, localisation: f.localisation, budget: f.budget, bailleur: f.bailleur ?? f.financeur ?? '', date_debut: f.dateDebut, avancement: f.avancement ?? f.tauxAvancement ?? 0 };
    return this.amenagApi.create(body).pipe(
      map(r => ({ id: String(r.data.id), designation: r.data.designation, type: r.data.type as any, localisation: r.data.localisation, budget: r.data.budget, bailleur: r.data.bailleur, dateDebut: r.data.date_debut, avancement: r.data.avancement, statut: r.data.statut as any })),
      tap(a => this.amenagements.update(l => [a, ...l]))
    );
  }

  ajouterChantier(f: { projet: string; entrepreneur: string; dateVisite?: string; dateOuverture?: string; avancement?: number; tauxAvancement?: number; observations: string; recommandations?: string; controleur?: string; [key: string]: any }): Observable<SuiviChantier> {
    return this.enregistrerVisite({
      projet: f.projet, entrepreneur: f.entrepreneur,
      dateVisite: f.dateVisite ?? f.dateOuverture ?? new Date().toISOString().slice(0, 10),
      avancement: f.avancement ?? f.tauxAvancement ?? 0,
      observations: f.observations,
      recommandations: f.recommandations,
      controleur: f.controleur ?? 'Système',
    });
  }

  creerPermis(f: { demandeur: string; [key: string]: any }): Observable<PermisConstruire> {
    return this.deposerPermisConstruire({ ...f, typeConstruire: f.typeConstruire ?? f.type ?? 'villa' });
  }

  updateStatutPermis(id: string, decision: 'accorde' | 'refuse', motif?: string): Observable<void> {
    return new Observable(obs => {
      this.deciderPermis(id, decision, motif);
      obs.next();
      obs.complete();
    });
  }

  ajouterQuartier(f: { nom: string; code?: string; superficie: number; statut?: string; chef?: string; population?: number }): Observable<QuartierSIG> {
    return this.quartierApi.create(f).pipe(
      map(r => ({ id: String(r.data.id), nom: r.data.nom, superficie: r.data.superficie, statut: r.data.statut as any })),
      tap(q => this.quartiers.update(l => [q, ...l]))
    );
  }

  ajouterVoirie(f: { nom: string; quartier: string; longueur: number; largeur?: number; type: string; statut?: string }): Observable<VoirieSIG> {
    return this.voirieApi.create(f).pipe(
      map(r => ({ id: String(r.data.id), nom: r.data.nom, quartier: r.data.quartier, longueur: r.data.longueur, type: r.data.type as any, statut: r.data.statut as any })),
      tap(v => this.voiries.update(l => [v, ...l]))
    );
  }

  exportJson(type?: string): void {
    this.statsApi.export(type).subscribe(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `urbanisme${type ? '_' + type : ''}_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    });
  }
}
