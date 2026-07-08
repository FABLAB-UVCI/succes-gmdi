import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RhService } from '../../../../core/services/rh.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast.component';
import { FcfaPipe } from '../../../../shared/pipes/fcfa.pipe';

type Tab = 'salaires' | 'primes' | 'bulletins';

@Component({
  selector: 'app-paie',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, FcfaPipe],
  template: `
<div class="nav">
  @for (t of tabs; track t.id) {
    <div class="ni" [class.act]="activeTab() === t.id" (click)="activeTab.set(t.id)">
      <i class="ti {{ t.icon }}"></i>{{ t.label }}
    </div>
  }
</div>

<!-- ── Salaires ────────────────────────────────────────────────────────── -->
@if (activeTab() === 'salaires') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-cash"></i>Gestion des salaires — Mai 2025</h3></div>
    <div class="pb">
      <div class="kpi4" style="margin-bottom:1rem">
        <div class="kcard"><div class="kv" style="color:#C9A84C">15 000 000</div><div class="kl">Masse salariale mai (FCFA)</div></div>
        <div class="kcard"><div class="kv" style="color:#009A44">347</div><div class="kl">Agents à payer</div></div>
        <div class="kcard"><div class="kv" style="color:#185FA5">43 285</div><div class="kl">Salaire moyen (FCFA)</div></div>
        <div class="kcard"><div class="kv" style="color:#F77F00">2 250 000</div><div class="kl">Total retenues CNPS</div></div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:1rem">
        <button class="bp" (click)="lancerPaiement()"><i class="ti ti-send"></i>Lancer paiement mai 2025</button>
        <button class="bs"><i class="ti ti-download"></i>État de paie</button>
        <button class="bd"><i class="ti ti-printer"></i>Imprimer tous les bulletins</button>
      </div>
      <app-toast [visible]="toast.get('pa')?.visible ?? false" [message]="toast.get('pa')?.message ?? ''" [type]="toast.get('pa')?.type ?? 'success'" />
      <div class="fs">Extrait du journal de paie</div>
      <table class="tbl">
        <thead><tr>
          <th>Matricule</th><th>Agent</th><th>Poste</th>
          <th>Brut (FCFA)</th><th>Retenues</th><th>Net (FCFA)</th>
          <th>Mode</th><th>Statut</th>
        </tr></thead>
        <tbody>
          @for (l of rh.lignesPaie(); track l.matricule) {
            <tr>
              <td class="mono">{{ l.matricule }}</td>
              <td class="bold">{{ l.nomComplet }}</td>
              <td>{{ l.poste.slice(0,25) }}</td>
              <td class="right">{{ l.brut | fcfa }}</td>
              <td class="right" style="color:#E24B4A">{{ l.retenues | fcfa }}</td>
              <td class="right bold" style="color:#009A44">{{ l.net | fcfa }}</td>
              <td>{{ l.mode }}</td>
              <td><span class="chip cv">{{ l.statut }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Primes ──────────────────────────────────────────────────────────── -->
@if (activeTab() === 'primes') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-star"></i>Primes et indemnités</h3></div>
    <app-toast [visible]="toast.get('pr')?.visible ?? false" [message]="toast.get('pr')?.message ?? ''" [type]="toast.get('pr')?.type ?? 'success'" />
    <div class="pb">
      <div class="fs">Attribuer une prime</div>
      <div class="fr3">
        <div class="fg"><div class="fl">Matricule <span class="req">*</span></div><input class="fi" [(ngModel)]="prime.matricule" placeholder="Matricule"></div>
        <div class="fg"><div class="fl">Type de prime <span class="req">*</span></div>
          <select class="fsel" [(ngModel)]="prime.type">
            <option value="">-- Choisir --</option>
            <option value="anciennete">Ancienneté</option>
            <option value="responsabilite">Responsabilité</option>
            <option value="rendement">Rendement</option>
            <option value="transport">Transport</option>
            <option value="logement">Logement</option>
            <option value="risque">Risque</option>
            <option value="exceptionnelle">Prime exceptionnelle</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Montant (FCFA) <span class="req">*</span></div><input class="fi" type="number" [(ngModel)]="prime.montant" placeholder="Ex: 25000"></div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Mois concerné</div>
          <select class="fsel" [(ngModel)]="prime.mois">
            <option>Mai 2025</option><option>Juin 2025</option><option>Juillet 2025</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Justification</div><input class="fi" [(ngModel)]="prime.justification" placeholder="Ex: Performance exceptionnelle Q1"></div>
      </div>
      <div class="fa"><button class="bp" (click)="attribuerPrime()"><i class="ti ti-check"></i>Attribuer la prime</button></div>

      <div class="fs" style="margin-top:.75rem">Types d'indemnités en vigueur</div>
      <table class="tbl">
        <thead><tr><th>Type</th><th>Bénéficiaires</th><th>Montant unitaire (FCFA)</th><th>Total mensuel (FCFA)</th></tr></thead>
        <tbody>
          <tr><td class="bold">Prime d'ancienneté</td><td>280 agents</td><td class="right">10% du salaire de base</td><td class="right">1 500 000</td></tr>
          <tr><td class="bold">Indemnité de responsabilité</td><td>45 agents</td><td class="right">50 000 – 150 000</td><td class="right">3 200 000</td></tr>
          <tr><td class="bold">Indemnité de transport</td><td>312 agents</td><td class="right">25 000</td><td class="right">7 800 000</td></tr>
          <tr><td class="bold">Indemnité de logement</td><td>12 agents</td><td class="right">80 000</td><td class="right">960 000</td></tr>
          <tr><td class="bold">Prime de risque</td><td>28 agents</td><td class="right">15 000</td><td class="right">420 000</td></tr>
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Bulletins de paie ───────────────────────────────────────────────── -->
@if (activeTab() === 'bulletins') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-file-invoice"></i>Bulletins de paie</h3></div>
    <div class="pb">
      <div class="fr3" style="margin-bottom:.75rem">
        <div class="fg"><div class="fl">Rechercher un agent</div><input class="fi" [(ngModel)]="bul.recherche" placeholder="Matricule ou nom"></div>
        <div class="fg"><div class="fl">Mois</div>
          <select class="fsel" [(ngModel)]="bul.mois">
            <option>Mai 2025</option><option>Avril 2025</option><option>Mars 2025</option>
          </select>
        </div>
        <div class="fg" style="justify-content:flex-end;flex-direction:row;align-items:center;padding-top:14px;gap:6px">
          <button class="bp" (click)="voirBulletin()"><i class="ti ti-eye"></i>Voir le bulletin</button>
        </div>
      </div>

      @if (showBulletin()) {
        <div style="border:.5px solid var(--color-border-tertiary);border-radius:8px;padding:1rem;margin-top:.5rem">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem">
            <div>
              <div style="font-size:15px;font-weight:500;color:var(--color-text-primary)">{{ agentBulletin() }}</div>
              <div style="font-size:12px;color:var(--color-text-secondary)">Chef Service État Civil — EC-001</div>
            </div>
            <span class="chip cv">Payé</span>
          </div>
          <table class="tbl" style="margin-bottom:.5rem">
            <thead><tr><th>Élément</th><th>Base</th><th>Montant (FCFA)</th></tr></thead>
            <tbody>
              <tr><td class="bold">Salaire de base</td><td>Indice 800</td><td class="right">450 000</td></tr>
              <tr><td class="bold">Prime d'ancienneté</td><td>10%</td><td class="right">45 000</td></tr>
              <tr><td class="bold">Indemnité responsabilité</td><td>Forfait</td><td class="right">30 000</td></tr>
              <tr><td class="bold">Indemnité transport</td><td>Forfait</td><td class="right">25 000</td></tr>
              <tr style="background:var(--color-background-secondary)"><td class="bold">TOTAL BRUT</td><td></td><td class="right bold">550 000</td></tr>
              <tr><td style="color:#E24B4A">Cotisation CNPS</td><td>3.6%</td><td class="right" style="color:#E24B4A">-18 000</td></tr>
              <tr><td style="color:#E24B4A">Retraite</td><td>3%</td><td class="right" style="color:#E24B4A">-13 500</td></tr>
              <tr><td style="color:#E24B4A">IR retenu à la source</td><td>15%</td><td class="right" style="color:#E24B4A">-67 500</td></tr>
              <tr style="background:var(--color-background-secondary)">
                <td class="bold" style="color:#009A44">NET À PAYER</td><td></td>
                <td class="right bold" style="color:#009A44">451 000</td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex;gap:8px;justify-content:flex-end">
            <button class="bs"><i class="ti ti-download"></i>Télécharger PDF</button>
            <button class="bd"><i class="ti ti-printer"></i>Imprimer</button>
          </div>
        </div>
      }
    </div>
  </div>
}
  `,
})
export class PaieComponent {
  constructor(readonly rh: RhService, readonly toast: ToastService) {}

  activeTab = signal<Tab>('salaires');
  showBulletin = signal(false);
  agentBulletin = signal('TRAORÉ Adjoa');

  tabs = [
    { id: 'salaires'  as Tab, label: 'Salaires',          icon: 'ti-cash'         },
    { id: 'primes'    as Tab, label: 'Primes & indemnités',icon: 'ti-star'         },
    { id: 'bulletins' as Tab, label: 'Bulletins de paie',  icon: 'ti-file-invoice' },
  ];

  prime = { matricule: '', type: '', montant: null as number|null, mois: 'Mai 2025', justification: '' };
  bul = { recherche: '', mois: 'Mai 2025' };

  lancerPaiement(): void {
    this.toast.show('pa', 'Paiement des salaires mai 2025 lancé — 347 agents — 15 000 000 FCFA');
  }

  attribuerPrime(): void {
    if (!this.prime.matricule || !this.prime.type || !this.prime.montant) {
      this.toast.showError('pr', 'Remplir tous les champs obligatoires'); return;
    }
    this.toast.show('pr', `Prime attribuée — ${this.prime.matricule} — ${this.prime.type} : ${this.rh.formaterFCFA(this.prime.montant)}`);
    this.prime = { matricule: '', type: '', montant: null, mois: 'Mai 2025', justification: '' };
  }

  voirBulletin(): void {
    if (this.bul.recherche) {
      const ag = this.rh.findAgent(this.bul.recherche);
      if (ag) this.agentBulletin.set(ag.nomComplet);
    }
    this.showBulletin.set(true);
  }
}
