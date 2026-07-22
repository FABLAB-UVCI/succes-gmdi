import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventaireComponent }    from '../../components/inventaire/inventaire.component';
import { ImmobilierComponent }    from '../../components/immobilier/immobilier.component';
import {
  AffectationComponent,
  MaintenanceComponent,
  AmortissementComponent,
  RapportsPatrimoineComponent
} from '../../components/affectation/affectation.component';
import { PatrimoineService } from '../../../../core/services/patrimoine.service';
import { LoadingService }    from '../../../../core/services/loading.service';
import { AuthService }       from '../../../../core/services/auth.service';
import { ToastService }      from '../../../../core/services/toast.service';
import { AnnoncesMaireComponent } from '../../../../../shared/components/annonces-maire/annonces-maire.component';

export type Section = 'inventaire' | 'immobilier' | 'affectation' | 'maintenance' | 'amortissement' | 'rapports';

@Component({
  selector: 'app-patrimoine-shell',
  standalone: true,
  imports: [
    CommonModule,
    InventaireComponent, ImmobilierComponent, AffectationComponent,
    MaintenanceComponent, AmortissementComponent, RapportsPatrimoineComponent,
    AnnoncesMaireComponent,
  ],
  template: `
<div class="r">

  <!-- Topbar -->
  <div class="top">
    <div style="display:flex;align-items:center;gap:12px">
      <!-- Hamburger (mobile) -->
      <button class="hamburger" (click)="toggleSidebar()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div>
        <div class="tt">GMDI — Module Patrimoine Communal</div>
        <div class="ts">République de Côte d'Ivoire</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:1rem">
      @if (loading.isLoading()) {
        <span style="font-size:11px;color:rgba(255,255,255,.55);display:flex;align-items:center;gap:4px">
          <i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:13px"></i>Chargement…
        </span>
      }
      <div class="tu">
        <div class="av">{{ userInitials() }}</div>
        <div class="tu-name">
          <div>{{ auth.currentUser()?.name ?? '—' }}</div>
          <div style="font-size:10px;color:rgba(255,255,255,.45);text-transform:capitalize">{{ auth.currentUser()?.role ?? 'agent' }}</div>
        </div>
      </div>
      <button (click)="auth.backToModules()" class="btn-logout" title="Retour aux modules">
        <i class="ti ti-layout-grid"></i>
        <span class="logout-label">Modules</span>
      </button>
    </div>
  </div>

  <div class="lay">
    <!-- Overlay mobile -->
    @if (sidebarOpen()) {
      <div class="overlay" (click)="closeSidebar()"></div>
    }

    <!-- Sidebar -->
    <nav class="sb" [class.open]="sidebarOpen()">
      <div class="ss">Patrimoine</div>
      @for (item of navItems; track item.id) {
        <div class="si" [class.on]="activeSection() === item.id" (click)="navigate(item.id)">
          <i class="ti {{ item.icon }}"></i>{{ item.label }}
        </div>
      }

      <app-annonces-maire />
    </nav>

    <!-- Main -->
    <div class="mn">
      <!-- Header KPIs — style photo RH -->
      <div class="phdr">
        <div class="phdr-left">
          <div class="phdr-icon"><i class="ti ti-building-bank"></i></div>
          <div>
            <div class="phdr-title">Patrimoine Communal</div>
            <div class="phdr-sub">Gestion du patrimoine municipal — {{ anneeCourante }}</div>
          </div>
        </div>
        <div class="phdr-kpis">
          <div class="phdr-kpi">
            <span class="phdr-kv" style="color:#F77F00">{{ pat.kpi().totalBiens }}</span>
            <span class="phdr-kl">BIENS TOTAL</span>
          </div>
          <div class="phdr-kpi">
            <span class="phdr-kv" style="color:#004D20">{{ pat.vehicules().length }}</span>
            <span class="phdr-kl">VÉHICULES</span>
          </div>
          <div class="phdr-kpi">
            <span class="phdr-kv" style="color:#009A44">{{ (pat.kpi().loyersMensuel / 1000000).toFixed(1) }} M</span>
            <span class="phdr-kl">LOYERS/MOIS</span>
          </div>
          <div class="phdr-kpi">
            <span class="phdr-kv" style="color:#E24B4A">{{ pat.kpi().urgences }}</span>
            <span class="phdr-kl">URGENCES</span>
          </div>
        </div>
      </div>

      <!-- Sections -->
      @if (activeSection() === 'inventaire')    { <app-inventaire />              }
      @if (activeSection() === 'immobilier')    { <app-immobilier />              }
      @if (activeSection() === 'affectation')   { <app-affectation />             }
      @if (activeSection() === 'maintenance')   { <app-maintenance />             }
      @if (activeSection() === 'amortissement') { <app-amortissement />           }
      @if (activeSection() === 'rapports')      { <app-rapports-patrimoine />     }
    </div>
  </div>
</div>

<!-- Toast globaux flottants -->
<div class="toast-stack">
  @for (t of visibleToasts(); track t.id) {
    <div class="toast-global" [class.ok]="t.type === 'success'">
      <i class="ti" [class.ti-circle-check]="t.type === 'success'" [class.ti-alert-circle]="t.type === 'error'" style="font-size:16px;flex-shrink:0;margin-top:1px"></i>
      <div>
        @if (t.title) { <div class="tg-title">{{ t.title }}</div> }
        <div class="tg-msg">{{ t.message }}</div>
      </div>
    </div>
  }
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
    .hamburger:hover { background: rgba(255,255,255,.12); }
    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: all .25s;
    }

    /* ── Topbar ── */
    .top {
      position: sticky;
      top: 0;
      z-index: 100;
      background: linear-gradient(135deg, #1a3a1f 0%, #1a5c28 100%);
      padding: 0 1.5rem;
      height: 65px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 16px rgba(0,0,0,0.18);
      border-bottom: 3px solid #F77F00;
    }

    .tt {
      color: #ffffff;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: .2px;
    }

    .ts {
      color: rgba(255,255,255,.65);
      font-size: 10.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .8px;
      margin-top: 2px;
    }

    .tu {
      color: white;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,.1);
      border: 1px solid rgba(255,255,255,.2);
      padding: 6px 14px;
      border-radius: 30px;
    }

    .av {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #F77F00, #009A44);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: bold;
      color: white;
      box-shadow: 0 2px 6px rgba(0,0,0,.2);
    }

    .tu-name {
      line-height: 1.2;
    }
    .tu-name div:first-child {
      font-weight: 600;
    }

    /* ── Overlay ── */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.45);
      z-index: 199;
      backdrop-filter: blur(1px);
    }

    /* ── Layout ── */
    .lay {
      display: flex;
      position: relative;
      min-height: calc(100vh - 65px);
    }

    /* ── Sidebar ── */
    .sb {
      width: 240px;
      background: linear-gradient(180deg, #1a3a1f 0%, #0d2414 100%);
      padding: 20px 0 40px;
      border-right: 1px solid rgba(255,255,255,.06);
      flex-shrink: 0;
      transition: transform .28s cubic-bezier(.4,0,.2,1);
      z-index: 200;
      overflow-y: auto;
      position: sticky;
      top: 65px;
      height: calc(100vh - 65px);
    }

    .ss {
      font-size: 10px;
      color: rgba(255,255,255,.4);
      padding: 16px 20px 6px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1.2px;
    }

    .si {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 10px 16px;
      margin: 2px 10px;
      border-radius: 9px;
      color: rgba(255,255,255,.65);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }

    .si i {
      font-size: 17px;
      width: 22px;
      text-align: center;
      flex-shrink: 0;
    }

    .si:hover {
      background: rgba(255,255,255,.08);
      color: rgba(255,255,255,.9);
      border-color: rgba(255,255,255,.1);
    }

    .si.on {
      background: linear-gradient(90deg, #F77F00, #e06d00);
      color: white;
      font-weight: 700;
      border-color: transparent;
      box-shadow: 0 3px 10px rgba(247,127,0,.35);
    }

    /* ── Main content ── */
    .mn {
      flex: 1;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      min-width: 0;
      background: #f8fafc;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100vh - 65px);
    }

    /* ── Bouton déconnexion ── */
    .btn-logout {
      background: rgba(255,255,255,.1);
      border: 1px solid rgba(255,255,255,.2);
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 6px;
      transition: all .15s;
      font-family: inherit;
    }
    .btn-logout:hover {
      background: rgba(231,76,60,.85);
      border-color: transparent;
    }
    .btn-logout i { font-size: 14px; }

    /* ── Header patrimoine ── */
    .phdr {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-top: 3px solid #F77F00;
      border-radius: 10px;
      padding: .85rem 1.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: .75rem;
      flex-shrink: 0;
    }
    .phdr-left { display: flex; align-items: center; gap: .75rem; }
    .phdr-icon {
      width: 46px; height: 46px; border-radius: 50%;
      background: linear-gradient(135deg, rgba(247,127,0,.12), rgba(0,154,68,.08));
      border: 2px solid #F77F00;
      display: flex; align-items: center; justify-content: center;
      color: #F77F00; font-size: 22px;
    }
    .phdr-title { font-size: 15px; font-weight: 600; color: #111827; }
    .phdr-sub   { font-size: 11px; color: #6b7280; margin-top: 1px; }
    .phdr-kpis  { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .phdr-kpi   { text-align: center; }
    .phdr-kv    { display: block; font-size: 20px; font-weight: 700; line-height: 1.1; }
    .phdr-kl    { display: block; font-size: 9px; color: #9ca3af; font-weight: 600; letter-spacing: .5px; margin-top: 2px; }

    /* ── Toast ── */
    .toast-stack {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 360px;
      pointer-events: none;
    }

    .toast-global {
      background: #1e293b;
      color: #f1f5f9;
      padding: 12px 16px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.25);
      display: flex;
      gap: 10px;
      align-items: flex-start;
      border-left: 4px solid #3b82f6;
      pointer-events: auto;
      animation: slideIn .25s ease;
    }

    .toast-global.ok {
      border-left-color: #22c55e;
    }

    .tg-title { font-weight: 600; font-size: 13px; }
    .tg-msg   { font-size: 12px; color: rgba(255,255,255,.8); }

    /* ── Animations ── */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .hamburger { display: flex; }
      .sb {
        position: fixed;
        top: 65px;
        left: 0;
        height: calc(100vh - 65px);
        transform: translateX(-100%);
      }
      .sb.open { transform: translateX(0); }
      .tu-name    { display: none; }
      .logout-label { display: none; }
      .top { padding: 0 1rem; }
    }

    @media (max-width: 600px) {
      .phdr { flex-direction: column; align-items: flex-start; }
      .phdr-kpis { width: 100%; justify-content: space-between; }
      .mn { padding: 1rem; }
      .tu { padding: 5px 10px; }
    }
  `],
})
export class PatrimoineShellComponent implements OnInit {
  readonly pat     = inject(PatrimoineService);
  readonly loading = inject(LoadingService);
  readonly auth    = inject(AuthService);
  readonly toast   = inject(ToastService);

  activeSection = signal<Section>('inventaire');
  sidebarOpen   = signal(false);
  readonly anneeCourante = new Date().getFullYear();

  visibleToasts = computed(() => Object.values(this.toast.toasts()).filter(t => t.visible));

  readonly userInitials = computed(() => {
    const name = this.auth.currentUser()?.name ?? '';
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || 'U';
  });

  navItems = [
    { id: 'inventaire'    as Section, label: 'Inventaire',        icon: 'ti-clipboard-list'       },
    { id: 'immobilier'    as Section, label: 'Gestion immobilière',icon: 'ti-building'             },
    { id: 'affectation'   as Section, label: 'Affectation',       icon: 'ti-arrows-transfer-up'   },
    { id: 'maintenance'   as Section, label: 'Maintenance',       icon: 'ti-tool'                 },
    { id: 'amortissement' as Section, label: 'Amortissement',     icon: 'ti-chart-line'           },
    { id: 'rapports'      as Section, label: 'Rapports',          icon: 'ti-report'               },
  ];

  ngOnInit(): void { this.pat.loadStats(); this.pat.loadBiens(); this.pat.loadVehicules(); }

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
  closeSidebar(): void  { this.sidebarOpen.set(false); }

  navigate(s: Section): void {
    this.activeSection.set(s);
    this.closeSidebar();
    if (s === 'inventaire')    { this.pat.loadBiens(); this.pat.loadVehicules(); }
    if (s === 'immobilier')    { this.pat.loadTerrains(); }
    if (s === 'affectation')   { this.pat.loadMouvements(); }
    if (s === 'maintenance')   { this.pat.loadEntretiens(); this.pat.loadReparations(); }
    if (s === 'amortissement') { this.pat.loadAmortissements(); }
    if (s === 'rapports')      { this.pat.loadStats(); }
  }
}
