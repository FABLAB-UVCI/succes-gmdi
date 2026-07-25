import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitoyenService, Demarche } from './citoyen.service';
import { ToastService } from '../communication/core/services/toast.service';

@Component({
  selector: 'app-citoyen-demande',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="demande-container">
      <div class="header">
        <a routerLink="/citoyen" class="btn-back"><i class="ti ti-arrow-left"></i> Retour</a>
        <h1>Demandes - {{ moduleLabel }}</h1>
        <p>Soumettez une nouvelle demande ou suivez l'avancement de vos dossiers en cours.</p>
      </div>

      <div class="content-grid">
        <!-- Section Formulaire -->
        <div class="form-section card">
          <h2>Nouvelle demande</h2>
          
          <div class="type-selector" *ngIf="module === 'etat-civil'">
            <label>Type de demande :</label>
            <select [formControl]="typeControl" (change)="onTypeChange()">
              <option value="Demande d'acte de naissance">Déclaration / Acte de naissance</option>
              <option value="Demande d'acte de mariage">Déclaration / Acte de mariage</option>
              <option value="Demande d'acte de décès">Déclaration / Acte de décès</option>
            </select>
          </div>

          <div class="type-selector" *ngIf="module === 'communication'">
            <label>Type de requête :</label>
            <select [formControl]="typeControl" (change)="onTypeChange()">
              <option value="Réclamation">Réclamation</option>
              <option value="Suggestion">Suggestion</option>
              <option value="Demande d'information">Demande d'information</option>
            </select>
          </div>

          <div class="type-selector" *ngIf="module === 'urbanisme'">
            <label>Type de demande :</label>
            <select [formControl]="typeControl" (change)="onTypeChange()">
              <option value="Permis de construire">Permis de construire</option>
              <option value="Certificat d'urbanisme">Certificat d'urbanisme</option>
            </select>
          </div>

          <div class="type-selector" *ngIf="module === 'services-techniques'">
            <label>Type de signalement :</label>
            <select [formControl]="typeControl" (change)="onTypeChange()">
              <option value="Voirie et éclairage">Voirie et éclairage</option>
              <option value="Espaces verts">Espaces verts</option>
            </select>
          </div>
          
          <div class="type-selector" *ngIf="module === 'patrimoine'">
            <label>Type de demande :</label>
            <select [formControl]="typeControl" (change)="onTypeChange()">
              <option value="Occupation du domaine public">Occupation du domaine public</option>
              <option value="Location de salle">Location de salle</option>
            </select>
          </div>

          <div class="type-selector" *ngIf="module === 'finances'">
            <label>Type d'opération :</label>
            <select [formControl]="typeControl" (change)="onTypeChange()">
              <option value="Paiement de taxe municipale">Paiement de taxe municipale</option>
              <option value="Règlement de facture">Règlement de facture</option>
            </select>
          </div>

          <div class="type-selector" *ngIf="module === 'rh'">
            <label>Type de démarche :</label>
            <select [formControl]="typeControl" (change)="onTypeChange()">
              <option value="Candidature spontanée">Candidature spontanée</option>
              <option value="Réponse à une offre">Réponse à une offre d'emploi</option>
              <option value="Demande de stage">Demande de stage</option>
            </select>
          </div>

          <!-- Formulaire dynamique avec le style "Gestionnaire" -->
          <form [formGroup]="demandeForm" (ngSubmit)="onSubmit()" class="dynamic-form">
            
            <!-- Champs État Civil : Naissance -->
            <ng-container *ngIf="typeControl.value === 'Demande d\\'acte de naissance'">
              <div class="fsec ivoire-border">Informations de l'enfant</div>
              <div class="form-grid">
                <div class="fg"><div class="fl">Nom de famille <span class="req">*</span></div><input type="text" class="fi" formControlName="nom" placeholder="Ex: KONAN"></div>
                <div class="fg"><div class="fl">Prénoms <span class="req">*</span></div><input type="text" class="fi" formControlName="prenom" placeholder="Ex: Yao Emmanuel"></div>
              </div>
              <div class="form-grid-3">
                <div class="fg"><div class="fl">Date de naissance <span class="req">*</span></div><input type="date" class="fi" formControlName="date_naissance"></div>
                <div class="fg"><div class="fl">Heure de naissance <span class="req">*</span></div><input type="time" class="fi" formControlName="heure_naissance"></div>
                <div class="fg"><div class="fl">Sexe <span class="req">*</span></div>
                  <select class="fsel" formControlName="sexe">
                    <option value="">Sélectionner...</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
              </div>
              <div class="form-grid">
                <div class="fg"><div class="fl">Lieu de naissance <span class="req">*</span></div><input type="text" class="fi" formControlName="lieu_naissance" placeholder="Ex: CHU de Cocody"></div>
                <div class="fg"><div class="fl">Commune d'enregistrement <span class="req">*</span></div><input type="text" class="fi" formControlName="commune" placeholder="Ex: Cocody"></div>
              </div>

              <div class="fsec ivoire-border">Informations du père</div>
              <div class="form-grid-3">
                <div class="fg"><div class="fl">Nom et Prénoms</div><input type="text" class="fi" formControlName="pere_nom" placeholder="Ex: DOUKOURÉ Youssouf"></div>
                <div class="fg"><div class="fl">Profession</div><input type="text" class="fi" formControlName="pere_profession" placeholder="Ex: Enseignant"></div>
                <div class="fg"><div class="fl">Nationalité</div><input type="text" class="fi" formControlName="pere_nationalite" placeholder="Ex: Ivoirienne"></div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Pièce d'identité du père (PDF/JPG)</div><input type="file" class="fi" (change)="onFileSelected($event)"></div>
              </div>

              <div class="fsec ivoire-border">Informations de la mère</div>
              <div class="form-grid-3">
                <div class="fg"><div class="fl">Nom et Prénoms</div><input type="text" class="fi" formControlName="mere_nom" placeholder="Ex: KONÉ Aminata"></div>
                <div class="fg"><div class="fl">Profession</div><input type="text" class="fi" formControlName="mere_profession" placeholder="Ex: Commerçante"></div>
                <div class="fg"><div class="fl">Nationalité</div><input type="text" class="fi" formControlName="mere_nationalite" placeholder="Ex: Ivoirienne"></div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Pièce d'identité de la mère (PDF/JPG)</div><input type="file" class="fi" (change)="onFileSelected($event)"></div>
              </div>
            </ng-container>

            <!-- Champs État Civil : Mariage -->
            <ng-container *ngIf="typeControl.value === 'Demande d\\'acte de mariage'">
              <div class="fsec ivoire-border">Informations sur l'époux</div>
              <div class="form-grid-3">
                <div class="fg"><div class="fl">Nom complet de l'époux <span class="req">*</span></div><input type="text" class="fi" formControlName="epoux_nom" placeholder="Ex: KOUASSI Jean"></div>
                <div class="fg"><div class="fl">Profession <span class="req">*</span></div><input type="text" class="fi" formControlName="epoux_profession"></div>
                <div class="fg"><div class="fl">Nationalité <span class="req">*</span></div><input type="text" class="fi" formControlName="epoux_nationalite"></div>
              </div>

              <div class="fsec ivoire-border">Informations sur l'épouse</div>
              <div class="form-grid-3">
                <div class="fg"><div class="fl">Nom complet de l'épouse <span class="req">*</span></div><input type="text" class="fi" formControlName="epouse_nom" placeholder="Ex: N'GUESSAN Marie"></div>
                <div class="fg"><div class="fl">Profession <span class="req">*</span></div><input type="text" class="fi" formControlName="epouse_profession"></div>
                <div class="fg"><div class="fl">Nationalité <span class="req">*</span></div><input type="text" class="fi" formControlName="epouse_nationalite"></div>
              </div>
              <div class="fsec ivoire-border">Détails du mariage</div>
              <div class="form-grid">
                <div class="fg"><div class="fl">Date du mariage <span class="req">*</span></div><input type="date" class="fi" formControlName="date_mariage"></div>
              </div>
            </ng-container>

            <!-- Champs État Civil : Décès -->
            <ng-container *ngIf="typeControl.value === 'Demande d\\'acte de décès'">
              <div class="fsec">Déclaration de décès</div>
              <div class="form-grid">
                <div class="fg"><div class="fl">Nom complet du défunt <span class="req">*</span></div><input type="text" class="fi" formControlName="defunt_nom" placeholder="Ex: KONE Issa"></div>
                <div class="fg"><div class="fl">Date du décès <span class="req">*</span></div><input type="date" class="fi" formControlName="date_deces"></div>
              </div>
            </ng-container>

            <!-- Champs Communication -->
            <ng-container *ngIf="module === 'communication'">
              <div class="fsec ivoire-border">Détails de la requête</div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Sujet principal <span class="req">*</span></div><input type="text" class="fi" formControlName="sujet" placeholder="Titre clair de votre requête"></div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Description / Message <span class="req">*</span></div><textarea class="fi" formControlName="message" rows="5" placeholder="Décrivez votre requête en détail..."></textarea></div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Pièce jointe éventuelle (PDF/JPG)</div><input type="file" class="fi" (change)="onFileSelected($event)"></div>
              </div>
            </ng-container>

            <!-- Champs Urbanisme -->
            <ng-container *ngIf="module === 'urbanisme'">
              <div class="fsec ivoire-border">Informations sur le terrain</div>
              <div class="form-grid-3">
                <div class="fg"><div class="fl">Numéro de parcelle / Lot / Ilot <span class="req">*</span></div><input type="text" class="fi" formControlName="parcelle" placeholder="Ex: Lot 124, Ilot 12"></div>
                <div class="fg"><div class="fl">Superficie estimée (m²) <span class="req">*</span></div><input type="number" class="fi" formControlName="superficie" placeholder="Ex: 500"></div>
                <div class="fg"><div class="fl">Usage prévu <span class="req">*</span></div>
                  <select class="fsel" formControlName="usage">
                    <option value="">Sélectionner...</option>
                    <option value="Habitation">Habitation</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Mixte">Mixte</option>
                  </select>
                </div>
              </div>
              <div class="fsec ivoire-border">Description du projet</div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Détails de la construction <span class="req">*</span></div><textarea class="fi" formControlName="description" rows="4" placeholder="Construction d'un immeuble R+2 à usage d'habitation..."></textarea></div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Plan cadastral ou plan architectural (PDF)</div><input type="file" class="fi" (change)="onFileSelected($event)" accept="application/pdf"></div>
              </div>
            </ng-container>

            <!-- Champs Services Techniques -->
            <ng-container *ngIf="module === 'services-techniques'">
              <div class="fsec ivoire-border">Localisation du problème</div>
              <div class="form-grid">
                <div class="fg"><div class="fl">Quartier / Adresse exacte <span class="req">*</span></div><input type="text" class="fi" formControlName="adresse" placeholder="Ex: Quartier Palmeraie, rue des jardins"></div>
                <div class="fg"><div class="fl">Repère précis</div><input type="text" class="fi" formControlName="repere" placeholder="Ex: Devant la pharmacie"></div>
              </div>
              <div class="fsec ivoire-border">Détails de l'intervention demandée</div>
              <div class="form-grid-3">
                <div class="fg"><div class="fl">Niveau d'urgence <span class="req">*</span></div>
                  <select class="fsel" formControlName="urgence">
                    <option value="">Sélectionner...</option>
                    <option value="Faible">Faible (Gênant mais non dangereux)</option>
                    <option value="Moyenne">Moyenne (Risque potentiel)</option>
                    <option value="Élevée">Élevée (Danger immédiat)</option>
                  </select>
                </div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Description complète <span class="req">*</span></div><textarea class="fi" formControlName="description" rows="4" placeholder="Lampadaire en panne, nid de poule dangereux, canalisation bouchée..."></textarea></div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Joindre une photo du problème (JPG/PNG)</div><input type="file" class="fi" (change)="onFileSelected($event)" accept="image/*"></div>
              </div>
            </ng-container>

            <!-- Champs Patrimoine -->
            <ng-container *ngIf="module === 'patrimoine'">
              <div class="fsec ivoire-border">Détails de la réservation / occupation</div>
              <div class="form-grid">
                <div class="fg"><div class="fl">Espace / Salle demandée <span class="req">*</span></div><input type="text" class="fi" formControlName="espace" placeholder="Ex: Foyer des jeunes, Place de la Mairie"></div>
                <div class="fg"><div class="fl">Date prévue <span class="req">*</span></div><input type="date" class="fi" formControlName="date_prevue"></div>
              </div>
              <div class="form-grid-3">
                <div class="fg"><div class="fl">Heure de début <span class="req">*</span></div><input type="time" class="fi" formControlName="heure_debut"></div>
                <div class="fg"><div class="fl">Heure de fin estimée <span class="req">*</span></div><input type="time" class="fi" formControlName="heure_fin"></div>
                <div class="fg"><div class="fl">Nombre de participants</div><input type="number" class="fi" formControlName="participants" placeholder="Ex: 100"></div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Motif / Événement <span class="req">*</span></div><input type="text" class="fi" formControlName="motif" placeholder="Ex: Réunion d'association, Mariage, Cérémonie..."></div>
              </div>
            </ng-container>

            <!-- Champs Finances -->
            <ng-container *ngIf="module === 'finances'">
              <div class="fsec ivoire-border">Informations de paiement</div>
              <div class="form-grid-3">
                <div class="fg"><div class="fl">Numéro de référence / Facture <span class="req">*</span></div><input type="text" class="fi" formControlName="reference_facture" placeholder="Ex: FAC-2026-001"></div>
                <div class="fg"><div class="fl">Montant à régler (FCFA) <span class="req">*</span></div><input type="number" class="fi" formControlName="montant" placeholder="Ex: 25000"></div>
                <div class="fg"><div class="fl">Mode de paiement <span class="req">*</span></div>
                  <select class="fsel" formControlName="mode_paiement">
                    <option value="">Sélectionner...</option>
                    <option value="Mobile Money">Mobile Money (Orange/MTN/Moov)</option>
                    <option value="Virement bancaire">Virement bancaire</option>
                    <option value="Espèces">Espèces (à la caisse)</option>
                  </select>
                </div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Preuve de paiement / Reçu (PDF/JPG)</div><input type="file" class="fi" (change)="onFileSelected($event)"></div>
              </div>
            </ng-container>

            <!-- Champs RH -->
            <ng-container *ngIf="module === 'rh'">
              <div class="fsec ivoire-border">Profil du candidat</div>
              <div class="form-grid">
                <div class="fg"><div class="fl">Nom et Prénoms <span class="req">*</span></div><input type="text" class="fi" formControlName="nom_complet" placeholder="Ex: DIOMANDÉ Ali"></div>
                <div class="fg"><div class="fl">Numéro de téléphone <span class="req">*</span></div><input type="text" class="fi" formControlName="telephone" placeholder="Ex: 0102030405"></div>
              </div>
              <div class="form-grid" style="grid-template-columns: 1fr;">
                <div class="fg"><div class="fl">Poste visé ou domaine de compétence <span class="req">*</span></div><input type="text" class="fi" formControlName="poste" placeholder="Ex: Assistant administratif, Informaticien..."></div>
              </div>
              <div class="fsec ivoire-border">Pièces jointes</div>
              <div class="form-grid">
                <div class="fg"><div class="fl">Curriculum Vitae (PDF) <span class="req">*</span></div><input type="file" class="fi" (change)="onFileSelected($event)" accept="application/pdf"></div>
                <div class="fg"><div class="fl">Lettre de motivation (PDF)</div><input type="file" class="fi" (change)="onFileSelected($event)" accept="application/pdf"></div>
              </div>
            </ng-container>

            <button type="submit" class="btn-submit" [disabled]="loading() || demandeForm.invalid">
              <i class="ti ti-check" style="margin-right:8px;"></i>
              {{ loading() ? 'Enregistrement...' : 'Soumettre le dossier' }}
            </button>
          </form>
        </div>

        <!-- Section Suivi -->
        <div class="tracking-section card">
          <h2>Suivi de vos dossiers ({{ moduleLabel }})</h2>
          
          @if (mesDemarches().length === 0) {
            <div class="empty-state">
              <i class="ti ti-folder-off"></i>
              <p>Aucune demande en cours pour ce service.</p>
            </div>
          } @else {
            <div class="demarche-list">
              @for (d of mesDemarches(); track d.id) {
                <div class="demarche-item">
                  <div class="d-head">
                    <span class="d-ref">{{ d.reference }}</span>
                    <span class="d-statut" [ngClass]="d.statut">{{ getStatutLabel(d.statut) }}</span>
                  </div>
                  <div class="d-type">{{ d.type_demarche }}</div>
                  <div class="d-date">Soumis le {{ d.created_at | date:'dd/MM/yyyy HH:mm' }}</div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>

    <style>
      .demande-container { padding: 2rem; max-width: 1200px; margin: 0 auto; font-family: 'Inter', sans-serif; }
      .header { margin-bottom: 2rem; }
      .btn-back { display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #003366; font-weight: 600; margin-bottom: 1rem; }
      .btn-back:hover { text-decoration: underline; }
      .header h1 { font-size: 2rem; color: #003366; margin: 0 0 0.5rem 0; }
      .header p { color: #4a5568; margin: 0; }

      .content-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 2rem; }
      @media (max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }
      
      .card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
      .card h2 { font-size: 1.2rem; color: #003366; margin-top: 0; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #edf2f7; }

      .type-selector { margin-bottom: 2rem; }
      .type-selector label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #4a5568; }
      .type-selector select { width: 100%; padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #cbd5e0; font-size: 1rem; font-family: inherit; box-sizing: border-box; height: 48px; background: #fff; }

      /* Styles Visuels "Gestionnaire" */
      .fsec { font-size: 13px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
      .ivoire-border { border-bottom: 3px solid #009A44; position: relative; padding-bottom: 0.75rem; }
      .ivoire-border::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 33.33%; height: 3px; background: #F77F00; }
      .ivoire-border::before { content: ''; position: absolute; bottom: -3px; left: 33.33%; width: 33.33%; height: 3px; background: #ffffff; border-bottom: 3px solid #f8fafc; z-index: 1; }
      .fsec:first-child { margin-top: 0; }
      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; align-items: end; }
      .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; align-items: end; }
      .fg { display: flex; flex-direction: column; gap: 0.5rem; justify-content: flex-end; }
      .fl { font-size: 12px; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 4px; }
      .req { color: #ef4444; margin-left: 2px; }
      .fi, .fsel { padding: 0.6rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; background: #f8fafc; font-family: inherit; width: 100%; box-sizing: border-box; }
      input.fi, select.fsel { height: 44px; }
      textarea.fi { min-height: 100px; padding: 0.8rem 1rem; }
      .fi:focus, .fsel:focus { border-color: #F77F00; background: #fff; box-shadow: 0 0 0 3px rgba(247,127,0,0.1); }
      @media (max-width: 768px) {
        .form-grid, .form-grid-3 { grid-template-columns: 1fr; gap: 1rem; }
      }
      
      .btn-submit { margin-top: 1rem; padding: 1rem; background: #009A44; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; width: 100%; }
      .btn-submit:hover:not(:disabled) { background: #007a36; }
      .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

      .empty-state { text-align: center; padding: 3rem 1rem; color: #a0aec0; }
      .empty-state i { font-size: 3rem; margin-bottom: 1rem; }

      .demarche-list { display: flex; flex-direction: column; gap: 1rem; }
      .demarche-item { padding: 1rem; border: 1px solid #edf2f7; border-radius: 8px; background: #f8fafc; }
      .d-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
      .d-ref { font-weight: 700; color: #003366; font-size: 0.9rem; }
      .d-type { font-weight: 600; color: #2d3748; margin-bottom: 0.3rem; }
      .d-date { font-size: 0.8rem; color: #718096; }

      .d-statut { padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
      .d-statut.en_attente { background: #fff3cd; color: #856404; }
      .d-statut.en_cours { background: #cce5ff; color: #004085; }
      .d-statut.valide, .d-statut.termine { background: #d4edda; color: #155724; }
      .d-statut.refuse { background: #f8d7da; color: #721c24; }
    </style>
  `
})
export class CitoyenDemandeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private citoyenService = inject(CitoyenService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  module: string = '';
  moduleLabel: string = '';
  loading = signal(false);
  mesDemarches = signal<Demarche[]>([]);

  typeControl = this.fb.control('');
  demandeForm!: FormGroup;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.module = params.get('module') || '';
      this.setModuleLabel();
      this.initForm();
      this.loadDemarches();
    });
  }

  setModuleLabel() {
    const labels: Record<string, string> = {
      'etat-civil': 'État civil',
      'urbanisme': 'Urbanisme',
      'services-techniques': 'Services techniques',
      'patrimoine': 'Patrimoine',
      'finances': 'Finances',
      'rh': 'Ressources Humaines',
      'communication': 'Communication'
    };
    this.moduleLabel = labels[this.module] || this.module;
  }

  initForm() {
    // Default types per module
    let defaultType = '';
    if (this.module === 'etat-civil') defaultType = "Demande d'acte de naissance";
    else if (this.module === 'communication') defaultType = "Réclamation";
    else if (this.module === 'urbanisme') defaultType = "Permis de construire";
    else if (this.module === 'services-techniques') defaultType = "Voirie et éclairage";
    else if (this.module === 'patrimoine') defaultType = "Occupation du domaine public";
    else if (this.module === 'finances') defaultType = "Paiement de taxe municipale";
    else if (this.module === 'rh') defaultType = "Candidature spontanée";

    this.typeControl.setValue(defaultType);
    this.buildDynamicForm();
  }

  onTypeChange() {
    this.buildDynamicForm();
  }

  buildDynamicForm() {
    const type = this.typeControl.value;
    
    // Base generic fields
    let controls: any = {};

    if (this.module === 'etat-civil') {
      if (type === "Demande d'acte de naissance") {
        controls = {
          nom: ['', Validators.required], prenom: ['', Validators.required],
          date_naissance: ['', Validators.required], heure_naissance: ['', Validators.required],
          sexe: ['', Validators.required], lieu_naissance: ['', Validators.required], commune: ['', Validators.required],
          pere_nom: [''], pere_profession: [''], pere_nationalite: ['Ivoirienne'],
          mere_nom: [''], mere_profession: [''], mere_nationalite: ['Ivoirienne']
        };
      } else if (type === "Demande d'acte de mariage") {
        controls = { 
          epoux_nom: ['', Validators.required], epoux_profession: ['', Validators.required], epoux_nationalite: ['Ivoirienne', Validators.required],
          epouse_nom: ['', Validators.required], epouse_profession: ['', Validators.required], epouse_nationalite: ['Ivoirienne', Validators.required],
          date_mariage: ['', Validators.required]
        };
      } else if (type === "Demande d'acte de décès") {
        controls = { defunt_nom: ['', Validators.required], date_deces: ['', Validators.required] };
      }
    } else if (this.module === 'communication') {
      controls = { sujet: ['', Validators.required], message: ['', Validators.required] };
    } else if (this.module === 'urbanisme') {
      controls = { parcelle: ['', Validators.required], superficie: ['', Validators.required], usage: ['', Validators.required], description: ['', Validators.required] };
    } else if (this.module === 'services-techniques') {
      controls = { adresse: ['', Validators.required], repere: [''], urgence: ['', Validators.required], description: ['', Validators.required] };
    } else if (this.module === 'patrimoine') {
      controls = { espace: ['', Validators.required], date_prevue: ['', Validators.required], heure_debut: ['', Validators.required], heure_fin: ['', Validators.required], participants: [''], motif: ['', Validators.required] };
    } else if (this.module === 'finances') {
      controls = { reference_facture: ['', Validators.required], montant: ['', Validators.required], mode_paiement: ['', Validators.required] };
    } else if (this.module === 'rh') {
      controls = { nom_complet: ['', Validators.required], telephone: ['', Validators.required], poste: ['', Validators.required] };
    }

    this.demandeForm = this.fb.group(controls);
  }

  loadDemarches() {
    this.citoyenService.getDemarches().subscribe((res: {data: Demarche[]}) => {
      // Filtrer pour ne garder que les démarches de ce module
      this.mesDemarches.set(res.data.filter(d => d.module === this.module));
    });
  }

  selectedFiles: File[] = [];
  showPaymentModal = signal(false);
  paymentMethod = signal('wave');

  needsPayment(): boolean {
    const type = this.typeControl.value;
    if (this.module === 'urbanisme' || this.module === 'finances' || this.module === 'patrimoine') return true;
    if (this.module === 'etat-civil' && type === "Demande d'acte de mariage") return true;
    return false;
  }

  onInitiateSubmit() {
    if (this.demandeForm.invalid) {
      this.toast.showError('demande-err', 'Veuillez remplir tous les champs obligatoires.', 'Erreur');
      return;
    }
    if (this.needsPayment()) {
      this.showPaymentModal.set(true);
    } else {
      this.onSubmit();
    }
  }

  processPayment() {
    this.loading.set(true);
    // Simulation API de paiement (2s)
    setTimeout(() => {
      this.toast.show('paiement-ok', 'Paiement effectué avec succès via ' + this.paymentMethod().toUpperCase());
      this.showPaymentModal.set(false);
      this.onSubmit(true); // Passer true pour indiquer que c'est payé
    }, 2000);
  }

  onSubmit(isPaid: boolean = false) {
    this.loading.set(true);
    const formData = new FormData();
    formData.append('module', this.module);
    if (this.typeControl.value) {
      formData.append('type_demarche', this.typeControl.value);
    }
    
    // Si la démarche nécessitait un paiement, on l'ajoute dans les données
    const donnees = this.demandeForm.value;
    if (isPaid) {
      donnees['paiement'] = { statut: 'Payé', methode: this.paymentMethod(), date: new Date().toISOString() };
    }
    
    formData.append('donnees', JSON.stringify(donnees));
    
    this.selectedFiles.forEach(f => formData.append('files[]', f));

    this.citoyenService.createDemarche(formData).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.toast.show('demande-ok', 'Votre demande a été soumise avec succès.');
        this.demandeForm.reset();
        this.selectedFiles = [];
        this.loadDemarches(); // Reload tracking list
      },
      error: () => {
        this.loading.set(false);
        this.toast.showError('demande-api-err', 'Impossible de soumettre la demande.', 'Erreur');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles.push(file);
      this.toast.show('file-ok', `Fichier ${file.name} sélectionné avec succès.`);
    }
  }

  getStatutLabel(statut: string): string {
    return this.citoyenService.labelForStatut(statut);
  }
}
