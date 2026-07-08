import { Component, signal, computed, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoncierComponent }          from '../../components/foncier/foncier.component';
import { PermisComponent }           from '../../components/permis/permis.component';
import { CartographieComponent }     from '../../components/cartographie/cartographie.component';
import { ProjetsComponent }          from '../../components/projets/projets.component';
import { GeolocalisationComponent }  from '../../components/geolocalisation/geolocalisation.component';
import { UrbanismeService }          from '../../../../core/services/urbanisme.service';
import { LoadingService }            from '../../../../core/services/loading.service';
import { AuthService }               from '../../../../core/services/auth.service';
import { ToastService }              from '../../../../core/services/toast.service';

export type Section = 'foncier' | 'permis' | 'cartographie' | 'projets' | 'geolocalisation';

@Component({
  selector: 'app-urbanisme-shell',
  standalone: true,
  imports: [
    CommonModule,
    FoncierComponent, PermisComponent, CartographieComponent,
    ProjetsComponent, GeolocalisationComponent,
  ],
  template: `
<!-- Overlay mobile pour fermer le sidebar -->
@if (sidebarOpen()) {
  <div class="overlay" (click)="sidebarOpen.set(false)"></div>
}

<div class="root">

  <!-- ── Topbar ─────────────────────────────────────────────────────────── -->
  <header class="topbar">
    <!-- Bande drapeau CI -->
    <div class="topbar-flag">
      <span class="f-o"></span><span class="f-w"></span><span class="f-g"></span>
    </div>

    <div class="topbar-left">
      <!-- Hamburger -->
      <button class="hamburger" (click)="toggleSidebar()" [class.open]="sidebarOpen()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div class="topbar-brand">
        <div class="brand-logo">🗺</div>
        <div>
          <div class="topbar-title">GMDI — Urbanisme & SIG</div>
          <div class="topbar-sub">Direction de l'Urbanisme · Côte d'Ivoire</div>
        </div>
      </div>
    </div>

    <div class="topbar-right">
      @if (loading.isLoading()) {
        <span class="loading-pill">
          <span class="ldot"></span>Chargement…
        </span>
      }
      <div class="topbar-user">
        <div class="av">{{ initiales() }}</div>
        <span class="user-name">{{ auth.currentUser()?.name ?? 'Responsable' }}</span>
      </div>
      <button class="logout-btn" (click)="auth.backToModules()" title="Retour aux modules">
        ⊞
      </button>
    </div>
  </header>

  <div class="layout">

    <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
    <nav class="sidebar" [class.open]="sidebarOpen()">

      <!-- En-tête sidebar -->
      <div class="sb-header">
        <div class="sb-flag">
          <span class="f-o"></span><span class="f-w"></span><span class="f-g"></span>
        </div>
        <div class="sb-brand">
          <div class="sb-brand-name">GMDI</div>
          <div class="sb-brand-sub">Urbanisme & SIG</div>
        </div>
        <button class="sb-close" (click)="sidebarOpen.set(false)">✕</button>
      </div>

      <!-- Navigation -->
      <div class="sb-nav">
        <div class="sb-sec">🏠 Foncier</div>
        @for (item of navFoncier; track item.id) {
          <div class="sb-item" [class.act]="active()===item.id"
               (click)="navigate(item.id)" role="button" tabindex="0"
               (keyup.enter)="navigate(item.id)">
            <span class="sb-icon">{{ item.emoji }}</span>
            <span>{{ item.label }}</span>
          </div>
        }

        <div class="sb-sec">📋 Réglementation</div>
        @for (item of navRegl; track item.id) {
          <div class="sb-item" [class.act]="active()===item.id"
               (click)="navigate(item.id)" role="button" tabindex="0"
               (keyup.enter)="navigate(item.id)">
            <span class="sb-icon">{{ item.emoji }}</span>
            <span>{{ item.label }}</span>
            @if (item.id==='permis' && (urb.kpi().permisPendants ?? 0) > 0) {
              <span class="badge">{{ urb.kpi().permisPendants ?? 0 }}</span>
            }
          </div>
        }

        <div class="sb-sec">🗺 SIG & Projets</div>
        @for (item of navSig; track item.id) {
          <div class="sb-item" [class.act]="active()===item.id"
               (click)="navigate(item.id)" role="button" tabindex="0"
               (keyup.enter)="navigate(item.id)">
            <span class="sb-icon">{{ item.emoji }}</span>
            <span>{{ item.label }}</span>
          </div>
        }
      </div>

      <!-- Pied sidebar -->
      <div class="sb-footer">
        <div class="sb-footer-flag">🇨🇮</div>
        <div>
          <div style="font-size:11px;font-weight:600;color:#fff">République de Côte d'Ivoire</div>
          <div style="font-size:10px;color:rgba(255,255,255,.55)">GMDI v2.0 · UVCI FabLab</div>
        </div>
      </div>
    </nav>

    <!-- ── Main ─────────────────────────────────────────────────────────── -->
    <main class="main">

      <!-- ── KPIs ──────────────────────────────────────────────────────── -->
      <div class="kpi-row">
        <div class="kpi" style="--accent:#009A44">
          <div class="kpi-bar"></div>
          <div class="kpi-ic">🗺</div>
          <div class="kpi-v">{{ urb.kpi().totalParcelles }}</div>
          <div class="kpi-l">Parcelles enregistrées</div>
        </div>
        <div class="kpi" style="--accent:#F77F00">
          <div class="kpi-bar"></div>
          <div class="kpi-ic">⏱</div>
          <div class="kpi-v">{{ urb.kpi().permisPendants ?? urb.kpi().permisEnCours }}</div>
          <div class="kpi-l">Permis en instruction</div>
        </div>
        <div class="kpi" style="--accent:#FFCD00">
          <div class="kpi-bar"></div>
          <div class="kpi-ic">🏗</div>
          <div class="kpi-v">{{ urb.kpi().permisMois ?? urb.kpi().permisAccordes }}</div>
          <div class="kpi-l">Permis ce mois</div>
        </div>
        <div class="kpi" style="--accent:#1a5c28">
          <div class="kpi-bar"></div>
          <div class="kpi-ic">🏘</div>
          <div class="kpi-v">{{ urb.kpi().lotissementsActifs ?? urb.kpi().chantierEnCours }}</div>
          <div class="kpi-l">Lotissements actifs</div>
        </div>
        <div class="kpi" style="--accent:#185FA5">
          <div class="kpi-bar"></div>
          <div class="kpi-ic">📍</div>
          <div class="kpi-v">{{ urb.kpi().equipementsPublics }}</div>
          <div class="kpi-l">Équipements SIG</div>
        </div>
      </div>

      <!-- ── Sections ───────────────────────────────────────────────────── -->
      <div class="section-wrap">
        @if (active()==='foncier')        { <app-foncier /> }
        @if (active()==='permis')         { <app-permis /> }
        @if (active()==='cartographie')   { <app-cartographie /> }
        @if (active()==='projets')        { <app-projets /> }
        @if (active()==='geolocalisation'){ <app-geolocalisation /> }
      </div>

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

<style>
/* ── Reset ───────────────────────────────────────────────────────────────── */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Root ────────────────────────────────────────────────────────────────── */
.root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #f4f6f8;
  overflow: hidden;
}

/* ── Overlay mobile ──────────────────────────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  z-index: 40;
  backdrop-filter: blur(2px);
}

/* ── Topbar ──────────────────────────────────────────────────────────────── */
.topbar {
  height: 58px;
  background: linear-gradient(135deg, #1a3a1f 0%, #1a5c28 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  position: relative;
  z-index: 50;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
  flex-shrink: 0;
}
.topbar-flag {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  display: flex;
}
.f-o { flex:1; background:#F77F00; }
.f-w { flex:1; background:#fff; }
.f-g { flex:1; background:#009A44; }

.topbar-left  { display:flex; align-items:center; gap:12px; }
.topbar-right { display:flex; align-items:center; gap:10px; }

.topbar-brand { display:flex; align-items:center; gap:10px; }
.brand-logo   { font-size:20px; }
.topbar-title { color:#fff; font-size:14px; font-weight:700; line-height:1.2; letter-spacing:.2px; }
.topbar-sub   { color:rgba(255,255,255,.6); font-size:10px; }

/* ── Hamburger ───────────────────────────────────────────────────────────── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px; height: 36px;
  background: rgba(255,255,255,.1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 7px;
  transition: background .2s;
  flex-shrink: 0;
}
.hamburger:hover { background: rgba(255,255,255,.2); }
.hamburger span {
  display: block;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: all .25s;
  transform-origin: center;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Loading pill ────────────────────────────────────────────────────────── */
.loading-pill {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: rgba(255,255,255,.7);
  background: rgba(255,255,255,.1);
  border-radius: 20px;
  padding: 4px 10px;
}
.ldot {
  width: 8px; height: 8px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

/* ── User / Logout ───────────────────────────────────────────────────────── */
.topbar-user {
  display: flex; align-items: center; gap: 8px;
  color: rgba(255,255,255,.9);
  font-size: 13px;
}
.av {
  width: 32px; height: 32px;
  background: #F77F00;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff;
  flex-shrink: 0;
}
.user-name { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.logout-btn {
  background: rgba(255,255,255,.1);
  border: none;
  color: rgba(255,255,255,.8);
  cursor: pointer;
  font-size: 16px;
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s;
}
.logout-btn:hover { background: rgba(220,38,38,.5); color: #fff; }

/* ── Layout ──────────────────────────────────────────────────────────────── */
.layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── Sidebar ─────────────────────────────────────────────────────────────── */
.sidebar {
  width: 230px;
  min-width: 230px;
  background: linear-gradient(180deg, #1a3a1f 0%, #0d2414 100%);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform .25s ease;
  z-index: 45;
  flex-shrink: 0;
}
.sb-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 10px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.sb-flag {
  display: flex;
  flex-direction: column;
  width: 4px;
  height: 36px;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
}
.sb-flag span { flex: 1; }
.sb-brand-name { color: #fff; font-size: 15px; font-weight: 700; }
.sb-brand-sub  { color: rgba(255,255,255,.5); font-size: 10px; }
.sb-close {
  margin-left: auto;
  display: none;
  background: none;
  border: none;
  color: rgba(255,255,255,.5);
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.sb-nav { flex: 1; padding: 8px 0; }

.sb-sec {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 14px 16px 6px;
}
.sb-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  cursor: pointer;
  color: rgba(255,255,255,.7);
  font-size: 13px;
  border-left: 3px solid transparent;
  transition: all .15s;
  user-select: none;
}
.sb-item:hover {
  background: rgba(255,255,255,.06);
  color: #fff;
}
.sb-item.act {
  background: rgba(0,154,68,.2);
  color: #fff;
  border-left-color: #009A44;
  font-weight: 600;
}
.sb-icon { font-size: 16px; width: 22px; text-align: center; }

.badge {
  margin-left: auto;
  background: #F77F00;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
}

.sb-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,.08);
}
.sb-footer-flag { font-size: 22px; }

/* ── Main ────────────────────────────────────────────────────────────────── */
.main {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

/* ── KPIs ────────────────────────────────────────────────────────────────── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: .75rem;
}
.kpi {
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,.07);
  border: 1px solid #e5e7eb;
}
.kpi-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--accent, #009A44);
  border-radius: 10px 10px 0 0;
}
.kpi-ic { font-size: 22px; margin-bottom: 8px; }
.kpi-v  { font-size: 26px; font-weight: 800; color: #111827; line-height: 1; }
.kpi-l  { font-size: 11px; color: #6b7280; margin-top: 4px; }

/* ── Section wrap ────────────────────────────────────────────────────────── */
.section-wrap {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  min-height: 200px;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}

/* ── Animation ───────────────────────────────────────────────────────────── */
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Erreurs globales ────────────────────────────────────────────────────── */
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

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .hamburger { display: flex; }
  .user-name  { display: none; }
  .topbar-sub { display: none; }

  .sidebar {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    transform: translateX(-100%);
    z-index: 45;
  }
  .sidebar.open { transform: translateX(0); }
  .sb-close { display: block; }

  .main { padding: .75rem; }

  .kpi-row { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 420px) {
  .kpi-row { grid-template-columns: 1fr 1fr; gap: .5rem; }
  .kpi { padding: .75rem; }
  .kpi-v { font-size: 22px; }
}
</style>
  `
})
export class UrbanismeShellComponent implements OnInit {
  readonly urb     = inject(UrbanismeService);
  readonly loading = inject(LoadingService);
  readonly auth    = inject(AuthService);
  readonly toast   = inject(ToastService);

  active      = signal<Section>('foncier');
  sidebarOpen = signal(false);

  visibleErrorToasts = computed(() => Object.values(this.toast.toasts()).filter(t => t.visible && t.type === 'error'));

  navFoncier = [
    { id: 'foncier' as Section, label: 'Gestion foncière', emoji: '🏠' },
  ];
  navRegl = [
    { id: 'permis' as Section, label: 'Permis & Autorisations', emoji: '📋' },
  ];
  navSig = [
    { id: 'cartographie' as Section,    label: 'Cartographie SIG',  emoji: '🗺' },
    { id: 'projets' as Section,         label: 'Projets urbains',   emoji: '🏗' },
    { id: 'geolocalisation' as Section, label: 'Géolocalisation',   emoji: '📍' },
  ];

  initiales(): string {
    const name = this.auth.currentUser()?.name ?? '';
    return name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase() || 'U';
  }

  ngOnInit(): void { this.urb.loadStats(); }

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }

  navigate(s: Section): void {
    this.active.set(s);
    this.sidebarOpen.set(false);
    switch (s) {
      case 'foncier':         this.urb.loadParcelles(); this.urb.loadTitresFonciers(); break;
      case 'permis':          this.urb.loadPermis(); break;
      case 'cartographie':    this.urb.loadQuartiers(); this.urb.loadVoiries(); break;
      case 'projets':         this.urb.loadLotissements(); this.urb.loadAmenagements(); this.urb.loadChantiers(); break;
      case 'geolocalisation': this.urb.loadEquipements(); break;
    }
  }

  @HostListener('window:keydown.escape')
  onEsc(): void { this.sidebarOpen.set(false); }
}
