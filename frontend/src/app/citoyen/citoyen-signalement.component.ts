import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitoyenService, Demarche } from './citoyen.service';
import { ToastService } from '../communication/core/services/toast.service';

const TYPES_INCIDENT = [
  'Nid de poule',
  'Éclairage public défectueux',
  'Fuite d\'eau',
  'Problème de voirie',
  'Déchets / poubelle non collectée',
  'Autre incident',
];

// Libellés de statut spécifiques à l'affichage citoyen des signalements (Services Techniques).
// Les valeurs backend restent celles du modèle Demarche générique (aucun nouvel enum).
const STATUT_LABELS_ST: Record<string, string> = {
  en_attente:  'Reçu',
  en_cours:    'En cours',
  a_completer: 'Affecté',
  valide:      'Résolu',
  refuse:      'Fermé',
  termine:     'Fermé',
};

const STATUT_COLORS_ST: Record<string, string> = {
  en_attente:  '#F77F00',
  en_cours:    '#003366',
  a_completer: '#7c3aed',
  valide:      '#009A44',
  refuse:      '#6b7280',
  termine:     '#6b7280',
};

@Component({
  selector: 'app-citoyen-signalement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="signal-container">
      <div class="header">
        <a routerLink="/citoyen" class="btn-back"><i class="ti ti-arrow-left"></i> Retour</a>
        <h1>Signalement d'incident</h1>
        <p>Signalez un problème de voirie, d'éclairage, d'eau ou de déchets. Un numéro de ticket vous sera attribué.</p>
      </div>

      <div class="content-grid">
        <div class="form-section card">
          <h2>Nouveau signalement</h2>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dynamic-form">
            <div class="fsec ivoire-border">Informations du demandeur (facultatif)</div>
            <div class="form-grid" style="grid-template-columns: 1fr;">
              <div class="fg">
                <div class="fl">Nom et prénoms du demandeur</div>
                <input type="text" class="fi" formControlName="nom_demandeur" placeholder="Ex: KOUASSI Jean (si différent de votre compte)">
              </div>
            </div>

            <div class="fsec ivoire-border">Nature du problème</div>
            <div class="form-grid">
              <div class="fg">
                <div class="fl">Type d'incident <span class="req">*</span></div>
                <select class="fsel" formControlName="type_incident">
                  @for (t of typesIncident; track t) { <option [value]="t">{{ t }}</option> }
                </select>
              </div>
              <div class="fg">
                <div class="fl">Quartier <span class="req">*</span></div>
                <input type="text" class="fi" formControlName="quartier" placeholder="Ex: Angré 8e Tranche">
              </div>
            </div>

            <div class="fsec ivoire-border">Localisation</div>
            <div class="form-grid">
              <div class="fg">
                <div class="fl">Adresse / repère précis <span class="req">*</span></div>
                <input type="text" class="fi" formControlName="localisation" placeholder="Ex: Devant la pharmacie, rue des jardins">
              </div>
              <div class="fg">
                <div class="fl">Géolocalisation</div>
                <div class="gps-row">
                  <input type="text" class="fi" formControlName="gps" placeholder="Non renseignée" readonly>
                  <button type="button" class="btn-gps" (click)="localiser()" [disabled]="locating()">
                    <i class="ti ti-map-pin" [class.spin]="locating()"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="fsec ivoire-border">Description</div>
            <div class="form-grid" style="grid-template-columns: 1fr;">
              <div class="fg">
                <div class="fl">Description complète <span class="req">*</span></div>
                <textarea class="fi" formControlName="description" rows="4" placeholder="Décrivez le problème rencontré..."></textarea>
              </div>
            </div>
            <div class="form-grid" style="grid-template-columns: 1fr;">
              <div class="fg">
                <div class="fl">Joindre une photo du problème (simulation) <span class="req">*</span></div>
                <input type="file" class="fi" accept="image/*" (change)="onFileSelected($event)">
                @if (selectedFile) { <span class="file-name"><i class="ti ti-paperclip"></i> {{ selectedFile.name }}</span> }
              </div>
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading()">
              <i class="ti ti-send" style="margin-right:8px;"></i>
              {{ loading() ? 'Envoi en cours...' : 'Envoyer le signalement' }}
            </button>
          </form>
        </div>

        <div class="tracking-section card">
          <h2>Suivi de mes signalements</h2>

          @if (mesSignalements().length === 0) {
            <div class="empty-state">
              <i class="ti ti-alert-circle"></i>
              <p>Aucun signalement pour le moment.</p>
            </div>
          } @else {
            <div class="demarche-list">
              @for (d of mesSignalements(); track d.id) {
                <div class="demarche-item">
                  <div class="d-head">
                    <span class="d-ref">Ticket {{ d.reference }}</span>
                    <span class="d-statut" [style.background]="colorStatut(d.statut)+'22'" [style.color]="colorStatut(d.statut)">
                      {{ labelStatutST(d.statut) }}
                    </span>
                  </div>
                  <div class="d-type">{{ d.donnees?.type_incident || d.type_demarche }}</div>
                  <div class="d-date">Signalé le {{ d.created_at | date:'dd/MM/yyyy HH:mm' }}</div>
                  @if (d.commentaire_gestionnaire) {
                    <div class="d-commentaire"><i class="ti ti-message-circle"></i> {{ d.commentaire_gestionnaire }}</div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>

    <style>
      .signal-container { padding: 2rem; max-width: 1200px; margin: 0 auto; font-family: 'Inter', sans-serif; }
      .header { margin-bottom: 2rem; }
      .btn-back { display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #003366; font-weight: 600; margin-bottom: 1rem; }
      .btn-back:hover { text-decoration: underline; }
      .header h1 { font-size: 2rem; color: #003366; margin: 0 0 0.5rem 0; }
      .header p { color: #4a5568; margin: 0; }

      .content-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 2rem; }
      @media (max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }

      .card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
      .card h2 { font-size: 1.2rem; color: #003366; margin-top: 0; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #edf2f7; }

      .fsec { font-size: 13px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
      .ivoire-border { border-bottom: 3px solid #009A44; position: relative; padding-bottom: 0.75rem; }
      .ivoire-border::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 33.33%; height: 3px; background: #F77F00; }
      .fsec:first-child { margin-top: 0; }
      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; align-items: end; }
      .fg { display: flex; flex-direction: column; gap: 0.5rem; justify-content: flex-end; }
      .fl { font-size: 12px; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 4px; }
      .req { color: #ef4444; margin-left: 2px; }
      .fi.ng-invalid.ng-touched, select.fsel.ng-invalid.ng-touched { border-color: #ef4444; background: #fff5f5; }
      .fi, .fsel { padding: 0.6rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; background: #f8fafc; font-family: inherit; width: 100%; box-sizing: border-box; }
      input.fi, select.fsel { height: 44px; }
      textarea.fi { min-height: 100px; padding: 0.8rem 1rem; }
      .fi:focus, .fsel:focus { border-color: #F77F00; background: #fff; box-shadow: 0 0 0 3px rgba(247,127,0,0.1); }
      .gps-row { display: flex; gap: 0.5rem; }
      .btn-gps { flex-shrink: 0; width: 44px; height: 44px; border-radius: 8px; border: 1.5px solid #cbd5e1; background: #f8fafc; color: #003366; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      .btn-gps:hover:not(:disabled) { background: #003366; color: #fff; }
      .btn-gps:disabled { opacity: .6; cursor: not-allowed; }
      .spin { animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .file-name { font-size: 0.78rem; color: #7a5c3a; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
      @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; gap: 1rem; } }

      .btn-submit { margin-top: 1rem; padding: 1rem; background: #009A44; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; width: 100%; }
      .btn-submit:hover:not(:disabled) { background: #007a36; }
      .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

      .empty-state { text-align: center; padding: 3rem 1rem; color: #a0aec0; }
      .empty-state i { font-size: 3rem; margin-bottom: 1rem; }

      .demarche-list { display: flex; flex-direction: column; gap: 1rem; }
      .demarche-item { padding: 1rem; border: 1px solid #edf2f7; border-radius: 8px; background: #f8fafc; }
      .d-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem; }
      .d-ref { font-weight: 700; color: #003366; font-size: 0.9rem; }
      .d-type { font-weight: 600; color: #2d3748; margin-bottom: 0.3rem; }
      .d-date { font-size: 0.8rem; color: #718096; }
      .d-commentaire { font-size: 0.8rem; color: #7a5c3a; font-style: italic; margin-top: 0.4rem; display: flex; align-items: center; gap: 4px; }
      .d-statut { padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
    </style>
  `
})
export class CitoyenSignalementComponent implements OnInit {
  private citoyenService = inject(CitoyenService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  typesIncident = TYPES_INCIDENT;
  loading = signal(false);
  locating = signal(false);
  mesSignalements = signal<Demarche[]>([]);
  selectedFile: File | null = null;

  form = this.fb.group({
    nom_demandeur: [''],
    type_incident: [TYPES_INCIDENT[0], Validators.required],
    quartier: ['', Validators.required],
    localisation: ['', Validators.required],
    gps: [''],
    description: ['', Validators.required],
  });

  ngOnInit() {
    this.loadSignalements();
  }

  loadSignalements() {
    this.citoyenService.getDemarches().subscribe((res: { data: Demarche[] }) => {
      this.mesSignalements.set(res.data.filter(d => d.module === 'services-techniques'));
    });
  }

  localiser() {
    if (!navigator.geolocation) {
      this.toast.showError('gps-err', 'La géolocalisation n\'est pas disponible sur cet appareil.', 'Erreur');
      return;
    }
    this.locating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.form.patchValue({ gps: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` });
        this.locating.set(false);
      },
      () => {
        this.toast.showError('gps-refus', 'Position non partagée. Vous pouvez continuer sans géolocalisation.', 'Information');
        this.locating.set(false);
      },
      { timeout: 8000 }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.toast.show('file-ok', `Photo ${file.name} sélectionnée avec succès.`);
    }
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toast.showError('signal-err', 'Veuillez remplir tous les champs obligatoires (marqués d\'une étoile rouge *).', 'Champs manquants');
      return;
    }
    if (!this.selectedFile) {
      this.toast.showError('signal-photo-err', 'Veuillez joindre une photo du problème.', 'Photo manquante');
      return;
    }
    this.loading.set(true);

    const formData = new FormData();
    formData.append('module', 'services-techniques');
    formData.append('type_demarche', this.form.value.type_incident || 'Signalement citoyen');
    formData.append('donnees', JSON.stringify(this.form.value));
    if (this.selectedFile) formData.append('files[]', this.selectedFile);

    this.citoyenService.createDemarche(formData).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.show('signal-ok', 'Votre signalement a été enregistré. Un ticket vous a été attribué.');
        this.form.reset({ nom_demandeur: '', type_incident: TYPES_INCIDENT[0], quartier: '', localisation: '', gps: '', description: '' });
        this.selectedFile = null;
        this.loadSignalements();
      },
      error: () => {
        this.loading.set(false);
        this.toast.showError('signal-api-err', 'Impossible d\'enregistrer le signalement.', 'Erreur');
      }
    });
  }

  labelStatutST(statut: string): string {
    return STATUT_LABELS_ST[statut] ?? statut;
  }

  colorStatut(statut: string): string {
    return STATUT_COLORS_ST[statut] ?? '#7a5c3a';
  }
}
