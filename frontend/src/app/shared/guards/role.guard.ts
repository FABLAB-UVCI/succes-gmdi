import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../communication/core/services/auth.service';

/**
 * roleGuard — vérifie que l'utilisateur connecté a le rôle requis.
 * Usage dans les routes :
 *   canActivate: [roleGuard('citoyen')]
 *   canActivate: [roleGuard('maire')]
 *   canActivate: [roleGuard('gestionnaire', 'admin')]
 */
export function roleGuard(...roles: string[]): CanActivateFn {
  return (_route: ActivatedRouteSnapshot) => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const user = auth.currentUser();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (roles.includes(user.role)) return true;

    // Redirection vers l'espace correct selon le rôle réel
    router.navigate([user.redirect ?? '/login']);
    return false;
  };
}

/**
 * moduleGuard — vérifie qu'un gestionnaire a accès au module demandé.
 * Usage : canActivate: [moduleGuard('finances')]
 */
export function moduleGuard(module: string): CanActivateFn {
  return () => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) { router.navigate(['/login']); return false; }

    const user = auth.currentUser();
    if (!user) { router.navigate(['/login']); return false; }

    // Maire et admin ont accès à tout
    if (user.role === 'maire' || user.role === 'admin') return true;

    // Citoyen → son portail
    if (user.role === 'citoyen') { router.navigate(['/citoyen']); return false; }

    // Gestionnaire → vérification de son module
    if ((user.allowed_modules ?? []).includes(module)) return true;

    router.navigate(['/accueil']);
    return false;
  };
}
