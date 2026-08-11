import { Routes } from '@angular/router';
import { authGuard } from './communication/core/guards/auth.guard';

/**
 * Routing unifié E-Mairie.
 * - Un seul login (partagé) ; le token (`E-Mairie_token`) est commun à tous les modules.
 * - Chaque module est chargé en lazy sous son préfixe, protégé par authGuard.
 */
export const routes: Routes = [
  { path: '', title: 'E-Mairie — Bienvenue', loadComponent: () => import('./public-landing/public-landing.component').then(m => m.PublicLandingComponent) },

  { path: 'login', title: 'E-Mairie — Connexion', loadComponent: () => import('./communication/pages/login/login.component').then(m => m.LoginComponent) },

  { path: 'accueil', title: 'E-Mairie — Portail', canActivate: [authGuard], loadComponent: () => import('./portal/portal-home.component').then(m => m.PortalHomeComponent) },

  // ── Tableau de bord du Maire ─────────────────────────────────────────────
  { path: 'maire', title: 'E-Mairie — Maire', canActivate: [authGuard], loadComponent: () => import('./maire/maire-dashboard.component').then(m => m.MaireDashboardComponent) },

  // ── Administration (gestion des comptes professionnels) ─────────────────
  { path: 'admin', title: 'E-Mairie — Administration', canActivate: [authGuard], loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },

  // ── Portail Citoyen (sécurisé) ─────────────────────────────────────────
  { 
    path: 'citoyen', 
    title: 'E-Mairie — Espace Citoyen',
    canActivate: [authGuard], 
    loadComponent: () => import('./citoyen/citoyen-layout.component').then(m => m.CitoyenLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./citoyen/citoyen-dashboard.component').then(m => m.CitoyenDashboardComponent) },
      { path: 'demarches', title: 'E-Mairie — Mes Démarches', loadComponent: () => import('./citoyen/citoyen-demarches.component').then(m => m.CitoyenDemarchesComponent) },
      { path: 'profil', title: 'E-Mairie — Mon Profil', loadComponent: () => import('./citoyen/citoyen-profil.component').then(m => m.CitoyenProfilComponent) },
      { path: 'notifications', title: 'E-Mairie — Notifications', loadComponent: () => import('./citoyen/citoyen-notifications.component').then(m => m.CitoyenNotificationsComponent) },
      { path: 'finances/paiements', title: 'E-Mairie — Paiement des taxes', loadComponent: () => import('./citoyen/citoyen-paiements.component').then(m => m.CitoyenPaiementsComponent) },
      { path: 'services-techniques/signalement', title: 'E-Mairie — Signaler un incident', loadComponent: () => import('./citoyen/citoyen-signalement.component').then(m => m.CitoyenSignalementComponent) },
      { path: 'communication', title: 'E-Mairie — Communication', loadComponent: () => import('./citoyen/citoyen-communication.component').then(m => m.CitoyenCommunicationComponent) },
      { path: ':module/demande', title: 'E-Mairie — Nouvelle Demande', loadComponent: () => import('./citoyen/citoyen-demande.component').then(m => m.CitoyenDemandeComponent) }
    ]
  },

  // ── Communication ───────────────────────────────────────────────────────
  { path: 'communication', title: 'E-Mairie — Communication', canActivate: [authGuard], loadComponent: () => import('./communication/modules/communication/pages/shell/communication-shell.component').then(m => m.CommunicationShellComponent) },

  // ── État civil ──────────────────────────────────────────────────────────
  { path: 'etat-civil', title: 'E-Mairie — État Civil', canActivate: [authGuard], loadChildren: () => import('./etat-civil/modules/etat-civil/etat-civil.routes').then(m => m.ETAT_CIVIL_ROUTES) },

  // ── Finances (plusieurs vues) ─────────────────────────────────────────────
  {
    path: 'finances', title: 'E-Mairie — Finances', canActivate: [authGuard],
    loadComponent: () => import('./finances/features/shell/finances-layout.component').then(m => m.FinancesLayoutComponent),
    children: [
      { path: '', redirectTo: 'budget', pathMatch: 'full' },
      { path: 'budget',       title: 'E-Mairie — Finances | Budget', loadComponent: () => import('./finances/features/budget/budget.component').then(m => m.BudgetComponent) },
      { path: 'recettes',     title: 'E-Mairie — Finances | Recettes', loadComponent: () => import('./finances/features/recettes/recettes.component').then(m => m.RecettesComponent) },
      { path: 'depenses',     title: 'E-Mairie — Finances | Dépenses', loadComponent: () => import('./finances/features/depenses/depenses.component').then(m => m.DepensesComponent) },
      { path: 'comptabilite', title: 'E-Mairie — Finances | Comptabilité', loadComponent: () => import('./finances/features/comptabilite/comptabilite.component').then(m => m.ComptabiliteComponent) },
      { path: 'tresorerie',   title: 'E-Mairie — Finances | Trésorerie', loadComponent: () => import('./finances/features/tresorerie/tresorerie.component').then(m => m.TresorerieComponent) },
      { path: 'rapports',     title: 'E-Mairie — Finances | Rapports', loadComponent: () => import('./finances/features/rapports/rapports.component').then(m => m.RapportsComponent) },
      { path: 'demandes',     title: 'E-Mairie — Finances | Demandes Citoyens', loadComponent: () => import('./finances/features/demandes/demandes.component').then(m => m.DemandesComponent) },
      { path: 'demande-rh',   title: 'E-Mairie — Finances | Demande RH', loadComponent: () => import('./finances/features/demande-rh/demande-rh.component').then(m => m.FinancesDemandeRhComponent) },
    ]
  },

  // ── Patrimoine ────────────────────────────────────────────────────────────
  { path: 'patrimoine', title: 'E-Mairie — Patrimoine', canActivate: [authGuard], loadComponent: () => import('./patrimoine/modules/patrimoine/pages/shell/patrimoine-shell.component').then(m => m.PatrimoineShellComponent) },

  // ── Ressources humaines ─────────────────────────────────────────────────
  { path: 'rh', title: 'E-Mairie — Ressources Humaines', canActivate: [authGuard], loadComponent: () => import('./rh/modules/rh/pages/rh-shell/rh-shell.component').then(m => m.RhShellComponent) },

  // ── Services techniques ─────────────────────────────────────────────────
  { path: 'services-techniques', title: 'E-Mairie — Services Techniques', canActivate: [authGuard], loadComponent: () => import('./services-techniques/modules/services-techniques/pages/shell/st-shell.component').then(m => m.StShellComponent) },

  // ── Urbanisme / SIG ─────────────────────────────────────────────────────
  { path: 'urbanisme', title: 'E-Mairie — Urbanisme', canActivate: [authGuard], loadComponent: () => import('./urbanisme/modules/urbanisme/pages/shell/urbanisme-shell.component').then(m => m.UrbanismeShellComponent) },

  { path: 'forgot-password', title: 'E-Mairie — Mot de passe oublié', loadComponent: () => import('./citoyen/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', title: 'E-Mairie — Réinitialiser le mot de passe', loadComponent: () => import('./citoyen/reset-password.component').then(m => m.ResetPasswordComponent) },

  { path: '404', title: 'E-Mairie — Page introuvable', loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent) },
];

