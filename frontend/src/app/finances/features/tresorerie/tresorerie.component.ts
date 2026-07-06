// src/app/features/tresorerie/tresorerie.component.ts
import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FinancesService } from '../../core/services/finances.service';
import { ToastService } from '../../core/services/toast.service';
import { FcfaPipe } from '../../shared/pipes/fcfa.pipe';

type TresoTab = 'caisse' | 'banque' | 'rapproch';

@Component({
  selector: 'app-tresorerie',
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

    <!-- CAISSE -->
    @if (activeTab() === 'caisse') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-cash"></i>Caisse principale</h3></div>
        <div class="pb">
          <div class="kpi4">
            <div class="kcard"><div class="kv" style="color:#009A44">{{ 52400000 | fcfa }}</div><div class="kl">Solde caisse actuel</div><div class="ks">Aujourd'hui</div></div>
            <div class="kcard"><div class="kv" style="color:#F77F00">{{ 935000 | fcfa }}</div><div class="kl">Encaissements du jour</div></div>
            <div class="kcard"><div class="kv" style="color:#E24B4A">{{ 450000 | fcfa }}</div><div class="kl">Décaissements du jour</div></div>
            <div class="kcard"><div class="kv" style="color:#185FA5">4</div><div class="kl">Opérations du jour</div></div>
          </div>
          <div class="fs" style="margin-top:.75rem">Mouvements de caisse</div>
          <table class="tbl">
            <thead><tr><th>Date</th><th>Libellé</th><th>Type</th><th>Montant (FCFA)</th><th>Solde après</th></tr></thead>
            <tbody>
              @for (m of svc.mouvementsCaisse(); track m.date + m.libelle) {
                <tr>
                  <td>{{ m.date }}</td>
                  <td class="bold">{{ m.libelle }}</td>
                  <td><span class="chip" [class.cv]="m.type==='encaissement'" [class.cr]="m.type==='decaissement'">{{ m.type }}</span></td>
                  <td class="right" [style.color]="m.type==='encaissement' ? '#009A44' : '#E24B4A'">
                    {{ m.type === 'encaissement' ? '+' : '-' }}{{ m.montant | fcfa }}
                  </td>
                  <td class="right">{{ m.soldeApres | fcfa }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- BANQUE -->
    @if (activeTab() === 'banque') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-building-bank"></i>Compte bancaire — Banque du Trésor</h3></div>
        <div class="pb">
          <div class="kpi4">
            <div class="kcard"><div class="kv" style="color:#009A44">{{ 36100000 | fcfa }}</div><div class="kl">Solde bancaire (FCFA)</div></div>
            <div class="kcard"><div class="kv" style="color:#185FA5">{{ 88500000 | fcfa }}</div><div class="kl">Trésorerie globale</div><div class="ks">Caisse + Banque</div></div>
          </div>
          <div class="fs" style="margin-top:.75rem">Relevé bancaire — Mai 2025</div>
          <table class="tbl">
            <thead><tr><th>Date</th><th>Libellé</th><th>Débit</th><th>Crédit</th><th>Solde</th></tr></thead>
            <tbody>
              @for (m of svc.mouvementsBanque(); track m.date + m.libelle) {
                <tr>
                  <td>{{ m.date }}</td>
                  <td class="bold">{{ m.libelle }}</td>
                  <td class="right" style="color:#E24B4A">{{ m.debit ? (m.debit | fcfa) : '' }}</td>
                  <td class="right" style="color:#009A44">{{ m.credit ? (m.credit | fcfa) : '' }}</td>
                  <td class="right bold">{{ m.solde | fcfa }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- RAPPROCHEMENT -->
    @if (activeTab() === 'rapproch') {
      <div class="card">
        <div class="ch"><h3><i class="ti ti-arrows-exchange"></i>Rapprochement bancaire — Mai 2025</h3></div>
        <div class="pb">
          <div class="kpi4">
            <div class="kcard"><div class="kv" style="color:#009A44">{{ 36100000 | fcfa }}</div><div class="kl">Solde relevé banque</div></div>
            <div class="kcard"><div class="kv" style="color:#185FA5">{{ 36100000 | fcfa }}</div><div class="kl">Solde livres comptables</div></div>
            <div class="kcard"><div class="kv" style="color:#009A44">0 FCFA</div><div class="kl">Écart constaté</div></div>
            <div class="kcard"><div class="kv" style="color:#009A44">VALIDÉ</div><div class="kl">Statut rapprochement</div></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:.75rem">
            <button class="bp" (click)="validerRapproch()"><i class="ti ti-check"></i>Valider le rapprochement</button>
            <button class="bs"><i class="ti ti-download"></i>Exporter PV</button>
          </div>
        </div>
      </div>
    }
  `
})
export class TresorerieComponent {
  svc   = inject(FinancesService);
  toast = inject(ToastService);
  activeTab = signal<TresoTab>('caisse');

  tabs = [
    { id: 'caisse'   as TresoTab, label: 'Caisse',                  icon: 'ti-cash' },
    { id: 'banque'   as TresoTab, label: 'Banque',                  icon: 'ti-building-bank' },
    { id: 'rapproch' as TresoTab, label: 'Rapprochement bancaire',   icon: 'ti-arrows-exchange' },
  ];

  setTab(t: TresoTab): void { this.activeTab.set(t); }
  validerRapproch(): void { this.toast.show('Rapprochement bancaire mai 2025 validé'); }
}
