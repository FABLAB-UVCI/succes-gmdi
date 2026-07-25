import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const user = auth.currentUser();
  if (user) {
    const isMaire = user.roles?.includes('maire') || user.role === 'maire';
    const isAdmin = user.roles?.includes('admin') || user.role === 'admin';
    const isCitoyen = user.roles?.includes('citoyen') || user.role === 'citoyen';

    const path = state.url.split('/')[1]; // e.g. 'etat-civil' from '/etat-civil/dossiers'

    // Le citoyen n'a le droit qu'au portail citoyen
    if (isCitoyen && path !== 'citoyen' && path !== 'accueil' && path !== 'login') {
      router.navigate(['/citoyen']);
      return false;
    }

    // Le gestionnaire ne peut accéder qu'aux modules où il a la permission
    if (!isMaire && !isAdmin && !isCitoyen) {
      const allowedPaths = ['accueil', 'login', 'citoyen'];
      if (path && !allowedPaths.includes(path)) {
        if (!user.permissions?.includes(`access.${path}`)) {
          router.navigate(['/accueil']);
          return false;
        }
      }
    }
  }

  return true;
};
