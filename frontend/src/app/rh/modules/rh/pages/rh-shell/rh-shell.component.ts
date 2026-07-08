import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonnelComponent }  from '../../components/personnel/personnel.component';
import { CarriereComponent }   from '../../components/carriere/carriere.component';
import { PresenceComponent }   from '../../components/presence/presence.component';
import { PaieComponent }       from '../../components/paie/paie.component';
import { FormationComponent }  from '../../components/formation/formation.component';
import { RapportsComponent }   from '../../components/rapports/rapports.component';
import { RhService }           from '../../../../core/services/rh.service';
import { AuthService }         from '../../../../core/services/auth.service';

export type Section = 'personnel' | 'carriere' | 'presence' | 'paie' | 'formation' | 'rapports';

interface NavItem { id: Section; label: string; icon: string; }

@Component({
  selector: 'app-rh-shell',
  standalone: true,
  imports: [
    CommonModule,
    PersonnelComponent, CarriereComponent, PresenceComponent,
    PaieComponent, FormationComponent, RapportsComponent,
  ],
  template: `
<div class="root">
  <!-- Topbar CI -->
  <div class="topbar">
    <div class="tb-brand">
      <!-- Hamburger (mobile) -->
      <button class="hamburger" (click)="toggleSidebar()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <div class="tb-flag"><span></span><span></span><span></span></div>
      <div>
        <div class="tb-title">GMDI — Ressources Humaines</div>
        <div class="tb-sub">République de Côte d'Ivoire</div>
      </div>
    </div>
    <div class="tb-user">
      <div class="av">{{ initiales() }}</div>
      <span class="tb-name"><strong>{{ auth.currentUser()?.name ?? '' }}</strong> — {{ auth.currentUser()?.role?.toUpperCase() ?? '' }}</span>
      <button class="tb-logout" (click)="auth.logout()" title="Se déconnecter">
        <i class="ti ti-logout" aria-hidden="true"></i>
      </button>
    </div>
  </div>

  <div class="layout">
    <!-- Overlay mobile -->
    @if (sidebarOpen()) {
      <div class="overlay" (click)="closeSidebar()"></div>
    }

    <!-- Sidebar style État Civil -->
    <nav class="sidebar" [class.open]="sidebarOpen()">
      <div class="sb-sec">RH</div>
      @for (item of navItems; track item.id) {
        <div class="sb-it" [class.act]="activeSection() === item.id" (click)="navigate(item.id)">
          <i class="ti {{ item.icon }}" aria-hidden="true"></i>{{ item.label }}
        </div>
      }
    </nav>

    <!-- Main content -->
    <main class="main">
      <!-- Header avec KPIs -->
      <div class="hdr">
        <div class="hl">
          <i class="ti ti-users hi" aria-hidden="true"></i>
          <div>
            <h2>Ressources Humaines</h2>
            <p>Gestion du personnel municipal — 2025</p>
          </div>
        </div>
        <div class="mkpis">
          <div class="mk"><span class="mk-v" style="color:#C9A84C">{{ rh.totalAgents() }}</span><span class="mk-l">Agents actifs</span></div>
          <div class="mk"><span class="mk-v" style="color:#185FA5">{{ rh.totalFonct() }}</span><span class="mk-l">Fonctionnaires</span></div>
          <div class="mk"><span class="mk-v" style="color:#F77F00">{{ rh.totalContrat() }}</span><span class="mk-l">Contractuels</span></div>
          <div class="mk"><span class="mk-v" style="color:#009A44">{{ rh.totalStagiaires() }}</span><span class="mk-l">Stagiaires</span></div>
        </div>
      </div>

      <!-- Sections -->
      @if (activeSection() === 'personnel') { <app-personnel /> }
      @if (activeSection() === 'carriere')  { <app-carriere />  }
      @if (activeSection() === 'presence')  { <app-presence />  }
      @if (activeSection() === 'paie')      { <app-paie />      }
      @if (activeSection() === 'formation') { <app-formation /> }
      @if (activeSection() === 'rapports')  { <app-rapports />  }
    </main>
  </div>
</div>
  `,
  styleUrls: ['./rh-shell.component.css']
})
export class RhShellComponent {
  constructor(readonly rh: RhService, readonly auth: AuthService) {}

  readonly initiales = () => {
    const name = this.auth.currentUser()?.name ?? '';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  };

  activeSection = signal<Section>('personnel');
  sidebarOpen   = signal(false);

  navItems: NavItem[] = [
    { id: 'personnel', label: 'Personnel',    icon: 'ti-users'    },
    { id: 'carriere',  label: 'Carrière',     icon: 'ti-briefcase' },
    { id: 'presence',  label: 'Présence',     icon: 'ti-clock'     },
    { id: 'paie',      label: 'Paie',         icon: 'ti-cash'      },
    { id: 'formation', label: 'Formation',    icon: 'ti-school'    },
    { id: 'rapports',  label: 'Rapports RH',  icon: 'ti-report'    },
  ];

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
  closeSidebar(): void  { this.sidebarOpen.set(false); }

  navigate(sec: Section): void {
    this.activeSection.set(sec);
    this.closeSidebar();
  }
}