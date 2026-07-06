import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="login-root">

  <!-- Bande du drapeau ivoirien en haut -->
  <div class="drapeau">
    <div class="d-orange"></div>
    <div class="d-blanc"></div>
    <div class="d-vert"></div>
  </div>

  <!-- Fond décoratif -->
  <div class="bg-pattern"></div>

  <div class="login-wrap">

    <!-- Logo République -->
    <div class="republique">
      <div class="rep-logo">🇨🇮</div>
      <div class="rep-text">
        <div class="rep-titre">République de Côte d'Ivoire</div>
        <div class="rep-sous">Union · Discipline · Travail</div>
      </div>
    </div>

    <div class="login-card">

      <!-- En-tête avec couleurs ivoiriennes -->
      <div class="login-header">
        <div class="header-accent"></div>
        <div class="login-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.15)"/>
            <path d="M16 4C10.477 4 6 8.477 6 14c0 3.866 2.1 7.24 5.2 9.04L16 28l4.8-4.96C23.9 21.24 26 17.866 26 14c0-5.523-4.477-10-10-10z" fill="white" fill-opacity="0.9"/>
            <circle cx="16" cy="14" r="3" fill="#F77F00"/>
          </svg>
        </div>
        <div class="login-title">GMDI — Urbanisme & SIG</div>
        <div class="login-sub">Direction de l'Urbanisme et du Cadastre</div>
        <div class="login-divider">
          <span class="div-orange"></span>
          <span class="div-blanc"></span>
          <span class="div-vert"></span>
        </div>
      </div>

      <div class="login-body">
        @if (error()) {
          <div class="login-error">
            <span class="err-icon">⚠</span>{{ error() }}
          </div>
        }

        <div class="fg">
          <label class="fl">Adresse e-mail</label>
          <div class="fi-wrap">
            <span class="fi-icon">✉</span>
            <input class="fi" type="email" [(ngModel)]="email"
              placeholder="votre@mairie.ci" [disabled]="loading()"
              (keyup.enter)="login()"/>
          </div>
        </div>

        <div class="fg">
          <label class="fl">Mot de passe</label>
          <div class="fi-wrap">
            <span class="fi-icon">🔒</span>
            <input class="fi" [type]="showPwd()?'text':'password'"
              [(ngModel)]="password" [disabled]="loading()"
              (keyup.enter)="login()" style="padding-right:40px"/>
            <button type="button" class="eye-btn" (click)="showPwd.set(!showPwd())">
              {{ showPwd() ? '🙈' : '👁' }}
            </button>
          </div>
        </div>

        <button class="login-btn" [disabled]="loading()" (click)="login()">
          @if (loading()) {
            <span class="spinner"></span>Connexion en cours…
          } @else {
            <span>→</span> Se connecter
          }
        </button>

        <!-- Aide rapide -->
        <div class="aide">
          <details>
            <summary>Comptes de démonstration</summary>
            <div class="aide-body">
              <div class="aide-row"><b>urb&#64;mairie.ci</b><span>Urbanisme@2025!</span></div>
              <div class="aide-row"><b>admin&#64;mairie.ci</b><span>Admin@2025!</span></div>
            </div>
          </details>
        </div>
      </div>

      <div class="login-footer">
        <span>© 2025 GMDI v2.0</span>
        <span class="sep">·</span>
        <span>UVCI — FabLab</span>
        <span class="sep">·</span>
        <span>Côte d'Ivoire</span>
      </div>
    </div>

  </div>
</div>

<style>
/* ── Reset & base ─────────────────────────────────────────────────────────── */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Root ────────────────────────────────────────────────────────────────── */
.login-root {
  min-height: 100vh;
  background: linear-gradient(160deg, #1a3a1f 0%, #0d2414 40%, #1c2b10 70%, #2a1f0a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', system-ui, sans-serif;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

/* ── Drapeau CI en haut ───────────────────────────────────────────────────── */
.drapeau {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 6px;
  display: flex;
  z-index: 100;
}
.d-orange { flex: 1; background: #F77F00; }
.d-blanc  { flex: 1; background: #FFFFFF; }
.d-vert   { flex: 1; background: #009A44; }

/* ── Motif de fond (tissu africain stylisé) ──────────────────────────────── */
.bg-pattern {
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(247,127,0,.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0,154,68,.10) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255,255,255,.03) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Wrap centré ────────────────────────────────────────────────────────── */
.login-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 420px;
  z-index: 1;
}

/* ── Bloc République ────────────────────────────────────────────────────── */
.republique {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 10px;
  padding: 10px 16px;
  width: 100%;
}
.rep-logo { font-size: 28px; line-height: 1; }
.rep-titre { color: #fff; font-size: 13px; font-weight: 600; letter-spacing: .3px; }
.rep-sous  { color: rgba(255,255,255,.5); font-size: 10px; margin-top: 2px; letter-spacing: 1px; text-transform: uppercase; }

/* ── Carte de connexion ──────────────────────────────────────────────────── */
.login-card {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 24px 64px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.08);
  overflow: hidden;
}

/* ── Header ─────────────────────────────────────────────────────────────── */
.login-header {
  background: linear-gradient(135deg, #1a5c28 0%, #009A44 60%, #00b84e 100%);
  padding: 1.75rem 1.5rem 1.5rem;
  text-align: center;
  position: relative;
}
.header-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #F77F00, #FFCD00, #009A44);
}
.login-logo {
  width: 56px; height: 56px;
  background: rgba(255,255,255,.15);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 14px;
  border: 2px solid rgba(255,255,255,.25);
}
.login-title {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: .2px;
}
.login-sub {
  color: rgba(255,255,255,.75);
  font-size: 11px;
  margin-top: 4px;
  letter-spacing: .3px;
}
.login-divider {
  display: flex;
  justify-content: center;
  gap: 3px;
  margin-top: 14px;
}
.div-orange { display:inline-block; width:32px; height:3px; border-radius:2px; background:#F77F00; }
.div-blanc  { display:inline-block; width:32px; height:3px; border-radius:2px; background:rgba(255,255,255,.7); }
.div-vert   { display:inline-block; width:32px; height:3px; border-radius:2px; background:#FFCD00; }

/* ── Body ───────────────────────────────────────────────────────────────── */
.login-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Erreur ──────────────────────────────────────────────────────────────── */
.login-error {
  background: #fff5f5;
  color: #c0392b;
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.err-icon { font-size: 14px; }

/* ── Champs ──────────────────────────────────────────────────────────────── */
.fg { display: flex; flex-direction: column; gap: 6px; }
.fl {
  font-size: 12px;
  color: #374151;
  font-weight: 600;
  letter-spacing: .2px;
}
.fi-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.fi-icon {
  position: absolute;
  left: 11px;
  font-size: 14px;
  color: #9ca3af;
  pointer-events: none;
}
.fi {
  width: 100%;
  height: 42px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  padding: 0 40px 0 36px;
  font-size: 13.5px;
  color: #111827;
  outline: none;
  transition: all .2s;
  background: #fafafa;
}
.fi:focus {
  border-color: #009A44;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,154,68,.12);
}
.fi:disabled { background: #f3f4f6; opacity: .7; }
.eye-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  padding: 0;
  line-height: 1;
  opacity: .6;
}
.eye-btn:hover { opacity: 1; }

/* ── Bouton connexion ────────────────────────────────────────────────────── */
.login-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #1a5c28, #009A44);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all .2s;
  letter-spacing: .3px;
  margin-top: 4px;
  box-shadow: 0 4px 14px rgba(0,154,68,.35);
}
.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0,154,68,.45);
}
.login-btn:active:not(:disabled) { transform: translateY(0); }
.login-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }

/* ── Spinner ─────────────────────────────────────────────────────────────── */
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

/* ── Aide démo ───────────────────────────────────────────────────────────── */
.aide details { font-size: 11.5px; color: #6b7280; }
.aide summary {
  cursor: pointer;
  color: #009A44;
  font-weight: 500;
  list-style: none;
  text-align: center;
}
.aide summary::-webkit-details-marker { display: none; }
.aide-body {
  margin-top: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.aide-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11.5px;
}
.aide-row b { color: #166534; }
.aide-row span {
  background: #fff;
  border: 1px solid #d1fae5;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  color: #065f46;
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
.login-footer {
  border-top: 1px solid #f3f4f6;
  padding: .75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 10.5px;
  color: #9ca3af;
}
.sep { opacity: .5; }

/* ── Animation ───────────────────────────────────────────────────────────── */
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .login-root { padding: .75rem; }
  .login-header { padding: 1.5rem 1.25rem 1.25rem; }
  .login-body { padding: 1.25rem; }
  .republique { padding: 8px 12px; }
  .rep-logo { font-size: 22px; }
}
</style>
  `
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  email    = '';
  password = '';
  loading  = signal(false);
  error    = signal('');
  showPwd  = signal(false);

  login(): void {
    if (!this.email || !this.password) { this.error.set('Veuillez renseigner vos identifiants.'); return; }
    this.loading.set(true); this.error.set('');
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/urbanisme']),
      error: (err: Error) => { this.error.set(err.message); this.loading.set(false); }
    });
  }
}
