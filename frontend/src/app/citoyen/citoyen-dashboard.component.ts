import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../communication/core/services/auth.service';
import { CitoyenService, Demarche } from './citoyen.service';

interface ModuleInfo { label: string; route: string; ico: string; color: string; desc: string; }

@Component({
  selector: 'app-citoyen-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="dash">

  <!-- ── Bienvenue ────────────────────────────────── -->
  <div class="hero-card">
    <div class="hero-left">
      <div class="hero-wave"><i class="ti ti-hand-stop"></i></div>
      <div>
        <h1 class="hero-title">Bonjour, {{ firstNameOf(user?.name) }} !</h1>
        <p class="hero-sub">Bienvenue sur votre espace citoyen — Plateforme E-Mairie</p>
        <span class="hero-badge"><i class="ti ti-flag"></i> République de Côte d'Ivoire</span>
      </div>
    </div>
    <div class="hero-stats">
      <div class="hs-item"><span class="hs-val">{{ totalDemarches() }}</span><span class="hs-lbl">Démarches</span></div>
      <div class="hs-sep"></div>
      <div class="hs-item"><span class="hs-val">{{ enCours() }}</span><span class="hs-lbl">En cours</span></div>
      <div class="hs-sep"></div>
      <div class="hs-item"><span class="hs-val">{{ valides() }}</span><span class="hs-lbl">Validées</span></div>
    </div>
  </div>

  <!-- ── Démarches récentes ────────────────────────────────── -->
  <section class="section section-orange">
    <div class="section-head">
      <h2 class="section-title"><i class="ti ti-list"></i> Mes démarches récentes</h2>
      <a class="link-all" routerLink="/citoyen/demarches">Voir tout →</a>
    </div>
    @if (loading()) {
      <div class="loading-row">Chargement…</div>
    } @else if (recentDemarches().length === 0) {
      <div class="empty-card">
        <i class="ti ti-folder-open empty-ico"></i>
        <p>Aucune démarche pour l'instant.</p>
        <p class="empty-sub">Commencez par choisir un service ci-dessous.</p>
      </div>
    } @else {
      <div class="demarches-list">
        @for (d of recentDemarches(); track d.id) {
          <div class="demarche-row">
            <div class="dr-left">
              <span class="dr-ref">{{ d.reference }}</span>
              <span class="dr-module">{{ labelModule(d.module) }}</span>
              @if (d.type_demarche) { <span class="dr-type">{{ d.type_demarche }}</span> }
            </div>
            <div class="dr-right">
              @if (d.donnees?.document_officiel) {
                <a [href]="d.donnees.document_officiel" target="_blank" class="btn-pdf" title="Télécharger le document officiel">
                  <i class="ti ti-download"></i> PDF
                </a>
              }
              <span class="dr-statut" [style.background]="colorForStatut(d.statut)+'22'" [style.color]="colorForStatut(d.statut)">
                {{ labelStatut(d.statut) }}
              </span>
              <span class="dr-date">{{ d.updated_at | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>
        }
      </div>
    }
  </section>

  <!-- ── Accès aux modules ────────────────────────────────── -->
  <section class="section section-vert">
    <div class="section-head">
      <h2 class="section-title"><i class="ti ti-building"></i> Services municipaux disponibles</h2>
    </div>
    <div class="modules-grid">
      @for (m of modules; track m.route) {
        <a class="module-card" [routerLink]="[m.route]">
          <span class="mc-ico" [style.background]="m.color+'22'"><i [class]="m.ico"></i></span>
          <div class="mc-body">
            <span class="mc-label">{{ m.label }}</span>
            <span class="mc-desc">{{ m.desc }}</span>
          </div>
          <span class="mc-arrow">›</span>
        </a>
      }
    </div>
  </section>

</div>

<style>
.dash { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }

/* ── Hero Ivoirien ── */
.hero-card {
  background: linear-gradient(135deg, #F77F00 0%, #cc6600 40%, #009A44 100%);
  border-radius: 16px; padding: 2rem 2.2rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
  flex-wrap: wrap;
  box-shadow: 0 8px 30px rgba(247,127,0,.3);
  position: relative; overflow: hidden;
}
.hero-card::before {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Ccircle cx='20' cy='20' r='4'/%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}
.hero-left { display: flex; align-items: center; gap: 1.2rem; position: relative; z-index: 1; }
.hero-wave { font-size: 2.8rem; animation: wave 2s ease-in-out infinite alternate; }
@keyframes wave { from { transform: rotate(0deg); } to { transform: rotate(20deg); } }
.hero-title { color: #fff; font-size: 1.6rem; font-weight: 800; margin: 0 0 .3rem; text-shadow: 0 1px 6px rgba(0,0,0,.2); }
.hero-sub { color: rgba(255,255,255,.88); font-size: .9rem; margin: 0 0 .6rem; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: rgba(255,255,255,.2); backdrop-filter: blur(4px);
  color: #fff; font-size: .75rem; font-weight: 700;
  padding: .2rem .7rem; border-radius: 20px; letter-spacing: .5px;
  border: 1px solid rgba(255,255,255,.3);
}
.hero-stats { display: flex; align-items: center; gap: 1.5rem; position: relative; z-index: 1; }
.hs-item { display: flex; flex-direction: column; align-items: center; }
.hs-val { color: #fff; font-size: 1.8rem; font-weight: 800; line-height: 1; text-shadow: 0 1px 4px rgba(0,0,0,.15); }
.hs-lbl { color: rgba(255,255,255,.75); font-size: .72rem; margin-top: .2rem; }
.hs-sep { width: 1px; height: 40px; background: rgba(255,255,255,.3); }

/* ── Sections ── */
.section {
  background: #fff; border-radius: 14px; padding: 1.6rem;
  box-shadow: 0 2px 10px rgba(0,0,0,.05);
  border-top: 4px solid transparent;
}
.section-orange { border-top-color: #F77F00; }
.section-vert   { border-top-color: #009A44; }
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.2rem; }
.section-title { font-size: 1rem; font-weight: 700; color: #003366; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.link-all { font-size: .82rem; font-weight: 600; color: #F77F00; text-decoration: none; transition: color .15s; }
.link-all:hover { color: #cc6600; text-decoration: underline; }

/* ── Loading / Empty ── */
.loading-row { padding: 2rem; text-align: center; color: #7a5c3a; font-size: .9rem; }
.empty-card { text-align: center; padding: 2.5rem 1rem; }
.empty-ico { font-size: 2.5rem; color: #F77F00; opacity: .5; }
.empty-card p { color: #7a5c3a; margin: .5rem 0 0; }
.empty-sub { font-size: .82rem; color: #b09070 !important; }

/* ── Démarches list ── */
.demarches-list { display: flex; flex-direction: column; gap: .6rem; }
.demarche-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: .85rem 1rem;
  background: #f8f9fb; border-radius: 10px;
  border: 1px solid #e8edf5; border-left: 3px solid #F77F00;
  gap: 1rem; flex-wrap: wrap;
  transition: all .15s ease;
}
.demarche-row:hover { border-color: #F77F00; background: #fff8f0; box-shadow: 0 2px 8px rgba(247,127,0,.1); }
.dr-left { display: flex; align-items: center; gap: .7rem; flex-wrap: wrap; }
.dr-ref { font-family: 'Courier New', monospace; font-size: .8rem; color: #003366; font-weight: 700; }
.dr-module {
  background: rgba(247,127,0,.12); color: #cc6600;
  font-size: .72rem; font-weight: 600; padding: .15rem .55rem; border-radius: 20px;
}
.dr-type { font-size: .78rem; color: #7a5c3a; }
.dr-right { display: flex; align-items: center; gap: .8rem; }
.dr-statut { font-size: .75rem; font-weight: 700; padding: .2rem .65rem; border-radius: 20px; }
.dr-date { font-size: .75rem; color: #b09070; }
.btn-pdf {
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: #fef2f2; color: #ef4444; border: 1px solid #fca5a5;
  padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700;
  text-decoration: none; transition: all 0.2s;
}
.btn-pdf:hover { background: #ef4444; color: #fff; }

/* ── Modules grid ── */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: .9rem;
}
.module-card {
  display: flex; align-items: center; gap: .9rem;
  padding: 1rem 1.1rem;
  background: #f8f9fb;
  border: 1px solid #e8edf5; border-radius: 12px;
  text-decoration: none; color: inherit;
  transition: all .18s ease;
}
.module-card:hover {
  border-color: #009A44;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0,154,68,.12);
  transform: translateY(-2px);
}
.mc-ico {
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
  flex-shrink: 0;
}
.mc-body { flex: 1; display: flex; flex-direction: column; gap: .1rem; }
.mc-label { font-weight: 700; font-size: .9rem; color: #003366; }
.mc-desc { font-size: .75rem; color: #7a5c3a; }
.mc-arrow { font-size: 1.2rem; color: #009A44; font-weight: 700; }
</style>
  `,
})
export class CitoyenDashboardComponent implements OnInit {
  private citoyenSvc = inject(CitoyenService);
  readonly auth      = inject(AuthService);
  readonly user      = this.auth.currentUser();

  loading   = signal(true);
  demarches = signal<Demarche[]>([]);

  totalDemarches = () => this.demarches().length;
  enCours        = () => this.demarches().filter(d => d.statut === 'en_cours' || d.statut === 'en_attente').length;
  valides        = () => this.demarches().filter(d => d.statut === 'valide' || d.statut === 'termine').length;
  recentDemarches = () => this.demarches().slice(0, 5);

  modules: ModuleInfo[] = [
    { label: 'État civil',          desc: 'Naissance, mariage, décès',    route: '/citoyen/etat-civil/demande',          ico: 'ti ti-file-text', color: '#003366' },
    { label: 'Services techniques', desc: 'Signalement voirie, éclairage', route: '/citoyen/services-techniques/demande', ico: 'ti ti-tool', color: '#e63946' },
    { label: 'Finances',            desc: 'Paiements, reçus',              route: '/citoyen/finances/demande',            ico: 'ti ti-cash', color: '#F77F00' },
  ];

  ngOnInit(): void {
    this.citoyenSvc.getDemarches().subscribe({
      next:  r => { this.demarches.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  firstNameOf(name?: string | null): string {
    if (!name) return 'Citoyen';
    const parts = name.split(' ');
    return parts[0] ?? 'Citoyen';
  }

  labelModule(m: string): string {
    const map: Record<string, string> = {
      'etat-civil': 'État civil',
      'finances': 'Finances', 'services-techniques': 'Services Techniques',
    };
    return map[m] ?? m;
  }
  labelStatut(s: string) { return this.citoyenSvc.labelForStatut(s); }
  colorForStatut(s: string) { return this.citoyenSvc.colorForStatut(s); }
}

