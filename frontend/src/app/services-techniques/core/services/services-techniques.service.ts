import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import {
  Route, EntretienVoirie, ReparationVoirie,
  Lampadaire, PanneEclairage, MaintenanceEclairage,
  Caniveau, InterventionDrainage, CollecteDechet,
  BatimentCommunal, TravauxBatiment,
  DemandeIntervention, BonTravail, SuiviEquipe,
  PlanningMaintenance, MaintenanceCorrective,
  KpiServicesTechniques
} from '../models/services-techniques.models';
import {
  RouteApiService, EntretienVoirieApiService, ReparationVoirieApiService,
  LampadaireApiService, PanneEclairageApiService, MaintenanceEclairageApiService,
  CaniveauApiService, DrainageApiService, DechetApiService,
  BatimentApiService, TravauxBatimentApiService,
  DemandeApiService, BonTravailApiService, EquipeApiService,
  PlanningMaintenanceApiService, MaintenanceCorrectiveApiService,
  StatsStApiService
} from './services-techniques-api.service';

@Injectable({ providedIn: 'root' })
export class ServicesTechniquesService {

  // ── Injections ────────────────────────────────────────────────────────────
  private routeApi     = inject(RouteApiService);
  private entVoirieApi = inject(EntretienVoirieApiService);
  private repVoirieApi = inject(ReparationVoirieApiService);
  private lampApi      = inject(LampadaireApiService);
  private panneApi     = inject(PanneEclairageApiService);
  private maintEclApi  = inject(MaintenanceEclairageApiService);
  private caniveauApi  = inject(CaniveauApiService);
  private drainageApi  = inject(DrainageApiService);
  private dechetApi    = inject(DechetApiService);
  private batApi       = inject(BatimentApiService);
  private travBatApi   = inject(TravauxBatimentApiService);
  private demandeApi   = inject(DemandeApiService);
  private bonApi       = inject(BonTravailApiService);
  private equipeApi    = inject(EquipeApiService);
  private planningApi  = inject(PlanningMaintenanceApiService);
  private correctApi   = inject(MaintenanceCorrectiveApiService);
  private statsApi     = inject(StatsStApiService);

  // ── Cache réactif ─────────────────────────────────────────────────────────
  readonly routes          = signal<Route[]>([]);
  readonly entretiensVoirie= signal<EntretienVoirie[]>([]);
  readonly reparationsVoirie= signal<ReparationVoirie[]>([]);

  readonly lampadaires     = signal<Lampadaire[]>([]);
  readonly pannes          = signal<PanneEclairage[]>([]);
  readonly maintEcl        = signal<MaintenanceEclairage[]>([]);

  readonly caniveaux       = signal<Caniveau[]>([]);
  readonly drainage        = signal<InterventionDrainage[]>([]);
  readonly collectes       = signal<CollecteDechet[]>([]);

  readonly batiments       = signal<BatimentCommunal[]>([]);
  readonly travaux         = signal<TravauxBatiment[]>([]);

  readonly demandes        = signal<DemandeIntervention[]>([]);
  readonly bons            = signal<BonTravail[]>([]);
  readonly equipes         = signal<SuiviEquipe[]>([]);

  readonly planningMaint   = signal<PlanningMaintenance[]>([]);
  readonly maintenanceCorrective = signal<MaintenanceCorrective[]>([]);

  readonly kpi = signal<KpiServicesTechniques>({
    interventionsEnCours: 12, pannesSignalees: 5, travauxPlanifies: 8,
    demandesCitoyennes: 24, tauxResolution: 78, delaiMoyenJours: 4
  });

  readonly loadingDemandes = signal(false);

  // ═══════════════════════════════════════════════════════════════════════════
  //  VOIRIE
  // ═══════════════════════════════════════════════════════════════════════════

  loadRoutes(f: { search?: string; etat?: string } = {}): void {
    this.routeApi.getAll(f).pipe(
      tap(r => this.routes.set(r.data.map(x => ({
        id: String(x.id), nom: x.nom, quartier: x.quartier, longueur: x.longueur,
        type: x.type as any, etat: x.etat as any,
        dateDernierEntretien: x.date_dernier_entretien ?? undefined
      }))))
    ).subscribe();
  }

  ajouterRoute(f: { nom: string; quartier: string; longueur: number; type: string; etat?: string }): Observable<Route> {
    return this.routeApi.create(f).pipe(
      map(r => ({ id: String(r.data.id), nom: r.data.nom, quartier: r.data.quartier, longueur: r.data.longueur, type: r.data.type as any, etat: r.data.etat as any })),
      tap(r => this.routes.update(l => [r, ...l]))
    );
  }

  loadEntretiensVoirie(): void {
    this.entVoirieApi.getAll().pipe(
      tap(r => this.entretiensVoirie.set(r.data.map(x => ({
        id: String(x.id), route: x.route, typeEntretien: x.type_entretien,
        dateDebut: x.date_debut, dateFin: x.date_fin ?? undefined,
        equipe: x.equipe, coutEstime: x.cout_estime, coutReel: x.cout_reel ?? undefined,
        statut: x.statut as any
      }))))
    ).subscribe();
  }

  planifierEntretienVoirie(f: { route: string; typeEntretien: string; dateDebut: string; dateFin?: string; equipe: string; coutEstime?: number }): Observable<EntretienVoirie> {
    return this.entVoirieApi.create({
      route: f.route, type_entretien: f.typeEntretien, date_debut: f.dateDebut,
      date_fin: f.dateFin, equipe: f.equipe, cout_estime: f.coutEstime
    }).pipe(
      map(r => ({ id: String(r.data.id), route: r.data.route, typeEntretien: r.data.type_entretien, dateDebut: r.data.date_debut, equipe: r.data.equipe, coutEstime: r.data.cout_estime, statut: r.data.statut as any })),
      tap(e => this.entretiensVoirie.update(l => [e, ...l]))
    );
  }

  loadReparationsVoirie(): void {
    this.repVoirieApi.getAll().pipe(
      tap(r => this.reparationsVoirie.set(r.data.map(x => ({
        id: String(x.id), route: x.route, description: x.description,
        priorite: x.priorite as any, signalePar: x.signale_par,
        dateSignalement: x.date_signalement, statut: x.statut as any
      }))))
    ).subscribe();
  }

  signalerReparation(f: { route: string; description: string; priorite?: string; signalePar: string }): Observable<ReparationVoirie> {
    return this.repVoirieApi.create({
      route: f.route, description: f.description, priorite: f.priorite, signale_par: f.signalePar
    }).pipe(
      map(r => ({ id: String(r.data.id), route: r.data.route, description: r.data.description, priorite: r.data.priorite as any, signalePar: r.data.signale_par, dateSignalement: r.data.date_signalement, statut: r.data.statut as any })),
      tap(r => this.reparationsVoirie.update(l => [r, ...l]))
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ÉCLAIRAGE
  // ═══════════════════════════════════════════════════════════════════════════

  loadLampadaires(f: { statut?: string; quartier?: string } = {}): void {
    this.lampApi.getAll(f).pipe(
      tap(r => this.lampadaires.set(r.data.map(x => ({
        id: String(x.id), reference: x.reference, localisation: x.localisation,
        quartier: x.quartier, typeLampe: x.type_lampe, puissance: x.puissance,
        statut: x.statut as any, datePosee: x.date_posee ?? undefined
      }))))
    ).subscribe();
  }

  signalerPanne(f: { localisation: string; description: string }): Observable<PanneEclairage> {
    return this.panneApi.create(f).pipe(
      map(r => ({ id: String(r.data.id), reference: r.data.reference, localisation: r.data.localisation, description: r.data.description, dateSignalement: r.data.date_signalement, statut: r.data.statut as any })),
      tap(p => {
        this.pannes.update(l => [p, ...l]);
        this.kpi.update(k => ({ ...k, pannesSignalees: k.pannesSignalees + 1 }));
      })
    );
  }

  loadPannes(f: { statut?: string } = {}): void {
    this.panneApi.getAll(f).pipe(
      tap(r => this.pannes.set(r.data.map(x => ({
        id: String(x.id), reference: x.reference, localisation: x.localisation,
        description: x.description, dateSignalement: x.date_signalement,
        technicien: x.technicien ?? undefined, dateResolution: x.date_resolution ?? undefined,
        statut: x.statut as any
      }))))
    ).subscribe();
  }

  resoudrePanne(id: string, technicien: string): void {
    this.panneApi.resoudre(Number(id), technicien).pipe(
      tap(() => {
        this.pannes.update(l => l.map(p => p.id === id ? { ...p, statut: 'resolue' as const } : p));
        this.kpi.update(k => ({ ...k, pannesSignalees: Math.max(0, k.pannesSignalees - 1) }));
      })
    ).subscribe();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  EAU & ASSAINISSEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  loadCaniveaux(f: { etat?: string } = {}): void {
    this.caniveauApi.getAll(f).pipe(
      tap(r => this.caniveaux.set(r.data.map(x => ({
        id: String(x.id), localisation: x.localisation, quartier: x.quartier,
        longueur: x.longueur, etat: x.etat as any,
        dateDernierNettoyage: x.date_dernier_nettoyage ?? undefined
      }))))
    ).subscribe();
  }

  loadCollectes(): void {
    this.dechetApi.getAll().pipe(
      tap(r => this.collectes.set(r.data.map(x => ({
        id: String(x.id), zone: x.zone, frequence: x.frequence,
        prochaineCollecte: x.prochaine_collecte, tonnage: x.tonnage ?? undefined,
        statut: x.statut as any
      }))))
    ).subscribe();
  }

  marquerCollecteEffectuee(id: string, tonnage?: number): void {
    this.dechetApi.marquerEffectue(Number(id), tonnage).pipe(
      tap(() => this.collectes.update(l => l.map(c => c.id === id ? { ...c, statut: 'effectue' as const } : c)))
    ).subscribe();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  BÂTIMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  loadBatiments(f: { type?: string; etat?: string } = {}): void {
    this.batApi.getAll(f).pipe(
      tap(r => this.batiments.set(r.data.map(x => ({
        id: String(x.id), nom: x.nom, type: x.type as any, adresse: x.adresse,
        superficie: x.superficie, anneeConstrucion: x.annee_construction ?? undefined,
        etat: x.etat as any, responsable: x.responsable ?? undefined,
        dateDerniereInspection: x.date_derniere_inspection ?? undefined
      }))))
    ).subscribe();
  }

  loadTravauxBatiments(): void {
    this.travBatApi.getAll().pipe(
      tap(r => this.travaux.set(r.data.map(x => ({
        id: String(x.id), batiment: x.batiment, description: x.description,
        type: x.type as any, dateDebut: x.date_debut, dateFin: x.date_fin ?? undefined,
        coutEstime: x.cout_estime, prestataire: x.prestataire ?? undefined, statut: x.statut as any
      }))))
    ).subscribe();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  INTERVENTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  loadDemandes(f: { statut?: string; type_service?: string; priorite?: string } = {}): void {
    this.loadingDemandes.set(true);
    this.demandeApi.getAll(f).pipe(
      tap(r => {
        this.demandes.set(r.data.map(x => ({
          id: String(x.id), reference: x.reference, typeService: x.type_service,
          description: x.description, localisation: x.localisation,
          demandeur: x.demandeur, telephone: x.telephone ?? undefined,
          dateDepot: x.date_depot, priorite: x.priorite as any,
          statut: x.statut as any, assigneA: x.assigne_a ?? undefined,
          dateResolution: x.date_resolution ?? undefined
        })));
        this.loadingDemandes.set(false);
      })
    ).subscribe({ error: () => this.loadingDemandes.set(false) });
  }

  creerDemande(f: { typeService: string; description: string; localisation: string; demandeur: string; telephone?: string; priorite?: string }): Observable<DemandeIntervention> {
    return this.demandeApi.create({
      type_service: f.typeService, description: f.description, localisation: f.localisation,
      demandeur: f.demandeur, telephone: f.telephone, priorite: f.priorite
    }).pipe(
      map(r => ({
        id: String(r.data.id), reference: r.data.reference, typeService: r.data.type_service,
        description: r.data.description, localisation: r.data.localisation,
        demandeur: r.data.demandeur, dateDepot: r.data.date_depot,
        priorite: r.data.priorite as any, statut: r.data.statut as any
      })),
      tap(d => {
        this.demandes.update(l => [d, ...l]);
        this.kpi.update(k => ({ ...k, demandesCitoyennes: k.demandesCitoyennes + 1 }));
      })
    );
  }

  assignerDemande(id: string, agent: string): void {
    this.demandeApi.assigner(Number(id), agent).pipe(
      tap(() => this.demandes.update(l => l.map(d => d.id === id ? { ...d, statut: 'assignee' as const, assigneA: agent } : d)))
    ).subscribe();
  }

  cloturerDemande(id: string): void {
    this.demandeApi.cloturer(Number(id)).pipe(
      tap(() => this.demandes.update(l => l.map(d => d.id === id ? { ...d, statut: 'cloturee' as const } : d)))
    ).subscribe();
  }

  loadBons(): void {
    this.bonApi.getAll().pipe(
      tap(r => this.bons.set(r.data.map(x => ({
        id: String(x.id), reference: x.reference, demande: x.demande_ref ?? undefined,
        description: x.description, service: x.service, equipe: x.equipe,
        chef: x.chef, dateDebut: x.date_debut, dateFin: x.date_fin ?? undefined,
        materiaux: x.materiaux ?? undefined, statut: x.statut as any
      }))))
    ).subscribe();
  }

  creerBonTravail(f: { demandeRef?: string; description: string; service: string; equipe: string; chef: string; dateDebut: string; materiaux?: string }): Observable<BonTravail> {
    return this.bonApi.create({
      demande_ref: f.demandeRef, description: f.description, service: f.service,
      equipe: f.equipe, chef: f.chef, date_debut: f.dateDebut, materiaux: f.materiaux
    }).pipe(
      map(r => ({
        id: String(r.data.id), reference: r.data.reference, description: r.data.description,
        service: r.data.service, equipe: r.data.equipe, chef: r.data.chef,
        dateDebut: r.data.date_debut, statut: r.data.statut as any
      })),
      tap(b => this.bons.update(l => [b, ...l]))
    );
  }

  loadEquipes(): void {
    this.equipeApi.getAll().pipe(
      tap(r => this.equipes.set(r.data.map(x => ({
        id: String(x.id), nom: x.nom, chef: x.chef, membres: x.membres,
        bonEnCours: x.bon_en_cours ?? undefined, localisation: x.localisation ?? undefined,
        statut: x.statut as any
      }))))
    ).subscribe();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  MAINTENANCE
  // ═══════════════════════════════════════════════════════════════════════════

  loadPlanningMaintenance(): void {
    this.planningApi.getAll().pipe(
      tap(r => this.planningMaint.set(r.data.map(x => ({
        id: String(x.id), equipement: x.equipement, service: x.service,
        typeMaintenance: x.type_maintenance, datePrevue: x.date_prevue,
        periodicite: x.periodicite, responsable: x.responsable,
        coutEstime: x.cout_estime ?? undefined, statut: x.statut as any
      }))))
    ).subscribe();
  }

  planifierMaintenance(f: { equipement: string; service: string; typeMaintenance: string; datePrevue: string; periodicite?: string; responsable: string; coutEstime?: number }): Observable<PlanningMaintenance> {
    return this.planningApi.create({
      equipement: f.equipement, service: f.service, type_maintenance: f.typeMaintenance,
      date_prevue: f.datePrevue, periodicite: f.periodicite, responsable: f.responsable,
      cout_estime: f.coutEstime
    }).pipe(
      map(r => ({
        id: String(r.data.id), equipement: r.data.equipement, service: r.data.service,
        typeMaintenance: r.data.type_maintenance, datePrevue: r.data.date_prevue,
        periodicite: r.data.periodicite, responsable: r.data.responsable, statut: r.data.statut as any
      })),
      tap(p => this.planningMaint.update(l => [p, ...l]))
    );
  }

  loadMaintenanceCorrective(): void {
    this.correctApi.getAll().pipe(
      tap(r => this.maintenanceCorrective.set(r.data.map(x => ({
        id: String(x.id), equipement: x.equipement, service: x.service,
        panne: x.panne, priorite: x.priorite as any,
        technicien: x.technicien ?? undefined, dateSignalement: x.date_signalement,
        dateResolution: x.date_resolution ?? undefined, statut: x.statut as any
      }))))
    ).subscribe();
  }

  signalerPanneMaintenance(f: { equipement: string; service: string; panne: string; priorite?: string }): Observable<MaintenanceCorrective> {
    return this.correctApi.create(f).pipe(
      map(r => ({
        id: String(r.data.id), equipement: r.data.equipement, service: r.data.service,
        panne: r.data.panne, priorite: r.data.priorite as any,
        dateSignalement: r.data.date_signalement, statut: r.data.statut as any
      })),
      tap(m => this.maintenanceCorrective.update(l => [m, ...l]))
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  STATISTIQUES & EXPORT
  // ═══════════════════════════════════════════════════════════════════════════

  loadStats(): void {
    this.statsApi.getDashboard().pipe(
      tap(s => this.kpi.set({
        interventionsEnCours: s.kpi.interventions_en_cours,
        pannesSignalees:      s.kpi.pannes_signalees,
        travauxPlanifies:     s.kpi.travaux_planifies,
        demandesCitoyennes:   s.kpi.demandes_citoyennes,
        tauxResolution:       s.kpi.taux_resolution,
        delaiMoyenJours:      s.kpi.delai_moyen_jours,
      }))
    ).subscribe();
  }

  exportJson(service?: string): void {
    this.statsApi.export(service).subscribe(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `services_techniques${service ? '_' + service : ''}_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    });
  }
}
