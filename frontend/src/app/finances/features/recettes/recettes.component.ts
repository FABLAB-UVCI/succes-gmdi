// src/app/features/recettes/recettes.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { FinancesService } from '../../core/services/finances.service';
import { ToastService } from '../../core/services/toast.service';
import { FcfaPipe } from '../../shared/pipes/fcfa.pipe';
import { Recette, ModePaiement } from '../../core/models/finances.models';
import { QRCodeComponent } from 'angularx-qrcode';

type RecetteTab = 'saisie' | 'liste' | 'enc';

@Component({
  selector: 'app-recettes',
  standalone: true,
  imports: [FormsModule, NgClass, FcfaPipe, QRCodeComponent],
  template: `
    <div class="nav">
      @for (tab of tabs; track tab.id) {
        <div class="ni" [class.active]="activeTab() === tab.id" (click)="setTab(tab.id)">
          <i [class]="'ti ' + tab.icon"></i>{{ tab.label }}
        </div>
      }
    </div>

    <!-- ═══ SAISIE ═══ -->
    @if (activeTab() === 'saisie') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-plus"></i>{{ editingId() ? "Modifier la recette" : "Enregistrement d'une recette" }}</h3></div>
        @if (toastMsg()) {
          <div class="alert-ok show" [class.error]="toastIsError()"><i class="ti" [class.ti-check]="!toastIsError()" [class.ti-alert-circle]="toastIsError()"></i>{{ toastMsg() }}</div>
        }
        <div class="pb">
          <div class="fs">Contribuable</div>
          <div class="fr">
            <div class="fg">
              <div class="fl">Nom du contribuable <span class="req">*</span></div>
              <input class="fi" [class.invalid]="submitAttempted() && !form.contribuable" type="text" [(ngModel)]="form.contribuable" placeholder="Nom complet ou raison sociale">
              @if (submitAttempted() && !form.contribuable) { <small class="field-error">Champ obligatoire</small> }
            </div>
            <div class="fg">
              <div class="fl">Adresse</div>
              <input class="fi" type="text" [(ngModel)]="form.adresse" placeholder="Adresse du contribuable">
            </div>
          </div>
          <div class="fs">Taxe ou redevance</div>
          <div class="fr">
            <div class="fg">
              <div class="fl">Type de taxe <span class="req">*</span></div>
              <select class="fsel" [class.invalid]="submitAttempted() && !form.typeTaxe" [(ngModel)]="form.typeTaxe">
                <option value="">-- Choisir --</option>
                <option value="taxe_fonciere">Taxe foncière</option>
                <option value="taxe_habitation">Taxe d'habitation</option>
                <option value="patente">Patente</option>
                <option value="taxe_marche">Taxe de marché</option>
                <option value="droit_domaine">Droit de domaine</option>
                <option value="droit_administratif">Droit administratif</option>
                <option value="taxe_publicite">Taxe de publicité</option>
                <option value="taxe_stationnement">Taxe de stationnement</option>
              </select>
              @if (submitAttempted() && !form.typeTaxe) { <small class="field-error">Champ obligatoire</small> }
            </div>
            <div class="fg">
              <div class="fl">Service émetteur</div>
              <select class="fsel" [(ngModel)]="form.serviceEmetteur">
                <option value="finances">Finances</option>
                <option value="etat_civil">État Civil</option>
                <option value="urbanisme">Urbanisme</option>
                <option value="marche">Marchés</option>
                <option value="domaine">Domaine</option>
              </select>
            </div>
          </div>
          <div class="fr3">
            <div class="fg">
              <div class="fl">Montant (FCFA) <span class="req">*</span></div>
              <input class="fi" [class.invalid]="submitAttempted() && !form.montant" type="number" [(ngModel)]="form.montant" placeholder="Ex: 85000">
              @if (submitAttempted() && !form.montant) { <small class="field-error">Champ obligatoire</small> }
            </div>
            <div class="fg">
              <div class="fl">Date d'échéance <span class="req">*</span></div>
              <input class="fi" [class.invalid]="submitAttempted() && !form.dateEcheance" type="date" [(ngModel)]="form.dateEcheance">
              @if (submitAttempted() && !form.dateEcheance) { <small class="field-error">Champ obligatoire</small> }
            </div>
            <div class="fg">
              <div class="fl">Mode de paiement</div>
              <select class="fsel" [(ngModel)]="form.modePaiement">
                <option value="especes">Espèces</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="virement">Virement</option>
                <option value="cheque">Chèque</option>
              </select>
            </div>
          </div>
          <div class="fr">
            <div class="fg">
              <div class="fl">Opérateur Mobile Money</div>
              <select class="fsel" [(ngModel)]="form.operateur">
                <option value="">-- Si Mobile Money --</option>
                <option>Orange Money</option><option>MTN MoMo</option>
                <option>Wave</option><option>Moov Money</option>
              </select>
            </div>
            <div class="fg">
              <div class="fl">N° Transaction</div>
              <input class="fi" type="text" [(ngModel)]="form.numeroTransaction" placeholder="Ex: OM-2025-887234">
            </div>
          </div>
          <div class="fa">
            <button class="bs" (click)="resetForm()"><i class="ti ti-x"></i>Effacer</button>
            <button class="bp" (click)="creerRecette()">
              @if (editingId()) { <i class="ti ti-check"></i>Enregistrer les modifications }
              @else { <i class="ti ti-check"></i>Créer la recette }
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ═══ LISTE ═══ -->
    @if (activeTab() === 'liste') {
      <div class="card">
        <div class="ch">
          <h3><i class="ti ti-list"></i>Registre des recettes</h3>
          <div class="ha">
            <button class="bs" (click)="svc.exportJSON(svc.recettes(),'recettes')"><i class="ti ti-download"></i>Exporter JSON</button>
            <button class="bd"><i class="ti ti-printer"></i>Imprimer</button>
          </div>
        </div>
        <div class="tf">
          <input class="fin" type="text" [(ngModel)]="searchQ" (ngModelChange)="onSearch()" placeholder="Rechercher contribuable...">
          <select class="fsel2" [(ngModel)]="filtreType" (ngModelChange)="onSearch()">
            <option value="">Tous types</option>
            <option value="taxe_fonciere">Taxe foncière</option>
            <option value="patente">Patente</option>
            <option value="taxe_marche">Taxe marché</option>
            <option value="droit_domaine">Droit domaine</option>
          </select>
          <select class="fsel2" [(ngModel)]="filtreStatut" (ngModelChange)="onSearch()">
            <option value="">Tous statuts</option>
            <option value="paye">Payé</option>
            <option value="en_attente">En attente</option>
            <option value="retard">En retard</option>
          </select>
          <span class="rc">{{ recettesFiltrees().length }} recette(s)</span>
        </div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead>
              <tr><th>Référence</th><th>Contribuable</th><th>Type</th><th>Montant</th><th>Échéance</th><th>Mode</th><th>Statut</th><th>Action</th></tr>
            </thead>
            <tbody>
              @for (r of recettesFiltrees(); track r.id) {
                <tr>
                  <td class="mono">{{ r.reference }}</td>
                  <td class="bold">{{ r.contribuable }}</td>
                  <td>{{ r.typeTaxe.replace('_',' ') }}</td>
                  <td class="right bold">{{ r.montant | fcfa }}</td>
                  <td>{{ r.dateEcheance }}</td>
                  <td>{{ r.modePaiement || '-' }}</td>
                  <td><span class="chip" [ngClass]="statutClass(r.statut)">{{ r.statut }}</span></td>
                  <td>
                    @if (r.statut !== 'paye') {
                      <button class="bti ok" title="Encaisser" (click)="encaisser(r.id, r.contribuable)">
                        <i class="ti ti-cash"></i>
                      </button>
                    }
                    <button class="bti" title="Modifier" (click)="editerRecette(r)"><i class="ti ti-edit"></i></button>
                    <button class="bti danger" title="Supprimer" (click)="supprimerRecette(r)"><i class="ti ti-trash"></i></button>
                    <button class="bti" title="Reçu (export JSON)" (click)="exporterRecu(r)"><i class="ti ti-receipt"></i></button>
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Total encaissé</td>
                <td class="right" style="color:#009A44">{{ totalEncaisse() | fcfa }}</td>
                <td colspan="4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    }

    <!-- ═══ ENCAISSEMENT ═══ -->
    @if (activeTab() === 'enc') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-cash"></i>Enregistrement d'un encaissement</h3></div>
        @if (toastMsg()) {
          <div class="alert-ok show"><i class="ti ti-check"></i>{{ toastMsg() }}</div>
        }
        <div class="pb">
          <div class="fr">
            <div class="fg">
              <div class="fl">N° Recette ou contribuable <span class="req">*</span></div>
              <input class="fi" type="text" [(ngModel)]="enc.ref" placeholder="Ex: TX-2025-10284">
            </div>
            <div class="fg">
              <div class="fl">Montant encaissé (FCFA) <span class="req">*</span></div>
              <input class="fi" type="number" [(ngModel)]="enc.montant" placeholder="Montant reçu">
            </div>
          </div>
          <div class="fr3">
            <div class="fg">
              <div class="fl">Mode de paiement <span class="req">*</span></div>
              <select class="fsel" [(ngModel)]="enc.mode">
                <option value="especes">Espèces</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="virement">Virement</option>
                <option value="cheque">Chèque</option>
              </select>
            </div>
            <div class="fg">
              <div class="fl">Opérateur</div>
              <select class="fsel" [(ngModel)]="enc.operateur">
                <option value="">-- Mobile Money --</option>
                <option>Orange Money</option><option>MTN MoMo</option><option>Wave</option>
              </select>
            </div>
            <div class="fg">
              <div class="fl">N° Transaction</div>
              <input class="fi" type="text" [(ngModel)]="enc.txn" placeholder="Ex: OM-2025-...">
            </div>
          </div>
          @if (enc.ref || enc.montant) {
            <div class="fr" style="justify-content:center;margin-top:.5rem">
              <div style="text-align:center">
                <div class="fl" style="margin-bottom:.5rem">QR Code de paiement</div>
                <div style="display:inline-block;padding:8px;background:#fff;border-radius:8px;border:1px solid #e0e0e0">
                  <qrcode
                    [qrdata]="qrData()"
                    [width]="160"
                    [errorCorrectionLevel]="'M'"
                    [colorDark]="'#185FA5'"
                    [colorLight]="'#ffffff'">
                  </qrcode>
                </div>
                <div style="font-size:.7rem;color:#888;margin-top:.25rem">Scannez pour payer</div>
              </div>
            </div>
          }
          <div class="fa">
            <button class="bp" (click)="validerEncaissement()"><i class="ti ti-cash"></i>Valider l'encaissement</button>
          </div>
        </div>
      </div>
    }
  `
})
export class RecettesComponent {
  svc   = inject(FinancesService);
  toast = inject(ToastService);

  activeTab = signal<RecetteTab>('saisie');
  toastMsg  = signal('');
  toastIsError = signal(false);
  editingId = signal<string | null>(null);
  submitAttempted = signal(false);

  searchQ     = '';
  filtreType  = '';
  filtreStatut = '';

  tabs = [
    { id: 'saisie' as RecetteTab, label: 'Nouvelle recette',    icon: 'ti-plus' },
    { id: 'liste'  as RecetteTab, label: 'Liste des recettes',  icon: 'ti-list' },
    { id: 'enc'    as RecetteTab, label: 'Encaissement',        icon: 'ti-cash' },
  ];

  form = { contribuable:'', adresse:'', typeTaxe:'', serviceEmetteur:'finances', montant:null as number|null, dateEcheance:'', modePaiement:'especes' as ModePaiement, operateur:'', numeroTransaction:'' };
  enc  = { ref:'', montant:null as number|null, mode:'especes', operateur:'', txn:'' };

  recettesFiltrees = computed(() => {
    let d = [...this.svc.recettes()];
    if (this.searchQ) d = d.filter(r => r.contribuable.toLowerCase().includes(this.searchQ.toLowerCase()) || r.reference.includes(this.searchQ));
    if (this.filtreType)   d = d.filter(r => r.typeTaxe === this.filtreType);
    if (this.filtreStatut) d = d.filter(r => r.statut   === this.filtreStatut);
    return d;
  });

  totalEncaisse = computed(() =>
    this.recettesFiltrees().filter(r => r.statut === 'paye').reduce((s, r) => s + r.montant, 0)
  );

  setTab(t: RecetteTab): void { this.activeTab.set(t); }
  onSearch(): void { /* computed auto-refresh */ }

  statutClass(s: string): string {
    const m: Record<string, string> = { paye:'cv', en_attente:'cp', retard:'cr' };
    return m[s] || 'cp';
  }

  creerRecette(): void {
    this.submitAttempted.set(true);
    if (!this.form.contribuable || !this.form.typeTaxe || !this.form.montant || !this.form.dateEcheance) {
      this.showToast('Veuillez remplir les champs obligatoires (*)', true); return;
    }
    const payload = {
      contribuable: this.form.contribuable,
      typeTaxe: this.form.typeTaxe,
      montant: this.form.montant,
      dateEcheance: this.form.dateEcheance,
      modePaiement: this.form.modePaiement,
      statut: 'en_attente' as const,
      adresse: this.form.adresse,
      serviceEmetteur: this.form.serviceEmetteur,
      operateur: this.form.operateur,
      numeroTransaction: this.form.numeroTransaction
    };
    if (this.editingId()) {
      this.svc.modifierRecette(this.editingId()!, payload);
      this.showToast('Recette modifiée');
    } else {
      this.svc.ajouterRecette(payload);
      this.showToast('Recette créée');
    }
    this.resetForm();
  }

  editerRecette(r: Recette): void {
    this.editingId.set(r.id);
    this.form = {
      contribuable: r.contribuable,
      adresse: r.adresse || '',
      typeTaxe: r.typeTaxe,
      serviceEmetteur: r.serviceEmetteur || 'finances',
      montant: r.montant,
      dateEcheance: r.dateEcheance,
      modePaiement: r.modePaiement || 'especes',
      operateur: r.operateur || '',
      numeroTransaction: r.numeroTransaction || ''
    };
    this.activeTab.set('saisie');
  }

  supprimerRecette(r: Recette): void {
    if (!confirm(`Supprimer la recette de ${r.contribuable} (${r.reference}) ?`)) return;
    this.svc.supprimerRecette(r.id);
  }

  exporterRecu(r: Recette): void {
    this.svc.exportJSON(r, 'recu_' + r.reference);
    this.showToast('Reçu exporté — ' + r.reference);
  }

  encaisser(id: string, nom: string): void {
    this.svc.encaisserRecette(id);
    this.showToast('Encaissement validé — ' + nom);
  }

  qrData(): string {
    return `GMDI-ENCAISSEMENT|REF:${this.enc.ref || 'N/A'}|MONTANT:${this.enc.montant || 0} FCFA|MODE:${this.enc.mode}`;
  }

  validerEncaissement(): void {
    if (!this.enc.ref || !this.enc.montant) { this.showToast('Référence et montant obligatoires', true); return; }
    this.showToast('Encaissement validé — Reçu généré — ' + this.enc.ref);
    this.enc.ref = ''; this.enc.montant = null;
  }

  resetForm(): void {
    this.form = { contribuable:'', adresse:'', typeTaxe:'', serviceEmetteur:'finances', montant:null, dateEcheance:'', modePaiement:'especes', operateur:'', numeroTransaction:'' };
    this.editingId.set(null);
    this.submitAttempted.set(false);
  }

  private showToast(msg: string, isError = false): void {
    this.toastMsg.set(msg);
    this.toastIsError.set(isError);
    setTimeout(() => this.toastMsg.set(''), isError ? 5000 : 3500);
  }
}
