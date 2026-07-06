import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-bg">
      <div class="login-card">

        <div class="login-logo">
          <div class="logo-flag">
            <span></span><span></span><span></span>
          </div>
          <div>
            <div class="login-title"><span>GMDI</span> Finances</div>
            <div class="login-sub">République de Côte d'Ivoire · Gestion Municipale</div>
          </div>
        </div>

        <h2 class="login-h2">Connexion</h2>

        @if (erreur()) {
          <div class="login-err"><i class="ti ti-alert-circle"></i> {{ erreur() }}</div>
        }

        <form (ngSubmit)="connexion()" #f="ngForm">
          <div class="field">
            <label>Adresse e-mail</label>
            <input
              type="email" name="email" [(ngModel)]="email"
              placeholder="nom@gmdi.ci" required autocomplete="username"
              [disabled]="chargement()"
            />
          </div>
          <div class="field">
            <label>Mot de passe</label>
            <input
              type="password" name="password" [(ngModel)]="password"
              placeholder="••••••••" required autocomplete="current-password"
              [disabled]="chargement()"
            />
          </div>
          <button class="btn-login" type="submit" [disabled]="chargement() || !email || !password">
            @if (chargement()) {
              <span class="spin"></span> Connexion…
            } @else {
              <i class="ti ti-login"></i> Se connecter
            }
          </button>
        </form>

        <div class="login-hint">
          <i class="ti ti-info-circle"></i>
          Contactez l'administrateur si vous n'avez pas de compte.
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* fond avec les 3 bandes du drapeau CI */
    .login-bg {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        linear-gradient(90deg,
          rgba(247,127,0,.92) 0%   33.3%,
          rgba(255,255,255,.92) 33.3% 66.6%,
          rgba(0,154,68,.92)   66.6% 100%
        ),
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      padding: 1rem;
    }

    .login-card {
      background: #fff;
      border-radius: 18px;
      padding: 2.5rem 2.2rem;
      width: 100%; max-width: 420px;
      box-shadow: 0 24px 80px rgba(0,0,0,.28);
      border-top: 5px solid #F77F00;
      position: relative;
      overflow: hidden;
    }

    /* bande verte en bas de la card */
    .login-card::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 5px;
      background: #009A44;
    }

    .login-logo {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #f0fdf4;
    }

    .logo-flag {
      display: flex; flex-direction: column;
      width: 12px; height: 44px;
      border-radius: 3px; overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,.2);
      flex-shrink: 0;
    }
    .logo-flag span { flex: 1; }
    .logo-flag span:nth-child(1) { background: #F77F00; }
    .logo-flag span:nth-child(2) { background: #fff; border-top: .5px solid #e5e7eb; border-bottom: .5px solid #e5e7eb; }
    .logo-flag span:nth-child(3) { background: #009A44; }

    .login-title   { font-size: 24px; font-weight: 900; color: #006B2B; letter-spacing: -.5px; }
    .login-title span { color: #F77F00; }
    .login-sub     { font-size: 11px; color: #6b7280; font-weight: 500; margin-top: 1px; }

    .login-h2 { font-size: 17px; font-weight: 700; color: #1a2e20; margin-bottom: 1.4rem; }

    .login-err {
      background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626;
      border-radius: 8px; padding: 10px 14px; margin-bottom: 1rem;
      font-size: 13px; display: flex; align-items: center; gap: 6px;
    }

    .field { margin-bottom: 1.1rem; }
    .field label {
      display: block; font-size: 12px; font-weight: 700;
      color: #006B2B; margin-bottom: 5px; text-transform: uppercase; letter-spacing: .4px;
    }
    .field input {
      width: 100%; padding: 11px 14px;
      border: 1.5px solid #D9EDDF; border-radius: 9px;
      font-size: 14px; outline: none; transition: border .2s, box-shadow .2s;
      box-sizing: border-box; background: #F5FAF7;
    }
    .field input:focus {
      border-color: #F77F00;
      box-shadow: 0 0 0 3px rgba(247,127,0,.12);
      background: #fff;
    }
    .field input:disabled { background: #f3f4f6; cursor: not-allowed; }

    .btn-login {
      width: 100%; padding: 13px; border: none; border-radius: 9px; cursor: pointer;
      background: linear-gradient(135deg, #F77F00, #D46C00);
      color: #fff; font-size: 15px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: all .25s; margin-top: .75rem;
      box-shadow: 0 4px 14px rgba(247,127,0,.35);
    }
    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(247,127,0,.45);
    }
    .btn-login:disabled { opacity: .6; cursor: not-allowed; }

    .spin {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,.4);
      border-top-color: #fff; border-radius: 50%;
      animation: spin .7s linear infinite; display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .login-hint {
      margin-top: 1.5rem; font-size: 12px; color: #9ca3af;
      text-align: center; display: flex; align-items: center;
      justify-content: center; gap: 5px;
    }
  `]
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  email      = '';
  password   = '';
  chargement = signal(false);
  erreur     = signal('');

  connexion() {
    if (!this.email || !this.password) return;
    this.chargement.set(true);
    this.erreur.set('');

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/budget']),
      error: err => {
        this.chargement.set(false);
        if (err.status === 401 || err.status === 422) {
          this.erreur.set('Email ou mot de passe incorrect.');
        } else {
          this.erreur.set('Erreur de connexion. Vérifiez votre réseau.');
        }
      }
    });
  }
}
