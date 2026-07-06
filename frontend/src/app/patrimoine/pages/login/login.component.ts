import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <!-- Logo / Icon -->
        <div class="login-icon">
          <div class="av-lg">GMDI</div>
        </div>
        
        <!-- Title -->
        <div class="login-title">
          <h2>Module Patrimoine</h2>
          <p>Gestion du patrimoine municipal</p>
        </div>

        <!-- Error message -->
        @if (errMsg()) {
          <div class="alert-error">
            <i class="ti ti-alert-circle"></i>
            <span>{{ errMsg() }}</span>
          </div>
        }

        <!-- Form -->
        <div class="login-form">
          <div class="fg">
            <div class="fl">Adresse email</div>
            <input type="email" class="fi" [(ngModel)]="email" placeholder="agent@mairie.ci" (keyup.enter)="submit()">
          </div>
          
          <div class="fg">
            <div class="fl">Mot de passe</div>
            <input type="password" class="fi" [(ngModel)]="password" placeholder="••••••••" (keyup.enter)="submit()">
          </div>

          <button class="btn-login" [disabled]="loading.isLoading()" (click)="submit()">
            @if (loading.isLoading()) {
              <i class="ti ti-loader-2 spin"></i>
              <span>Connexion en cours...</span>
            } @else {
              <i class="ti ti-login"></i>
              <span>Se connecter</span>
            }
          </button>
        </div>

        <!-- Footer -->
        <div class="login-footer">
          <span>République de Côte d'Ivoire</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        linear-gradient(160deg, #D96B00 0%, #F77F00 35%, #006B30 100%);
      font-family: 'Ubuntu', 'Segoe UI', system-ui, sans-serif;
      position: relative;
      overflow: hidden;
    }
    .login-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(90deg, transparent 0px, transparent 30px, rgba(255,255,255,.04) 30px, rgba(255,255,255,.04) 31px),
        repeating-linear-gradient(0deg, transparent 0px, transparent 30px, rgba(255,255,255,.04) 30px, rgba(255,255,255,.04) 31px);
      pointer-events: none;
    }
    .login-container::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 5px;
      background: linear-gradient(90deg, #F77F00 33.33%, #fff 33.33%, #fff 66.66%, #009A44 66.66%);
    }

    .login-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      width: 380px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-top: 4px solid #F77F00;
      transition: transform 0.2s ease;
      position: relative;
      z-index: 1;
    }

    .login-card:hover {
      transform: translateY(-2px);
    }

    /* Logo / Icon */
    .login-icon {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .av-lg {
      width: 70px;
      height: 70px;
      margin: 0 auto;
      border-radius: 50%;
      background: linear-gradient(135deg, #F77F00, #009A44);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      color: white;
      box-shadow: 0 4px 15px rgba(247,127,0,0.3);
    }

    /* Title */
    .login-title {
      text-align: center;
      margin-bottom: 1.8rem;
    }

    .login-title h2 {
      color: #004D20;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 5px 0;
    }

    .login-title p {
      color: #6c757d;
      font-size: 12px;
      margin: 0;
    }

    /* Alert error */
    .alert-error {
      background: #FCEBEB;
      color: #A32D2D;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 1.2rem;
      border-left: 3px solid #A32D2D;
    }

    .alert-error i {
      font-size: 16px;
    }

    /* Form */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .fg {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .fl {
      font-size: 12px;
      font-weight: 600;
      color: #004D20;
    }

    .fi {
      height: 42px;
      border: 1px solid #dee2e6;
      border-radius: 10px;
      padding: 0 14px;
      font-size: 13px;
      background: white;
      transition: all 0.2s ease;
    }

    .fi:focus {
      outline: none;
      border-color: #F77F00;
      box-shadow: 0 0 0 3px rgba(247,127,0,0.1);
    }

    /* Login button */
    .btn-login {
      background: linear-gradient(135deg, #F77F00, #e06d00);
      border: none;
      color: white;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 0.5rem;
      transition: all 0.25s ease;
      box-shadow: 0 2px 6px rgba(247,127,0,0.3);
    }

    .btn-login:hover:not(:disabled) {
      background: linear-gradient(135deg, #e06d00, #c96200);
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(247,127,0,0.35);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Footer */
    .login-footer {
      text-align: center;
      margin-top: 1.8rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
      font-size: 11px;
      color: #6c757d;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Spin animation */
    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 480px) {
      .login-card {
        width: 90%;
        padding: 1.5rem;
      }
      
      .login-title h2 {
        font-size: 18px;
      }
    }
  `]
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  readonly loading = inject(LoadingService);

  email = '';
  password = '';
  errMsg = signal('');

  submit(): void {
    this.errMsg.set('');
    if (!this.email || !this.password) {
      this.errMsg.set('Veuillez remplir tous les champs.');
      return;
    }
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/patrimoine']),
      error: (err: Error) => this.errMsg.set(err.message),
    });
  }
}