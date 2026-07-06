// src/app/features/comptabilite/comptabilite.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { FinancesService } from '../../core/services/finances.service';
import { FcfaPipe } from '../../shared/pipes/fcfa.pipe';

type ComptaTab = 'journal' | 'grandlivre' | 'balance' | 'bilan';

@Component({
  selector: 'app-comptabilite',
  standalone: true,
  imports: [FcfaPipe],
  template: `
    <div class="nav">
      @for (tab of tabs; track tab.id) {
        <div class="ni" [class.active]="activeTab() === tab.id" (click)="setTab(tab.id)">
          <i [class]="'ti ' + tab.icon"></i>{{ tab.label }}
        </div>
      }
    </div>

    <!-- JOURNAL -->
    @if (activeTab() === 'journal') {
      <div class="card">
        <div class="ch">
          <h3><i class="ti ti-notebook"></i>Journal comptable</h3>
          <button class="bs" (click)="svc.exportJSON(svc.ecritures(),'journal_comptable')"><i class="ti ti-download"></i>Exporter</button>
        </div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead><tr><th>N°</th><th>Date</th><th>Journal</th><th>Libellé</th><th>Compte</th><th>Débit (FCFA)</th><th>Crédit (FCFA)</th><th>Pièce</th></tr></thead>
            <tbody>
              @for (e of svc.ecritures(); track e.numero) {
                <tr>
                  <td class="mono">{{ e.numero }}</td>
                  <td>{{ e.date }}</td>
                  <td><span class="chip cv">{{ e.journal }}</span></td>
                  <td class="bold">{{ e.libelle }}</td>
                  <td class="mono">{{ e.compte }}</td>
                  <td class="right" style="color:#009A44">{{ e.debit > 0 ? (e.debit | fcfa) : '' }}</td>
                  <td class="right" style="color:#E24B4A">{{ e.credit > 0 ? (e.credit | fcfa) : '' }}</td>
                  <td class="mono">{{ e.piece || '-' }}</td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5">TOTAUX</td>
                <td class="right" style="color:#009A44">{{ svc.totalDebit() | fcfa }}</td>
                <td class="right" style="color:#E24B4A">{{ svc.totalCredit() | fcfa }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    }

    <!-- GRAND LIVRE -->
    @if (activeTab() === 'grandlivre') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-book"></i>Grand livre des comptes</h3></div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead><tr><th>Compte</th><th>Intitulé</th><th>Total débit</th><th>Total crédit</th><th>Solde</th><th>Nature</th></tr></thead>
            <tbody>
              @for (c of svc.comptes(); track c.compte) {
                <tr>
                  <td class="mono bold">{{ c.compte }}</td>
                  <td>{{ c.intitule }}</td>
                  <td class="right" style="color:#009A44">{{ c.debit | fcfa }}</td>
                  <td class="right" style="color:#E24B4A">{{ c.credit | fcfa }}</td>
                  <td class="right bold" [style.color]="c.solde >= 0 ? '#009A44' : '#E24B4A'">{{ (c.solde < 0 ? -c.solde : c.solde) | fcfa }}</td>
                  <td><span class="chip" [class.cv]="c.solde >= 0" [class.cr]="c.solde < 0">{{ c.solde >= 0 ? 'Débiteur' : 'Créditeur' }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- BALANCE -->
    @if (activeTab() === 'balance') {
      <div class="card">
        <div class="ch">
          <h3><i class="ti ti-scale"></i>Balance des comptes — Mai 2025</h3>
          <button class="bs" (click)="svc.exportJSON(svc.comptes(),'balance')"><i class="ti ti-download"></i>Exporter</button>
        </div>
        <div class="pb">
          <div class="kpi4" style="margin-bottom:.75rem">
            <div class="kcard"><div class="kv" style="color:#009A44">{{ totalSoldesDebiteurs() | fcfa }}</div><div class="kl">Total débits</div></div>
            <div class="kcard"><div class="kv" style="color:#E24B4A">{{ totalSoldesCrediteurs() | fcfa }}</div><div class="kl">Total crédits</div></div>
            <div class="kcard"><div class="kv" style="color:#009A44">ÉQUILIBRÉE</div><div class="kl">Situation balance</div></div>
          </div>
        </div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead><tr><th>Compte</th><th>Intitulé</th><th>Solde débiteur</th><th>Solde créditeur</th></tr></thead>
            <tbody>
              @for (c of svc.comptes(); track c.compte) {
                <tr>
                  <td class="mono">{{ c.compte }}</td>
                  <td>{{ c.intitule }}</td>
                  <td class="right" style="color:#009A44">{{ c.solde >= 0 ? (c.solde | fcfa) : '' }}</td>
                  <td class="right" style="color:#E24B4A">{{ c.solde < 0  ? (-c.solde | fcfa) : '' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- BILAN -->
    @if (activeTab() === 'bilan') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-report"></i>Bilan comptable — Exercice 2025</h3></div>
        <div class="pb">
          <div class="grid2">
            <div>
              <div class="fs">Actif</div>
              <table class="tbl">
                <thead><tr><th>Poste</th><th>Montant (FCFA)</th></tr></thead>
                <tbody>
                  <tr><td>Patrimoine communal</td><td class="right bold">{{ 1920000000 | fcfa }}</td></tr>
                  <tr><td>Disponibilités</td><td class="right bold">{{ 52400000 | fcfa }}</td></tr>
                  <tr><td>Créances sur contribuables</td><td class="right bold">{{ 28500000 | fcfa }}</td></tr>
                </tbody>
                <tfoot><tr><td>TOTAL ACTIF</td><td class="right" style="color:#009A44">{{ 2000900000 | fcfa }}</td></tr></tfoot>
              </table>
            </div>
            <div>
              <div class="fs">Passif</div>
              <table class="tbl">
                <thead><tr><th>Poste</th><th>Montant (FCFA)</th></tr></thead>
                <tbody>
                  <tr><td>Fonds propres</td><td class="right bold">{{ 1850000000 | fcfa }}</td></tr>
                  <tr><td>Dettes fournisseurs</td><td class="right bold">{{ 98500000 | fcfa }}</td></tr>
                  <tr><td>Excédent exercice</td><td class="right bold">{{ 52400000 | fcfa }}</td></tr>
                </tbody>
                <tfoot><tr><td>TOTAL PASSIF</td><td class="right" style="color:#E24B4A">{{ 2000900000 | fcfa }}</td></tr></tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ComptabiliteComponent {
  svc = inject(FinancesService);
  activeTab = signal<ComptaTab>('journal');

  tabs = [
    { id: 'journal'    as ComptaTab, label: 'Journal comptable', icon: 'ti-notebook' },
    { id: 'grandlivre' as ComptaTab, label: 'Grand livre',       icon: 'ti-book' },
    { id: 'balance'    as ComptaTab, label: 'Balance',           icon: 'ti-scale' },
    { id: 'bilan'      as ComptaTab, label: 'Bilan',             icon: 'ti-report' },
  ];

  setTab(t: ComptaTab): void { this.activeTab.set(t); }

  totalSoldesDebiteurs = computed(() =>
    this.svc.comptes().filter(c => c.solde >= 0).reduce((s, c) => s + c.solde, 0)
  );
  totalSoldesCrediteurs = computed(() =>
    this.svc.comptes().filter(c => c.solde < 0).reduce((s, c) => s + Math.abs(c.solde), 0)
  );
}
