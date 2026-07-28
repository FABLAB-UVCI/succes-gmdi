import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { AuthService } from '../communication/core/services/auth.service';
import { ToastService } from '../communication/core/services/toast.service';

type Onglet = 'actualites' | 'agenda' | 'deliberations' | 'budget' | 'alertes' | 'abonnement';

const TYPES_COMMUNICATION = [
  { value: 'tous', label: 'Toutes les communications' },
  { value: 'actualites', label: 'Actualités municipales' },
  { value: 'alertes_travaux', label: 'Alertes travaux / coupures' },
  { value: 'finances', label: 'Informations fiscales et financières' },
];

@Component({
  selector: 'app-citoyen-communication',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="com-container">
      <div class="header">
        <a routerLink="/citoyen" class="btn-back"><i class="ti ti-arrow-left"></i> Retour</a>
        <h1>Communication municipale</h1>
        <p>Actualités, agenda, délibérations, budget et abonnement aux communications de la commune.</p>
      </div>

      <div class="tabs">
        @for (o of onglets; track o.id) {
          <button class="tab" [class.active]="active() === o.id" (click)="active.set(o.id)">
            <i [class]="o.icone"></i> {{ o.label }}
          </button>
        }
      </div>

      <div class="card">
        @if (active() === 'actualites') {
          <h2><i class="ti ti-news"></i> Actualités municipales</h2>
          @if (loading()) { <div class="loading">Chargement...</div> }
          @else if (actualites().length === 0) { <div class="empty"><i class="ti ti-news-off"></i><p>Aucune actualité publiée pour le moment.</p></div> }
          @else {
            <div class="liste">
              @for (a of actualites(); track a.id) {
                <div class="item">
                  <div class="item-head"><span class="item-titre">{{ a.titre }}</span><span class="item-badge" [ngClass]="a.type">{{ a.type }}</span></div>
                  <p class="item-contenu">{{ a.contenu }}</p>
                  <span class="item-date">{{ a.date | date:'dd/MM/yyyy' }} — {{ a.auteur }}</span>
                </div>
              }
            </div>
          }
        }

        @if (active() === 'agenda') {
          <h2><i class="ti ti-calendar-event"></i> Agenda municipal</h2>
          @if (loading()) { <div class="loading">Chargement...</div> }
          @else if (agenda().length === 0) { <div class="empty"><i class="ti ti-calendar-off"></i><p>Aucun événement programmé.</p></div> }
          @else {
            <div class="liste">
              @for (e of agenda(); track e.id) {
                <div class="item">
                  <div class="item-head"><span class="item-titre">{{ e.titre }}</span><span class="item-date">{{ e.date | date:'dd/MM/yyyy' }}</span></div>
                  <p class="item-contenu">{{ e.contenu }}</p>
                </div>
              }
            </div>
          }
        }

        @if (active() === 'deliberations') {
          <h2><i class="ti ti-gavel"></i> Délibérations publiées</h2>
          @if (loading()) { <div class="loading">Chargement...</div> }
          @else if (deliberations().length === 0) { <div class="empty"><i class="ti ti-file-off"></i><p>Aucune délibération publiée.</p></div> }
          @else {
            <div class="liste">
              @for (d of deliberations(); track d.id) {
                <div class="item">
                  <div class="item-head"><span class="item-titre">{{ d.titre }}</span><span class="item-date">{{ d.date | date:'dd/MM/yyyy' }}</span></div>
                  @if (d.url) { <a [href]="d.url" target="_blank" class="btn-download"><i class="ti ti-download"></i> Consulter le document</a> }
                </div>
              }
            </div>
          }
        }

        @if (active() === 'budget') {
          <h2><i class="ti ti-chart-pie"></i> Budget communal simplifié</h2>
          @if (loading()) { <div class="loading">Chargement...</div> }
          @else if (budget().length === 0) { <div class="empty"><i class="ti ti-chart-pie-off"></i><p>Aucune donnée budgétaire approuvée disponible.</p></div> }
          @else {
            <div class="budget-total">
              <div><span>Total prévisionnel</span><strong>{{ budgetTotalPrev() | number:'1.0-0':'fr-FR' }} FCFA</strong></div>
              <div><span>Total consommé</span><strong>{{ budgetTotalConso() | number:'1.0-0':'fr-FR' }} FCFA</strong></div>
            </div>
            <div class="liste">
              @for (b of budget(); track b.chapitre) {
                <div class="item">
                  <div class="item-head"><span class="item-titre">{{ b.chapitre }}</span></div>
                  <div class="budget-bar">
                    <div class="budget-bar-fill" [style.width.%]="pct(b.montantConsomme, b.montantPrevisionnel)"></div>
                  </div>
                  <span class="item-date">{{ b.montantConsomme | number:'1.0-0':'fr-FR' }} / {{ b.montantPrevisionnel | number:'1.0-0':'fr-FR' }} FCFA</span>
                </div>
              }
            </div>
          }
        }

        @if (active() === 'alertes') {
          <h2><i class="ti ti-bell-ringing"></i> Alertes et communications</h2>
          @if (loading()) { <div class="loading">Chargement...</div> }
          @else if (alertes().length === 0) { <div class="empty"><i class="ti ti-bell-off"></i><p>Aucune communication récente.</p></div> }
          @else {
            <div class="liste">
              @for (al of alertes(); track al.message) {
                <div class="item">
                  <div class="item-head"><span class="item-titre">{{ al.nom }}</span><span class="item-badge" [ngClass]="al.type">{{ al.type }}</span></div>
                  <p class="item-contenu">{{ al.message }}</p>
                  <span class="item-date">{{ al.date_envoi | date:'dd/MM/yyyy' }}</span>
                </div>
              }
            </div>
          }
        }

        @if (active() === 'abonnement') {
          <h2><i class="ti ti-mail-heart"></i> S'abonner aux communications municipales</h2>
          <p class="sub">Recevez les actualités, alertes travaux et informations financières de votre commune.</p>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="abo-form">
            <div class="form-grid">
              <div class="fg"><div class="fl">Nom <span class="req">*</span></div><input type="text" class="fi" formControlName="nom"></div>
              <div class="fg"><div class="fl">Prénom</div><input type="text" class="fi" formControlName="prenom"></div>
            </div>
            <div class="form-grid">
              <div class="fg"><div class="fl">Email <span class="req">*</span></div><input type="email" class="fi" formControlName="email"></div>
              <div class="fg"><div class="fl">Téléphone</div><input type="text" class="fi" formControlName="telephone"></div>
            </div>
            <div class="form-grid" style="grid-template-columns: 1fr;">
              <div class="fg">
                <div class="fl">Type de communication souhaitée <span class="req">*</span></div>
                <select class="fsel" formControlName="type_communication">
                  @for (t of typesCommunication; track t.value) { <option [value]="t.value">{{ t.label }}</option> }
                </select>
              </div>
            </div>
            <button type="submit" class="btn-submit" [disabled]="submitting() || form.invalid">
              <i class="ti ti-send" style="margin-right:8px;"></i>
              {{ submitting() ? 'Envoi en cours...' : "S'abonner" }}
            </button>
          </form>
        }
      </div>
    </div>

    <style>
      .com-container { padding: 2rem; max-width: 1000px; margin: 0 auto; font-family: 'Inter', sans-serif; }
      .header { margin-bottom: 1.5rem; }
      .btn-back { display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #003366; font-weight: 600; margin-bottom: 1rem; }
      .btn-back:hover { text-decoration: underline; }
      .header h1 { font-size: 2rem; color: #003366; margin: 0 0 0.5rem 0; }
      .header p { color: #4a5568; margin: 0; }

      .tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
      .tab { background: #fff; border: 1px solid #e2e8f0; padding: 0.6rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; color: #4a5568; display: flex; align-items: center; gap: 6px; transition: all .15s; }
      .tab:hover { border-color: #009A44; color: #009A44; }
      .tab.active { background: #003366; border-color: #003366; color: #fff; }

      .card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
      .card h2 { font-size: 1.2rem; color: #003366; margin-top: 0; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
      .sub { color: #718096; font-size: 0.85rem; margin: -0.5rem 0 1.5rem; }

      .loading, .empty { text-align: center; padding: 2.5rem 1rem; color: #a0aec0; }
      .empty i { font-size: 2.5rem; margin-bottom: 0.8rem; }

      .liste { display: flex; flex-direction: column; gap: 1rem; }
      .item { padding: 1rem; border: 1px solid #edf2f7; border-radius: 8px; background: #f8fafc; }
      .item-head { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
      .item-titre { font-weight: 700; color: #003366; }
      .item-contenu { color: #4a5568; font-size: 0.88rem; margin: 0.3rem 0; }
      .item-date { font-size: 0.78rem; color: #a0aec0; }
      .item-badge { padding: 0.15rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; background: rgba(247,127,0,.12); color: #cc6600; white-space: nowrap; }
      .btn-download { display: inline-flex; align-items: center; gap: 0.3rem; background: #003366; color: #fff; padding: 0.35rem 0.8rem; border-radius: 6px; font-size: 0.78rem; font-weight: 600; text-decoration: none; margin-top: 0.4rem; }
      .btn-download:hover { background: #004fa3; }

      .budget-total { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
      .budget-total div { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 1rem 1.4rem; flex: 1; min-width: 200px; }
      .budget-total span { display: block; color: #166534; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.2rem; }
      .budget-total strong { color: #009A44; font-size: 1.3rem; }
      .budget-bar { height: 8px; border-radius: 4px; background: #e2e8f0; overflow: hidden; margin: 0.5rem 0; }
      .budget-bar-fill { height: 100%; background: #F77F00; }

      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
      @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
      .fg { display: flex; flex-direction: column; gap: 0.5rem; }
      .fl { font-size: 12px; font-weight: 600; color: #475569; }
      .req { color: #ef4444; }
      .fi, .fsel { padding: 0.6rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; background: #f8fafc; font-family: inherit; width: 100%; box-sizing: border-box; height: 44px; }
      .fi:focus, .fsel:focus { border-color: #F77F00; background: #fff; box-shadow: 0 0 0 3px rgba(247,127,0,0.1); }
      .btn-submit { padding: 1rem; background: #009A44; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; }
      .btn-submit:hover:not(:disabled) { background: #007a36; }
      .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

      @media (max-width: 640px) { .com-container { padding: 1rem; } }
    </style>
  `
})
export class CitoyenCommunicationComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  readonly auth = inject(AuthService);
  private base = `${environment.apiUrl}/citoyen/communication`;

  onglets: { id: Onglet; label: string; icone: string }[] = [
    { id: 'actualites', label: 'Actualités', icone: 'ti ti-news' },
    { id: 'agenda', label: 'Agenda', icone: 'ti ti-calendar-event' },
    { id: 'deliberations', label: 'Délibérations', icone: 'ti ti-gavel' },
    { id: 'budget', label: 'Budget simplifié', icone: 'ti ti-chart-pie' },
    { id: 'alertes', label: 'Alertes', icone: 'ti ti-bell-ringing' },
    { id: 'abonnement', label: 'Abonnement', icone: 'ti ti-mail-heart' },
  ];
  typesCommunication = TYPES_COMMUNICATION;

  active = signal<Onglet>('actualites');
  loading = signal(false);
  submitting = signal(false);

  actualites = signal<any[]>([]);
  agenda = signal<any[]>([]);
  deliberations = signal<any[]>([]);
  budget = signal<any[]>([]);
  alertes = signal<any[]>([]);

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: [''],
    email: ['', [Validators.required, Validators.email]],
    telephone: [''],
    type_communication: ['tous', Validators.required],
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) {
      const parts = (user.name || '').split(' ');
      this.form.patchValue({ nom: parts[0] || '', prenom: parts.slice(1).join(' '), email: user.email || '' });
    }
    this.loadAll();
  }

  loadAll() {
    this.loading.set(true);
    this.http.get<{ data: any[] }>(`${this.base}/actualites`).subscribe({ next: r => this.actualites.set(r.data), error: () => {} });
    this.http.get<{ data: any[] }>(`${this.base}/agenda`).subscribe({ next: r => this.agenda.set(r.data), error: () => {} });
    this.http.get<{ data: any[] }>(`${this.base}/deliberations`).subscribe({ next: r => this.deliberations.set(r.data), error: () => {} });
    this.http.get<{ data: any[]; totalPrevisionnel: number; totalConsomme: number }>(`${this.base}/budget-simplifie`).subscribe({
      next: r => { this.budget.set(r.data); this.budgetTotalPrev.set(r.totalPrevisionnel); this.budgetTotalConso.set(r.totalConsomme); },
      error: () => {}
    });
    this.http.get<{ data: any[] }>(`${this.base}/alertes`).subscribe({ next: r => this.alertes.set(r.data), error: () => {}, complete: () => this.loading.set(false) });
  }

  budgetTotalPrev = signal(0);
  budgetTotalConso = signal(0);

  pct(conso: number, prev: number): number {
    if (!prev) return 0;
    return Math.min(100, Math.round((conso / prev) * 100));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toast.showError('abo-err', 'Veuillez remplir les champs obligatoires.', 'Erreur');
      return;
    }
    this.submitting.set(true);
    this.http.post(`${this.base}/abonnements`, this.form.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.show('abo-ok', 'Votre demande d\'abonnement a été enregistrée.');
      },
      error: () => {
        this.submitting.set(false);
        this.toast.showError('abo-api-err', 'Impossible d\'enregistrer votre abonnement.', 'Erreur');
      }
    });
  }
}
