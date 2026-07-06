import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
<div class="login-page">

  <!-- Bande tricolore en haut -->
  <div class="tricolore">
    <div class="tc-orange"></div>
    <div class="tc-blanc"></div>
    <div class="tc-vert"></div>
  </div>

  <div class="login-wrap">

    <!-- Panneau gauche — identité institutionnelle -->
    <div class="login-branding">
      <div class="brand-top">
        <div class="brand-logo">
          <i class="ti ti-building-community" aria-hidden="true"></i>
        </div>
        <div class="brand-shield">
          <div class="shield-stripe orange"></div>
          <div class="shield-stripe blanc"></div>
          <div class="shield-stripe vert"></div>
        </div>
      </div>

      <h1 class="brand-title">GMDI</h1>
      <p class="brand-sub">Gestion Municipale Digitale Intégrée</p>
      <p class="brand-country">République de Côte d'Ivoire</p>

      <div class="brand-divider"></div>

      <div class="brand-module">
        <i class="ti ti-users" aria-hidden="true"></i>
        <span>Module Ressources Humaines</span>
      </div>

      <ul class="brand-features">
        <li><i class="ti ti-check" aria-hidden="true"></i> Gestion du personnel</li>
        <li><i class="ti ti-check" aria-hidden="true"></i> Suivi des congés et absences</li>
        <li><i class="ti ti-check" aria-hidden="true"></i> Paie et formations</li>
        <li><i class="ti ti-check" aria-hidden="true"></i> Carrière et recrutements</li>
      </ul>
    </div>

    <!-- Panneau droit — formulaire de connexion -->
    <div class="login-form-panel">
      <div class="form-header">
        <h2>Connexion</h2>
        <p>Accès réservé aux agents autorisés</p>
      </div>

      <form class="lform" (ngSubmit)="onSubmit()">

        <div class="lf-group">
          <label class="lf-label">
            <i class="ti ti-mail" aria-hidden="true"></i>
            Adresse e-mail
          </label>
          <input
            type="email"
            class="lf-input"
            placeholder="vous@mairie.ci"
            [(ngModel)]="email"
            name="email"
            required
            autocomplete="email"
          />
        </div>

        <div class="lf-group">
          <label class="lf-label">
            <i class="ti ti-lock" aria-hidden="true"></i>
            Mot de passe
          </label>
          <div class="lf-pass-wrap">
            <input
              [type]="showPassword() ? 'text' : 'password'"
              class="lf-input"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              required
              autocomplete="current-password"
            />
            <button type="button" class="lf-eye" (click)="showPassword.update(v => !v)" tabindex="-1">
              <i class="ti {{ showPassword() ? 'ti-eye-off' : 'ti-eye' }}" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        @if (error()) {
          <div class="lf-error">
            <i class="ti ti-alert-circle" aria-hidden="true"></i>
            {{ error() }}
          </div>
        }

        <button type="submit" class="lf-submit" [disabled]="loading()">
          @if (loading()) {
            <i class="ti ti-loader-2 spin" aria-hidden="true"></i>
            Vérification en cours…
          } @else {
            <i class="ti ti-login" aria-hidden="true"></i>
            Se connecter
          }
        </button>

      </form>

      <div class="form-footer">
        <div class="ff-badges">
          <span class="badge orange">GMDI v2</span>
          <span class="badge vert">Sécurisé</span>
        </div>
        <p>© 2025 — Mairie de la Commune</p>
      </div>
    </div>

  </div>

  <!-- Bande tricolore en bas -->
  <div class="tricolore bottom">
    <div class="tc-orange"></div>
    <div class="tc-blanc"></div>
    <div class="tc-vert"></div>
  </div>

</div>
  `,
  styles: [`
/* ── Page principale ─────────────────────────────────────────────────── */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a1628;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(0,51,102,0.6) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(0,105,0,0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(247,127,0,0.12) 0%, transparent 50%);
  position: relative;
  overflow: hidden;
}

/* motif de fond subtil */
.login-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 40px,
    rgba(255,255,255,0.012) 40px,
    rgba(255,255,255,0.012) 41px
  );
  pointer-events: none;
}

/* ── Bande tricolore ─────────────────────────────────────────────────── */
.tricolore {
  display: flex;
  height: 5px;
  flex-shrink: 0;
  z-index: 2;
}
.tricolore.bottom { margin-top: auto; }
.tc-orange { flex: 1; background: #F77F00; }
.tc-blanc  { flex: 1; background: #ffffff; }
.tc-vert   { flex: 1; background: #009A44; }

/* ── Conteneur central ───────────────────────────────────────────────── */
.login-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  z-index: 1;
  position: relative;
}

/* ── Panneau branding gauche ─────────────────────────────────────────── */
.login-branding {
  width: 320px;
  color: #fff;
  padding: 2.5rem 2rem 2.5rem 2.5rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: .5rem;
}

.brand-logo {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.08);
  border: 1.5px solid rgba(255,255,255,0.18);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: #C9A84C;
  flex-shrink: 0;
}

/* Mini drapeau vertical CI */
.brand-shield {
  display: flex;
  height: 44px;
  width: 30px;
  border-radius: 4px;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.25);
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}
.shield-stripe { flex: 1; }
.shield-stripe.orange { background: #F77F00; }
.shield-stripe.blanc  { background: #ffffff; }
.shield-stripe.vert   { background: #009A44; }

.brand-title {
  font-size: 36px;
  font-weight: 900;
  letter-spacing: 5px;
  margin: 0;
  color: #fff;
  line-height: 1;
}

.brand-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.65);
  margin: 0;
  line-height: 1.4;
}

.brand-country {
  font-size: 11px;
  font-weight: 700;
  color: #C9A84C;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0;
}

.brand-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(247,127,0,0.6) 0%, rgba(0,154,68,0.4) 50%, transparent 100%);
  margin: .5rem 0;
}

.brand-module {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  background: rgba(247,127,0,0.12);
  border: 1px solid rgba(247,127,0,0.25);
  border-radius: 8px;
  padding: 8px 14px;
}
.brand-module i { font-size: 16px; color: #F77F00; }

.brand-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.brand-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}
.brand-features li i {
  font-size: 13px;
  color: #009A44;
  flex-shrink: 0;
}

/* ── Séparateur vertical ─────────────────────────────────────────────── */
.login-branding::after {
  content: '';
  display: none;
}

/* ── Panneau formulaire droite ───────────────────────────────────────── */
.login-form-panel {
  background: #ffffff;
  border-radius: 20px;
  width: 380px;
  padding: 2rem;
  box-shadow: 0 25px 80px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.08);
  position: relative;
  overflow: hidden;
}

/* Accent tricolore en haut de la card */
.login-form-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #F77F00 33%, #ffffff 33%, #ffffff 66%, #009A44 66%);
}

.form-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-top: .5rem;
}
.form-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #003366;
  margin: 0 0 .3rem;
}
.form-header p {
  font-size: 11.5px;
  color: #9ca3af;
  margin: 0;
}

/* ── Formulaire ──────────────────────────────────────────────────────── */
.lform {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lf-group {
  display: flex;
  flex-direction: column;
  gap: .4rem;
}

.lf-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 5px;
}
.lf-label i { font-size: 13px; color: #003366; }

.lf-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  font-size: 13px;
  font-family: inherit;
  color: #111827;
  outline: none;
  background: #fafafa;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.lf-input:focus {
  border-color: #003366;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,51,102,0.08);
}
.lf-input::placeholder { color: #c4c9d4; }

.lf-pass-wrap {
  position: relative;
}
.lf-pass-wrap .lf-input {
  padding-right: 42px;
}
.lf-eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 15px;
  padding: 0;
  display: flex;
  align-items: center;
  line-height: 1;
}
.lf-eye:hover { color: #6b7280; }

.lf-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 11.5px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.lf-error i { flex-shrink: 0; }

.lf-submit {
  width: 100%;
  padding: 11px;
  background: linear-gradient(135deg, #F77F00 0%, #e06500 100%);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: opacity .15s, transform .1s, box-shadow .15s;
  font-family: inherit;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 15px rgba(247,127,0,0.35);
  margin-top: .25rem;
}
.lf-submit:hover:not(:disabled) {
  opacity: .92;
  box-shadow: 0 6px 20px rgba(247,127,0,0.45);
}
.lf-submit:active:not(:disabled) { transform: scale(0.98); }
.lf-submit:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }

/* ── Footer formulaire ───────────────────────────────────────────────── */
.form-footer {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
}
.ff-badges {
  display: flex;
  gap: 6px;
}
.badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.badge.orange { background: rgba(247,127,0,0.12); color: #c96400; border: 1px solid rgba(247,127,0,0.3); }
.badge.vert   { background: rgba(0,154,68,0.1); color: #006b2e; border: 1px solid rgba(0,154,68,0.25); }

.form-footer p {
  font-size: 10px;
  color: #c4c9d4;
  margin: 0;
}

/* ── Animation loader ────────────────────────────────────────────────── */
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsive ──────────────────────────────────────────────────────── */
@media (max-width: 760px) {
  .login-branding { display: none; }
  .login-form-panel { width: 100%; max-width: 400px; }
}
  `]
})
export class LoginComponent {
  email        = '';
  password     = '';
  error        = signal('');
  loading      = signal(false);
  showPassword = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error.set('Veuillez remplir tous les champs.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/rh']),
      error: (err) => {
        this.loading.set(false);
        if (err.status === 422) {
          this.error.set('Identifiants incorrects. Vérifiez votre e-mail et mot de passe.');
        } else {
          this.error.set('Erreur de connexion. Vérifiez que le serveur est démarré.');
        }
      },
    });
  }
}
