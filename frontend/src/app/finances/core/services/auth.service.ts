import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { User, LoginRequest, LoginResponse } from '../models/auth.models';

const TOKEN_KEY = 'gmdi_token';
const USER_KEY  = 'gmdi_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  private _user  = signal<User | null>(this.lireUser());
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly user      = this._user.asReadonly();
  readonly token     = this._token.asReadonly();
  readonly connecte  = computed(() => !!this._token());
  readonly initiales = computed(() => {
    const u = this._user();
    if (!u) return '??';
    return u.initiales ?? u.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  });

  login(req: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, req).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this._token.set(res.token);
        this._user.set(res.user);
      })
    );
  }

  logout() {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      complete: () => this.effacerSession(),
      error:    () => this.effacerSession()
    });
  }

  private effacerSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private lireUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
