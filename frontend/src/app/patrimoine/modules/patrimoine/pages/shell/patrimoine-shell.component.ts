import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { FcfaPipe }          from '../../../../core/pipes/fcfa.pipe';

export type Section = 'inventaire' | 'immobilier' | 'affectation' | 'maintenance' | 'amortissement' | 'rapports';

@Component({
  selector: 'app-patrimoine-shell',
  standalone: true,
  imports: [
    CommonModule, FcfaPipe,
    InventaireComponent, ImmobilierComponent, AffectationComponent,
    MaintenanceComponent, AmortissementComponent, RapportsPatrimoineComponent,
  ],
  template: `
<div class="r">

  <!-- Topbar -->
  <div class="top">
    <div>
      <div class="tt">GMDI — Module Patrimoine Communal</div>
      <div class="ts">République de Côte d'Ivoire</div>
    </div>
    <div style="display:flex;align-items:center;gap:1rem">
      @if (loading.isLoading()) {
        <span style="font-size:11px;color:rgba(255,255,255,.55);display:flex;align-items:center;gap:4px">
          <i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:13px"></i>Chargement…
        </span>
      }
      <div class="tu">
        <div class="av">{{ userInitials() }}</div>
        <div>
          <div>{{ auth.currentUser()?.name ?? '—' }}</div>
          <div style="font-size:10px;color:rgba(255,255,255,.45);text-transform:capitalize">{{ auth.currentUser()?.role ?? 'agent' }}</div>
        </div>
      </div>
      <button (click)="auth.logout()" class="btn-logout">
        <i class="ti ti-logout"></i>
        <span>Déconnexion</span>
      </button>
    </div>
  </div>

  <div class="lay">
    <!-- Sidebar -->
    <nav class="sb">
      <div class="ss">Patrimoine</div>
      @for (item of navItems; track item.id) {
        <div class="si" [class.on]="activeSection() === item.id" (click)="navigate(item.id)">
          <i class="ti {{ item.icon }}"></i>{{ item.label }}
        </div>
      }
    </nav>

    <!-- Main -->
    <div class="mn">
      <!-- Header KPIs — style photo RH -->
      <div class="phdr">
        <div class="phdr-left">
          <div class="phdr-icon"><i class="ti ti-building-bank"></i></div>
          <div>
            <div class="phdr-title">Patrimoine Communal</div>
            <div class="phdr-sub">Gestion du patrimoine municipal — 2025</div>
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
  `],
})
export class PatrimoineShellComponent implements OnInit {
  readonly pat     = inject(PatrimoineService);
  readonly loading = inject(LoadingService);
  readonly auth    = inject(AuthService);
  readonly toast   = inject(ToastService);

  activeSection = signal<Section>('inventaire');

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

  navigate(s: Section): void {
    this.activeSection.set(s);
    if (s === 'inventaire')    { this.pat.loadBiens(); this.pat.loadVehicules(); }
    if (s === 'immobilier')    { this.pat.loadTerrains(); }
    if (s === 'affectation')   { this.pat.loadMouvements(); }
    if (s === 'maintenance')   { this.pat.loadEntretiens(); this.pat.loadReparations(); }
    if (s === 'amortissement') { this.pat.loadAmortissements(); }
    if (s === 'rapports')      { this.pat.loadStats(); }
  }
}
