import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'urbanisme', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'urbanisme', canActivate: [authGuard], loadComponent: () => import('./modules/urbanisme/pages/shell/urbanisme-shell.component').then(m => m.UrbanismeShellComponent) },
  { path: '**', redirectTo: 'urbanisme' },
];
