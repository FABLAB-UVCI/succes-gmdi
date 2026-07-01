import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<{ name: string; email: string; role: string } | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('gmdi_user');
    if (stored) this.currentUser.set(JSON.parse(stored));
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(`${API}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('gmdi_token', res.token);
        localStorage.setItem('gmdi_user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  logout() {
    const token = localStorage.getItem('gmdi_token');
    if (token) {
      this.http.post(`${API}/logout`, {}).subscribe();
    }
    localStorage.removeItem('gmdi_token');
    localStorage.removeItem('gmdi_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('gmdi_token');
  }

  getToken(): string | null {
    return localStorage.getItem('gmdi_token');
  }
}
