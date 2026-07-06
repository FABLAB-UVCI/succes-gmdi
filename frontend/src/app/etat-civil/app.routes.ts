import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'etat-civil',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'etat-civil',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/etat-civil/etat-civil.routes')
        .then(m => m.ETAT_CIVIL_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'etat-civil'
  }
];
