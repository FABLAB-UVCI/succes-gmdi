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
    <div>
      <div class="topbar-title">GMDI — Communication</div>
      <div class="topbar-sub">République de Côte d'Ivoire</div>
    </div>
    <div style="display:flex;align-items:center;gap:1.25rem">
      @if (loading.isLoading()) {
        <span style="font-size:11px;color:#a0b4cc;display:flex;align-items:center;gap:4px">
          <i class="ti ti-loader-2" style="animation:spin 1s linear infinite;font-size:13px"></i>Chargement…
        </span>
      }
      <div class="topbar-user">
        <div class="av">{{initiales()}}</div>
        <span>{{auth.currentUser()?.name ?? 'Chef Communication'}}<span style="opacity:.6"> — {{roleLabel()}}</span></span>
      </div>
      <button (click)="auth.logout()" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:12px;padding:5px 12px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:background .15s" onmouseenter="this.style.background='rgba(255,255,255,.18)'" onmouseleave="this.style.background='rgba(255,255,255,.1)'">
        <i class="ti ti-logout" style="font-size:14px"></i>Déconnexion
      </button>
    </div>
  </div>

  <div class="layout">

    <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
    <nav class="sidebar">
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
  `
})
export class CommunicationShellComponent implements OnInit {
  readonly com     = inject(CommunicationService);
  readonly loading = inject(LoadingService);
  readonly auth    = inject(AuthService);

  active = signal<Section>('actualites');

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

  navigate(s: Section): void {
    this.active.set(s);
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
