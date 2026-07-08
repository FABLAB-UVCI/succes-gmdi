import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoirieComponent }           from '../../components/voirie/voirie.component';
import { EclairageComponent }        from '../../components/eclairage/eclairage.component';
import { EauAssainissementComponent }from '../../components/eau-assainissement/eau-assainissement.component';
import { BatimentsComponent }        from '../../components/batiments/batiments.component';
import { InterventionsComponent }    from '../../components/interventions/interventions.component';
import { MaintenanceComponent }      from '../../components/maintenance/maintenance.component';
import { ServicesTechniquesService } from '../../../../core/services/services-techniques.service';
import { LoadingService }            from '../../../../core/services/loading.service';
import { AuthService }               from '../../../../core/services/auth.service';
import { ToastService }              from '../../../../core/services/toast.service';

export type Section = 'voirie' | 'eclairage' | 'eau' | 'batiments' | 'interventions' | 'maintenance';

@Component({
  selector: 'app-st-shell',
  standalone: true,
  imports: [
    CommonModule,
    VoirieComponent, EclairageComponent, EauAssainissementComponent,
    BatimentsComponent, InterventionsComponent, MaintenanceComponent,
  ],
  template: `
<div class="root">

  <!-- ── Topbar ─────────────────────────────────────────────────────────── -->
  <div class="topbar">
    <div style="display:flex;align-items:center;gap:12px">
      <!-- Hamburger (mobile) -->
      <button class="hamburger" (click)="toggleSidebar()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div class="ci-flag">
        <span class="f-or"></span><span class="f-wh"></span><span class="f-gr"></span>
      </div>
      <div>
        <div class="topbar-title">GMDI — Services Techniques</div>
        <div class="topbar-sub">République de Côte d'Ivoire</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:1rem">
      @if (loading.isLoading()) {
        <span style="font-size:11px;color:#a0b4cc;display:flex;align-items:center;gap:4px">
          <i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:13px"></i>Chargement…
        </span>
      }
      <div class="topbar-user">
        <div class="av">ST</div>
        <div class="tb-info">
          <div style="font-size:12px;font-weight:600;color:#1f2937">{{ auth.currentUser()?.name ?? 'Directeur Technique' }}</div>
          <div style="font-size:10px;color:var(--ci-green);font-weight:600">Services Techniques</div>
        </div>
      </div>
      <button (click)="auth.backToModules()" class="btn-logout" title="Retour aux modules">
        <i class="ti ti-layout-grid" style="font-size:15px"></i>
        <span class="logout-label">Modules</span>
      </button>
    </div>
  </div>

  <div class="layout">

    <!-- ── Overlay mobile ─────────────────────────────────────────────── -->
    @if (sidebarOpen()) {
      <div class="overlay" (click)="closeSidebar()"></div>
    }

    <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
    <nav class="sidebar" [class.open]="sidebarOpen()">
      <div class="sb-logo">
        <div class="sb-logo-badge"><i class="ti ti-building-community"></i></div>
        <div>
          <div class="sb-logo-text">GMDI</div>
          <div class="sb-logo-sub">Côte d'Ivoire</div>
        </div>
      </div>
      <div class="sb-sec"><i class="ti ti-building-arch"></i>Infrastructures</div>
      @for (item of navInfra; track item.id) {
        <div class="sb-item" [class.act]="active()===item.id" (click)="navigate(item.id)" role="button">
          <i class="ti {{item.icon}}"></i>{{item.label}}
        </div>
      }
      <div class="sb-sec"><i class="ti ti-settings-2"></i>Gestion</div>
      @for (item of navGestion; track item.id) {
        <div class="sb-item" [class.act]="active()===item.id" (click)="navigate(item.id)" role="button">
          <i class="ti {{item.icon}}"></i>{{item.label}}
          @if (item.id==='interventions' && st.kpi().demandesCitoyennes > 0) {
            <span class="badge" style="margin-left:auto">{{st.kpi().demandesCitoyennes}}</span>
          }
        </div>
      }
    </nav>

    <!-- ── Main ─────────────────────────────────────────────────────────── -->
    <main class="main">

      <!-- Toast global -->
      @if (toast.get('shell')?.visible) {
        <div class="success-toast show" style="margin-bottom:.5rem"><i class="ti ti-check"></i>{{toast.get('shell')?.message}}</div>
      }

      <!-- ── KPIs ──────────────────────────────────────────────────────── -->
      <div class="kpi-row">
        <div class="kpi">
          <div class="kpi-bar" style="background:#003366"></div>
          <div class="kpi-ic" style="color:#003366"><i class="ti ti-refresh-alert"></i></div>
          <div class="kpi-v">{{st.kpi().interventionsEnCours}}</div>
          <div class="kpi-l">Interventions en cours</div>
        </div>
        <div class="kpi">
          <div class="kpi-bar" style="background:#e63946"></div>
          <div class="kpi-ic" style="color:#e63946"><i class="ti ti-alert-triangle"></i></div>
          <div class="kpi-v">{{st.kpi().pannesSignalees}}</div>
          <div class="kpi-l">Pannes signalées</div>
        </div>
        <div class="kpi">
          <div class="kpi-bar" style="background:#F77F00"></div>
          <div class="kpi-ic" style="color:#F77F00"><i class="ti ti-calendar-stats"></i></div>
          <div class="kpi-v">{{st.kpi().travauxPlanifies}}</div>
          <div class="kpi-l">Travaux planifiés</div>
        </div>
        <div class="kpi">
          <div class="kpi-bar" style="background:#185FA5"></div>
          <div class="kpi-ic" style="color:#185FA5"><i class="ti ti-message-circle"></i></div>
          <div class="kpi-v">{{st.kpi().demandesCitoyennes}}</div>
          <div class="kpi-l">Demandes citoyennes</div>
        </div>
        <div class="kpi">
          <div class="kpi-bar" style="background:#009A44"></div>
          <div class="kpi-ic" style="color:#009A44"><i class="ti ti-chart-bar"></i></div>
          <div class="kpi-v">{{st.kpi().tauxResolution}}%</div>
          <div class="kpi-l">Taux de résolution</div>
        </div>
      </div>

      <!-- ── Sections ───────────────────────────────────────────────────── -->
      @if (active()==='voirie')       { <app-voirie /> }
      @if (active()==='eclairage')    { <app-eclairage /> }
      @if (active()==='eau')          { <app-eau-assainissement /> }
      @if (active()==='batiments')    { <app-batiments /> }
      @if (active()==='interventions'){ <app-interventions /> }
      @if (active()==='maintenance')  { <app-maintenance /> }

    </main>
  </div>

  <!-- Erreurs globales (interceptor + validations) -->
  <div class="error-toast-stack">
    @for (t of visibleErrorToasts(); track t.id) {
      <div class="error-toast">
        <i class="ti ti-alert-circle"></i>
        <div>
          @if (t.title) { <div class="et-title">{{ t.title }}</div> }
          <div class="et-msg">{{ t.message }}</div>
        </div>
      </div>
    }
  </div>
</div>
  `,
  styles: [`
    /* ── Hamburger ── */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: background .15s;
      flex-shrink: 0;
    }
    .hamburger:hover { background: rgba(0,0,0,.08); }
    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: #1f2937;
      border-radius: 2px;
    }

    /* ── Overlay ── */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.45);
      z-index: 199;
      backdrop-filter: blur(1px);
    }

    /* ── Bouton déconnexion ── */
    .btn-logout {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--color-background-secondary);
      border: 1px solid var(--color-border-secondary);
      color: var(--color-text-secondary);
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      padding: 7px 12px;
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: all .15s;
    }
    .btn-logout:hover {
      background: #fce8e8;
      border-color: #e63946;
      color: #a32d2d;
    }
    .btn-logout:active { transform: translateY(1px); }

    /* ── Erreurs globales ── */
    .error-toast-stack {
      position: fixed;
      bottom: 1.25rem;
      right: 1.25rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }
    .error-toast {
      background: #fce8e8;
      color: #a32d2d;
      border: 1px solid #f3b8b8;
      border-left: 4px solid #e63946;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 12px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,.12);
      min-width: 260px;
      max-width: 380px;
      pointer-events: all;
    }
    .error-toast .et-title { font-weight: 700; margin-bottom: 2px; }
    .error-toast .et-msg { opacity: .9; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .hamburger { display: flex; }
      .sidebar {
        position: fixed;
        top: 65px;
        left: 0;
        height: calc(100vh - 65px);
        transform: translateX(-100%);
        transition: transform .28s cubic-bezier(.4,0,.2,1);
        z-index: 200;
        overflow-y: auto;
      }
      .sidebar.open { transform: translateX(0); }
      .tb-info      { display: none; }
      .logout-label { display: none; }
      .layout       { position: relative; }
    }
    @media (max-width: 600px) {
      .topbar { padding: 0 1rem !important; }
      .main   { padding: 1rem !important; }
      .kpi-row { grid-template-columns: 1fr 1fr !important; }
    }
  `]
})
export class StShellComponent implements OnInit {
  readonly st      = inject(ServicesTechniquesService);
  readonly loading = inject(LoadingService);
  readonly auth    = inject(AuthService);
  readonly toast   = inject(ToastService);

  active      = signal<Section>('interventions');
  sidebarOpen = signal(false);

  visibleErrorToasts = computed(() => Object.values(this.toast.toasts()).filter(t => t.visible && t.type === 'error'));

  navInfra = [
    { id: 'voirie' as Section,    label: 'Voirie',              icon: 'ti-road' },
    { id: 'eclairage' as Section, label: 'Éclairage public',    icon: 'ti-bulb' },
    { id: 'eau' as Section,       label: 'Eau & Assainissement',icon: 'ti-droplet' },
    { id: 'batiments' as Section, label: 'Bâtiments communaux', icon: 'ti-building' },
  ];

  navGestion = [
    { id: 'interventions' as Section, label: 'Interventions',  icon: 'ti-message-circle' },
    { id: 'maintenance' as Section,   label: 'Maintenance',    icon: 'ti-tool' },
  ];

  ngOnInit(): void { this.st.loadStats(); }

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
  closeSidebar(): void  { this.sidebarOpen.set(false); }

  navigate(s: Section): void {
    this.active.set(s);
    this.closeSidebar();
    switch (s) {
      case 'voirie':        this.st.loadRoutes(); break;
      case 'eclairage':     this.st.loadLampadaires(); this.st.loadPannes(); break;
      case 'eau':           this.st.loadCaniveaux(); this.st.loadCollectes(); break;
      case 'batiments':     this.st.loadBatiments(); this.st.loadTravauxBatiments(); break;
      case 'interventions': this.st.loadDemandes(); this.st.loadBons(); this.st.loadEquipes(); break;
      case 'maintenance':   this.st.loadPlanningMaintenance(); this.st.loadMaintenanceCorrective(); break;
    }
  }
}
