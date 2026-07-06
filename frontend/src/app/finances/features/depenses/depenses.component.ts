// src/app/features/depenses/depenses.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { FinancesService } from '../../core/services/finances.service';
import { ToastService } from '../../core/services/toast.service';
import { FcfaPipe } from '../../shared/pipes/fcfa.pipe';
import { Chapitre } from '../../core/models/finances.models';

type DepTab = 'dsaisie' | 'dliste' | 'salaires';

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [FormsModule, NgClass, FcfaPipe],
  template: `
    <div class="nav">
      @for (tab of tabs; track tab.id) {
        <div class="ni" [class.active]="activeTab() === tab.id" (click)="setTab(tab.id)">
          <i [class]="'ti ' + tab.icon"></i>{{ tab.label }}
        </div>
      }
    </div>

    <!-- ═══ SAISIE ═══ -->
    @if (activeTab() === 'dsaisie') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-file-invoice"></i>Engagement d'une dépense</h3></div>
        @if (toastMsg()) {
          <div class="alert-ok show"><i class="ti ti-check"></i>{{ toastMsg() }}</div>
        }
        <div class="pb">
          <div class="fs">Objet de la dépense</div>
          <div class="fr">
            <div class="fg">
              <div class="fl">Objet <span class="req">*</span></div>
              <input class="fi" type="text" [(ngModel)]="form.objet" placeholder="Description de la dépense">
            </div>
            <div class="fg">
              <div class="fl">Fournisseur <span class="req">*</span></div>
              <input class="fi" type="text" [(ngModel)]="form.fournisseur" placeholder="Nom du fournisseur">
            </div>
          </div>
          <div class="fs">Imputation budgétaire</div>
          <div class="fr3">
            <div class="fg">
              <div class="fl">Chapitre <span class="req">*</span></div>
              <select class="fsel" [(ngModel)]="form.chapitre">
                <option value="">-- Choisir --</option>
                <option value="personnel">Personnel</option>
                <option value="fonctionnement">Fonctionnement</option>
                <option value="investissement">Investissement</option>
                <option value="dette">Dette</option>
              </select>
            </div>
            <div class="fg">
              <div class="fl">Article <span class="req">*</span></div>
              <input class="fi" type="text" [(ngModel)]="form.article" placeholder="Ex: fournitures_bureau">
            </div>
            <div class="fg">
              <div class="fl">Montant (FCFA) <span class="req">*</span></div>
              <input class="fi" type="number" [(ngModel)]="form.montant" placeholder="Montant">
            </div>
          </div>
          <div class="fr">
            <div class="fg">
              <div class="fl">Date d'engagement</div>
              <input class="fi" type="date" [(ngModel)]="form.dateEngagement">
            </div>
            <div class="fg">
              <div class="fl">Description / justification</div>
              <input class="fi" type="text" [(ngModel)]="form.description" placeholder="Détails supplémentaires">
            </div>
          </div>
          <div class="fs">Informations bancaires & justificatif</div>
          <div class="fr">
            <div class="fg">
              <div class="fl">Numéro de compte bancaire</div>
              <input class="fi" type="text" [(ngModel)]="form.numeroCcompte" placeholder="Ex: CI093-00001-12345678901-12">
            </div>
            <div class="fg">
              <div class="fl">Facture / Justificatif</div>
              <div class="upload-zone" [class.has-file]="form.factureName" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
                <input #fileInput type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" (change)="onFileSelect($event)">
                @if (form.factureName) {
                  <span style="color:#009A44"><i class="ti ti-file-check" style="margin-right:4px"></i>{{ form.factureName }}</span>
                  <button type="button" style="margin-left:8px;background:none;border:none;color:#c0392b;cursor:pointer;font-size:.85rem" (click)="removeFile($event)"><i class="ti ti-x"></i></button>
                } @else {
                  <i class="ti ti-upload" style="font-size:1.2rem;color:#888"></i>
                  <span style="color:#888;font-size:.85rem;margin-left:6px">Glisser-déposer ou cliquer pour joindre une facture (PDF, JPG, PNG)</span>
                }
              </div>
            </div>
          </div>
          <div class="fa">
            <button class="bs" (click)="resetForm()"><i class="ti ti-x"></i>Effacer</button>
            <button class="bp" (click)="creerDepense()"><i class="ti ti-check"></i>Engager la dépense</button>
          </div>
        </div>
      </div>
    }

    <!-- ═══ LISTE ═══ -->
    @if (activeTab() === 'dliste') {
      <div class="card">
        <div class="ch">
          <h3><i class="ti ti-list"></i>Registre des dépenses</h3>
          <button class="bs" (click)="svc.exportJSON(svc.depenses(),'depenses')"><i class="ti ti-download"></i>Exporter JSON</button>
        </div>
        <div class="tf">
          <select class="fsel2" [(ngModel)]="filtreChap" (ngModelChange)="onFilter()">
            <option value="">Tous chapitres</option>
            <option value="personnel">Personnel</option>
            <option value="fonctionnement">Fonctionnement</option>
            <option value="investissement">Investissement</option>
          </select>
          <select class="fsel2" [(ngModel)]="filtreStatut" (ngModelChange)="onFilter()">
            <option value="">Tous statuts</option>
            <option value="engage">Engagé</option>
            <option value="paye">Payé</option>
          </select>
          <span class="rc">{{ depensesFiltrees().length }} dépense(s)</span>
        </div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead>
              <tr><th>Référence</th><th>Objet</th><th>Fournisseur</th><th>Chapitre</th><th>Montant</th><th>Date</th><th>Statut</th><th>Action</th></tr>
            </thead>
            <tbody>
              @for (d of depensesFiltrees(); track d.id) {
                <tr>
                  <td class="mono">{{ d.reference }}</td>
                  <td class="bold">{{ d.objet }}</td>
                  <td>{{ d.fournisseur }}</td>
                  <td><span class="chip cb">{{ d.chapitre }}</span></td>
                  <td class="right bold">{{ d.montant | fcfa }}</td>
                  <td>{{ d.dateEngagement }}</td>
                  <td><span class="chip" [ngClass]="statutClass(d.statut)">{{ d.statut }}</span></td>
                  <td>
                    @if (d.statut === 'engage') {
                      <button class="bti ok" title="Payer" (click)="payer(d.id, d.objet)">
                        <i class="ti ti-check"></i>
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- ═══ SALAIRES ═══ -->
    @if (activeTab() === 'salaires') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-users"></i>Paiement des salaires</h3></div>
        <div class="pb">
          <div class="kpi4">
            <div class="kcard"><div class="kv" style="color:#F77F00">180 000 000</div><div class="kl">Masse salariale prévisionnelle</div><div class="ks">FCFA / an 2025</div></div>
            <div class="kcard"><div class="kv" style="color:#009A44">75 000 000</div><div class="kl">Salaires versés Jan–Mai</div><div class="ks">FCFA cumulés</div></div>
            <div class="kcard"><div class="kv" style="color:#185FA5">347</div><div class="kl">Agents à payer</div><div class="ks">Mai 2025</div></div>
            <div class="kcard"><div class="kv" style="color:#009A44">15 000 000</div><div class="kl">Masse salariale mai</div><div class="ks">FCFA</div></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:.75rem">
            <button class="bp" (click)="lancerPaiement()"><i class="ti ti-cash"></i>Lancer le paiement mai 2025</button>
            <button class="bs"><i class="ti ti-download"></i>Exporter état de paie</button>
            <button class="bd"><i class="ti ti-printer"></i>Imprimer bulletins</button>
          </div>
        </div>
      </div>
    }
  `
})
export class DepensesComponent {
  svc   = inject(FinancesService);
  toast = inject(ToastService);

  activeTab = signal<DepTab>('dsaisie');
  toastMsg  = signal('');

  filtreChap   = '';
  filtreStatut = '';

  tabs = [
    { id: 'dsaisie'  as DepTab, label: 'Nouvelle dépense',   icon: 'ti-plus' },
    { id: 'dliste'   as DepTab, label: 'Liste des dépenses', icon: 'ti-list' },
    { id: 'salaires' as DepTab, label: 'Salaires',           icon: 'ti-users' },
  ];

  form = { objet:'', fournisseur:'', chapitre:'' as Chapitre|'', article:'', montant:null as number|null, dateEngagement:'', description:'', numeroCcompte:'', factureName:'', factureFile: null as File|null };

  depensesFiltrees = computed(() => {
    let d = [...this.svc.depenses()];
    if (this.filtreChap)   d = d.filter(x => x.chapitre === this.filtreChap);
    if (this.filtreStatut) d = d.filter(x => x.statut   === this.filtreStatut);
    return d;
  });

  setTab(t: DepTab): void { this.activeTab.set(t); }
  onFilter(): void { /* computed auto-refresh */ }

  statutClass(s: string): string {
    const m: Record<string, string> = { paye:'cv', engage:'cp', rejete:'cr', liquide:'cb' };
    return m[s] || 'cp';
  }

  creerDepense(): void {
    if (!this.form.objet || !this.form.fournisseur || !this.form.chapitre || !this.form.article || !this.form.montant) {
      this.showToast('Veuillez remplir les champs obligatoires'); return;
    }
    const ref = this.svc.ajouterDepense({
      objet: this.form.objet,
      fournisseur: this.form.fournisseur,
      chapitre: this.form.chapitre,
      article: this.form.article,
      montant: this.form.montant,
      dateEngagement: this.form.dateEngagement,
      description: this.form.description,
      statut: 'en_attente'  // Valeur par défaut: 'en_attente', 'valide', 'rejete'
    });
    this.showToast('Dépense engagée — Réf: ' + ref);
    this.resetForm();
  }

  payer(id: string, objet: string): void {
    this.svc.payerDepense(id);
    this.showToast('Dépense payée — ' + objet);
  }

  lancerPaiement(): void {
    this.toast.show('Paiement salaires mai 2025 lancé — 347 agents');
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.form.factureFile = input.files[0];
      this.form.factureName = input.files[0].name;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.form.factureFile = file;
      this.form.factureName = file.name;
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.form.factureFile = null;
    this.form.factureName = '';
  }

  resetForm(): void {
    this.form = { objet:'', fournisseur:'', chapitre:'', article:'', montant:null, dateEngagement:'', description:'', numeroCcompte:'', factureName:'', factureFile: null };
  }

  private showToast(msg: string): void {
    this.toastMsg.set(msg); setTimeout(() => this.toastMsg.set(''), 3500);
  }
}
