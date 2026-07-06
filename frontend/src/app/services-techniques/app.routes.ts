import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'services-techniques', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'services-techniques', canActivate: [authGuard], loadComponent: () => import('./modules/services-techniques/pages/shell/st-shell.component').then(m => m.StShellComponent) },
  { path: '**', redirectTo: 'services-techniques' },
];
