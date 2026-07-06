import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { LoginRequest, LoginResponse, UserApi } from '../models/api.models';

const TOKEN_KEY = 'gmdi_token';
const USER_KEY  = 'gmdi_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private _user  = signal<UserApi | null>(this._loadUser());

  readonly isAuthenticated = computed(() => !!this._token());
  readonly currentUser     = computed(() => this._user());
  readonly token           = computed(() => this._token());

  login(creds: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, creds).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this._token.set(res.token); this._user.set(res.user);
      }),
      catchError(err => throwError(() => new Error(err.error?.message ?? 'Identifiants incorrects')))
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({ complete: () => this._clear(), error: () => this._clear() });
  }

  refreshToken() {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, {}).pipe(
      tap(res => { localStorage.setItem(TOKEN_KEY, res.token); this._token.set(res.token); })
    );
  }

  private _clear(): void {
    localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
    this._token.set(null); this._user.set(null);
    this.router.navigate(['/login']);
  }
  private _loadUser(): UserApi | null {
    try { const r = localStorage.getItem(USER_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
  }
}
