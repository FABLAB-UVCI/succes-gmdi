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
  <div class="login-card">
    <div class="login-flag"><span class="flag-orange"></span><span class="flag-white"></span><span class="flag-green"></span></div>
    <div class="login-header">
      <div class="login-logo"><i class="ti ti-building-community"></i></div>
      <div class="login-title">Plateforme GMDI</div>
      <div class="login-sub">Gestion Municipale Digitale Intégrée — Portail d'accès</div>
    </div>
    <div class="login-body">
      @if (error()) { <div class="login-error"><i class="ti ti-alert-circle"></i>{{ error() }}</div> }
      <div class="fg">
        <div class="fl">Adresse e-mail</div>
        <input class="fi" type="email" [(ngModel)]="email" placeholder="votre@mairie.ci" [disabled]="loading()" (keyup.enter)="login()"/>
      </div>
      <div class="fg" style="margin-top:10px">
        <div class="fl">Mot de passe</div>
        <div style="position:relative">
          <input class="fi" [type]="showPwd()?'text':'password'" [(ngModel)]="password" [disabled]="loading()" (keyup.enter)="login()" style="padding-right:36px"/>
          <button type="button" (click)="showPwd.set(!showPwd())" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#6b7280;padding:0">
            <i class="ti" [class.ti-eye]="!showPwd()" [class.ti-eye-off]="showPwd()"></i>
          </button>
        </div>
      </div>
      <button class="login-btn" [disabled]="loading()" (click)="login()" style="margin-top:18px">
        @if (loading()) { <i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Connexion… }
        @else { <i class="ti ti-login"></i>Se connecter }
      </button>
    </div>
    <div class="login-footer">
      <span>République de Côte d'Ivoire</span><span>·</span><span>GMDI v2.0</span><span>·</span><span>UVCI — FabLab</span>
    </div>
  </div>
</div>
<style>
.login-root {
  min-height:100vh;
  background: linear-gradient(160deg, #F77F00 0%, #ff9a2e 18%, #fff8f0 42%, #e8f7ee 62%, #009A44 100%);
  display:flex;align-items:center;justify-content:center;
  font-family:'Inter',system-ui,sans-serif;padding:1rem;
  position:relative;overflow:hidden;
}
.login-root::before {
  content:'';position:absolute;inset:0;
  background: radial-gradient(ellipse at 20% 50%, rgba(247,127,0,.25) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 50%, rgba(0,154,68,.2) 0%, transparent 55%);
}
.login-card { background:#fff;border-radius:16px;width:100%;max-width:390px;box-shadow:0 24px 64px rgba(0,0,0,.18);overflow:hidden;position:relative;z-index:1; }
.login-flag { display:flex;height:5px; }
.flag-orange { flex:1;background:#F77F00; }
.flag-white  { flex:1;background:#fff; }
.flag-green  { flex:1;background:#009A44; }
.login-header { background:linear-gradient(135deg,#F77F00 0%,#e06a00 50%,#009A44 100%);padding:2rem 1.5rem 1.5rem;text-align:center;position:relative;overflow:hidden; }
.login-header::after { content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#F77F00 33%,#fff 33% 66%,#009A44 66%); }
.login-logo { width:56px;height:56px;background:rgba(255,255,255,.2);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:28px;color:#fff;border:2px solid rgba(255,255,255,.35);box-shadow:0 4px 16px rgba(0,0,0,.15); }
.login-title { color:#fff;font-size:15px;font-weight:700;letter-spacing:.2px; }
.login-sub { color:rgba(255,255,255,.82);font-size:11px;margin-top:4px; }
.login-body { padding:1.6rem; }
.login-error { background:#fce8e8;color:#a32d2d;border:.5px solid #f5c6c6;border-radius:6px;padding:8px 12px;font-size:12px;margin-bottom:12px;display:flex;align-items:center;gap:6px; }
.fg { display:flex;flex-direction:column;gap:4px; }
.fl { font-size:11px;color:#5a3a0a;font-weight:600; }
.fi { height:36px;border:1.5px solid #e0cdb5;border-radius:8px;padding:0 10px;font-size:13px;width:100%;outline:none;transition:all .15s;background:#fffdf8; }
.fi:focus { border-color:#F77F00;box-shadow:0 0 0 3px rgba(247,127,0,.14);background:#fff; }
.fi:disabled { background:#f9fafb;opacity:.7; }
.login-btn { width:100%;height:42px;background:linear-gradient(135deg,#F77F00,#cc6600);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .15s;box-shadow:0 4px 14px rgba(247,127,0,.4);letter-spacing:.2px; }
.login-btn:hover:not(:disabled) { box-shadow:0 6px 20px rgba(247,127,0,.55);transform:translateY(-1px); }
.login-btn:disabled { opacity:.55;cursor:not-allowed;box-shadow:none; }
.login-footer { border-top:.5px solid #e5e7eb;padding:.75rem 1.5rem;display:flex;align-items:center;justify-content:center;gap:6px;font-size:10px;color:#9ca3af; }
@keyframes spin { to { transform:rotate(360deg); } }
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
      next: () => this.router.navigate(['/accueil']),
      error: (err: Error) => { this.error.set(err.message); this.loading.set(false); }
    });
  }
}
