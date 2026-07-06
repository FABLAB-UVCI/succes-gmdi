import { Routes } from '@angular/router';
import { authGuard, inviteGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'budget', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [inviteGuard],
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'budget',
    canActivate: [authGuard],
    loadComponent: () => import('./features/budget/budget.component').then(m => m.BudgetComponent)
  },
  {
    path: 'recettes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/recettes/recettes.component').then(m => m.RecettesComponent)
  },
  {
    path: 'depenses',
    canActivate: [authGuard],
    loadComponent: () => import('./features/depenses/depenses.component').then(m => m.DepensesComponent)
  },
  {
    path: 'comptabilite',
    canActivate: [authGuard],
    loadComponent: () => import('./features/comptabilite/comptabilite.component').then(m => m.ComptabiliteComponent)
  },
  {
    path: 'tresorerie',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tresorerie/tresorerie.component').then(m => m.TresorerieComponent)
  },
  {
    path: 'rapports',
    canActivate: [authGuard],
    loadComponent: () => import('./features/rapports/rapports.component').then(m => m.RapportsComponent)
  },
  { path: '**', redirectTo: 'budget' }
];
