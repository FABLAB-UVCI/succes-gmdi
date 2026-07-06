import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { LoadingService } from '../services/loading.service';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  if (req.url.includes('/auth/login')) return next(req);
  const token = auth.token();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        if (isRefreshing) return refreshSubject.pipe(filter(t => t !== null), take(1),
          switchMap(t => next(req.clone({ setHeaders: { Authorization: `Bearer ${t!}` } }))));
        isRefreshing = true; refreshSubject.next(null);
        return auth.refreshToken().pipe(
          switchMap(res => { isRefreshing = false; refreshSubject.next(res.token); return next(req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } })); }),
          catchError(e => { isRefreshing = false; auth.logout(); return throwError(() => e); })
        );
      }
      return throwError(() => err);
    })
  );
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 422) {
        const e = err.error?.errors as Record<string, string[]> | undefined;
        toast.showError('Validation', e ? (Object.values(e)[0]?.[0] ?? 'Erreur') : 'Erreur');
      } else if (err.status === 403) toast.showError('Accès refusé', 'Droits insuffisants.');
      else if (err.status === 404) toast.showError('Introuvable', err.error?.message ?? 'Ressource introuvable.');
      else if (err.status >= 500) toast.showError('Erreur serveur', 'Erreur interne, réessayez.');
      else if (err.status === 0)  toast.showError('Connexion', 'Serveur inaccessible.');
      return throwError(() => err);
    })
  );
};

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.increment();
  return next(req).pipe(finalize(() => loading.decrement()));
};
