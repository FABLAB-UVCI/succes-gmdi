import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../communication/core/services/auth.service';
import { environment } from '@env/environment';
import { DemandesCitoyensComponent } from '../shared/components/demandes-citoyens.component';

interface ModuleStat {
  key: string; label: string; ico: string; color: string;
  route: string; description: string;
  kpis: { label: string; value: string | number; unit?: string }[];
}

@Component({
  selector: 'app-maire-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DemandesCitoyensComponent],
  template: `
<div class="maire">

  <!-- Topbar -->
  <header class="maire-topbar">
    <div class="topbar-left">
      <span class="flag-strip"><span class="fo"></span><span class="fw"></span><span class="fv"></span></span>
      <div>
        <h1 class="topbar-title">Tableau de bord du Maire</h1>
        <p class="topbar-sub">Plateforme E-Mairie â€” Vue consolidÃ©e</p>
      </div>
    </div>
    <div class="topbar-right">
      <span class="mayor-name">ðŸ›ï¸ {{ user?.name ?? 'Monsieur le Maire' }}</span>
      <button class="btn-logout" (click)="auth.logout()">DÃ©connexion</button>
    </div>
  </header>

  <div class="maire-body">

    <!-- KPIs globaux  -->
    <section class="kpi-section">
      <h2 class="section-title">ðŸ“Š Indicateurs globaux</h2>
      <div class="kpi-grid">
        @for (k of globalKpis; track k.label) {
          <div class="kpi-card" [style.border-top-color]="k.color">
            <span class="kpi-ico">{{ k.ico }}</span>
            <div class="kpi-body">
              <span class="kpi-val">{{ k.value }}</span>
              <span class="kpi-lbl">{{ k.label }}</span>
            </div>
            <span class="kpi-trend" [class.up]="k.trend > 0" [class.neutral]="k.trend === 0">
              {{ k.trend > 0 ? 'â†‘' : k.trend < 0 ? 'â†“' : 'â€”' }}
            </span>
          </div>
        }
      </div>
    </section>

    <!--  Modules -->
    <section>
      <h2 class="section-title">ðŸ—‚ï¸ AccÃ¨s aux modules â€” Supervision</h2>
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
              AccÃ©der au module <span>â†’</span>
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

<style>
.maire {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'Inter', system-ui, sans-serif;
}

/* â”€â”€ Topbar â”€â”€ */
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
.mayor-name { color: rgba(255,255,255,.9); font-size: .9rem; font-weight: 600; }
.btn-logout {
  padding: .45rem 1rem; border-radius: 8px;
  background: rgba(230,57,70,.2); color: #ff8080;
  border: 1px solid rgba(230,57,70,.3); font-size: .8rem; font-weight: 600; cursor: pointer;
  transition: background .15s ease;
}
.btn-logout:hover { background: rgba(230,57,70,.4); }

.maire-body { max-width: 1280px; margin: 0 auto; padding: 2rem 2rem; display: flex; flex-direction: column; gap: 2.5rem; }
.section-title { font-size: 1.05rem; font-weight: 800; color: #003366; margin: 0 0 1.2rem; }

/* â”€â”€ KPI globaux â”€â”€ */
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

/* â”€â”€ Modules grid â”€â”€ */
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

/* â”€â”€ Alertes â”€â”€ */
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
</style>
  `,
})
export class MaireDashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly user = this.auth.currentUser();
  private http  = inject(HttpClient);

  globalKpis = [
    { label: 'DÃ©marches citoyens',  value: 'â€”', ico: 'ðŸ“‹', color: '#003366', trend: 0 },
    { label: 'Actes Ã‰tat civil',    value: 'â€”', ico: 'ðŸ“„', color: '#009A44', trend: 1 },
    { label: 'Recettes (FCFA)',     value: 'â€”', ico: 'ðŸ’°', color: '#F77F00', trend: 1 },
    { label: 'Agents actifs',       value: 'â€”', ico: 'ðŸ‘¥', color: '#7a5c3a', trend: 0 },
    { label: 'Permis Urbanisme',    value: 'â€”', ico: 'ðŸ—ºï¸', color: '#004fa3', trend: 1 },
    { label: 'Interventions ST',    value: 'â€”', ico: 'ðŸ”§', color: '#e63946', trend: -1 },
  ];

  modules: ModuleStat[] = [
    {
      key: 'communication', label: 'Communication', ico: 'ðŸ“£', color: '#F77F00',
      route: '/communication', description: 'ActualitÃ©s, rÃ©clamations, partenaires, SMS',
      kpis: [
        { label: 'Publications', value: 'â€”' },
        { label: 'RÃ©clamations ouvertes', value: 'â€”' },
        { label: 'Partenaires actifs', value: 'â€”' },
      ],
    },
    {
      key: 'etat-civil', label: 'Ã‰tat civil', ico: 'ðŸ“„', color: '#003366',
      route: '/etat-civil', description: 'Naissances, mariages, dÃ©cÃ¨s, certificats',
      kpis: [
        { label: 'Naissances', value: 'â€”' },
        { label: 'Mariages', value: 'â€”' },
        { label: 'Certificats', value: 'â€”' },
      ],
    },
    {
      key: 'finances', label: 'Finances', ico: 'ðŸ’°', color: '#F77F00',
      route: '/finances', description: 'Budget, recettes, dÃ©penses, trÃ©sorerie',
      kpis: [
        { label: 'Budget', value: 'â€”', unit: ' FCFA' },
        { label: 'Recettes', value: 'â€”', unit: ' FCFA' },
        { label: 'DÃ©penses', value: 'â€”', unit: ' FCFA' },
      ],
    },
    {
      key: 'patrimoine', label: 'Patrimoine', ico: 'ðŸ›ï¸', color: '#7a5c3a',
      route: '/patrimoine', description: 'Biens immobiliers, vÃ©hicules, terrains',
      kpis: [
        { label: 'Parcelles', value: 'â€”' },
        { label: 'Biens immo.', value: 'â€”' },
        { label: 'VÃ©hicules', value: 'â€”' },
      ],
    },
    {
      key: 'rh', label: 'Ressources humaines', ico: 'ðŸ‘¥', color: '#009A44',
      route: '/rh', description: 'Agents, congÃ©s, formations, recrutements',
      kpis: [
        { label: 'Agents actifs', value: 'â€”' },
        { label: 'CongÃ©s en cours', value: 'â€”' },
        { label: 'Recrutements', value: 'â€”' },
      ],
    },
    {
      key: 'services-techniques', label: 'Services techniques', ico: 'ðŸ”§', color: '#e63946',
      route: '/services-techniques', description: 'Voirie, Ã©clairage, bÃ¢timents, drainage',
      kpis: [
        { label: 'Interventions', value: 'â€”' },
        { label: 'Pannes signalÃ©es', value: 'â€”' },
        { label: 'Chantiers actifs', value: 'â€”' },
      ],
    },
    {
      key: 'urbanisme', label: 'Urbanisme / SIG', ico: 'ðŸ—ºï¸', color: '#004fa3',
      route: '/urbanisme', description: 'Parcelles, permis, lotissements, cartographie',
      kpis: [
        { label: 'Parcelles', value: 'â€”' },
        { label: 'Permis actifs', value: 'â€”' },
        { label: 'Lotissements', value: 'â€”' },
      ],
    },
  ];

  alerts = [
    { ico: 'âš ï¸', message: 'Dossiers en attente de validation', detail: '3 dossiers Ã‰tat civil nÃ©cessitent votre attention', level: 'warning', tag: 'Ã‰tat civil' },
    { ico: 'ðŸ“¢', message: 'Rapport mensuel disponible', detail: 'Le rapport Finances de juillet est prÃªt', level: 'info', tag: 'Finances' },
    { ico: 'ðŸ”§', message: 'Pannes Ã©clairage signalÃ©es', detail: '5 pannes en attente de maintenance', level: 'warning', tag: 'Services techniques' },
    { ico: 'ðŸ‘¥', message: 'Recrutements en cours', detail: '2 postes ouverts au stade de validation', level: 'info', tag: 'RH' },
  ];

  ngOnInit(): void {
    // Ici on pourrait rÃ©cupÃ©rer les vrais KPIs via des appels API parallÃ¨les
    // Pour l'instant on affiche la structure prÃªte Ã  recevoir des donnÃ©es
    this.loadKpis();
  }

  loadKpis(): void {
    // Chargement des statistiques Ã‰tat civil (exemple rÃ©el)
    this.http.get<any>(`${environment.apiUrl}/etat-civil/statistiques`).subscribe({
      next: stats => {
        if (stats) {
          this.updateModuleKpi('etat-civil', 0, stats.naissances ?? 'â€”');
          this.updateModuleKpi('etat-civil', 1, stats.mariages ?? 'â€”');
          this.updateModuleKpi('etat-civil', 2, stats.certificats ?? 'â€”');
          this.globalKpis[1].value = String(stats.naissances ?? 'â€”');
        }
      },
      error: () => {},
    });
  }

  private updateModuleKpi(moduleKey: string, idx: number, value: string | number): void {
    const m = this.modules.find(x => x.key === moduleKey);
    if (m && m.kpis[idx]) m.kpis[idx].value = value;
  }
}

