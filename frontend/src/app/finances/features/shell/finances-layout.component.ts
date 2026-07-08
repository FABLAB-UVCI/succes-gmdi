import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-finances-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="gmdi-finances">
      <!-- ── Topbar ── -->
      <div class="topbar">
        <div class="tb-brand">
          <!-- Hamburger (mobile) -->
          <button class="hamburger" (click)="toggleSidebar()" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
          <div class="tb-flag">
            <span></span><span></span><span></span>
          </div>
          <div>
            <div class="tb-title"><span>GMDI</span> Finances</div>
            <div class="tb-sub">République de Côte d'Ivoire · Gestion Municipale</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:1.25rem">
          <div class="tb-user">
            <div class="av">{{ auth.initiales() }}</div>
            <span class="tb-username">
              {{ auth.user()?.name ?? 'Utilisateur' }}
              <span style="opacity:.6"> — {{ auth.user()?.role ?? 'Finances' }}</span>
            </span>
          </div>
          <button (click)="auth.logout()" class="btn-logout">
            <i class="ti ti-logout" style="font-size:14px"></i><span class="logout-label">Déconnexion</span>
          </button>
        </div>
      </div>

      <div class="layout">
        <!-- Overlay mobile -->
        @if (sidebarOpen()) {
          <div class="sidebar-overlay" (click)="closeSidebar()"></div>
        }

        <!-- ── Sidebar ── -->
        <nav class="sidebar" [class.open]="sidebarOpen()">
          <div class="sb-logo">
            <div class="sb-logo-icon">💰</div>
            <div class="sb-logo-text">
              GMDI Finances
              <small>Côte d'Ivoire</small>
            </div>
          </div>

          <div class="sb-sec">Gestion</div>
          <a class="sb-item" routerLink="/finances/budget" routerLinkActive="act" (click)="closeSidebar()"><i class="ti ti-wallet"></i>Budget</a>
          <a class="sb-item" routerLink="/finances/recettes" routerLinkActive="act" (click)="closeSidebar()"><i class="ti ti-download"></i>Recettes</a>
          <a class="sb-item" routerLink="/finances/depenses" routerLinkActive="act" (click)="closeSidebar()"><i class="ti ti-upload"></i>Dépenses</a>
          
          <div class="sb-sec">Comptabilité</div>
          <a class="sb-item" routerLink="/finances/comptabilite" routerLinkActive="act" (click)="closeSidebar()"><i class="ti ti-calculator"></i>Opérations</a>
          <a class="sb-item" routerLink="/finances/tresorerie" routerLinkActive="act" (click)="closeSidebar()"><i class="ti ti-scale"></i>Trésorerie</a>
          <a class="sb-item" routerLink="/finances/rapports" routerLinkActive="act" (click)="closeSidebar()"><i class="ti ti-report-money"></i>Rapports</a>
        </nav>

        <!-- ── Main Content ── -->
        <main class="main">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- ── Toasts globaux ── -->
      <div class="fin-toast-stack">
        @for (t of toast.toasts(); track t.id) {
          <div class="fin-toast" [class.error]="t.type === 'error'">
            <i class="ti" [class.ti-check]="t.type === 'success'" [class.ti-alert-circle]="t.type === 'error'"></i>
            <span>{{ t.message }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .btn-logout {
      background: rgba(247,127,0,.1);
      border: 1px solid rgba(247,127,0,.2);
      color: #F77F00;
      font-size: 12px;
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background .15s;
    }
    .btn-logout:hover {
      background: rgba(247,127,0,.18);
    }

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
    .hamburger:hover { background: rgba(0,0,0,.06); }
    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: #006B2B;
      border-radius: 2px;
    }

    /* ── Overlay ── */
    .sidebar-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.45);
      z-index: 199;
      backdrop-filter: blur(1px);
    }

    /* ── Sidebar responsive ── */
    .layout { position: relative; }
    .sidebar {
      transition: transform .28s cubic-bezier(.4,0,.2,1);
      z-index: 200;
    }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .hamburger { display: flex; }
      .sidebar {
        position: fixed;
        top: 64px;
        left: 0;
        height: calc(100vh - 64px);
        transform: translateX(-100%);
        overflow-y: auto;
      }
      .sidebar.open { transform: translateX(0); }
      .tb-username  { display: none; }
      .logout-label { display: none; }
    }
    @media (max-width: 600px) {
      .tb-user { display: none; }
    }

    /* ── Toasts globaux ── */
    .fin-toast-stack {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .fin-toast {
      background: #009A44;
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 6px 20px rgba(0,0,0,.2);
      border-left: 4px solid #F77F00;
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 360px;
      animation: finToastIn .25s ease;
    }
    .fin-toast.error {
      background: #C62828;
      border-left-color: #7a1f1f;
    }
    @keyframes finToastIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class FinancesLayoutComponent {
  auth = inject(AuthService);
  toast = inject(ToastService);
  sidebarOpen = signal(false);

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
  closeSidebar(): void  { this.sidebarOpen.set(false); }
}
