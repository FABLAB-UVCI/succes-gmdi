import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../communication/core/services/auth.service';
import { ToastService } from '../communication/core/services/toast.service';
import { environment } from '@env/environment';

interface CompteForm { name: string; email: string; role: 'gestionnaire' | 'maire' | 'admin'; module: string; }

interface ModuleOption { value: string; label: string; }

const MODULES: ModuleOption[] = [
  { value: 'communication', label: 'Communication' },
  { value: 'etat-civil', label: 'État civil' },
  { value: 'finances', label: 'Finances' },
  { value: 'patrimoine', label: 'Patrimoine' },
  { value: 'rh', label: 'Ressources humaines' },
  { value: 'services-techniques', label: 'Services techniques' },
  { value: 'urbanisme', label: 'Urbanisme / SIG' },
];

interface CompteApi {
  id: number; name: string; email: string; role: string; roleLabel: string;
  modules: string[]; created_at: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="admin">

  <header class="admin-topbar">
    <div class="topbar-left">
      <span class="flag-strip"><span class="fo"></span><span class="fw"></span><span class="fv"></span></span>
      <div>
        <h1 class="topbar-title">Administration</h1>
        <p class="topbar-sub">Gestion des comptes professionnels — E-Mairie</p>
      </div>
    </div>
    <div class="topbar-right">
      <span class="admin-name">🛡️ {{ user?.name ?? 'Administrateur' }}</span>
      <button class="btn-logout" (click)="auth.logout()">Déconnexion</button>
    </div>
  </header>

  <div class="admin-body">

    <!-- Formulaire de création -->
    <section class="card">
      <h2 class="section-title">Créer un compte professionnel</h2>
      <p class="section-hint">
        Le mot de passe est généré automatiquement et envoyé par e-mail au titulaire du compte —
        vous ne le voyez jamais ici.
      </p>

      <div class="form-grid">
        <div class="fg">
          <label>Nom complet <span class="req">*</span></label>
          <input type="text" [(ngModel)]="form.name" placeholder="Ex: Kouassi Adjoua Marie">
        </div>
        <div class="fg">
          <label>Adresse e-mail <span class="req">*</span></label>
          <input type="email" [(ngModel)]="form.email" placeholder="ex: agent@gmail.com">
        </div>
        <div class="fg">
          <label>Rôle <span class="req">*</span></label>
          <select [(ngModel)]="form.role">
            <option value="gestionnaire">Gestionnaire de module</option>
            <option value="maire">Maire</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        @if (form.role === 'gestionnaire') {
          <div class="fg">
            <label>Module géré <span class="req">*</span></label>
            <select [(ngModel)]="form.module">
              <option value="" disabled>Choisir un module...</option>
              @for (m of modules; track m.value) { <option [value]="m.value">{{ m.label }}</option> }
            </select>
          </div>
        }
      </div>

      @if (formError()) { <p class="form-error">{{ formError() }}</p> }

      <button class="btn-create" [disabled]="creating()" (click)="creerCompte()">
        <i class="ti ti-user-plus"></i> {{ creating() ? 'Création...' : 'Créer le compte et envoyer les identifiants' }}
      </button>
    </section>

    <!-- Liste des comptes -->
    <section class="card">
      <h2 class="section-title">Comptes professionnels existants</h2>
      @if (loading()) {
        <p class="empty-msg">Chargement...</p>
      } @else if (comptes().length === 0) {
        <p class="empty-msg">Aucun compte professionnel pour le moment.</p>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Module(s)</th><th>Créé le</th><th></th></tr>
            </thead>
            <tbody>
              @for (c of comptes(); track c.id) {
                <tr>
                  <td class="cell-name">{{ c.name }}</td>
                  <td>{{ c.email }}</td>
                  <td><span class="role-badge" [class.role-admin]="c.role==='admin'" [class.role-maire]="c.role==='maire'">{{ c.roleLabel }}</span></td>
                  <td>{{ labelModules(c.modules) }}</td>
                  <td>{{ c.created_at | date:'dd/MM/yyyy' }}</td>
                  <td class="cell-actions">
                    <button class="btn-reset" (click)="reinitialiserMotDePasse(c)" title="Réinitialiser le mot de passe"><i class="ti ti-key"></i> Réinitialiser</button>
                    <button class="btn-delete" (click)="supprimerCompte(c)" title="Supprimer"><i class="ti ti-trash"></i></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

  </div>
</div>

<style>
.admin { min-height: 100vh; background: #f0f4f8; font-family: 'Inter', system-ui, sans-serif; }

.admin-topbar {
  background: linear-gradient(135deg, #003366 0%, #00245c 100%);
  padding: 1.2rem 2.5rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
}
.topbar-left { display: flex; align-items: center; gap: 1rem; }
.flag-strip { display: flex; width: 28px; height: 20px; border-radius: 4px; overflow: hidden; flex-shrink: 0; }
.fo, .fw, .fv { flex: 1; }
.fo { background: #F77F00; } .fw { background: #fff; } .fv { background: #009A44; }
.topbar-title { color: #fff; font-size: 1.3rem; font-weight: 800; margin: 0; }
.topbar-sub { color: rgba(255,255,255,.6); font-size: .8rem; margin: .1rem 0 0; }
.topbar-right { display: flex; align-items: center; gap: 1rem; }
.admin-name { color: rgba(255,255,255,.9); font-size: .9rem; font-weight: 600; }
.btn-logout {
  padding: .45rem 1rem; border-radius: 8px;
  background: rgba(230,57,70,.2); color: #ff8080;
  border: 1px solid rgba(230,57,70,.3); font-size: .8rem; font-weight: 600; cursor: pointer;
}
.btn-logout:hover { background: rgba(230,57,70,.4); }

.admin-body { max-width: 1000px; margin: 0 auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
.card { background: #fff; border-radius: 16px; padding: 1.8rem; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
.section-title { font-size: 1.05rem; font-weight: 800; color: #003366; margin: 0 0 .4rem; }
.section-hint { font-size: .82rem; color: #7a8aaa; margin: 0 0 1.2rem; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.fg { display: flex; flex-direction: column; gap: .4rem; }
.fg label { font-size: .78rem; font-weight: 700; color: #475569; }
.fg .req { color: #ef4444; }
.fg input, .fg select { padding: .6rem .8rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: .88rem; font-family: inherit; outline: none; background: #fff; }
.fg input:focus, .fg select:focus { border-color: #F77F00; box-shadow: 0 0 0 3px rgba(247,127,0,.1); }
.form-error { color: #e63946; font-size: .82rem; margin: 0 0 .8rem; }

.btn-create {
  padding: .8rem 1.4rem; background: #009A44; color: #fff; border: none; border-radius: 8px;
  font-weight: 700; font-size: .88rem; cursor: pointer; display: flex; align-items: center; gap: .5rem;
}
.btn-create:hover:not(:disabled) { background: #007a36; }
.btn-create:disabled { opacity: .6; cursor: not-allowed; }

.empty-msg { color: #7a8aaa; font-size: .85rem; padding: .5rem 0; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: .85rem; }
th { text-align: left; padding: .6rem .5rem; color: #7a8aaa; font-size: .72rem; text-transform: uppercase; letter-spacing: .4px; border-bottom: 2px solid #eef1f6; }
td { padding: .7rem .5rem; border-bottom: 1px solid #eef1f6; color: #334155; }
.cell-name { font-weight: 700; color: #003366; }
.role-badge { background: #eef4fb; color: #185FA5; font-size: .72rem; font-weight: 700; padding: .2rem .6rem; border-radius: 20px; }
.role-badge.role-maire { background: #e5f3ea; color: #009A44; }
.role-badge.role-admin { background: #fdeee0; color: #F77F00; }
.cell-actions { display: flex; align-items: center; gap: .5rem; white-space: nowrap; }
.btn-reset {
  display: inline-flex; align-items: center; gap: .3rem;
  background: #eef4fb; color: #185FA5; border: 1px solid #cfe3ff;
  padding: .35rem .7rem; border-radius: 6px; font-size: .72rem; font-weight: 700; cursor: pointer;
}
.btn-reset:hover { background: #dbeafe; }
.btn-delete { background: none; border: none; color: #cbd5e1; cursor: pointer; font-size: 1rem; padding: .3rem; }
.btn-delete:hover { color: #e63946; }
</style>
  `,
})
export class AdminDashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly user = this.auth.currentUser();
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  modules = MODULES;
  comptes = signal<CompteApi[]>([]);
  loading = signal(true);
  creating = signal(false);
  formError = signal('');

  form: CompteForm = { name: '', email: '', role: 'gestionnaire', module: '' };

  ngOnInit(): void {
    this.chargerComptes();
  }

  chargerComptes(): void {
    this.loading.set(true);
    this.http.get<{ data: CompteApi[] }>(`${environment.apiUrl}/admin/users`).subscribe({
      next: r => { this.comptes.set(r.data); this.loading.set(false); },
      error: () => { this.loading.set(false); },
    });
  }

  labelModules(modules: string[]): string {
    if (!modules?.length) return '—';
    return modules.map(m => this.modules.find(mo => mo.value === m)?.label ?? m).join(', ');
  }

  creerCompte(): void {
    this.formError.set('');
    if (!this.form.name.trim() || !this.form.email.trim()) {
      this.formError.set('Le nom et l\'email sont obligatoires.');
      return;
    }
    if (this.form.role === 'gestionnaire' && !this.form.module) {
      this.formError.set('Choisissez le module géré par ce gestionnaire.');
      return;
    }

    this.creating.set(true);
    const payload: any = { name: this.form.name.trim(), email: this.form.email.trim(), role: this.form.role };
    if (this.form.role === 'gestionnaire') payload.module = this.form.module;

    this.http.post<{ success: boolean; message: string }>(`${environment.apiUrl}/admin/users`, payload).subscribe({
      next: (r) => {
        this.creating.set(false);
        this.toast.show('compte-ok', r.message);
        this.form = { name: '', email: '', role: 'gestionnaire', module: '' };
        this.chargerComptes();
      },
      error: (err) => {
        this.creating.set(false);
        this.formError.set(err?.error?.message ?? 'Impossible de créer le compte.');
      },
    });
  }

  reinitialiserMotDePasse(c: CompteApi): void {
    if (!confirm(`Réinitialiser le mot de passe de ${c.name} ? Un nouveau mot de passe sera généré et envoyé à ${c.email}.`)) return;
    this.http.post<{ success: boolean; message: string }>(`${environment.apiUrl}/admin/users/${c.id}/reset-password`, {}).subscribe({
      next: (r) => { this.toast.show('reset-ok', r.message); },
      error: (err) => { this.toast.showError('reset-err', err?.error?.message ?? 'Impossible de réinitialiser ce mot de passe.'); },
    });
  }

  supprimerCompte(c: CompteApi): void {
    if (!confirm(`Supprimer le compte de ${c.name} (${c.email}) ?`)) return;
    this.http.delete(`${environment.apiUrl}/admin/users/${c.id}`).subscribe({
      next: () => { this.toast.show('suppr-ok', 'Compte supprimé.'); this.chargerComptes(); },
      error: () => { this.toast.showError('suppr-err', 'Impossible de supprimer ce compte.'); },
    });
  }
}
