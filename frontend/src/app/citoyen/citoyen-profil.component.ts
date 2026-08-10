import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../communication/core/services/auth.service';
import { ToastService } from '../communication/core/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-citoyen-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dash">

      <!-- Bandeau tricolore ivoirien -->
      <div class="ivoire-banner">
        <div class="band orange-band"></div>
        <div class="band white-band"></div>
        <div class="band green-band"></div>
      </div>

      <!-- Hero profil -->
      <div class="hero-profil">
        <div class="avatar-large">{{ initial }}</div>
        <div class="hero-info">
          <h1 class="hero-name">{{ user?.name }}</h1>
          <span class="hero-badge"><i class="ti ti-flag"></i> Citoyen — République de Côte d'Ivoire</span>
        </div>
      </div>

      <!-- Formulaire Informations -->
      <section class="section orange-top">
        <div class="section-head">
          <h2 class="section-title"><i class="ti ti-user-circle"></i> Informations Personnelles</h2>
          <div class="divider-flag">
            <span class="df-o"></span><span class="df-w"></span><span class="df-g"></span>
          </div>
        </div>
        <div class="form-grid">
          <div class="fg">
            <div class="fl"><i class="ti ti-user"></i> Nom complet</div>
            <input type="text" class="fi" [value]="user?.name ?? ''" disabled>
          </div>
          <div class="fg">
            <div class="fl"><i class="ti ti-mail"></i> Adresse Email</div>
            <input type="email" class="fi" [value]="user?.email ?? ''" disabled>
          </div>
          <div class="fg">
            <div class="fl"><i class="ti ti-phone"></i> Téléphone</div>
            <input type="text" class="fi" [(ngModel)]="profil.telephone" placeholder="Ex: +225 01 02 03 04">
          </div>
          <div class="fg">
            <div class="fl"><i class="ti ti-map-pin"></i> Commune de résidence</div>
            <input type="text" class="fi" [(ngModel)]="profil.commune" placeholder="Ex: Cocody, Yopougon…">
          </div>
          <div class="fg">
            <div class="fl"><i class="ti ti-id-badge"></i> Numéro CNI</div>
            <input type="text" class="fi" [(ngModel)]="profil.numero_cni" placeholder="Ex: CI0000000000">
          </div>
          <div class="fg">
            <div class="fl"><i class="ti ti-calendar"></i> Date de naissance</div>
            <input type="date" class="fi" [(ngModel)]="profil.date_naissance">
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-save orange-btn" [disabled]="savingProfil" (click)="save()">
            <i class="ti ti-device-floppy"></i> {{ savingProfil ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </div>
      </section>

      <!-- Section sécurité -->
      <section class="section green-top">
        <div class="section-head">
          <h2 class="section-title"><i class="ti ti-shield-lock"></i> Sécurité du compte</h2>
          <div class="divider-flag">
            <span class="df-g"></span><span class="df-w"></span><span class="df-o"></span>
          </div>
        </div>
        <div class="form-grid">
          <div class="fg">
            <div class="fl"><i class="ti ti-lock"></i> Mot de passe actuel</div>
            <input type="password" class="fi" [(ngModel)]="pwd.current" placeholder="Votre mot de passe actuel">
          </div>
          <div class="fg"></div>
          <div class="fg">
            <div class="fl"><i class="ti ti-lock"></i> Nouveau mot de passe</div>
            <input type="password" class="fi" [(ngModel)]="pwd.next" placeholder="8 caractères minimum">
          </div>
          <div class="fg">
            <div class="fl"><i class="ti ti-lock-check"></i> Confirmer le mot de passe</div>
            <input type="password" class="fi" [(ngModel)]="pwd.confirm" placeholder="Confirmer le nouveau mot de passe">
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-save green-btn" [disabled]="changingPwd" (click)="changePassword()">
            <i class="ti ti-key"></i> {{ changingPwd ? 'Modification...' : 'Changer le mot de passe' }}
          </button>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .dash { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }

    .ivoire-banner { display: flex; height: 8px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .band { flex: 1; }
    .orange-band { background: #F77F00; }
    .white-band { background: #e8edf5; }
    .green-band { background: #009A44; }

    .hero-profil {
      display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
      background: linear-gradient(135deg, #F77F00 0%, #FF9A00 45%, #009A44 100%);
      border-radius: 16px; padding: 2rem 2.5rem;
      box-shadow: 0 8px 30px rgba(247,127,0,.3);
    }
    .avatar-large {
      width: 90px; height: 90px; border-radius: 50%;
      background: rgba(255,255,255,0.25); border: 3px solid rgba(255,255,255,0.7);
      color: #fff; font-size: 2.5rem; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .hero-name { color: #fff; font-size: 1.8rem; font-weight: 900; margin: 0 0 .5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .hero-badge {
      display: inline-flex; align-items: center; gap: .4rem;
      background: rgba(255,255,255,0.22); color: #fff;
      padding: .3rem .9rem; border-radius: 20px;
      font-size: .82rem; font-weight: 700; letter-spacing: .5px;
    }

    .section { background: #fff; border-radius: 14px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
    .orange-top { border-top: 4px solid #F77F00; }
    .green-top { border-top: 4px solid #009A44; }
    .section-head { margin-bottom: 1.5rem; }
    .section-title { font-size: 1.1rem; font-weight: 800; color: #003366; margin: 0 0 .6rem; display: flex; align-items: center; gap: 0.5rem; }

    .divider-flag { display: flex; height: 3px; border-radius: 3px; overflow: hidden; width: 80px; }
    .df-o { flex: 1; background: #F77F00; }
    .df-w { flex: 1; background: #e2e8f0; }
    .df-g { flex: 1; background: #009A44; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    .fg { display: flex; flex-direction: column; gap: .4rem; }
    .fl { font-size: .85rem; font-weight: 700; color: #334155; display: flex; align-items: center; gap: .4rem; }
    .fi {
      padding: .75rem 1rem; border: 2px solid #e2e8f0; border-radius: 8px;
      font-family: inherit; font-size: .95rem; background: #fafbfc; outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .fi:focus { border-color: #F77F00; box-shadow: 0 0 0 3px rgba(247,127,0,.12); }
    .fi:disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }

    .form-actions { margin-top: 1.8rem; display: flex; justify-content: flex-end; }
    .btn-save {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: .8rem 1.8rem; border: none; border-radius: 10px;
      font-weight: 800; font-size: .95rem; cursor: pointer;
      transition: all .2s; color: #fff;
    }
    .btn-save:disabled { opacity: .6; cursor: not-allowed; transform: none !important; }
    .orange-btn { background: linear-gradient(135deg, #F77F00, #FF9A00); box-shadow: 0 4px 15px rgba(247,127,0,.35); }
    .orange-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(247,127,0,.5); }
    .green-btn { background: linear-gradient(135deg, #009A44, #00bf57); box-shadow: 0 4px 15px rgba(0,154,68,.35); }
    .green-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,154,68,.5); }

    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
      .hero-profil { justify-content: center; text-align: center; }
    }
  `]
})
export class CitoyenProfilComponent {
  readonly auth = inject(AuthService);
  private toast = inject(ToastService);
  user = this.auth.currentUser();

  profil = {
    telephone: this.user?.telephone ?? '',
    commune: this.user?.commune ?? '',
    numero_cni: this.user?.numero_cni ?? '',
    date_naissance: this.user?.date_naissance ?? '',
  };
  pwd = { current: '', next: '', confirm: '' };

  savingProfil = false;
  changingPwd = false;

  get initial(): string {
    return (this.user?.name ?? 'C').charAt(0).toUpperCase();
  }

  save() {
    this.savingProfil = true;
    this.auth.updateProfile(this.profil).subscribe({
      next: () => {
        this.savingProfil = false;
        this.user = this.auth.currentUser();
        this.toast.show('profil-ok', 'Vos informations ont été mises à jour avec succès.');
      },
      error: (err: Error) => {
        this.savingProfil = false;
        this.toast.showError('profil-err', err.message, 'Erreur');
      },
    });
  }

  changePassword() {
    if (!this.pwd.current || !this.pwd.next || !this.pwd.confirm) {
      this.toast.showError('pwd-err', 'Tous les champs sont obligatoires.', 'Erreur');
      return;
    }
    if (this.pwd.next !== this.pwd.confirm) {
      this.toast.showError('pwd-err', 'Les mots de passe ne correspondent pas.', 'Erreur');
      return;
    }
    this.changingPwd = true;
    this.auth.changePassword({
      current_password: this.pwd.current,
      password: this.pwd.next,
      password_confirmation: this.pwd.confirm,
    }).subscribe({
      next: () => {
        this.changingPwd = false;
        this.pwd = { current: '', next: '', confirm: '' };
        this.toast.show('pwd-ok', 'Mot de passe modifié avec succès. Veuillez vous reconnecter.');
        setTimeout(() => this.auth.logout(), 1500);
      },
      error: (err: Error) => {
        this.changingPwd = false;
        this.toast.showError('pwd-err', err.message, 'Erreur');
      },
    });
  }
}
