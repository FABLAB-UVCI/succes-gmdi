import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import {
  Actualite, Partenaire, Document,
  Reclamation, Suggestion, ConsultationPublique,
  CampagneSms, CompteReseau, PostProgramme,
  KpiCommunication
} from '../models/communication.models';
import {
  ActualiteApiService, ReseauxApiService, RelationsApiService,
  DocumentApiService, ReclamationApiService, SuggestionApiService,
  ConsultationApiService, SmsApiService, StatsCommunicationApiService
} from './communication-api.service';
import { ActualiteCreateRequest, ReclamationCreateRequest, SuggestionCreateRequest, ConsultationCreateRequest, CampagneSmsCreateRequest, AlerteRequest, PartenaireCreateRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CommunicationService {

  private actuApi   = inject(ActualiteApiService);
  private rsApi     = inject(ReseauxApiService);
  private relApi    = inject(RelationsApiService);
  private docApi    = inject(DocumentApiService);
  private recApi    = inject(ReclamationApiService);
  private sugApi    = inject(SuggestionApiService);
  private consApi   = inject(ConsultationApiService);
  private smsApi    = inject(SmsApiService);
  private statsApi  = inject(StatsCommunicationApiService);

  // ── Cache réactif ─────────────────────────────────────────────────────────
  readonly actualites       = signal<Actualite[]>([]);
  readonly comptes          = signal<CompteReseau[]>([]);
  readonly calendrier       = signal<PostProgramme[]>([]);
  readonly partenaires      = signal<Partenaire[]>([]);
  readonly documents        = signal<Document[]>([]);
  readonly reclamations     = signal<Reclamation[]>([]);
  readonly suggestions      = signal<Suggestion[]>([]);
  readonly consultations    = signal<ConsultationPublique[]>([]);
  readonly smsHistorique    = signal<CampagneSms[]>([]);
  readonly loading          = signal(false);

  readonly kpi = signal<KpiCommunication>({
    publicationsMois: 24, abonnesTotaux: 12800,
    tauxLivraisonSms: 94, reclamationsOuvertes: 8,
    partenairesActifs: 3, documentsArchives: 1248
  });

  // ── Actualités ─────────────────────────────────────────────────────────────

  loadActualites(f: { type?: string; statut?: string; search?: string } = {}): void {
    this.loading.set(true);
    this.actuApi.getAll(f).pipe(
      tap(r => {
        this.actualites.set(r.data.map(x => ({
          id: String(x.id), type: x.type as any, titre: x.titre, contenu: x.contenu,
          auteur: x.auteur, date: x.date, statut: x.statut as any, categorie: x.categorie ?? undefined
        })));
        this.loading.set(false);
      })
    ).subscribe({ error: () => this.loading.set(false) });
  }

  publierActualite(data: ActualiteCreateRequest): Observable<Actualite> {
    return this.actuApi.create(data).pipe(
      map(r => ({ id: String(r.data.id), type: r.data.type as any, titre: r.data.titre, contenu: r.data.contenu, auteur: r.data.auteur, date: r.data.date, statut: r.data.statut as any })),
      tap(a => {
        this.actualites.update(l => [a, ...l]);
        this.kpi.update(k => ({ ...k, publicationsMois: k.publicationsMois + 1 }));
      })
    );
  }

  publierDirectement(id: string): void {
    this.actuApi.updateStatut(Number(id), 'publie').pipe(
      tap(() => this.actualites.update(l => l.map(a => a.id === id ? { ...a, statut: 'publie' as const } : a)))
    ).subscribe();
  }

  // ── Réseaux sociaux ────────────────────────────────────────────────────────

  loadComptes(): void {
    this.rsApi.getComptes().pipe(
      tap(r => this.comptes.set(r.map(x => ({
        id: String(x.id), plateforme: x.plateforme as any, nom: x.nom, handle: x.handle,
        abonnes: x.abonnes, publications: x.publications,
        tauxEngagement: x.taux_engagement, porteMois: x.porte_mois,
        dernierPost: x.dernier_post ?? undefined
      }))))
    ).subscribe();
  }

  loadCalendrier(): void {
    this.rsApi.getCalendrier().pipe(
      tap(r => this.calendrier.set(r.map(x => ({
        id: String(x.id), date: x.date, contenu: x.contenu,
        plateformes: x.plateformes.split(',').filter(Boolean),
        responsable: x.responsable, statut: x.statut as any
      }))))
    ).subscribe();
  }

  publierPost(data: { contenu: string; plateformes: string[]; programme?: boolean; date?: string }): Observable<any> {
    return this.rsApi.publierPost(data).pipe(
      tap(r => this.calendrier.update(l => [{ id: String(r.data.id), date: r.data.date, contenu: r.data.contenu, plateformes: r.data.plateformes.split(','), responsable: r.data.responsable, statut: r.data.statut as any }, ...l]))
    );
  }

  // ── Relations publiques ────────────────────────────────────────────────────

  loadPartenaires(): void {
    this.relApi.getPartenaires().pipe(
      tap(r => this.partenaires.set(r.data.map(x => ({
        id: String(x.id), nom: x.nom, type: x.type, domaine: x.domaine,
        contact: x.contact, dateDebut: x.date_debut, statut: x.statut as any
      }))))
    ).subscribe();
  }

  ajouterPartenaire(data: PartenaireCreateRequest): Observable<Partenaire> {
    return this.relApi.createPartenaire(data).pipe(
      map(r => ({ id: String(r.data.id), nom: r.data.nom, type: r.data.type, domaine: r.data.domaine, contact: r.data.contact, dateDebut: r.data.date_debut, statut: r.data.statut as any })),
      tap(p => this.partenaires.update(l => [p, ...l]))
    );
  }

  // ── Documents ──────────────────────────────────────────────────────────────

  loadDocuments(f: { type?: string } = {}): void {
    this.docApi.getAll(f).pipe(
      tap(r => this.documents.set(r.data.map(x => ({
        id: String(x.id), titre: x.titre, type: x.type as any, categorie: x.categorie,
        date: x.date, auteur: x.auteur ?? undefined, url: x.url ?? undefined
      }))))
    ).subscribe();
  }

  ajouterDocument(data: { titre: string; type: string; categorie: string; date?: string; auteur?: string; url?: string; droits?: string }): Observable<Document> {
    return this.docApi.create(data).pipe(
      map(r => ({ id: String(r.data.id), titre: r.data.titre, type: r.data.type as any, categorie: r.data.categorie, date: r.data.date })),
      tap(d => {
        this.documents.update(l => [d, ...l]);
        this.kpi.update(k => ({ ...k, documentsArchives: k.documentsArchives + 1 }));
      })
    );
  }

  // ── Réclamations ───────────────────────────────────────────────────────────

  loadReclamations(f: { statut?: string; service?: string } = {}): void {
    this.recApi.getAll(f).pipe(
      tap(r => this.reclamations.set(r.data.map(x => ({
        id: String(x.id), reference: x.reference, objet: x.objet, demandeur: x.demandeur,
        service: x.service, canal: x.canal, date: x.date, statut: x.statut as any
      }))))
    ).subscribe();
  }

  ajouterReclamation(data: ReclamationCreateRequest): Observable<Reclamation> {
    return this.recApi.create(data).pipe(
      map(r => ({ id: String(r.data.id), reference: r.data.reference, objet: r.data.objet, demandeur: r.data.demandeur, service: r.data.service, canal: r.data.canal, date: r.data.date, statut: r.data.statut as any })),
      tap(rec => {
        this.reclamations.update(l => [rec, ...l]);
        this.kpi.update(k => ({ ...k, reclamationsOuvertes: k.reclamationsOuvertes + 1 }));
      })
    );
  }

  validerReclamation(id: string): void {
    this.recApi.updateStatut(Number(id), 'repondu').pipe(
      tap(() => {
        this.reclamations.update(l => l.map(r => r.id === id ? { ...r, statut: 'repondu' as const } : r));
        this.kpi.update(k => ({ ...k, reclamationsOuvertes: Math.max(0, k.reclamationsOuvertes - 1) }));
      })
    ).subscribe();
  }

  exportReclamations(): void {
    this.recApi.export().subscribe(blob => {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `reclamations_${new Date().toISOString().slice(0, 10)}.json`; a.click();
    });
  }

  // ── Suggestions ────────────────────────────────────────────────────────────

  loadSuggestions(): void {
    this.sugApi.getAll().pipe(
      tap(r => this.suggestions.set(r.data.map(x => ({
        id: String(x.id), reference: x.reference, objet: x.objet,
        citoyen: x.citoyen, description: x.description ?? undefined,
        date: x.date, statut: x.statut as any
      }))))
    ).subscribe();
  }

  ajouterSuggestion(data: SuggestionCreateRequest): Observable<Suggestion> {
    return this.sugApi.create(data).pipe(
      map(r => ({ id: String(r.data.id), reference: r.data.reference, objet: r.data.objet, citoyen: r.data.citoyen, date: r.data.date, statut: r.data.statut as any })),
      tap(s => this.suggestions.update(l => [s, ...l]))
    );
  }

  transmettresuggestion(id: string): void {
    this.sugApi.transmettre(Number(id)).pipe(
      tap(() => this.suggestions.update(l => l.map(s => s.id === id ? { ...s, statut: 'transmis' as const } : s)))
    ).subscribe();
  }

  // ── Consultations ──────────────────────────────────────────────────────────

  loadConsultations(): void {
    this.consApi.getAll().pipe(
      tap(r => this.consultations.set(r.map(x => ({
        id: String(x.id), titre: x.titre, theme: x.theme,
        dateOuverture: x.date_ouverture, dateCloture: x.date_cloture,
        participants: x.participants, statut: x.statut as any
      }))))
    ).subscribe();
  }

  ouvrirConsultation(data: ConsultationCreateRequest): Observable<ConsultationPublique> {
    return this.consApi.create(data).pipe(
      map(r => ({ id: String(r.data.id), titre: r.data.titre, theme: r.data.theme, dateOuverture: r.data.date_ouverture, dateCloture: r.data.date_cloture, participants: 0, statut: 'programme' as const })),
      tap(c => this.consultations.update(l => [...l, c]))
    );
  }

  // ── SMS ────────────────────────────────────────────────────────────────────

  loadSmsHistorique(): void {
    this.smsApi.getHistorique().pipe(
      tap(r => this.smsHistorique.set(r.map(x => ({
        id: String(x.id), nom: x.nom, type: x.type as any, message: x.message,
        destinataires: x.destinataires, nbDestinataires: x.nb_destinataires,
        dateEnvoi: x.date_envoi, statut: x.statut as any, tauxLivraison: x.taux_livraison
      }))))
    ).subscribe();
  }

  lancerCampagne(data: CampagneSmsCreateRequest): Observable<CampagneSms> {
    return this.smsApi.lancerCampagne(data).pipe(
      map(r => ({ id: String(r.data.id), nom: r.data.nom, type: r.data.type as any, message: r.data.message, destinataires: r.data.destinataires, nbDestinataires: r.data.nb_destinataires, dateEnvoi: r.data.date_envoi, statut: r.data.statut as any, tauxLivraison: r.data.taux_livraison })),
      tap(c => this.smsHistorique.update(l => [c, ...l]))
    );
  }

  envoyerAlerte(data: AlerteRequest): Observable<CampagneSms> {
    return this.smsApi.envoyerAlerte(data).pipe(
      map(r => ({ id: String(r.data.id), nom: r.data.nom, type: 'alerte' as any, message: r.data.message, destinataires: r.data.destinataires, nbDestinataires: r.data.nb_destinataires, dateEnvoi: r.data.date_envoi, statut: r.data.statut as any, tauxLivraison: r.data.taux_livraison })),
      tap(c => this.smsHistorique.update(l => [c, ...l]))
    );
  }

  exportSms(): void {
    this.smsApi.export().subscribe(blob => {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `sms_historique_${new Date().toISOString().slice(0, 10)}.json`; a.click();
    });
  }

  // ── Stats ──────────────────────────────────────────────────────────────────

  loadStats(): void {
    this.statsApi.getDashboard().pipe(
      tap(s => this.kpi.set({
        publicationsMois:      s.kpi.publications_mois,
        abonnesTotaux:         s.kpi.abonnes_totaux,
        tauxLivraisonSms:      s.kpi.taux_livraison_sms,
        reclamationsOuvertes:  s.kpi.reclamations_ouvertes,
        partenairesActifs:     s.kpi.partenaires_actifs,
        documentsArchives:     s.kpi.documents_archives,
      }))
    ).subscribe();
  }
}
