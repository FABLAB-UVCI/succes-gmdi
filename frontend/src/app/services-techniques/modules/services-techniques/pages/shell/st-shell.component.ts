import { Component, signal, OnInit, inject } from '@angular/core';
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
        <div>
          <div style="font-size:12px;font-weight:600;color:#1f2937">{{ auth.currentUser()?.name ?? 'Directeur Technique' }}</div>
          <div style="font-size:10px;color:var(--ci-green);font-weight:600">Services Techniques</div>
        </div>
      </div>
      <button (click)="auth.logout()" style="background:none;border:1px solid #e5e7eb;color:#9ca3af;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:4px;padding:6px 10px;border-radius:6px;transition:all .15s" title="Déconnexion">
        <i class="ti ti-logout" style="font-size:15px"></i>
      </button>
    </div>
  </div>

  <div class="layout">

    <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
    <nav class="sidebar">
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
</div>
  `
})
export class StShellComponent implements OnInit {
  readonly st      = inject(ServicesTechniquesService);
  readonly loading = inject(LoadingService);
  readonly auth    = inject(AuthService);
  readonly toast   = inject(ToastService);

  active = signal<Section>('interventions');

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

  ngOnInit(): void { this.st.loadStats(); this.st.loadDemandes(); }

  navigate(s: Section): void {
    this.active.set(s);
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
