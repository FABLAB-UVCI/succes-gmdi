import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import {
  Bien, Vehicule, Terrain, MouvementAffectation,
  Entretien, Reparation, LigneAmortissement, KpiPatrimoine, StatsAmortissement,
  Batiment, Marche, CentreCommunautaire
} from '../models/patrimoine.models';
import { BienFilters, BienApi, VehiculeApi, TerrainApi, MouvementApi, EntretienApi, ReparationApi, AmortissementApi, BatimentApi, MarcheApi, CentreApi } from '../models/api.models';
import {
  BienApiService, VehiculeApiService, TerrainApiService,
  MobilierApiService, InformatiqueApiService, EquipementApiService,
  AffectationApiService, EntretienApiService, ReparationApiService,
  AmortissementApiService, StatsPatrimoineApiService,
  BatimentApiService, MarcheApiService, CentreApiService
} from './patrimoine-api.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class PatrimoineService {

  private bienApi    = inject(BienApiService);
  private vehApi     = inject(VehiculeApiService);
  private terApi     = inject(TerrainApiService);
  private mobApi     = inject(MobilierApiService);
  private infApi     = inject(InformatiqueApiService);
  private eqpApi     = inject(EquipementApiService);
  private affApi     = inject(AffectationApiService);
  private entApi     = inject(EntretienApiService);
  private repApi     = inject(ReparationApiService);
  private amortApi   = inject(AmortissementApiService);
  private statsApi   = inject(StatsPatrimoineApiService);
  private batApi     = inject(BatimentApiService);
  private marApi     = inject(MarcheApiService);
  private cenApi     = inject(CentreApiService);
  private toast      = inject(ToastService);

  // ── Cache réactif ─────────────────────────────────────────────────────────
  readonly biens        = signal<Bien[]>([]);
  readonly vehicules    = signal<Vehicule[]>([]);
  readonly terrains     = signal<Terrain[]>([]);
  readonly mouvements   = signal<MouvementAffectation[]>([]);
  readonly entretiens   = signal<Entretien[]>([]);
  readonly reparations  = signal<Reparation[]>([]);
  readonly amortissements = signal<LigneAmortissement[]>([]);
  readonly batiments    = signal<Batiment[]>([]);
  readonly marches      = signal<Marche[]>([]);
  readonly centres      = signal<CentreCommunautaire[]>([]);

  readonly kpi = signal<KpiPatrimoine>({ totalBiens: 0, valeurTotale: 0, loyersMensuel: 0, urgences: 0 });
  readonly statsAmort = signal<StatsAmortissement>({ valeurAcquisitionTotale: 0, valeurNetteTotale: 0, amortissementsCumules: 0, biensAmortis: 0 });
  readonly repartitionCategorie = signal<{ categorie: string; nombre: number; valeur: number; part: number }[]>([]);
  readonly repartitionStatut = signal<{ statut: string; nombre: number; valeur: number }[]>([]);
  readonly depreciationCategorie = signal<{ categorie: string; valeurBrute: number; tauxMoyen: number; depreciationAnnuelle: number; valeurNette: number }[]>([]);

  readonly loadingBiens = signal(false);
  readonly totalBiens   = computed(() => this.biens().length);

  // ── Formatage monétaire ───────────────────────────────────────────────────
  formaterFCFA(n: number | null | undefined): string {
    return new Intl.NumberFormat('fr-FR').format(Math.round(n || 0)) + ' FCFA';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  BIENS
  // ═══════════════════════════════════════════════════════════════════════════

  loadBiens(f: BienFilters = {}): void {
    this.loadingBiens.set(true);
    this.bienApi.getAll({ per_page: 1000, ...f }).pipe(
      tap(res => { this.biens.set(res.data.map(b => this.mapBien(b))); this.loadingBiens.set(false); })
    ).subscribe({ error: () => this.loadingBiens.set(false) });
  }

  enregistrerBien(f: { categorie: string; designation: string; localisation: string; valeurAcquisition: number; dateAcquisition: string; affectation: string; tauxAmortissement?: number; superficie?: number }): Observable<Bien> {
    return this.bienApi.create({
      categorie: f.categorie, designation: f.designation, localisation: f.localisation,
      valeur_acquisition: f.valeurAcquisition, date_acquisition: f.dateAcquisition,
      affectation: f.affectation, taux_amortissement: f.tauxAmortissement, superficie: f.superficie,
    }).pipe(
      map(r => this.mapBien(r.data)),
      tap(b => this.biens.update(l => [b, ...l]))
    );
  }

  rechercherBien(reference: string): Observable<Bien> {
    return this.bienApi.getByReference(reference).pipe(map(r => this.mapBien(r.data)));
  }

  enregistrerMobilier(f: { designation: string; quantite?: number; valeurUnitaire?: number; localisation: string; dateAcquisition?: string; etat?: string }): Observable<Bien> {
    return this.mobApi.create({
      designation: f.designation, quantite: f.quantite, valeur_unitaire: f.valeurUnitaire,
      localisation: f.localisation, date_acquisition: f.dateAcquisition, etat: f.etat,
    }).pipe(
      map(r => this.mapBien(r.data)),
      tap(b => this.biens.update(l => [b, ...l]))
    );
  }

  enregistrerInformatique(f: { type: string; modele?: string; serie?: string; affectation: string; valeur?: number; dateAcquisition?: string }): Observable<Bien> {
    return this.infApi.create({
      type_materiel: f.type, modele: f.modele, numero_serie: f.serie,
      affectation: f.affectation, valeur: f.valeur, date_acquisition: f.dateAcquisition,
    }).pipe(
      map(r => this.mapBien(r.data)),
      tap(b => this.biens.update(l => [b, ...l]))
    );
  }

  enregistrerEquipement(f: { designation: string; marque?: string; serie?: string; localisation: string; valeur?: number; dateAcquisition?: string }): Observable<Bien> {
    return this.eqpApi.create({
      designation: f.designation, marque: f.marque, numero_serie: f.serie,
      localisation: f.localisation, valeur: f.valeur, date_acquisition: f.dateAcquisition,
    }).pipe(
      map(r => this.mapBien(r.data)),
      tap(b => this.biens.update(l => [b, ...l]))
    );
  }

  filtrerBiens(recherche: string, categorie: string, statut: string): Bien[] {
    const q = recherche.toLowerCase();
    return this.biens().filter(b =>
      (!q || b.designation.toLowerCase().includes(q) || b.reference.toLowerCase().includes(q) || b.affectation.toLowerCase().includes(q))
      && (!categorie || b.categorie === categorie)
      && (!statut || b.statut === statut)
    );
  }

  exportJson(data: unknown, filename: string): void {
    this.statsApi.exportTout().subscribe(blob => this._dl(blob, `${filename}_${new Date().toISOString().slice(0, 10)}.json`));
  }

  exportLocal(data: unknown, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    this._dl(blob, `${filename}_${new Date().toISOString().slice(0, 10)}.json`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  VÉHICULES
  // ═══════════════════════════════════════════════════════════════════════════

  loadVehicules(): void {
    this.vehApi.getAll({ per_page: 1000 }).pipe(
      tap(r => this.vehicules.set(r.data.map(v => this.mapVehicule(v))))
    ).subscribe();
  }

  enregistrerVehicule(f: { modele: string; immatriculation: string; kilometrage?: number; affectation: string; valeur?: number; finAssurance?: string; finVisiteTechnique?: string }): Observable<Vehicule> {
    return this.vehApi.create({
      modele: f.modele, immatriculation: f.immatriculation,
      kilometrage: f.kilometrage, affectation: f.affectation, valeur: f.valeur,
      fin_assurance: f.finAssurance, fin_visite_technique: f.finVisiteTechnique,
    }).pipe(
      map(r => this.mapVehicule(r.data)),
      tap(v => this.vehicules.update(l => [v, ...l]))
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  TERRAINS
  // ═══════════════════════════════════════════════════════════════════════════

  loadTerrains(): void {
    this.terApi.getAll({ per_page: 1000 }).pipe(
      tap(r => this.terrains.set(r.data.map(t => this.mapTerrain(t))))
    ).subscribe();
  }

  enregistrerTerrain(f: { localisation: string; superficie: number; valeur?: number; usage?: string; titreFoncier?: string; dateAcquisition?: string }): Observable<Terrain> {
    return this.terApi.create({
      localisation: f.localisation, superficie: f.superficie, valeur: f.valeur,
      usage: f.usage, titre_foncier: f.titreFoncier, date_acquisition: f.dateAcquisition,
    }).pipe(
      map(r => this.mapTerrain(r.data)),
      tap(t => this.terrains.update(l => [t, ...l]))
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  BÂTIMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  loadBatiments(): void {
    this.batApi.getAll().pipe(
      tap(r => this.batiments.set(r.data.map(b => this.mapBatiment(b))))
    ).subscribe();
  }

  enregistrerBatiment(f: { nom: string; superficie?: number; valeurActuelle?: number; affectation?: string; etat?: string; derniereInspection?: string }): Observable<Batiment> {
    return this.batApi.create({
      nom: f.nom, superficie: f.superficie, valeur_actuelle: f.valeurActuelle,
      affectation: f.affectation, etat: f.etat, derniere_inspection: f.derniereInspection,
    }).pipe(
      map(r => this.mapBatiment(r.data)),
      tap(b => this.batiments.update(l => [b, ...l]))
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  MARCHÉS
  // ═══════════════════════════════════════════════════════════════════════════

  loadMarches(): void {
    this.marApi.getAll().pipe(
      tap(r => this.marches.set(r.data.map(m => this.mapMarche(m))))
    ).subscribe();
  }

  enregistrerMarche(f: { nom: string; superficie?: number; nombreBoutiques?: number; loyerMoyenBoutique?: number; statut?: string }): Observable<Marche> {
    return this.marApi.create({
      nom: f.nom, superficie: f.superficie, nombre_boutiques: f.nombreBoutiques,
      loyer_moyen_boutique: f.loyerMoyenBoutique, statut: f.statut,
    }).pipe(
      map(r => this.mapMarche(r.data)),
      tap(m => this.marches.update(l => [m, ...l]))
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  CENTRES COMMUNAUTAIRES
  // ═══════════════════════════════════════════════════════════════════════════

  loadCentres(): void {
    this.cenApi.getAll().pipe(
      tap(r => this.centres.set(r.data.map(c => this.mapCentre(c))))
    ).subscribe();
  }

  enregistrerCentre(f: { nom: string; quartier?: string; capacite?: number; services?: string; statut?: string }): Observable<CentreCommunautaire> {
    return this.cenApi.create({
      nom: f.nom, quartier: f.quartier, capacite: f.capacite, services: f.services, statut: f.statut,
    }).pipe(
      map(r => this.mapCentre(r.data)),
      tap(c => this.centres.update(l => [c, ...l]))
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  AFFECTATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  loadMouvements(): void {
    this.affApi.getHistorique({ per_page: 1000 }).pipe(
      tap(r => this.mouvements.set(r.data.map(m => this.mapMouvement(m))))
    ).subscribe();
  }

  affecter(f: { reference: string; direction: string; responsable?: string; dateEffet: string; motif?: string }): Observable<MouvementAffectation> {
    return this.affApi.affecter({
      reference: f.reference, direction: f.direction,
      responsable: f.responsable, date_effet: f.dateEffet, motif: f.motif,
    }).pipe(
      map(r => this.mapMouvement(r.data)),
      tap(m => {
        this.mouvements.update(l => [m, ...l]);
        // Mettre à jour l'affectation du bien dans le cache
        this.biens.update(l => l.map(b => b.reference === f.reference ? { ...b, affectation: f.direction } : b));
      })
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ENTRETIENS
  // ═══════════════════════════════════════════════════════════════════════════

  loadEntretiens(): void {
    this.entApi.getAll({ per_page: 1000 }).pipe(
      tap(r => this.entretiens.set(r.data.map(e => this.mapEntretien(e))))
    ).subscribe();
  }

  planifierEntretien(f: { bien: string; typeEntretien: string; datePrevue: string; periodicite?: string; coutEstime?: number }): Observable<Entretien> {
    return this.entApi.create({
      bien: f.bien, type_entretien: f.typeEntretien,
      date_prevue: f.datePrevue, periodicite: f.periodicite, cout_estime: f.coutEstime,
    }).pipe(
      map(r => this.mapEntretien(r.data)),
      tap(e => this.entretiens.update(l => [...l, e]))
    );
  }

  validerEntretien(id: string): void {
    this.entApi.valider(Number(id)).pipe(
      tap(() => this.entretiens.update(l =>
        l.map(e => e.id === id ? { ...e, statut: 'effectue' as const } : e)
      ))
    ).subscribe({ error: () => {} });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  RÉPARATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  loadReparations(): void {
    this.repApi.getAll({ per_page: 1000 }).pipe(
      tap(r => this.reparations.set(r.data.map(r2 => this.mapReparation(r2))))
    ).subscribe();
  }

  declarerReparation(f: { bien: string; description: string; priorite?: string; prestataire?: string; coutEstime?: number }): Observable<Reparation> {
    return this.repApi.create({
      bien: f.bien, description: f.description,
      priorite: f.priorite, prestataire: f.prestataire, cout_estime: f.coutEstime,
    }).pipe(
      map(r => this.mapReparation(r.data)),
      tap(r => this.reparations.update(l => [...l, r]))
    );
  }

  resoudreReparation(id: string): void {
    this.repApi.resoudre(Number(id)).pipe(
      tap(() => this.reparations.update(l =>
        l.map(r => r.id === id ? { ...r, statut: 'resolue' as const } : r)
      ))
    ).subscribe({ error: () => {} });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  AMORTISSEMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  loadAmortissements(): void {
    this.amortApi.getTableau().pipe(
      tap(r => this.amortissements.set(r.data.map(a => this.mapAmort(a))))
    ).subscribe();
  }

  simulerAmortissement(valeur: number, taux: number, annees: number): Observable<{ cumul: number; vnc: number }> {
    return this.amortApi.simuler(valeur, taux, annees).pipe(map(r => r.data));
  }

  loadStats(): void {
    this.statsApi.getDashboard().pipe(
      tap(s => {
        this.kpi.set({ totalBiens: s.total_biens, valeurTotale: s.valeur_totale, loyersMensuel: s.loyers_mensuel, urgences: s.urgences });
        this.statsAmort.set({ valeurAcquisitionTotale: s.valeur_acquisition_totale, valeurNetteTotale: s.valeur_nette_totale, amortissementsCumules: s.amortissements_cumules, biensAmortis: s.biens_amortis });
        this.repartitionCategorie.set(s.repartition_categorie ?? []);
        this.repartitionStatut.set(s.repartition_statut ?? []);
        this.depreciationCategorie.set((s.depreciation_categorie ?? []).map(d => ({
          categorie: d.categorie, valeurBrute: d.valeur_brute, tauxMoyen: d.taux_moyen,
          depreciationAnnuelle: d.depreciation_annuelle, valeurNette: d.valeur_nette,
        })));
      })
    ).subscribe();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  MAPPERS
  // ═══════════════════════════════════════════════════════════════════════════

  mapBien(b: BienApi): Bien {
    return { id: String(b.id), reference: b.reference, designation: b.designation, categorie: b.categorie as any, localisation: b.localisation, superficie: b.superficie ?? undefined, valeurAcquisition: b.valeur_acquisition, valeurActuelle: b.valeur_actuelle, dateAcquisition: b.date_acquisition, affectation: b.affectation, statut: b.statut as any, etat: b.etat, tauxAmortissement: b.taux_amortissement, qrCode: b.qr_code };
  }

  mapBatiment(b: BatimentApi): Batiment {
    return { id: String(b.id), nom: b.nom, superficie: b.superficie ?? 0, valeurActuelle: b.valeur_actuelle, affectation: b.affectation ?? '', etat: (b.etat as any) ?? 'bon', derniereInspection: b.derniere_inspection ?? '' };
  }

  mapMarche(m: MarcheApi): Marche {
    return { id: String(m.id), nom: m.nom, superficie: m.superficie ?? 0, nombreBoutiques: m.nombre_boutiques, loyerMoyenBoutique: m.loyer_moyen_boutique, revenusMensuels: m.revenus_mensuels, statut: m.statut as any };
  }

  mapCentre(c: CentreApi): CentreCommunautaire {
    return { id: String(c.id), nom: c.nom, quartier: c.quartier ?? '', capacite: c.capacite, services: c.services ?? '', statut: c.statut as any };
  }

  mapVehicule(v: VehiculeApi): Vehicule {
    return { id: String(v.id), modele: v.modele, immatriculation: v.immatriculation, kilometrage: v.kilometrage, affectation: v.affectation, valeur: v.valeur, finAssurance: v.fin_assurance, finVisiteTechnique: v.fin_visite_technique, statut: v.statut as any };
  }

  mapTerrain(t: TerrainApi): Terrain {
    return { id: String(t.id), localisation: t.localisation, superficie: t.superficie, valeur: t.valeur, usage: t.usage, titreFoncier: t.titre_foncier, statut: t.statut };
  }

  mapMouvement(m: MouvementApi): MouvementAffectation {
    return { id: String(m.id), date: m.date, reference: m.reference, bien: m.bien, origine: m.origine, destination: m.destination, responsable: m.responsable, motif: m.motif };
  }

  mapEntretien(e: EntretienApi): Entretien {
    return { id: String(e.id), bien: e.bien, typeEntretien: e.type_entretien, datePrevue: e.date_prevue, periodicite: e.periodicite, coutEstime: e.cout_estime, statut: e.statut as any };
  }

  mapReparation(r: ReparationApi): Reparation {
    return { id: String(r.id), bien: r.bien, description: r.description, priorite: r.priorite as any, prestataire: r.prestataire, coutEstime: r.cout_estime, statut: r.statut as any, dateDeclaration: r.date_declaration };
  }

  mapAmort(a: AmortissementApi): LigneAmortissement {
    return { id: String(a.id), bien: a.bien, valeurAcquisition: a.valeur_acquisition, tauxAnnuel: a.taux_annuel, anneeDebut: a.annee_debut, amortissementCumule: a.amortissement_cumule, valeurNette: a.valeur_nette };
  }

  private _dl(blob: Blob, filename: string): void {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  }
}
