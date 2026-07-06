import { Routes } from '@angular/router';
import { authGuard } from './communication/core/guards/auth.guard';

/**
 * Routing unifié GMDI.
 * - Un seul login (partagé) ; le token (`gmdi_token`) est commun à tous les modules.
 * - Chaque module est chargé en lazy sous son préfixe, protégé par authGuard.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./communication/pages/login/login.component').then(m => m.LoginComponent) },

  { path: 'accueil', canActivate: [authGuard], loadComponent: () => import('./portal/portal-home.component').then(m => m.PortalHomeComponent) },

  // ── Communication ───────────────────────────────────────────────────────
  { path: 'communication', canActivate: [authGuard], loadComponent: () => import('./communication/modules/communication/pages/shell/communication-shell.component').then(m => m.CommunicationShellComponent) },

  // ── État civil ──────────────────────────────────────────────────────────
  { path: 'etat-civil', canActivate: [authGuard], loadChildren: () => import('./etat-civil/modules/etat-civil/etat-civil.routes').then(m => m.ETAT_CIVIL_ROUTES) },

  // ── Finances (plusieurs vues) ─────────────────────────────────────────────
  {
    path: 'finances', canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'budget', pathMatch: 'full' },
      { path: 'budget',       loadComponent: () => import('./finances/features/budget/budget.component').then(m => m.BudgetComponent) },
      { path: 'recettes',     loadComponent: () => import('./finances/features/recettes/recettes.component').then(m => m.RecettesComponent) },
      { path: 'depenses',     loadComponent: () => import('./finances/features/depenses/depenses.component').then(m => m.DepensesComponent) },
      { path: 'comptabilite', loadComponent: () => import('./finances/features/comptabilite/comptabilite.component').then(m => m.ComptabiliteComponent) },
      { path: 'tresorerie',   loadComponent: () => import('./finances/features/tresorerie/tresorerie.component').then(m => m.TresorerieComponent) },
      { path: 'rapports',     loadComponent: () => import('./finances/features/rapports/rapports.component').then(m => m.RapportsComponent) },
    ]
  },

  // ── Patrimoine ────────────────────────────────────────────────────────────
  { path: 'patrimoine', canActivate: [authGuard], loadComponent: () => import('./patrimoine/modules/patrimoine/pages/shell/patrimoine-shell.component').then(m => m.PatrimoineShellComponent) },

  // ── Ressources humaines ─────────────────────────────────────────────────
  { path: 'rh', canActivate: [authGuard], loadComponent: () => import('./rh/modules/rh/pages/rh-shell/rh-shell.component').then(m => m.RhShellComponent) },

  // ── Services techniques ─────────────────────────────────────────────────
  { path: 'services-techniques', canActivate: [authGuard], loadComponent: () => import('./services-techniques/modules/services-techniques/pages/shell/st-shell.component').then(m => m.StShellComponent) },

  // ── Urbanisme / SIG ─────────────────────────────────────────────────────
  { path: 'urbanisme', canActivate: [authGuard], loadComponent: () => import('./urbanisme/modules/urbanisme/pages/shell/urbanisme-shell.component').then(m => m.UrbanismeShellComponent) },

  { path: '**', redirectTo: 'accueil' },
];
