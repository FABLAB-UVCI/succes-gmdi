import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualitesComponent }  from '../../components/actualites/actualites.component';
import { ReseauxComponent }     from '../../components/reseaux/reseaux.component';
import { RelationsComponent }   from '../../components/relations/relations.component';
import { DocumentsComponent }   from '../../components/documents/documents.component';
import { CitoyensComponent }    from '../../components/citoyens/citoyens.component';
import { SmsComponent }         from '../../components/sms/sms.component';
import { CommunicationService } from '../../../../core/services/communication.service';
import { LoadingService }       from '../../../../core/services/loading.service';
import { AuthService }          from '../../../../core/services/auth.service';

export type Section = 'actualites' | 'reseaux' | 'relations' | 'documents' | 'citoyens' | 'sms';

@Component({
  selector: 'app-communication-shell',
  standalone: true,
  imports: [
    CommonModule,
    ActualitesComponent, ReseauxComponent, RelationsComponent,
    DocumentsComponent, CitoyensComponent, SmsComponent,
  ],
  template: `
<div class="root">

  <!-- ── Topbar ─────────────────────────────────────────────────────────── -->
  <div class="topbar">
    <div style="display:flex;align-items:center;gap:12px">
      <!-- Hamburger button (mobile only) -->
      <button class="hamburger" (click)="toggleSidebar()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div>
        <div class="topbar-title">GMDI — Communication</div>
        <div class="topbar-sub">République de Côte d'Ivoire</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:1.25rem">
      @if (loading.isLoading()) {
        <span style="font-size:11px;color:#a0b4cc;display:flex;align-items:center;gap:4px">
          <i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:13px"></i>Chargement…
        </span>
      }
      <div class="topbar-user">
        <div class="av">{{initiales()}}</div>
        <span class="tb-name">{{auth.currentUser()?.name ?? 'Chef Communication'}}<span style="opacity:.6"> — {{roleLabel()}}</span></span>
      </div>
      <button (click)="auth.logout()" class="btn-logout">
        <i class="ti ti-logout" style="font-size:14px"></i><span class="logout-label">Déconnexion</span>
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
      <div class="sb-sec">Communication</div>
      @for (item of navComm; track item.id) {
        <div class="sb-item" [class.act]="active()===item.id" (click)="navigate(item.id)" role="button">
          <span class="sb-icon-wrap"><i class="ti {{item.icon}}"></i></span>
          <span class="sb-label">{{item.label}}</span>
        </div>
      }
      <div class="sb-sec">Citoyen</div>
      @for (item of navCit; track item.id) {
        <div class="sb-item" [class.act]="active()===item.id" (click)="navigate(item.id)" role="button">
          <span class="sb-icon-wrap"><i class="ti {{item.icon}}"></i></span>
          <span class="sb-label">{{item.label}}</span>
          @if (item.id==='citoyens' && com.kpi().reclamationsOuvertes > 0) {
            <span class="badge" style="margin-left:auto">{{com.kpi().reclamationsOuvertes}}</span>
          }
        </div>
      }

      <!-- ── Annonces du Maire ──────────────────────────────────────────── -->
      <div class="sb-maire-block">
        <div class="sb-maire-header">
          <div class="sb-maire-flag">
            <span class="flag-o"></span><span class="flag-w"></span><span class="flag-v"></span>
          </div>
          <div class="sb-maire-title">
            <i class="ti ti-speakerphone"></i>
            Annonces du Maire
          </div>
        </div>
        <div class="sb-maire-scroll">
          @for (ann of annonces; track ann.id) {
            <div class="sb-ann-item" [class.ann-urgent]="ann.urgent">
              <div class="ann-dot" [class.ann-dot-urgent]="ann.urgent"></div>
              <div class="ann-content">
                <div class="ann-titre">{{ann.titre}}</div>
                <div class="ann-date">{{ann.date}}</div>
              </div>
            </div>
          }
        </div>
        <div class="sb-maire-footer">
          <i class="ti ti-chevron-right"></i> Voir toutes les annonces
        </div>
      </div>
    </nav>

    <!-- ── Main ─────────────────────────────────────────────────────────── -->
    <main class="main">

      <!-- ── KPIs ──────────────────────────────────────────────────────── -->
      <div class="kpi-row">
        <div class="kpi" style="border-left-color:#F77F00">
          <div class="kpi-icon-box" style="background:rgba(247,127,0,.12);font-size:26px">📢</div>
          <div>
            <div class="kpi-v">{{com.kpi().publicationsMois}}</div>
            <div class="kpi-l">Publications ce mois</div>
          </div>
        </div>
        <div class="kpi" style="border-left-color:#185FA5">
          <div class="kpi-icon-box" style="background:rgba(24,95,165,.1);font-size:26px">👥</div>
          <div>
            <div class="kpi-v">{{com.kpi().abonnesTotaux > 0 ? (com.kpi().abonnesTotaux | number:'1.0-0':'fr-FR') : '—'}}</div>
            <div class="kpi-l">Abonnés réseaux</div>
          </div>
        </div>
        <div class="kpi" style="border-left-color:#009A44">
          <div class="kpi-icon-box" style="background:rgba(0,154,68,.1);font-size:26px">📱</div>
          <div>
            <div class="kpi-v">{{com.kpi().tauxLivraisonSms}}%</div>
            <div class="kpi-l">Taux livraison SMS</div>
          </div>
        </div>
        <div class="kpi" style="border-left-color:#e63946">
          <div class="kpi-icon-box" style="background:rgba(230,57,70,.1);font-size:26px">💬</div>
          <div>
            <div class="kpi-v">{{com.kpi().reclamationsOuvertes}}</div>
            <div class="kpi-l">Réclamations ouvertes</div>
          </div>
        </div>
        <div class="kpi" style="border-left-color:#C9A84C">
          <div class="kpi-icon-box" style="background:rgba(201,168,76,.12);font-size:26px">🗂️</div>
          <div>
            <div class="kpi-v">{{com.kpi().documentsArchives > 0 ? (com.kpi().documentsArchives | number:'1.0-0':'fr-FR') : '—'}}</div>
            <div class="kpi-l">Documents archivés</div>
          </div>
        </div>
      </div>

      <!-- ── Sections ───────────────────────────────────────────────────── -->
      @if (active()==='actualites')  { <app-actualites /> }
      @if (active()==='reseaux')     { <app-reseaux /> }
      @if (active()==='relations')   { <app-relations /> }
      @if (active()==='documents')   { <app-documents /> }
      @if (active()==='citoyens')    { <app-citoyens /> }
      @if (active()==='sms')         { <app-sms /> }

    </main>
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
    .topbar {
      background: var(--ci-bleu, #001f3f);
      padding: 0 1.5rem;
      height: 65px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 16px rgba(0,0,0,.18);
      border-bottom: 3px solid var(--ci-orange, #F77F00);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .topbar-title { color:#fff;font-size:17px;font-weight:800;letter-spacing:.2px; }
    .topbar-sub   { color:rgba(255,255,255,.65);font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;margin-top:2px; }
    .topbar-user  { display:flex;align-items:center;gap:10px;color:#fff;font-size:13px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);padding:6px 14px;border-radius:30px; }
    .av           { width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#F77F00,#009A44);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:bold;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2);flex-shrink:0; }
    .btn-logout   { background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:12px;padding:5px 12px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:background .15s; }
    .btn-logout:hover { background:rgba(255,255,255,.18); }

    /* ── Layout ── */
    .layout   { display:flex;min-height:calc(100vh - 65px);position:relative; }

    /* ── Overlay ── */
    .overlay  { position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:199;backdrop-filter:blur(1px); }

    /* ── Sidebar ── */
    .sidebar {
      width: 260px;
      background: linear-gradient(180deg,#001f3f 0%,#002a56 60%,#003a70 100%);
      min-height: calc(100vh - 65px);
      padding: 20px 0 40px;
      border-right: 1px solid rgba(255,255,255,.06);
      flex-shrink: 0;
      overflow-y: auto;
      transition: transform .28s cubic-bezier(.4,0,.2,1);
      z-index: 200;
    }
    .sb-sec   { font-size:10px;color:rgba(255,255,255,.4);padding:16px 20px 6px;text-transform:uppercase;font-weight:700;letter-spacing:1.2px; }
    .sb-item  { display:flex;align-items:center;gap:10px;padding:10px 14px;margin:2px 10px;border-radius:9px;color:rgba(255,255,255,.65);font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;border:1px solid transparent; }
    .sb-item:hover { background:rgba(255,255,255,.08);color:rgba(255,255,255,.9);border-color:rgba(255,255,255,.1); }
    .sb-item.act   { background:linear-gradient(90deg,#F77F00,#e06d00);color:#fff;font-weight:700;border-color:transparent;box-shadow:0 3px 10px rgba(247,127,0,.35); }
    .sb-icon-wrap  { font-size:17px;width:22px;text-align:center;flex-shrink:0; }
    .badge         { background:#e63946;color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px; }

    /* ── Annonces ── */
    .sb-maire-block { margin:20px 10px 10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);display:flex;flex-direction:column;flex-shrink:0; }
    .sb-maire-header{ display:flex;align-items:center;gap:8px;padding:10px 12px 6px;flex-shrink:0; }
    .sb-maire-flag  { display:flex;height:22px;border-radius:3px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.3); }
    .sb-maire-flag span { display:block;width:7px; }
    .flag-o { background:#F77F00; }
    .flag-w { background:#fff; }
    .flag-v { background:#009A44; }
    .sb-maire-title { color:rgba(255,255,255,.8);font-size:11px;font-weight:700;display:flex;align-items:center;gap:5px;letter-spacing:.3px; }
    .sb-maire-title i { color:#F77F00; }
    .sb-maire-scroll{ padding:4px 12px;display:flex;flex-direction:column;gap:6px;max-height:150px;overflow-y:auto; }
    .sb-ann-item    { display:flex;align-items:flex-start;gap:8px;padding:6px 0; }
    .ann-dot        { width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3);margin-top:4px;flex-shrink:0; }
    .ann-dot-urgent { background:#e63946; }
    .ann-content    { flex:1; }
    .ann-titre      { font-size:11px;color:rgba(255,255,255,.75);font-weight:500;line-height:1.3; }
    .ann-date       { font-size:10px;color:rgba(255,255,255,.35);margin-top:2px; }
    .ann-urgent .ann-titre { color:#fbbf24; }
    .sb-maire-footer{ text-align:center;font-size:10px;color:rgba(255,255,255,.35);padding:6px 12px 10px;cursor:pointer;transition:color .15s;display:flex;align-items:center;justify-content:center;gap:4px;flex-shrink:0; }
    .sb-maire-footer:hover { color:rgba(255,255,255,.6); }

    /* ── Main ── */
    .main { flex:1;padding:1.5rem;display:flex;flex-direction:column;gap:1.25rem;min-width:0;background:var(--bg-page,#f3f4f6);overflow:visible; }

    /* ── KPIs ── */
    .kpi-row { display:flex;gap:.75rem;flex-wrap:wrap; }
    .kpi     { background:#fff;border:1px solid #e5e7eb;border-left-width:4px;border-radius:10px;padding:.8rem 1rem;display:flex;align-items:center;gap:.75rem;flex:1;min-width:140px;box-shadow:0 1px 4px rgba(0,0,0,.04); }
    .kpi-icon-box { width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .kpi-v   { font-size:20px;font-weight:700;color:#111827;line-height:1.1; }
    .kpi-l   { font-size:11px;color:#6b7280;margin-top:2px; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .hamburger { display:flex; }
      .sidebar {
        position: fixed;
        top: 65px;
        left: 0;
        height: calc(100vh - 65px);
        transform: translateX(-100%);
      }
      .sidebar.open { transform: translateX(0); }
      .tb-name      { display:none; }
      .logout-label { display:none; }
    }
    @media (max-width: 600px) {
      .topbar { padding:0 1rem; }
      .main   { padding:1rem; }
      .kpi    { min-width:calc(50% - .75rem); }
      .topbar-user { display:none; }
    }
  `]
})
export class CommunicationShellComponent implements OnInit {
  readonly com     = inject(CommunicationService);
  readonly loading = inject(LoadingService);
  readonly auth    = inject(AuthService);

  active      = signal<Section>('actualites');
  sidebarOpen = signal(false);

  initiales = computed(() => {
    const name = this.auth.currentUser()?.name ?? '';
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'CI';
  });

  roleLabel(): string {
    const roles: Record<string, string> = {
      chef_communication: 'Chef Communication',
      agent_communication: 'Agent Communication',
      responsable_rs: 'Responsable RS',
      admin: 'Administrateur',
    };
    return roles[this.auth.currentUser()?.role ?? ''] ?? 'Communication';
  }

  navComm = [
    { id: 'actualites' as Section, label: 'Actualités',       icon: 'ti-news' },
    { id: 'reseaux' as Section,    label: 'Réseaux sociaux',  icon: 'ti-brand-facebook' },
    { id: 'relations' as Section,  label: 'Relations publiques', icon: 'ti-building-community' },
    { id: 'documents' as Section,  label: 'Gestion documentaire', icon: 'ti-folder' },
  ];

  navCit = [
    { id: 'citoyens' as Section, label: 'Participation citoyenne', icon: 'ti-message-circle' },
    { id: 'sms' as Section,      label: 'SMS & Notifications',     icon: 'ti-device-mobile-message' },
  ];

  annonces = [
    { id: 1, titre: 'Inauguration du nouveau marché d\'Adjamé', date: '24 juin 2026', urgent: true },
    { id: 2, titre: 'Journée de vaccination gratuite — Treichville', date: '26 juin 2026', urgent: false },
    { id: 3, titre: 'Réunion communautaire — Plateau Centre', date: '28 juin 2026', urgent: false },
    { id: 4, titre: 'Fête nationale : coupure d\'eau programmée', date: '07 août 2026', urgent: true },
  ];

  ngOnInit(): void { this.com.loadStats(); this.com.loadActualites(); this.com.loadReclamations(); }

  toggleSidebar(): void  { this.sidebarOpen.update(v => !v); }
  closeSidebar(): void   { this.sidebarOpen.set(false); }

  navigate(s: Section): void {
    this.active.set(s);
    this.closeSidebar();
    switch (s) {
      case 'actualites': this.com.loadActualites(); break;
      case 'reseaux':    this.com.loadComptes(); this.com.loadCalendrier(); break;
      case 'relations':  this.com.loadPartenaires(); break;
      case 'documents':  this.com.loadDocuments(); break;
      case 'citoyens':   this.com.loadReclamations(); this.com.loadSuggestions(); this.com.loadConsultations(); break;
      case 'sms':        this.com.loadSmsHistorique(); break;
    }
  }
}
