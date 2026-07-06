import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ModuleCard { titre: string; description: string; route: string; icone: string; }

@Component({
  selector: 'app-portal-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="portal">
  <header class="portal-head">
    <h1>Plateforme GMDI</h1>
    <p>Gestion municipale digitale intégrée</p>
  </header>

  <div class="grid">
    @for (m of modules; track m.route) {
      <a class="card" [routerLink]="['/', m.route]">
        <span class="ico">{{ m.icone }}</span>
        <span class="titre">{{ m.titre }}</span>
        <span class="desc">{{ m.description }}</span>
      </a>
    }
  </div>
</div>

<style>
.portal { min-height: 100vh; padding: 3rem 1.5rem; background: #0f172a; color: #e2e8f0; font-family: 'Inter', system-ui, sans-serif; }
.portal-head { text-align: center; margin-bottom: 2.5rem; }
.portal-head h1 { font-size: 2rem; font-weight: 700; margin: 0; }
.portal-head p { color: #94a3b8; margin-top: .5rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; max-width: 1000px; margin: 0 auto; }
.card { display: flex; flex-direction: column; gap: .4rem; padding: 1.4rem; border-radius: 14px; background: #1e293b; border: 1px solid #334155; text-decoration: none; color: inherit; transition: transform .15s ease, border-color .15s ease; }
.card:hover { transform: translateY(-3px); border-color: #6366f1; }
.ico { font-size: 1.8rem; }
.titre { font-weight: 600; font-size: 1.05rem; }
.desc { color: #94a3b8; font-size: .8rem; }
</style>
  `
})
export class PortalHomeComponent {
  modules: ModuleCard[] = [
    { titre: 'Communication',       description: 'Actualités, réseaux, réclamations', route: 'communication',       icone: '📣' },
    { titre: 'État civil',          description: 'Naissances, mariages, décès',        route: 'etat-civil',          icone: '📄' },
    { titre: 'Finances',            description: 'Budget, recettes, dépenses',          route: 'finances',            icone: '💰' },
    { titre: 'Patrimoine',          description: 'Biens, véhicules, terrains',          route: 'patrimoine',          icone: '🏛️' },
    { titre: 'Ressources humaines', description: 'Agents, congés, formations',          route: 'rh',                  icone: '👥' },
    { titre: 'Services techniques', description: 'Voirie, éclairage, bâtiments',        route: 'services-techniques', icone: '🔧' },
    { titre: 'Urbanisme / SIG',     description: 'Parcelles, permis, cartographie',     route: 'urbanisme',           icone: '🗺️' },
  ];
}
