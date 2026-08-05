import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../communication/core/services/auth.service';

@Component({
  selector: 'app-public-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="landing-page">
      <!-- Navbar publique -->
      <nav class="public-nav">
        <div class="brand">
          <i class="ti ti-building-monument emblem"></i>
          <span class="brand-text">E-Mairie</span>
        </div>
        <div class="nav-links">
          <a routerLink="/login" class="pro-link">Accès Professionnel (Agents & Maire)</a>
        </div>
      </nav>

      <main class="main-content">
        <!-- Section Histoire / Présentation -->
        <section class="presentation-section">
          <div class="presentation-card">
            <h1>Bienvenue sur le Portail Citoyen</h1>
            <h2 class="subtitle">Votre mairie, plus proche de vous</h2>
            <div class="history-content">
              <p>
                La plateforme <strong>Gestion Municipale Digitale Intégrée (E-Mairie)</strong> a été conçue pour moderniser et simplifier l'accès aux services de notre commune.
              </p>
              <p>
                Depuis sa création, notre Mairie s'engage à offrir un cadre de vie agréable, sécurisé et prospère. 
                Aujourd'hui, avec E-Mairie, nous franchissons une nouvelle étape : toutes vos démarches administratives (état civil, urbanisme, signalements techniques, paiements) sont désormais accessibles en quelques clics, 24h/24 et 7j/7.
              </p>
              <div class="features-grid">
                <div class="feature">
                  <i class="ti ti-file-description f-ico"></i>
                  <span>Démarches simplifiées</span>
                </div>
                <div class="feature">
                  <i class="ti ti-bolt f-ico"></i>
                  <span>Traitement rapide</span>
                </div>
                <div class="feature">
                  <i class="ti ti-device-mobile f-ico"></i>
                  <span>Suivi en temps réel</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section Auth Citoyen -->
        <section class="auth-section">
          <div class="auth-card">
            <div class="auth-tabs">
              <button [class.active]="isLoginMode()" (click)="isLoginMode.set(true)">Se connecter</button>
              <button [class.active]="!isLoginMode()" (click)="isLoginMode.set(false)">S'inscrire</button>
            </div>

            <!-- Formulaire de Connexion -->
            <form *ngIf="isLoginMode()" [formGroup]="loginForm" (ngSubmit)="onLogin()" class="auth-form">
              <div class="form-group">
                <label>Email</label>
                <input type="email" formControlName="email" placeholder="votre.email@exemple.com">
              </div>
              <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" formControlName="password" placeholder="••••••••">
              </div>
              <div *ngIf="errorMessage()" class="error-msg">{{ errorMessage() }}</div>
              <button type="submit" class="btn-submit" [disabled]="loginForm.invalid || loading()">
                {{ loading() ? 'Connexion...' : 'Se connecter' }}
              </button>
              <div class="forgot-link">
                <a routerLink="/forgot-password">Mot de passe oublié ?</a>
              </div>
            </form>

            <!-- Formulaire d'Inscription -->
            <form *ngIf="!isLoginMode()" [formGroup]="registerForm" (ngSubmit)="onRegister()" class="auth-form">
              <div class="form-group">
                <label>Nom complet</label>
                <input type="text" formControlName="name" placeholder="Jean Dupont">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" formControlName="email" placeholder="votre.email@exemple.com">
              </div>
              <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" formControlName="password" placeholder="••••••••">
              </div>
              <div class="form-group">
                <label>Confirmer le mot de passe</label>
                <input type="password" formControlName="password_confirmation" placeholder="••••••••">
              </div>
              <div *ngIf="errorMessage()" class="error-msg">{{ errorMessage() }}</div>
              <button type="submit" class="btn-submit" [disabled]="registerForm.invalid || loading()">
                {{ loading() ? 'Création en cours...' : 'Créer mon compte' }}
              </button>
            </form>

          </div>
        </section>
      </main>
      
      <footer class="public-footer">
        <p>E-Mairie © 2026 — République de Côte d'Ivoire</p>
      </footer>
    </div>

    <style>
      .landing-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: linear-gradient(135deg, #f0f4f8 0%, #e0e8f0 100%);
        font-family: 'Inter', system-ui, sans-serif;
      }

      .public-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 3rem;
        background: #fff;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      .brand { display: flex; align-items: center; gap: 0.8rem; }
      .emblem { font-size: 2rem; }
      .brand-text { font-weight: 800; font-size: 1.2rem; color: #003366; }
      
      .pro-link {
        font-size: 0.9rem; font-weight: 600; color: #7a8aaa;
        text-decoration: none; padding: 0.5rem 1rem;
        border-radius: 8px; transition: background 0.2s, color 0.2s;
      }
      .pro-link:hover { background: #f0f4f8; color: #003366; }

      .main-content {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 3rem;
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }

      .presentation-section {
        flex: 1;
        min-width: 300px;
      }
      .presentation-card {
        padding: 2rem;
      }
      .presentation-card h1 {
        font-size: 2.5rem; font-weight: 800; color: #003366; margin: 0 0 0.5rem 0;
        line-height: 1.2;
      }
      .subtitle {
        font-size: 1.2rem; color: #F77F00; font-weight: 600; margin-bottom: 2rem;
      }
      .history-content {
        font-size: 1rem; color: #4a5568; line-height: 1.6;
      }
      .history-content p { margin-bottom: 1.5rem; }
      
      .features-grid {
        display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;
      }
      .feature {
        display: flex; align-items: center; gap: 0.5rem;
        background: #fff; padding: 0.75rem 1rem; border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        font-weight: 600; font-size: 0.9rem; color: #003366;
      }
      .f-ico { font-size: 1.2rem; }

      .auth-section {
        flex: 0 1 450px;
        width: 100%;
      }
      .auth-card {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,51,102,0.1);
        overflow: hidden;
      }
      .auth-tabs {
        display: flex;
        background: #f8f9fb;
        border-bottom: 1px solid #e8edf5;
      }
      .auth-tabs button {
        flex: 1; padding: 1.2rem; border: none; background: none;
        font-size: 1rem; font-weight: 700; color: #7a8aaa;
        cursor: pointer; transition: all 0.2s;
      }
      .auth-tabs button:hover { color: #003366; background: #f0f4f8; }
      .auth-tabs button.active {
        color: #F77F00;
        border-bottom: 3px solid #F77F00;
        background: #fff;
      }

      .auth-form { padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: 1.2rem; }
      .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
      .form-group label { font-size: 0.85rem; font-weight: 600; color: #003366; }
      .form-group input {
        padding: 0.8rem 1rem; border: 1px solid #d0d9ec; border-radius: 8px;
        font-size: 0.95rem; font-family: inherit; transition: border-color 0.2s;
      }
      .form-group input:focus { outline: none; border-color: #F77F00; box-shadow: 0 0 0 3px rgba(247,127,0,0.1); }
      
      .btn-submit {
        margin-top: 1rem; padding: 0.9rem; border: none; border-radius: 8px;
        background: linear-gradient(135deg, #F77F00 0%, #e66a00 100%);
        color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(247,127,0,0.3); }
      .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
      
      .error-msg { color: #e63946; font-size: 0.85rem; background: #fff1f2; padding: 0.75rem; border-radius: 8px; text-align: center; }
      .forgot-link { text-align: center; margin-top: 0.8rem; }
      .forgot-link a { color: #F77F00; font-size: 0.83rem; font-weight: 600; text-decoration: none; }
      .forgot-link a:hover { text-decoration: underline; }

      .public-footer {
        text-align: center; padding: 2rem; color: #7a8aaa; font-size: 0.85rem;
      }

      @media (max-width: 768px) {
        .main-content { flex-direction: column; padding: 2rem 1.5rem; }
        .presentation-card { padding: 0; text-align: center; }
        .features-grid { justify-content: center; }
        .public-nav { padding: 1rem 1.5rem; flex-direction: column; gap: 1rem; }
      }
    </style>
  `
})
export class PublicLandingComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoginMode = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password_confirmation: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: any) {
    return g.get('password').value === g.get('password_confirmation').value
      ? null : { mismatch: true };
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => {
        this.loading.set(false);
        const user = this.authService.currentUser();
        if (user?.role === 'citoyen' || user?.roles?.includes('citoyen')) {
          this.router.navigate(['/citoyen']);
        } else {
          this.authService.logout();
          this.errorMessage.set('Veuillez utiliser le lien "Accès Professionnel" en haut pour vous connecter.');
        }
      },
      error: (err: any) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      if (this.registerForm.errors?.['mismatch']) {
        this.errorMessage.set('Les mots de passe ne correspondent pas.');
      }
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');

    const { name, email, password, password_confirmation } = this.registerForm.value;
    this.authService.register({ name, email, password, password_confirmation } as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/citoyen']);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }
}
