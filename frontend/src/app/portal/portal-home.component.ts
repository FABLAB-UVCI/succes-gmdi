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
  <div class="flag-bar"><span class="f-o"></span><span class="f-w"></span><span class="f-v"></span></div>

  <header class="portal-head">
    <div class="emblem">🇨🇮</div>
    <h1>Plateforme GMDI</h1>
    <p class="baseline">Gestion Municipale Digitale Intégrée</p>
    <p class="pays">République de Côte d'Ivoire</p>
  </header>

  <div class="grid">
    @for (m of modules; track m.route) {
      <a class="card" [routerLink]="['/', m.route]">
        <span class="card-accent"></span>
        <span class="ico">{{ m.icone }}</span>
        <span class="titre">{{ m.titre }}</span>
        <span class="desc">{{ m.description }}</span>
      </a>
    }
  </div>

  <footer class="portal-foot">
    <span>GMDI v2.0</span><span class="sep">·</span><span>UVCI — FabLab</span>
  </footer>
</div>

<style>
.portal {
  min-height: 100vh;
  padding: 0 1.5rem 3rem;
  background: linear-gradient(180deg, var(--ci-creme, #FFF8EE) 0%, #fdf1de 100%);
  color: var(--ci-brun, #3D1F00);
  font-family: var(--font-sans, 'Inter', system-ui, sans-serif);
}
.flag-bar { display: flex; height: 6px; margin: 0 -1.5rem 2.5rem; }
.f-o, .f-w, .f-v { flex: 1; }
.f-o { background: var(--ci-orange, #F77F00); }
.f-w { background: #fff; }
.f-v { background: var(--ci-vert, #009A44); }

.portal-head { text-align: center; padding-top: 2rem; margin-bottom: 2.5rem; }
.emblem { font-size: 2.4rem; line-height: 1; margin-bottom: .5rem; }
.portal-head h1 {
  font-size: 2.1rem; font-weight: 800; margin: 0; letter-spacing: .3px;
  color: var(--ci-bleu, #003366);
}
.baseline { color: var(--color-text-secondary, #7a5c3a); margin: .4rem 0 .15rem; font-weight: 500; }
.pays { color: var(--ci-vert, #009A44); font-size: .8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; margin: 0; }

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
  border-radius: var(--border-radius-lg, 10px);
  background: #fff;
  border: 1px solid var(--color-border-secondary, #e0cdb5);
  text-decoration: none; color: inherit;
  box-shadow: 0 1px 4px rgba(61,31,0,.05);
  transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
  overflow: hidden;
}
.card-accent {
  position: absolute; top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, var(--ci-orange, #F77F00), var(--ci-vert, #009A44));
}
.card:hover {
  transform: translateY(-3px);
  border-color: var(--ci-orange, #F77F00);
  box-shadow: 0 8px 20px rgba(247,127,0,.16);
}
.ico { font-size: 1.9rem; }
.titre { font-weight: 700; font-size: 1.05rem; color: var(--ci-bleu, #003366); }
.desc { color: var(--color-text-secondary, #7a5c3a); font-size: .8rem; }

.portal-foot {
  text-align: center; margin-top: 3rem;
  font-size: .75rem; color: var(--color-text-tertiary, #b09070);
}
.sep { margin: 0 .5rem; }
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
