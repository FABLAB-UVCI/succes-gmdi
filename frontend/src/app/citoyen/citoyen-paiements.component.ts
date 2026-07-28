import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CitoyenService, Demarche } from './citoyen.service';
import { ToastService } from '../communication/core/services/toast.service';

interface Taxe {
  code: string;
  libelle: string;
  description: string;
  montant: number;
}

interface MoyenPaiement {
  code: string;
  label: string;
  icone: string;
  couleur: string;
  texte: string;
}

const TAXES_CATALOGUE: Taxe[] = [
  { code: 'patente', libelle: 'Patente commerciale', description: 'Taxe annuelle sur l\'activité commerciale', montant: 45000 },
  { code: 'taxe_residence', libelle: 'Taxe de résidence', description: 'Taxe due par tout résident de la commune', montant: 12000 },
  { code: 'droits_etat_civil', libelle: "Droits d'état civil", description: 'Frais de délivrance d\'actes et certificats', montant: 2000 },
  { code: 'redevance_marchande', libelle: 'Redevance marchande', description: 'Occupation d\'une place de marché communal', montant: 5000 },
  { code: 'loyer_domanial', libelle: 'Loyer domanial', description: 'Loyer d\'un bien ou terrain communal', montant: 25000 },
  { code: 'amende_stationnement', libelle: 'Amende de stationnement', description: 'Infraction au stationnement réglementé', montant: 3000 },
];

const MOYENS_PAIEMENT: MoyenPaiement[] = [
  { code: 'orange_money', label: 'Orange Money', icone: 'ti ti-device-mobile', couleur: '#FF6600', texte: '#fff' },
  { code: 'wave', label: 'Wave', icone: 'ti ti-wave-square', couleur: '#1DC8E4', texte: '#012169' },
  { code: 'mtn_momo', label: 'MTN MoMo', icone: 'ti ti-device-mobile', couleur: '#FFCC00', texte: '#1a1a1a' },
  { code: 'moov_money', label: 'Moov Money', icone: 'ti ti-device-mobile', couleur: '#0066B3', texte: '#fff' },
  { code: 'carte_bancaire', label: 'Carte bancaire', icone: 'ti ti-credit-card', couleur: '#003366', texte: '#fff' },
  { code: 'guichet', label: 'Paiement au guichet (Cash)', icone: 'ti ti-building-bank', couleur: '#6b7280', texte: '#fff' },
];

@Component({
  selector: 'app-citoyen-paiements',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pay-container">
      <div class="header">
        <a routerLink="/citoyen" class="btn-back"><i class="ti ti-arrow-left"></i> Retour</a>
        <h1>Paiement des taxes et redevances</h1>
        <p>Consultez vos taxes, choisissez un moyen de paiement et suivez vos règlements.</p>
        <a routerLink="/citoyen/finances/demande" class="link-autre">
          <i class="ti ti-file-invoice"></i> Autre demande (règlement de facture, litige...) →
        </a>
      </div>

      @if (!selectedTaxe()) {
        <div class="card">
          <h2><i class="ti ti-receipt-tax"></i> Taxes et redevances disponibles</h2>
          <div class="taxes-grid">
            @for (t of taxes; track t.code) {
              <div class="taxe-card" (click)="choisirTaxe(t)">
                <div class="tc-head">
                  <span class="tc-label">{{ t.libelle }}</span>
                  <span class="tc-montant">{{ t.montant | number:'1.0-0':'fr-FR' }} FCFA</span>
                </div>
                <p class="tc-desc">{{ t.description }}</p>
                <span class="tc-cta">Payer maintenant <i class="ti ti-arrow-right"></i></span>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="card">
          <div class="d-header">
            <h2><i class="ti ti-cash-banknote"></i> Paiement — {{ selectedTaxe()!.libelle }}</h2>
            <button class="btn-cancel" (click)="annulerSelection()"><i class="ti ti-x"></i> Changer</button>
          </div>

          <div class="montant-box">
            <span>Montant à régler</span>
            <strong>{{ selectedTaxe()!.montant | number:'1.0-0':'fr-FR' }} FCFA</strong>
          </div>

          <h3>Choisissez votre moyen de paiement</h3>
          <div class="moyens-grid">
            @for (m of moyens; track m.code) {
              <button
                class="moyen-badge"
                [class.selected]="moyenChoisi() === m.code"
                [style.background]="m.couleur"
                [style.color]="m.texte"
                (click)="moyenChoisi.set(m.code)">
                <i [class]="m.icone"></i>
                <span>{{ m.label }}</span>
                @if (moyenChoisi() === m.code) { <i class="ti ti-circle-check-filled check"></i> }
              </button>
            }
          </div>

          <button class="btn-payer" [disabled]="!moyenChoisi() || loading()" (click)="onInitiatePayer()">
            <i class="ti ti-lock" style="margin-right:8px;"></i>
            {{ loading() ? 'Traitement en cours...' : 'Payer' }}
          </button>
        </div>
      }

      <!-- Historique des paiements -->
      <div class="card">
        <h2><i class="ti ti-history"></i> Historique de mes paiements</h2>
        @if (mesPaiements().length === 0) {
          <div class="empty-state">
            <i class="ti ti-receipt-off"></i>
            <p>Aucun paiement enregistré pour le moment.</p>
          </div>
        } @else {
          <div class="paiement-list">
            @for (d of mesPaiements(); track d.id) {
              <div class="paiement-item">
                <div class="p-left">
                  <span class="p-ref">{{ d.reference }}</span>
                  <span class="p-type">{{ d.type_demarche || d.donnees?.type_taxe }}</span>
                  <span class="p-date">Soumis le {{ d.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
                  @if (d.commentaire_gestionnaire) {
                    <span class="p-commentaire"><i class="ti ti-message-circle"></i> {{ d.commentaire_gestionnaire }}</span>
                  }
                </div>
                <div class="p-right">
                  @if (d.donnees?.montant) {
                    <span class="p-montant">{{ d.donnees.montant | number:'1.0-0':'fr-FR' }} FCFA</span>
                  }
                  <span class="p-statut" [ngClass]="d.statut">{{ getStatutLabel(d.statut) }}</span>
                  @if (d.donnees?.document_officiel) {
                    <a [href]="d.donnees.document_officiel" target="_blank" class="btn-recu" title="Télécharger le reçu">
                      <i class="ti ti-download"></i> Reçu
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Modal de simulation de paiement -->
      @if (showPaymentModal()) {
        <div class="modal-overlay" (click)="showPaymentModal.set(false)">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-icon"><i class="ti ti-shield-lock"></i></div>
            <h3>Passerelle de paiement — {{ labelMoyen(moyenChoisi()) }}</h3>
            <p>Cette interface simule la redirection vers l'opérateur de paiement choisi. L'intégration réelle avec l'API {{ labelMoyen(moyenChoisi()) }} sera effectuée ultérieurement.</p>
            <div class="modal-montant">{{ selectedTaxe()?.montant | number:'1.0-0':'fr-FR' }} FCFA</div>
            <button class="btn-confirm" [disabled]="loading()" (click)="confirmerPaiement()">
              @if (loading()) {
                <span><i class="ti ti-loader-2 spin"></i> Traitement en cours...</span>
              } @else {
                <span><i class="ti ti-check"></i> Confirmer le paiement (simulation)</span>
              }
            </button>
          </div>
        </div>
      }
    </div>

    <style>
      .pay-container { padding: 2rem; max-width: 1100px; margin: 0 auto; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; gap: 1.5rem; }
      .header { margin-bottom: .5rem; }
      .btn-back { display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #003366; font-weight: 600; margin-bottom: 1rem; }
      .btn-back:hover { text-decoration: underline; }
      .header h1 { font-size: 2rem; color: #003366; margin: 0 0 0.5rem 0; }
      .header p { color: #4a5568; margin: 0 0 0.5rem; }
      .link-autre { font-size: 0.85rem; font-weight: 600; color: #F77F00; text-decoration: none; }
      .link-autre:hover { text-decoration: underline; }

      .card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
      .card h2 { font-size: 1.2rem; color: #003366; margin-top: 0; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #edf2f7; display: flex; align-items: center; gap: 8px; }

      .taxes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
      .taxe-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.2rem; cursor: pointer; transition: all .15s; background: #f8fafc; }
      .taxe-card:hover { border-color: #009A44; box-shadow: 0 4px 14px rgba(0,154,68,.12); transform: translateY(-2px); }
      .tc-head { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; margin-bottom: .5rem; }
      .tc-label { font-weight: 700; color: #003366; }
      .tc-montant { font-weight: 700; color: #009A44; white-space: nowrap; }
      .tc-desc { font-size: .82rem; color: #718096; margin: 0 0 .8rem; }
      .tc-cta { font-size: .8rem; font-weight: 600; color: #F77F00; display: flex; align-items: center; gap: 4px; }

      .d-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #edf2f7; }
      .d-header h2 { border: none; margin: 0; padding: 0; }
      .btn-cancel { background: #f0f4f8; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 8px; cursor: pointer; color: #003366; font-weight: 600; font-size: .82rem; display: flex; align-items: center; gap: 4px; }
      .btn-cancel:hover { background: #e2e8f0; }

      .montant-box { display: flex; justify-content: space-between; align-items: center; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 1rem 1.4rem; margin-bottom: 1.5rem; }
      .montant-box span { color: #166534; font-weight: 600; }
      .montant-box strong { color: #009A44; font-size: 1.4rem; }

      h3 { font-size: .95rem; color: #334155; margin: 0 0 1rem; }
      .moyens-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: .8rem; margin-bottom: 1.5rem; }
      .moyen-badge { position: relative; border: none; border-radius: 10px; padding: 1rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: .4rem; font-weight: 700; font-size: .85rem; transition: all .15s; opacity: .88; }
      .moyen-badge i:not(.check) { font-size: 1.4rem; }
      .moyen-badge:hover { opacity: 1; transform: translateY(-2px); }
      .moyen-badge.selected { opacity: 1; box-shadow: 0 0 0 3px rgba(0,51,102,.25); }
      .moyen-badge .check { position: absolute; top: 6px; right: 6px; font-size: 1rem; }

      .btn-payer { width: 100%; padding: 1rem; background: #009A44; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; }
      .btn-payer:hover:not(:disabled) { background: #007a36; }
      .btn-payer:disabled { opacity: .6; cursor: not-allowed; }

      .empty-state { text-align: center; padding: 3rem 1rem; color: #a0aec0; }
      .empty-state i { font-size: 3rem; margin-bottom: 1rem; }

      .paiement-list { display: flex; flex-direction: column; gap: .8rem; }
      .paiement-item { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .8rem; padding: 1rem; border: 1px solid #edf2f7; border-radius: 8px; background: #f8fafc; }
      .p-left { display: flex; flex-direction: column; gap: .2rem; }
      .p-ref { font-weight: 700; color: #003366; font-size: .9rem; }
      .p-type { font-size: .82rem; color: #4a5568; }
      .p-date { font-size: .75rem; color: #a0aec0; }
      .p-commentaire { font-size: .78rem; color: #7a5c3a; font-style: italic; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
      .p-right { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
      .p-montant { font-weight: 700; color: #003366; }
      .p-statut { padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
      .p-statut.en_attente { background: #fff3cd; color: #856404; }
      .p-statut.en_cours { background: #cce5ff; color: #004085; }
      .p-statut.valide, .p-statut.termine { background: #d4edda; color: #155724; }
      .p-statut.refuse { background: #f8d7da; color: #721c24; }
      .btn-recu { display: inline-flex; align-items: center; gap: 0.3rem; background: #fef2f2; color: #ef4444; border: 1px solid #fca5a5; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-decoration: none; }
      .btn-recu:hover { background: #ef4444; color: #fff; }

      .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(2px); }
      .modal-content { background: #fff; width: 440px; max-width: 92vw; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.25); padding: 2rem; text-align: center; }
      .modal-icon { font-size: 2.5rem; color: #003366; margin-bottom: .8rem; }
      .modal-content h3 { color: #003366; margin: 0 0 .8rem; font-size: 1.1rem; }
      .modal-content p { color: #718096; font-size: .85rem; margin: 0 0 1.2rem; line-height: 1.5; }
      .modal-montant { font-size: 1.6rem; font-weight: 800; color: #009A44; margin-bottom: 1.5rem; }
      .btn-confirm { width: 100%; padding: .9rem; background: #003366; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
      .btn-confirm:hover:not(:disabled) { background: #004fa3; }
      .btn-confirm:disabled { opacity: .7; cursor: not-allowed; }
      .spin { animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 640px) {
        .pay-container { padding: 1rem; }
        .paiement-item { flex-direction: column; align-items: flex-start; }
      }
    </style>
  `
})
export class CitoyenPaiementsComponent implements OnInit {
  private citoyenService = inject(CitoyenService);
  private toast = inject(ToastService);

  taxes = TAXES_CATALOGUE;
  moyens = MOYENS_PAIEMENT;

  loading = signal(false);
  selectedTaxe = signal<Taxe | null>(null);
  moyenChoisi = signal<string>('');
  showPaymentModal = signal(false);
  mesPaiements = signal<Demarche[]>([]);

  ngOnInit() {
    this.loadPaiements();
  }

  loadPaiements() {
    this.citoyenService.getDemarches().subscribe((res: { data: Demarche[] }) => {
      this.mesPaiements.set(res.data.filter(d => d.module === 'finances'));
    });
  }

  choisirTaxe(t: Taxe) {
    this.selectedTaxe.set(t);
    this.moyenChoisi.set('');
  }

  annulerSelection() {
    this.selectedTaxe.set(null);
    this.moyenChoisi.set('');
  }

  labelMoyen(code: string): string {
    return this.moyens.find(m => m.code === code)?.label ?? '';
  }

  onInitiatePayer() {
    if (!this.selectedTaxe() || !this.moyenChoisi()) {
      this.toast.showError('paiement-err', 'Veuillez choisir un moyen de paiement.', 'Erreur');
      return;
    }
    this.showPaymentModal.set(true);
  }

  confirmerPaiement() {
    const taxe = this.selectedTaxe();
    if (!taxe) return;
    this.loading.set(true);

    // Simulation de passerelle de paiement (aucune intégration réelle avec les opérateurs)
    setTimeout(() => {
      const formData = new FormData();
      formData.append('module', 'finances');
      formData.append('type_demarche', 'Paiement de taxe municipale');
      formData.append('donnees', JSON.stringify({
        type_taxe: taxe.libelle,
        montant: taxe.montant,
        mode_paiement: this.labelMoyen(this.moyenChoisi()),
      }));

      this.citoyenService.createDemarche(formData).subscribe({
        next: () => {
          this.loading.set(false);
          this.showPaymentModal.set(false);
          this.toast.show('paiement-ok', 'Paiement soumis avec succès. Il sera validé par le service des Finances.');
          this.annulerSelection();
          this.loadPaiements();
        },
        error: () => {
          this.loading.set(false);
          this.toast.showError('paiement-api-err', 'Impossible de soumettre le paiement.', 'Erreur');
        }
      });
    }, 2000);
  }

  getStatutLabel(statut: string): string {
    return this.citoyenService.labelForStatut(statut);
  }
}
