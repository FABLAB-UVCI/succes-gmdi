import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../communication/core/services/auth.service';
import { environment } from '@env/environment';
import { DemandesCitoyensComponent } from '../shared/components/demandes-citoyens.component';

interface AnnonceForm { titre: string; contenu: string; urgent: boolean; destinataire: string; serviceCible: string; }

interface ServiceOption { value: string; label: string; }

const SERVICES_CIBLABLES: ServiceOption[] = [
  { value: 'communication', label: 'Communication' },
  { value: 'etat-civil', label: 'État civil' },
  { value: 'finances', label: 'Finances' },
  { value: 'patrimoine', label: 'Patrimoine' },
  { value: 'rh', label: 'Ressources humaines' },
  { value: 'services-techniques', label: 'Services techniques' },
  { value: 'urbanisme', label: 'Urbanisme / SIG' },
];

interface ModuleStat {
  key: string; label: string; ico: string; color: string;
  route: string; description: string;
  kpis: { label: string; value: string | number; unit?: string }[];
}

@Component({
  selector: 'app-maire-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DemandesCitoyensComponent],
  template: `
<div class="maire">

  <!-- Topbar -->
  <header class="maire-topbar">
    <div class="topbar-left">
      <span class="flag-strip"><span class="fo"></span><span class="fw"></span><span class="fv"></span></span>
      <div>
        <h1 class="topbar-title">Tableau de bord du Maire</h1>
        <p class="topbar-sub">Plateforme E-Mairie — Vue consolidée</p>
      </div>
    </div>
    <div class="topbar-right">
      <button class="btn-annonce" (click)="ouvrirModalAnnonce()"><i class="ti ti-speakerphone"></i> Nouvelle annonce</button>
      <span class="mayor-badge">
        <span class="mayor-avatar">🏛️</span>
        <span class="mayor-name">{{ user?.name ?? 'Monsieur le Maire' }}</span>
      </span>
      <button class="btn-logout" (click)="auth.logout()">Déconnexion</button>
    </div>
  </header>

  <div class="maire-body">

    <!-- Annonces du Maire -->
    <section class="annonces-section">
      <div class="section-head-row">
        <h2 class="section-title">📣 Mes annonces publiées</h2>
        <button class="btn-annonce-inline" (click)="ouvrirModalAnnonce()"><i class="ti ti-plus"></i> Publier une annonce</button>
      </div>
      @if (mesAnnonces().length === 0) {
        <div class="ann-empty-card">Aucune annonce publiée pour le moment. Utilisez le bouton ci-dessus pour communiquer avec tous les services.</div>
      } @else {
        <div class="ann-list">
          @for (a of mesAnnonces(); track a.id) {
            <div class="ann-row" [class.urgent]="a.urgent">
              <div class="ann-row-head">
                <span class="ann-row-titre">{{ a.titre }}</span>
                <span class="ann-row-audience">{{ labelAudience(a.audience) }}</span>
                @if (a.urgent) { <span class="ann-row-badge">Urgent</span> }
              </div>
              <p class="ann-row-contenu">{{ a.contenu }}</p>
              <span class="ann-row-date">{{ a.date | date:'dd MMMM yyyy':'':'fr-FR' }}</span>
            </div>
          }
        </div>
      }
    </section>

    <!-- KPIs globaux  -->
    <section class="kpi-section">
      <h2 class="section-title">📊 Indicateurs globaux</h2>
      <div class="kpi-grid">
        @for (k of globalKpis; track k.label) {
          <div class="kpi-card" [style.border-top-color]="k.color">
            <span class="kpi-ico">{{ k.ico }}</span>
            <div class="kpi-body">
              <span class="kpi-val">{{ k.value }}</span>
              <span class="kpi-lbl">{{ k.label }}</span>
            </div>
            <span class="kpi-trend" [class.up]="k.trend > 0" [class.neutral]="k.trend === 0">
              {{ k.trend > 0 ? '↑' : k.trend < 0 ? '↓' : '—' }}
            </span>
          </div>
        }
      </div>
    </section>

    <!--  Modules -->
    <section class="modules-section">
      <h2 class="section-title">🗂️ Accès aux modules — Supervision</h2>
      <div class="modules-grid">
        @for (m of modules; track m.key) {
          <div class="module-card" [style.--mc]="m.color">
            <div class="module-header">
              <span class="module-ico" [style.background]="m.color+'22'">{{ m.ico }}</span>
              <div>
                <div class="module-name">{{ m.label }}</div>
                <div class="module-desc">{{ m.description }}</div>
              </div>
            </div>
            <div class="module-kpis">
              @for (k of m.kpis; track k.label) {
                <div class="mkpi">
                  <span class="mkpi-val">{{ k.value }}{{ k.unit ?? '' }}</span>
                  <span class="mkpi-lbl">{{ k.label }}</span>
                </div>
              }
            </div>
            <a class="module-btn" [routerLink]="[m.route]">
              Accéder au module <span>→</span>
            </a>
          </div>
        }
      </div>
    </section>

    <!-- ── Alertes ──────────────────────────────────────────────────────── -->
    <section class="alerts-section">
      <h2 class="section-title">🔔 Alertes & actions stratégiques</h2>
      <div class="alerts-list">
        @for (a of alerts; track a.message) {
          <div class="alert-item" [class.warning]="a.level==='warning'" [class.info]="a.level==='info'">
            <span class="alert-ico">{{ a.ico }}</span>
            <div class="alert-body">
              <span class="alert-msg">{{ a.message }}</span>
              <span class="alert-sub">{{ a.detail }}</span>
            </div>
            <span class="alert-badge" [style.background]="a.level==='warning'?'#fff3e0':'#e8f0ff'"
              [style.color]="a.level==='warning'?'#F77F00':'#003366'">{{ a.tag }}</span>
          </div>
        }
      </div>
    </section>

    <!-- ── Demandes Citoyens (Supervision) ────────────────────────────────── -->
    <section class="demandes-section">
      <h2 class="section-title">📥 Supervision des demandes citoyennes</h2>
      <app-demandes-citoyens [readonly]="true" moduleLabel="Tous les modules (Vue globale)"></app-demandes-citoyens>
    </section>

  </div>
</div>

@if (modalAnnonceOuvert()) {
  <div class="ann-modal-overlay" (click)="fermerModalAnnonce()">
    <div class="ann-modal" (click)="$event.stopPropagation()">
      <div class="ann-modal-header">
        <h3><i class="ti ti-speakerphone"></i> Nouvelle annonce</h3>
        <button class="ann-modal-close" (click)="fermerModalAnnonce()"><i class="ti ti-x"></i></button>
      </div>
      <div class="ann-modal-body">
        <div class="ann-fg">
          <label>Titre <span class="req">*</span></label>
          <input type="text" [(ngModel)]="annonceForm.titre" placeholder="Ex: Coupure d'eau programmée">
        </div>
        <div class="ann-fg">
          <label>Contenu <span class="req">*</span></label>
          <textarea rows="5" [(ngModel)]="annonceForm.contenu" placeholder="Détails de l'annonce à diffuser..."></textarea>
        </div>
        <div class="ann-fg">
          <label>Destinataires <span class="req">*</span></label>
          <select [(ngModel)]="annonceForm.destinataire">
            <option value="public">Tous les citoyens et tous les services</option>
            <option value="tous_services">Tous les services (gestionnaires uniquement)</option>
            <option value="specifique">Un service précis...</option>
          </select>
        </div>
        @if (annonceForm.destinataire === 'specifique') {
          <div class="ann-fg">
            <label>Service ciblé <span class="req">*</span></label>
            <select [(ngModel)]="annonceForm.serviceCible">
              @for (s of servicesCiblables; track s.value) { <option [value]="s.value">{{ s.label }}</option> }
            </select>
          </div>
        }
        <label class="ann-checkbox">
          <input type="checkbox" [(ngModel)]="annonceForm.urgent"> Marquer comme urgente
        </label>
        @if (annonceError()) {
          <p class="ann-error">{{ annonceError() }}</p>
        }
        <button class="ann-submit" [disabled]="publishingAnnonce()" (click)="publierAnnonce()">
          <i class="ti ti-send"></i> {{ publishingAnnonce() ? 'Publication...' : "Publier l'annonce" }}
        </button>
      </div>
    </div>
  </div>
}


<style>
.maire {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'Inter', system-ui, sans-serif;
}

/* ── Topbar ── */
.maire-topbar {
  background: linear-gradient(135deg, #003366 0%, #00245c 100%);
  padding: 1.2rem 2.5rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
}
.topbar-left { display: flex; align-items: center; gap: 1rem; }
.flag-strip { display: flex; width: 28px; height: 20px; border-radius: 4px; overflow: hidden; flex-shrink: 0; }
.fo, .fw, .fv { flex: 1; }
.fo { background: #F77F00; } .fw { background: #fff; } .fv { background: #009A44; }
.topbar-title { color: #fff; font-size: 1.3rem; font-weight: 800; margin: 0; }
.topbar-sub { color: rgba(255,255,255,.6); font-size: .8rem; margin: .1rem 0 0; }
.topbar-right { display: flex; align-items: center; gap: 1rem; }
.mayor-badge { display: flex; align-items: center; gap: .5rem; padding: .3rem .8rem .3rem .3rem; border-radius: 999px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); }
.mayor-avatar {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 50%; font-size: .95rem;
  background: #fff;
  box-shadow: 0 0 0 2px #F77F00, 0 0 0 4px #fff, 0 0 0 5px #009A44;
}
.mayor-name { color: rgba(255,255,255,.9); font-size: .85rem; font-weight: 600; }
.btn-logout {
  padding: .45rem 1rem; border-radius: 8px;
  background: rgba(230,57,70,.2); color: #ff8080;
  border: 1px solid rgba(230,57,70,.3); font-size: .8rem; font-weight: 600; cursor: pointer;
  transition: background .15s ease;
}
.btn-logout:hover { background: rgba(230,57,70,.4); }

.maire-body { max-width: 1280px; margin: 0 auto; padding: 2rem 2rem; display: flex; flex-direction: column; gap: 2.5rem; }
.section-title { font-size: 1.05rem; font-weight: 800; color: #003366; margin: 0 0 1.2rem; }

/* ── KPI globaux ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.kpi-card {
  background: #fff; border-radius: 14px; padding: 1.3rem 1.5rem;
  border-top: 4px solid;
  display: flex; align-items: center; gap: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
  transition: transform .15s ease;
}
.kpi-card:hover { transform: translateY(-2px); }
.kpi-ico { font-size: 1.8rem; }
.kpi-body { flex: 1; display: flex; flex-direction: column; }
.kpi-val { font-size: 1.7rem; font-weight: 800; color: #003366; line-height: 1; }
.kpi-lbl { font-size: .75rem; color: #7a8aaa; font-weight: 600; margin-top: .2rem; }
.kpi-trend { font-size: 1rem; font-weight: 700; color: #c8d0de; }
.kpi-trend.up { color: #009A44; }

/* ── Modules grid ── */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 1.2rem;
}
.module-card {
  background: #fff; border-radius: 16px; padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  display: flex; flex-direction: column; gap: 1rem;
  border-left: 4px solid var(--mc, #003366);
  transition: box-shadow .15s ease, transform .15s ease;
}
.module-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.1); transform: translateY(-2px); }
.module-header { display: flex; align-items: center; gap: .9rem; }
.module-ico {
  width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
}
.module-name { font-weight: 800; font-size: 1rem; color: #003366; }
.module-desc { font-size: .75rem; color: #7a5c3a; margin-top: .15rem; }
.module-kpis { display: flex; gap: 1rem; flex-wrap: wrap; }
.mkpi {
  display: flex; flex-direction: column; gap: .1rem;
  background: #f4f7fc; border-radius: 8px; padding: .5rem .8rem;
  min-width: 70px;
}
.mkpi-val { font-size: 1.2rem; font-weight: 800; color: #003366; }
.mkpi-lbl { font-size: .65rem; color: #7a8aaa; font-weight: 600; text-transform: uppercase; letter-spacing: .4px; }
.module-btn {
  display: flex; align-items: center; justify-content: space-between;
  padding: .6rem 1rem; border-radius: 8px;
  background: linear-gradient(90deg, var(--mc, #003366) 0%, color-mix(in srgb, var(--mc, #003366) 80%, #000) 100%);
  color: #fff; text-decoration: none; font-size: .82rem; font-weight: 700;
  transition: opacity .15s ease;
}
.module-btn:hover { opacity: .88; }

/* ── Alertes ── */
.alerts-section { background: #fff; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
.alerts-list { display: flex; flex-direction: column; gap: .7rem; }
.alert-item {
  display: flex; align-items: center; gap: 1rem; padding: .9rem 1rem;
  border-radius: 10px; border: 1.5px solid #e8edf5;
}
.alert-item.warning { border-color: #ffe0b2; background: #fffaf3; }
.alert-item.info { border-color: #c8dcff; background: #f4f8ff; }
.alert-ico { font-size: 1.4rem; }
.alert-body { flex: 1; display: flex; flex-direction: column; gap: .1rem; }
.alert-msg { font-weight: 700; font-size: .88rem; color: #1a1a2e; }
.alert-sub { font-size: .75rem; color: #7a8aaa; }
.alert-badge { font-size: .72rem; font-weight: 700; padding: .2rem .65rem; border-radius: 20px; white-space: nowrap; }

/* ── Annonces du Maire ── */
.btn-annonce {
  padding: .5rem 1rem; border-radius: 8px;
  background: rgba(247,127,0,.2); color: #ffb877;
  border: 1px solid rgba(247,127,0,.35); font-size: .8rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: .4rem; transition: background .15s ease;
}
.btn-annonce:hover { background: rgba(247,127,0,.4); }
.section-head-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
.section-head-row .section-title { margin: 0; }
.btn-annonce-inline {
  padding: .5rem 1rem; border-radius: 8px; border: none; cursor: pointer;
  background: #F77F00; color: #fff; font-size: .82rem; font-weight: 700;
  display: flex; align-items: center; gap: .4rem; transition: background .15s ease;
}
.btn-annonce-inline:hover { background: #cc6600; }
.annonces-section { background: #fff; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
.ann-empty-card { color: #7a8aaa; font-size: .85rem; padding: 1rem 0; }
.ann-list { display: flex; flex-direction: column; gap: .8rem; }
.ann-row { padding: 1rem; border-radius: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #009A44; }
.ann-row.urgent { border-left-color: #e63946; background: #fff8f0; }
.ann-row-head { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .3rem; }
.ann-row-titre { font-weight: 700; color: #003366; font-size: .92rem; }
.ann-row-badge { background: #e63946; color: #fff; font-size: .68rem; font-weight: 700; padding: .15rem .5rem; border-radius: 20px; text-transform: uppercase; }
.ann-row-contenu { color: #334155; font-size: .84rem; margin: 0 0 .4rem; line-height: 1.5; white-space: pre-line; }
.ann-row-date { font-size: .75rem; color: #94a3b8; }

.ann-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(2px); }
.ann-modal { background: #fff; width: 500px; max-width: 92vw; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.25); overflow: hidden; max-height: 85vh; display: flex; flex-direction: column; }
.ann-modal-header { padding: 1.1rem 1.5rem; background: linear-gradient(135deg, #003366, #004fa3); color: white; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.ann-modal-header h3 { margin: 0; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
.ann-modal-close { background: rgba(255,255,255,.15); border: none; color: white; font-size: 1rem; cursor: pointer; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.ann-modal-close:hover { background: rgba(255,255,255,.3); }
.ann-modal-body { padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
.ann-fg { display: flex; flex-direction: column; gap: .4rem; }
.ann-fg label { font-size: .78rem; font-weight: 700; color: #475569; }
.ann-fg .req { color: #ef4444; }
.ann-fg input, .ann-fg textarea, .ann-fg select { padding: .6rem .8rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: .88rem; font-family: inherit; outline: none; background: #fff; width: 100%; box-sizing: border-box; }
.ann-row-audience { background: #e0f2fe; color: #0369a1; font-size: .68rem; font-weight: 700; padding: .15rem .5rem; border-radius: 20px; text-transform: uppercase; white-space: nowrap; }
.ann-fg input:focus, .ann-fg textarea:focus { border-color: #F77F00; box-shadow: 0 0 0 3px rgba(247,127,0,.1); }
.ann-checkbox { display: flex; align-items: center; gap: .5rem; font-size: .85rem; color: #334155; cursor: pointer; }
.ann-error { color: #e63946; font-size: .82rem; margin: 0; }
.ann-submit { padding: .8rem; background: #009A44; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .4rem; }
.ann-submit:hover:not(:disabled) { background: #007a36; }
.ann-submit:disabled { opacity: .6; cursor: not-allowed; }
</style>
  `,
})
export class MaireDashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly user = this.auth.currentUser();
  private http  = inject(HttpClient);

  mesAnnonces = signal<{ id: number; titre: string; contenu: string; date: string; urgent: boolean; audience: string }[]>([]);
  modalAnnonceOuvert = signal(false);
  publishingAnnonce  = signal(false);
  annonceError       = signal('');
  annonceForm: AnnonceForm = { titre: '', contenu: '', urgent: false, destinataire: 'public', serviceCible: 'communication' };
  servicesCiblables = SERVICES_CIBLABLES;

  globalKpis = [
    { label: 'Démarches citoyens',  value: '—', ico: '📋', color: '#003366', trend: 0 },
    { label: 'Actes État civil',    value: '—', ico: '📄', color: '#009A44', trend: 1 },
    { label: 'Recettes (FCFA)',     value: '—', ico: '💰', color: '#F77F00', trend: 1 },
    { label: 'Agents actifs',       value: '—', ico: '👥', color: '#7a5c3a', trend: 0 },
    { label: 'Permis Urbanisme',    value: '—', ico: '🗺️', color: '#004fa3', trend: 1 },
    { label: 'Interventions ST',    value: '—', ico: '🔧', color: '#e63946', trend: -1 },
  ];

  modules: ModuleStat[] = [
    {
      key: 'communication', label: 'Communication', ico: '📣', color: '#F77F00',
      route: '/communication', description: 'Actualités, réclamations, partenaires, SMS',
      kpis: [
        { label: 'Publications', value: '—' },
        { label: 'Réclamations ouvertes', value: '—' },
        { label: 'Partenaires actifs', value: '—' },
      ],
    },
    {
      key: 'etat-civil', label: 'État civil', ico: '📄', color: '#003366',
      route: '/etat-civil', description: 'Naissances, mariages, décès, certificats',
      kpis: [
        { label: 'Naissances', value: '—' },
        { label: 'Mariages', value: '—' },
        { label: 'Certificats', value: '—' },
      ],
    },
    {
      key: 'finances', label: 'Finances', ico: '💰', color: '#F77F00',
      route: '/finances', description: 'Budget, recettes, dépenses, trésorerie',
      kpis: [
        { label: 'Budget', value: '—', unit: ' FCFA' },
        { label: 'Recettes', value: '—', unit: ' FCFA' },
        { label: 'Dépenses', value: '—', unit: ' FCFA' },
      ],
    },
    {
      key: 'patrimoine', label: 'Patrimoine', ico: '🏛️', color: '#7a5c3a',
      route: '/patrimoine', description: 'Biens immobiliers, véhicules, terrains',
      kpis: [
        { label: 'Parcelles', value: '—' },
        { label: 'Biens immo.', value: '—' },
        { label: 'Véhicules', value: '—' },
      ],
    },
    {
      key: 'rh', label: 'Ressources humaines', ico: '👥', color: '#009A44',
      route: '/rh', description: 'Agents, congés, formations, recrutements',
      kpis: [
        { label: 'Agents actifs', value: '—' },
        { label: 'Congés en cours', value: '—' },
        { label: 'Recrutements', value: '—' },
      ],
    },
    {
      key: 'services-techniques', label: 'Services techniques', ico: '🔧', color: '#e63946',
      route: '/services-techniques', description: 'Voirie, éclairage, bâtiments, drainage',
      kpis: [
        { label: 'Interventions', value: '—' },
        { label: 'Pannes signalées', value: '—' },
        { label: 'Chantiers actifs', value: '—' },
      ],
    },
    {
      key: 'urbanisme', label: 'Urbanisme / SIG', ico: '🗺️', color: '#004fa3',
      route: '/urbanisme', description: 'Parcelles, permis, lotissements, cartographie',
      kpis: [
        { label: 'Parcelles', value: '—' },
        { label: 'Permis actifs', value: '—' },
        { label: 'Lotissements', value: '—' },
      ],
    },
  ];

  alerts = [
    { ico: '⚠️', message: 'Dossiers en attente de validation', detail: '3 dossiers État civil nécessitent votre attention', level: 'warning', tag: 'État civil' },
    { ico: '📢', message: 'Rapport mensuel disponible', detail: 'Le rapport Finances de juillet est prêt', level: 'info', tag: 'Finances' },
    { ico: '🔧', message: 'Pannes éclairage signalées', detail: '5 pannes en attente de maintenance', level: 'warning', tag: 'Services techniques' },
    { ico: '👥', message: 'Recrutements en cours', detail: '2 postes ouverts au stade de validation', level: 'info', tag: 'RH' },
  ];

  ngOnInit(): void {
    // Ici on pourrait récupérer les vrais KPIs via des appels API parallèles
    // Pour l'instant on affiche la structure prête à recevoir des données
    this.loadKpis();
    this.loadAnnonces();
  }

  loadAnnonces(): void {
    this.http.get<{ data: any[] }>(`${environment.apiUrl}/public/annonces`).subscribe({
      next: r => this.mesAnnonces.set(r.data),
      error: () => {},
    });
  }

  ouvrirModalAnnonce(): void {
    this.annonceForm = { titre: '', contenu: '', urgent: false, destinataire: 'public', serviceCible: 'communication' };
    this.annonceError.set('');
    this.modalAnnonceOuvert.set(true);
  }

  fermerModalAnnonce(): void {
    this.modalAnnonceOuvert.set(false);
  }

  publierAnnonce(): void {
    if (!this.annonceForm.titre.trim() || !this.annonceForm.contenu.trim()) {
      this.annonceError.set('Le titre et le contenu sont obligatoires.');
      return;
    }
    this.publishingAnnonce.set(true);
    this.annonceError.set('');

    const audience = this.annonceForm.destinataire === 'specifique'
      ? this.annonceForm.serviceCible
      : this.annonceForm.destinataire;

    this.http.post(`${environment.apiUrl}/com/actualites`, {
      type: 'annonce',
      titre: this.annonceForm.titre.trim(),
      contenu: this.annonceForm.contenu.trim(),
      auteur: this.user?.name ?? 'Le Maire',
      statut: 'publie',
      categorie: this.annonceForm.urgent ? 'Urgent' : null,
      audience,
    }).subscribe({
      next: () => {
        this.publishingAnnonce.set(false);
        this.modalAnnonceOuvert.set(false);
        this.loadAnnonces();
      },
      error: (err) => {
        this.publishingAnnonce.set(false);
        this.annonceError.set(err?.error?.message ?? "Impossible de publier l'annonce.");
      },
    });
  }

  labelAudience(audience: string): string {
    if (audience === 'public') return 'Tous + citoyens';
    if (audience === 'tous_services') return 'Tous les services';
    return this.servicesCiblables.find(s => s.value === audience)?.label ?? audience;
  }

  loadKpis(): void {
    const api = environment.apiUrl;
    const safe = <T>(obs: import('rxjs').Observable<T>) => obs.pipe(catchError(() => of(null)));

    forkJoin({
      globales: safe<any>(this.http.get(`${api}/admin/statistiques`)),
      etatCivil: safe<any>(this.http.get(`${api}/etat-civil/statistiques`)),
      finances: safe<any>(this.http.get(`${api}/dashboard/stats`)),
      patrimoine: safe<any>(this.http.get(`${api}/patrimoine/statistiques`)),
      urbanisme: safe<any>(this.http.get(`${api}/urb/statistiques`)),
      st: safe<any>(this.http.get(`${api}/st/statistiques`)),
      communication: safe<any>(this.http.get(`${api}/com/statistiques`)),
    }).subscribe(({ globales, etatCivil, finances, patrimoine, urbanisme, st, communication }) => {
      const g = globales?.data ?? globales;
      if (g) {
        this.globalKpis[0].value = String(g.demarches?.total ?? '—');
        this.globalKpis[2].value = g.revenus != null ? Number(g.revenus).toLocaleString('fr-FR') : '—';
        this.globalKpis[3].value = String(g.agents ?? '—');
        this.updateModuleKpi('rh', 0, g.agents ?? '—');
      }

      const ec = etatCivil?.totaux;
      if (ec) {
        this.updateModuleKpi('etat-civil', 0, ec.naissances ?? '—');
        this.updateModuleKpi('etat-civil', 1, ec.mariages ?? '—');
        this.updateModuleKpi('etat-civil', 2, ec.certificats ?? '—');
        const totalActes = (ec.naissances ?? 0) + (ec.mariages ?? 0) + (ec.deces ?? 0) + (ec.certificats ?? 0);
        this.globalKpis[1].value = String(totalActes);
      }

      if (finances) {
        this.updateModuleKpi('finances', 1, finances.totalRecettes != null ? Number(finances.totalRecettes).toLocaleString('fr-FR') : '—');
        this.updateModuleKpi('finances', 2, finances.totalDepenses != null ? Number(finances.totalDepenses).toLocaleString('fr-FR') : '—');
      }

      if (patrimoine) {
        this.updateModuleKpi('patrimoine', 1, patrimoine.total_biens ?? '—');
      }

      const uk = urbanisme?.kpi;
      if (uk) {
        this.updateModuleKpi('urbanisme', 0, uk.total_parcelles ?? '—');
        this.updateModuleKpi('urbanisme', 1, uk.permis_en_cours ?? '—');
        this.globalKpis[4].value = String((uk.permis_en_cours ?? 0) + (uk.permis_accordes ?? 0));
      }

      const sk = st?.kpi;
      if (sk) {
        this.updateModuleKpi('services-techniques', 0, sk.interventions_en_cours ?? '—');
        this.updateModuleKpi('services-techniques', 1, sk.pannes_signalees ?? '—');
        this.globalKpis[5].value = String(sk.interventions_en_cours ?? '—');
      }

      const ck = communication?.kpi;
      if (ck) {
        this.updateModuleKpi('communication', 0, ck.publications_mois ?? '—');
        this.updateModuleKpi('communication', 1, ck.reclamations_ouvertes ?? '—');
        this.updateModuleKpi('communication', 2, ck.partenaires_actifs ?? '—');
      }
    });
  }

  private updateModuleKpi(moduleKey: string, idx: number, value: string | number): void {
    const m = this.modules.find(x => x.key === moduleKey);
    if (m && m.kpis[idx]) m.kpis[idx].value = value;
  }
}

