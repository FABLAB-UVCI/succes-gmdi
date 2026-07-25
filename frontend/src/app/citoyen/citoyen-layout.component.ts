import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../communication/core/services/auth.service';

@Component({
  selector: 'app-citoyen-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
<div class="citoyen-app">

  <!-- ── Sidebar ────────────────────────────────── -->
  <aside class="sidebar" [class.open]="sidebarOpen">
    <!-- Bandeau tricolore -->
    <div class="sidebar-tricolor">
      <span class="stc-o"></span><span class="stc-w"></span><span class="stc-v"></span>
    </div>

    <div class="sidebar-brand">
      <span class="brand-flag">🇨🇮</span>
      <div>
        <div class="brand-name">
          <span class="bn-e">E</span><span class="bn-dash">-</span><span class="bn-m">Mairie</span>
        </div>
        <div class="brand-sub">Portail Citoyen</div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <a class="nav-item" routerLink="/citoyen" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
        <i class="ti ti-smart-home nav-ico"></i><span>Tableau de bord</span>
      </a>
      <a class="nav-item" routerLink="/citoyen/demarches" routerLinkActive="active">
        <i class="ti ti-list nav-ico"></i><span>Mes démarches</span>
      </a>
      <a class="nav-item" routerLink="/citoyen/notifications" routerLinkActive="active">
        <i class="ti ti-bell nav-ico"></i><span>Notifications</span>
      </a>
      <a class="nav-item" routerLink="/citoyen/profil" routerLinkActive="active">
        <i class="ti ti-user nav-ico"></i><span>Mon profil</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <button class="btn-logout" (click)="auth.logout()">
        <i class="ti ti-logout"></i> Se déconnecter
      </button>
    </div>
  </aside>

  <!-- ── Overlay mobile ────────────────────────────────── -->
  <div class="overlay" [class.show]="sidebarOpen" (click)="sidebarOpen=false"></div>

  <!-- ── Contenu principal ────────────────────────────────── -->
  <div class="main-area">
    <header class="topbar">
      <button class="burger" (click)="sidebarOpen=!sidebarOpen"><i class="ti ti-menu-2"></i></button>
      <div class="topbar-title">
        <span class="flag-strip"><span class="fo"></span><span class="fw"></span><span class="fv"></span></span>
        Plateforme E-Mairie
      </div>
      <div class="topbar-user">
        <span class="avatar">{{ initial }}</span>
        <span class="user-name">{{ user?.name ?? 'Citoyen' }}</span>
      </div>
    </header>

    <main class="content">
      <router-outlet />
    </main>
  </div>
</div>

<style>
:host { display: block; height: 100vh; }

.citoyen-app {
  display: flex; height: 100vh; overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  background: #f4f6fb;
  color: #1a1a2e;
}

/* ── Sidebar Ivoirienne ── */
.sidebar {
  width: 260px; flex-shrink: 0;
  background: linear-gradient(180deg, #1a0500 0%, #0a1a00 100%);
  display: flex; flex-direction: column;
  padding: 0;
  transition: transform .25s ease;
  z-index: 100;
  box-shadow: 4px 0 20px rgba(0,0,0,.3);
}

/* Bandeau tricolore mince en haut */
.sidebar-tricolor {
  display: flex; height: 4px; flex-shrink: 0;
}
.stc-o { flex: 1; background: #F77F00; }
.stc-w { flex: 1; background: #ffffff; }
.stc-v { flex: 1; background: #009A44; }

.sidebar-brand {
  display: flex; align-items: center; gap: .8rem;
  padding: 1.4rem 1.4rem 1.2rem;
  border-bottom: 1px solid rgba(247,127,0,.2);
}
.brand-flag { font-size: 2rem; line-height: 1; filter: drop-shadow(0 2px 6px rgba(0,0,0,.4)); }
.brand-name { font-weight: 800; font-size: 1.15rem; letter-spacing: .5px; }
.bn-e { color: #F77F00; }
.bn-dash { color: rgba(255,255,255,.5); }
.bn-m { color: #009A44; }
.brand-sub { font-size: .72rem; color: rgba(255,255,255,.5); margin-top: .1rem; }

.sidebar-nav { flex: 1; padding: 1rem 0; display: flex; flex-direction: column; gap: .2rem; }
.nav-item {
  display: flex; align-items: center; gap: .7rem;
  padding: .78rem 1.4rem;
  color: rgba(255,255,255,.65);
  text-decoration: none; font-size: .9rem; font-weight: 500;
  border-left: 3px solid transparent;
  transition: all .18s ease;
  position: relative;
}
.nav-item:hover {
  background: rgba(247,127,0,.12);
  color: #F77F00;
  border-left-color: rgba(247,127,0,.5);
}
.nav-item.active {
  background: rgba(247,127,0,.2);
  color: #F77F00;
  border-left-color: #F77F00;
  font-weight: 700;
}
.nav-item.active::after {
  content: '';
  position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
  width: 6px; height: 6px; border-radius: 50%; background: #F77F00;
}
.nav-ico { font-size: 1.1rem; width: 1.4rem; text-align: center; }

.sidebar-footer { padding: 1.2rem 1.4rem; border-top: 1px solid rgba(0,154,68,.2); }
.btn-logout {
  width: 100%; padding: .65rem 1rem;
  background: rgba(230,57,70,.12); color: #ff8080;
  border: 1px solid rgba(230,57,70,.25);
  border-radius: 8px; font-size: .85rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: .5rem;
  transition: all .15s ease;
}
.btn-logout:hover { background: rgba(230,57,70,.28); color: #fff; border-color: rgba(230,57,70,.5); }

/* ── Overlay mobile ── */
.overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 90; }
.overlay.show { display: block; }

/* ── Main ── */
.main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.topbar {
  height: 64px; min-height: 64px;
  background: #fff;
  border-bottom: 3px solid #F77F00;
  display: flex; align-items: center; gap: 1rem;
  padding: 0 1.5rem;
  box-shadow: 0 2px 8px rgba(247,127,0,.1);
}
.burger { display: none; background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #F77F00; }
.topbar-title {
  display: flex; align-items: center; gap: .5rem;
  font-weight: 700; font-size: 1rem; color: #003366; flex: 1;
}
.flag-strip { display: flex; width: 24px; height: 16px; border-radius: 3px; overflow: hidden; flex-shrink: 0; }
.fo, .fw, .fv { flex: 1; }
.fo { background: #F77F00; } .fw { background: #fff; border: 1px solid #e2e8f0; } .fv { background: #009A44; }
.topbar-user { display: flex; align-items: center; gap: .6rem; }
.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #F77F00, #009A44);
  color: #fff; font-weight: 800; font-size: .9rem;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(247,127,0,.35);
}
.user-name { font-size: .85rem; font-weight: 600; color: #003366; }

.content { flex: 1; overflow-y: auto; padding: 2rem 2rem; }

@media (max-width: 768px) {
  .sidebar { position: fixed; top: 0; left: 0; height: 100%; transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .burger { display: block; }
  .content { padding: 1.2rem 1rem; }
}
</style>
  `,
})
export class CitoyenLayoutComponent {
  readonly auth = inject(AuthService);
  readonly user = this.auth.currentUser();
  sidebarOpen = false;
  get initial(): string {
    return (this.user?.name ?? 'C').charAt(0).toUpperCase();
  }

  alertDev() {
    alert('Cette page est en cours de construction. Bientôt disponible !');
  }
}

