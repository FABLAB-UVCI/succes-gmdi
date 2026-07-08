import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'gmdi_token';
  private readonly USER_KEY  = 'gmdi_user';

  private _token  = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private _user   = signal<AuthUser | null>(this._loadUser());

  readonly isAuthenticated = computed(() => !!this._token());
  readonly currentUser     = this._user.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: AuthUser }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this._token.set(res.token);
        this._user.set(res.user);
      })
    );
  }

  logout() {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      complete: () => this._clear(),
      error: () => this._clear(),
    });
  }

  getToken(): string | null {
    return this._token();
  }

  /** Reste connecte, revient juste au selecteur de modules. */
  backToModules(): void {
    this.router.navigate(['/accueil']);
  }

  private _clear() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private _loadUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
}
