import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'patrimoine', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'patrimoine', canActivate: [authGuard], loadComponent: () => import('./modules/patrimoine/pages/shell/patrimoine-shell.component').then(m => m.PatrimoineShellComponent) },
  { path: '**', redirectTo: 'patrimoine' },
];
