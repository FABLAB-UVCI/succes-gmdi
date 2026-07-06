import { Routes } from '@angular/router';
import { RhShellComponent } from './modules/rh/pages/rh-shell/rh-shell.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'rh', component: RhShellComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
