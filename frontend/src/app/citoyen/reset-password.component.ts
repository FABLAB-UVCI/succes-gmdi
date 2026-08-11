import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="flag-top">
        <span class="ft-o"></span><span class="ft-w"></span><span class="ft-v"></span>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="logo">🇨🇮</div>
          <h1>E-Mairie</h1>
          <p class="sub">Réinitialiser mon mot de passe</p>
        </div>

        <div class="card-body">
          @if (!tokenPresent) {
            <div class="alert alert-error">
              <i class="ti ti-alert-circle"></i>
              Ce lien de réinitialisation est invalide ou incomplet. Redemandez un nouveau lien.
            </div>
            <div class="back-link"><a routerLink="/forgot-password">← Redemander un lien</a></div>
          } @else if (!done()) {
            <p class="info-text">
              <i class="ti ti-info-circle"></i>
              Choisissez un nouveau mot de passe pour <strong>{{ email }}</strong> (8 caractères minimum).
            </p>

            <form (ngSubmit)="submit()" #f="ngForm">
              <div class="fg">
                <label class="fl"><i class="ti ti-lock"></i> Nouveau mot de passe</label>
                <input type="password" class="fi" [(ngModel)]="password" name="password" required minlength="8" [disabled]="loading()">
              </div>
              <div class="fg">
                <label class="fl"><i class="ti ti-lock-check"></i> Confirmer le mot de passe</label>
                <input type="password" class="fi" [(ngModel)]="passwordConfirmation" name="password_confirmation" required [disabled]="loading()">
              </div>

              @if (error()) {
                <div class="alert alert-error"><i class="ti ti-alert-circle"></i> {{ error() }}</div>
              }

              <button type="submit" class="btn-submit" [disabled]="loading() || !password || !passwordConfirmation">
                @if (loading()) {
                  <i class="ti ti-loader-2 spin"></i> Réinitialisation...
                } @else {
                  <i class="ti ti-check"></i> Réinitialiser mon mot de passe
                }
              </button>
            </form>
          } @else {
            <div class="success-box">
              <div class="success-ico">✅</div>
              <h3>Mot de passe réinitialisé !</h3>
              <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
              <button class="btn-submit" (click)="router.navigate(['/login'])">
                <i class="ti ti-login"></i> Se connecter
              </button>
            </div>
          }

          @if (tokenPresent && !done()) {
            <div class="back-link"><a routerLink="/">← Retour à l'accueil</a></div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #FFF8EE 0%, #fff 60%, #f0fdf4 100%);
      padding: 2rem 1rem;
    }
    .flag-top { display: flex; width: 100%; height: 5px; position: fixed; top: 0; left: 0; }
    .ft-o { flex: 1; background: #F77F00; }
    .ft-w { flex: 1; background: #fff; border-top: 1px solid #e2e8f0; }
    .ft-v { flex: 1; background: #009A44; }

    .card { width: 100%; max-width: 440px; background: #fff; border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.1); overflow: hidden; }
    .card-header { background: linear-gradient(135deg, #F77F00 0%, #cc6600 45%, #009A44 100%); text-align: center; padding: 2rem 1.5rem; }
    .logo { font-size: 2.8rem; margin-bottom: 0.4rem; }
    .card-header h1 { color: #fff; font-size: 1.8rem; font-weight: 900; margin: 0; text-shadow: 0 2px 6px rgba(0,0,0,0.2); }
    .sub { color: rgba(255,255,255,0.85); font-size: 0.9rem; margin: 0.3rem 0 0; }

    .card-body { padding: 2rem 1.8rem; }

    .info-text { background: #fffbf0; border-left: 4px solid #F77F00; border-radius: 8px; padding: 0.9rem 1rem; color: #7a5c3a; font-size: 0.87rem; line-height: 1.5; margin-bottom: 1.5rem; display: flex; align-items: flex-start; gap: 0.5rem; }

    .fg { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1.2rem; }
    .fl { font-size: .85rem; font-weight: 700; color: #334155; display: flex; align-items: center; gap: .4rem; }
    .fi { padding: .8rem 1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: .95rem; font-family: inherit; outline: none; transition: border-color .2s, box-shadow .2s; width: 100%; box-sizing: border-box; }
    .fi:focus { border-color: #F77F00; box-shadow: 0 0 0 3px rgba(247,127,0,.12); }
    .fi:disabled { background: #f8fafc; cursor: not-allowed; }

    .alert { display: flex; align-items: center; gap: .5rem; padding: .75rem 1rem; border-radius: 8px; font-size: .85rem; margin-bottom: 1rem; }
    .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

    .btn-submit { width: 100%; padding: .9rem; border: none; border-radius: 10px; background: linear-gradient(135deg, #F77F00, #cc6600); color: #fff; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .5rem; transition: all .2s; box-shadow: 0 4px 15px rgba(247,127,0,.35); margin-top: .5rem; }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(247,127,0,.5); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { display: inline-block; animation: spin 1s linear infinite; }

    .success-box { text-align: center; padding: 1rem 0; }
    .success-ico { font-size: 3rem; margin-bottom: 1rem; }
    .success-box h3 { color: #009A44; font-size: 1.3rem; font-weight: 800; margin: 0 0 .8rem; }
    .success-box p { color: #475569; font-size: .9rem; line-height: 1.5; margin: 0 0 1.2rem; }

    .back-link { text-align: center; margin-top: 1.5rem; }
    .back-link a { color: #F77F00; font-size: .85rem; font-weight: 600; text-decoration: none; }
    .back-link a:hover { text-decoration: underline; }
  `]
})
export class ResetPasswordComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  token = '';
  email = '';
  tokenPresent = false;

  password = '';
  passwordConfirmation = '';
  loading = signal(false);
  done = signal(false);
  error = signal('');

  constructor() {
    const qp = this.route.snapshot.queryParamMap;
    this.token = qp.get('token') ?? '';
    this.email = qp.get('email') ?? '';
    this.tokenPresent = !!this.token && !!this.email;
  }

  submit() {
    if (this.password.length < 8) {
      this.error.set('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (this.password !== this.passwordConfirmation) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.http.post<any>(`${environment.apiUrl}/auth/reset-password`, {
      email: this.email,
      token: this.token,
      password: this.password,
      password_confirmation: this.passwordConfirmation,
    }).subscribe({
      next: () => { this.loading.set(false); this.done.set(true); },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Une erreur est survenue. Réessayez.');
      }
    });
  }
}
