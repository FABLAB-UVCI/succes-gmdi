import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../communication/core/services/auth.service';
import { AdminStatsService, AdminStats } from './services/admin-stats.service';

interface ModuleCard { titre: string; description: string; route: string; icone: string; }

@Component({
  selector: 'app-portal-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="portal">

  <!-- ── Hero Banner ──────────────────────────────── -->
  <header class="portal-hero">
    <button class="btn-disconnect" (click)="auth.logout()" title="Se déconnecter">
      <i class="ti ti-logout"></i><span>Se déconnecter</span>
    </button>
    <div class="hero-body">
      <div class="hero-flag">🇨🇮</div>
      <h1 class="hero-title">Plateforme E-Mairie</h1>
      <p class="hero-baseline">Gestion Municipale Digitale Intégrée</p>
      <p class="hero-pays">RÉPUBLIQUE DE CÔTE D'IVOIRE</p>
    </div>
    <div class="flag-stripe">
      <span class="fs-o"></span><span class="fs-w"></span><span class="fs-v"></span>
    </div>
  </header>

  @if (isMaire() && stats()) {
    <div class="dashboard-section">
      <h2 class="dash-title"><i class="ti ti-chart-pie"></i> Vue d'ensemble de la commune</h2>
      
      <div class="kpi-grid">
        <div class="kpi-card orange">
          <div class="kpi-ico"><i class="ti ti-users"></i></div>
          <div class="kpi-info">
            <span class="kpi-val">{{ stats()?.citoyens }}</span>
            <span class="kpi-lbl">Citoyens Inscrits</span>
          </div>
        </div>
        <div class="kpi-card vert">
          <div class="kpi-ico"><i class="ti ti-folder"></i></div>
          <div class="kpi-info">
            <span class="kpi-val">{{ stats()?.demarches?.total }}</span>
            <span class="kpi-lbl">Démarches Totales</span>
          </div>
        </div>
        <div class="kpi-card orange">
          <div class="kpi-ico"><i class="ti ti-loader"></i></div>
          <div class="kpi-info">
            <span class="kpi-val">{{ stats()?.demarches?.en_attente }}</span>
            <span class="kpi-lbl">En Attente</span>
          </div>
        </div>
        <div class="kpi-card rouge">
          <div class="kpi-ico"><i class="ti ti-x"></i></div>
          <div class="kpi-info">
            <span class="kpi-val">{{ stats()?.demarches?.refuse }}</span>
            <span class="kpi-lbl">Refusées</span>
          </div>
        </div>
        <div class="kpi-card vert">
          <div class="kpi-ico"><i class="ti ti-users-group"></i></div>
          <div class="kpi-info">
            <span class="kpi-val">{{ stats()?.agents }}</span>
            <span class="kpi-lbl">Agents Mairie (RH)</span>
          </div>
        </div>
        <div class="kpi-card orange">
          <div class="kpi-ico"><i class="ti ti-coin"></i></div>
          <div class="kpi-info">
            <span class="kpi-val">{{ stats()?.revenus | number:'1.0-0':'fr' }}</span>
            <span class="kpi-lbl">Revenus (FCFA)</span>
          </div>
        </div>
      </div>
    </div>
  }

  <h2 class="section-title"><i class="ti ti-apps"></i> Modules de gestion</h2>
  <div class="grid">
    @if (isMaire()) {
      <a class="card card-maire" routerLink="/maire">
        <span class="card-accent"></span>
        <span class="maire-badge">Espace Maire</span>
        <span class="ico">🏛️</span>
        <span class="titre">Tableau de bord du Maire</span>
        <span class="desc">Vue consolidée, indicateurs & annonces municipales</span>
      </a>
    }
    @for (m of visibleModules; track m.route) {
      <a class="card" [class.card-orange]="$index % 2 === 0" [class.card-vert]="$index % 2 !== 0" [routerLink]="['/', m.route]">
        <span class="card-accent"></span>
        <span class="ico">{{ m.icone }}</span>
        <span class="titre">{{ m.titre }}</span>
        <span class="desc">{{ m.description }}</span>
      </a>
    }
  </div>

  <footer class="portal-foot">
    <div class="foot-flag">
      <span class="ff-o"></span><span class="ff-w"></span><span class="ff-v"></span>
    </div>
    <div class="foot-content">
      <span class="foot-logo">🇨🇮 E-Mairie</span>
      <span class="foot-sep">·</span>
      <span>Plateforme Municipale Digitale</span>
      <span class="foot-sep">·</span>
      <span>UVCI — FabLab</span>
      <span class="foot-sep">·</span>
      <span>v1.0</span>
    </div>
  </footer>
</div>

<style>
.portal {
  position: relative;
  min-height: 100vh;
  padding: 0 1.5rem 3rem;
  background: #f7f8fa;
  color: #1a1a2e;
  font-family: var(--font-sans, 'Inter', system-ui, sans-serif);
}

/* ── Hero Banner Ivoirien ── */
.portal-hero {
  position: relative;
  margin: 0 -1.5rem 2.5rem;
  background: linear-gradient(135deg, #F77F00 0%, #cc6600 40%, #009A44 100%);
  padding: 3rem 2rem 2.5rem;
  text-align: center;
  overflow: hidden;
}
.portal-hero::before {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}
.btn-disconnect {
  position: absolute; top: 1.25rem; right: 1.5rem; z-index: 5;
  display: flex; align-items: center; gap: .4rem;
  padding: .5rem .9rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,.5);
  background: rgba(255,255,255,.15);
  backdrop-filter: blur(6px);
  color: #fff;
  font-size: .8rem; font-weight: 600;
  cursor: pointer;
  transition: all .15s ease;
}
.btn-disconnect i { font-size: 15px; }
.btn-disconnect:hover { background: rgba(255,255,255,.28); border-color: rgba(255,255,255,.8); }
.hero-body { position: relative; z-index: 1; }
.hero-flag { font-size: 3.5rem; line-height: 1; margin-bottom: .6rem; filter: drop-shadow(0 4px 12px rgba(0,0,0,.25)); }
.hero-title {
  font-size: 2.6rem; font-weight: 900; margin: 0 0 .4rem; letter-spacing: .3px;
  color: #fff; text-shadow: 0 2px 12px rgba(0,0,0,.25);
}
.hero-baseline { color: rgba(255,255,255,.88); margin: .2rem 0 .5rem; font-weight: 500; font-size: 1rem; }
.hero-pays {
  display: inline-block;
  color: #fff; font-size: .75rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 1.5px; margin: 0;
  background: rgba(255,255,255,.15); padding: .3rem 1rem; border-radius: 20px;
  border: 1px solid rgba(255,255,255,.3);
}
.flag-stripe {
  display: flex; height: 5px; margin-top: 2rem;
}
.fs-o { flex: 1; background: #F77F00; }
.fs-w { flex: 1; background: #fff; }
.fs-v { flex: 1; background: #009A44; }

/* ── Section title ── */
.section-title {
  max-width: 1080px; margin: 0 auto 1.2rem;
  font-size: 1.3rem; color: #003366; display: flex; align-items: center; gap: 8px;
  padding-left: .5rem;
  border-left: 4px solid #F77F00;
}

/* ── KPI / Dashboard ── */
.dashboard-section {
  max-width: 1080px; margin: 0 auto 3rem;
  background: #fff; padding: 1.5rem; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,.06);
  border-top: 4px solid #F77F00;
}
.dash-title { margin: 0 0 1.2rem; font-size: 1.2rem; color: #003366; display: flex; align-items: center; gap: 8px; font-weight: 800; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.kpi-card {
  display: flex; align-items: center; gap: 1rem; padding: 1.2rem; border-radius: 10px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  transition: transform .15s ease, box-shadow .15s ease;
}
.kpi-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }
.kpi-ico { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.kpi-info { display: flex; flex-direction: column; }
.kpi-val { font-size: 1.5rem; font-weight: 800; color: #0f172a; line-height: 1; margin-bottom: 4px; }
.kpi-lbl { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; }

.kpi-card.orange { border-left: 3px solid #F77F00; }
.kpi-card.orange .kpi-ico { background: #fff3e0; color: #F77F00; }
.kpi-card.vert { border-left: 3px solid #009A44; }
.kpi-card.vert .kpi-ico { background: #e8f5e9; color: #009A44; }
.kpi-card.rouge { border-left: 3px solid #e11d48; }
.kpi-card.rouge .kpi-ico { background: #ffe4e6; color: #e11d48; }

/* ── Modules grid ── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.1rem;
  max-width: 1080px;
  margin: 0 auto;
}
.card {
  position: relative;
  display: flex; flex-direction: column; gap: .45rem;
  padding: 1.6rem 1.4rem 1.4rem;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e2e8f0;
  text-decoration: none; color: inherit;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
  overflow: hidden;
}
.card-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 4px;
}
.card-orange .card-accent { background: #F77F00; }
.card-vert .card-accent { background: #009A44; }
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0,0,0,.1);
}
.card-orange:hover { border-color: #F77F00; box-shadow: 0 10px 24px rgba(247,127,0,.18); }
.card-vert:hover { border-color: #009A44; box-shadow: 0 10px 24px rgba(0,154,68,.18); }
.ico { font-size: 1.9rem; }
.titre { font-weight: 700; font-size: 1.05rem; color: #003366; }
.desc { color: #7a5c3a; font-size: .8rem; }

/* ── Footer Ivoirien ── */
.portal-foot {
  margin-top: 4rem;
  border-radius: 12px;
  overflow: hidden;
  max-width: 1080px;
  margin-left: auto; margin-right: auto;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
}
.foot-flag { display: flex; height: 6px; }
.ff-o { flex: 1; background: #F77F00; }
.ff-w { flex: 1; background: #fff; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
.ff-v { flex: 1; background: #009A44; }
.foot-content {
  background: #fff;
  display: flex; align-items: center; justify-content: center; gap: .5rem; flex-wrap: wrap;
  padding: .9rem 1.5rem;
  font-size: .78rem; color: #7a5c3a;
}
.foot-logo { font-weight: 800; color: #003366; }
.foot-sep { color: #F77F00; font-weight: 700; }
.card-maire {
  background: linear-gradient(135deg, #003366 0%, #00245c 55%, #F77F00 130%);
  border: 1px solid #003366;
  color: #fff;
}
.card-maire .card-accent { background: linear-gradient(90deg, #F77F00, #fff, #009A44); height: 5px; }
.card-maire .titre { color: #fff; }
.card-maire .desc { color: rgba(255,255,255,.8); }
.card-maire:hover { transform: translateY(-4px); border-color: #F77F00; box-shadow: 0 12px 28px rgba(0,51,102,.35); }
.maire-badge {
  position: absolute; top: 12px; right: 12px;
  background: rgba(255,255,255,.18); color: #ffdca8;
  font-size: .65rem; font-weight: 800; letter-spacing: .4px; text-transform: uppercase;
  padding: .25rem .6rem; border-radius: 20px; border: 1px solid rgba(255,255,255,.35);
}
</style>
  `
})
export class PortalHomeComponent implements OnInit {
  readonly auth = inject(AuthService);
  private statsService = inject(AdminStatsService);

  stats = signal<AdminStats | null>(null);

  modules: ModuleCard[] = [
    { titre: 'Communication',       description: 'Actualités, réseaux, réclamations', route: 'communication',       icone: '📣' },
    { titre: 'État civil',          description: 'Naissances, mariages, décès',        route: 'etat-civil',          icone: '📄' },
    { titre: 'Finances',            description: 'Budget, recettes, dépenses',          route: 'finances',            icone: '💰' },
    { titre: 'Patrimoine',          description: 'Biens, véhicules, terrains',          route: 'patrimoine',          icone: '🏛️' },
    { titre: 'Ressources humaines', description: 'Agents, congés, formations',          route: 'rh',                  icone: '👥' },
    { titre: 'Services techniques', description: 'Voirie, éclairage, bâtiments',        route: 'services-techniques', icone: '🔧' },
    { titre: 'Urbanisme / SIG',     description: 'Parcelles, permis, cartographie',     route: 'urbanisme',           icone: '🗺️' },
  ];

  ngOnInit() {
    if (this.isMaire()) {
      this.statsService.getStats().subscribe({
        next: (res) => this.stats.set(res),
        error: (err) => console.error('Erreur stats', err)
      });
    }
  }

  isMaire(): boolean {
    const user = this.auth.currentUser();
    return user?.roles?.includes('maire') || user?.role === 'maire' || user?.roles?.includes('admin') || user?.role === 'admin';
  }

  get visibleModules(): ModuleCard[] {
    const user = this.auth.currentUser();
    if (!user) return [];

    if (this.isMaire()) {
      return this.modules;
    }

    if (user.roles?.includes('citoyen') || user.role === 'citoyen') {
      return [];
    }

    return this.modules.filter(m => {
      return user.permissions?.includes(`access.${m.route}`);
    });
  }
}

