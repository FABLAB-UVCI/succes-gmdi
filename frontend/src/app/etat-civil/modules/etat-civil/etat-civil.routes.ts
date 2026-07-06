import { Routes } from '@angular/router';

import { EtatCivilLayoutComponent } from './layouts/etat-civil-layout/etat-civil-layout';

import { NaissancesComponent } from './pages/naissances/naissances';
import { MariagesComponent } from './pages/mariages/mariages';
import { DecesComponent } from './pages/deces/deces';
import { CertificatsComponent } from './pages/certificats/certificats';
import { RechercheComponent } from './pages/recherche/recherche';
import { StatistiquesComponent } from './pages/statistiques/statistiques';

export const ETAT_CIVIL_ROUTES: Routes = [
  {
    path: '',
    component: EtatCivilLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'naissances',
        pathMatch: 'full'
      },
      {
        path: 'naissances',
        component: NaissancesComponent
      },
      {
        path: 'mariages',
        component: MariagesComponent
      },
      {
        path: 'deces',
        component: DecesComponent
      },
      {
        path: 'certificats',
        component: CertificatsComponent
      },
      {
        path: 'recherche',
        component: RechercheComponent
      },
      {
        path: 'statistiques',
        component: StatistiquesComponent
      }
    ]
  }
];