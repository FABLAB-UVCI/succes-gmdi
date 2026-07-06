// src/app/features/rapports/rapports.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinancesService } from '../../core/services/finances.service';
import { ToastService } from '../../core/services/toast.service';
import { FcfaPipe } from '../../shared/pipes/fcfa.pipe';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [FormsModule, FcfaPipe],
  template: `
    <div class="card full">
      <div class="ch">
        <h3><i class="ti ti-report"></i>Rapports financiers</h3>
        <select class="fsel2" [(ngModel)]="periode">
          <option value="mois">Ce mois</option>
          <option value="trimestre">Ce trimestre</option>
          <option value="annee">Cette année</option>
        </select>
      </div>
      <div class="pb">
        <div class="kpi4">
          <div class="kcard"><div class="kv" style="color:#009A44">{{ 48600000 | fcfa }}</div><div class="kl">Recettes réalisées</div><div class="ks">Mai 2025</div></div>
          <div class="kcard"><div class="kv" style="color:#F77F00">{{ 13230000 | fcfa }}</div><div class="kl">Dépenses réalisées</div><div class="ks">Mai 2025</div></div>
          <div class="kcard"><div class="kv" style="color:#009A44">{{ 35370000 | fcfa }}</div><div class="kl">Excédent mensuel</div><div class="ks">Mai 2025</div></div>
          <div class="kcard"><div class="kv" style="color:#185FA5">39%</div><div class="kl">Taux exécution recettes</div><div class="ks">/ 520 M objectif annuel</div></div>
        </div>

        <div class="fs" style="margin-top:.75rem">Situation financière globale</div>
        <table class="tbl" style="margin-bottom:1rem">
          <thead><tr><th>Indicateur</th><th>Valeur</th><th>Référence</th><th>Variation</th></tr></thead>
          <tbody>
            <tr><td class="bold">Recettes cumulées Jan–Mai</td><td class="right">{{ 202500000 | fcfa }}</td><td class="right">{{ 520000000 | fcfa }}</td><td class="right" style="color:#009A44">+28%</td></tr>
            <tr><td class="bold">Dépenses cumulées Jan–Mai</td><td class="right">{{ 87500000 | fcfa }}</td><td class="right">{{ 280000000 | fcfa }}</td><td class="right" style="color:#F77F00">31%</td></tr>
            <tr><td class="bold">Solde de trésorerie</td><td class="right">{{ 88500000 | fcfa }}</td><td class="right">—</td><td class="right" style="color:#009A44">Excédent</td></tr>
            <tr><td class="bold">Masse salariale cumulée</td><td class="right">{{ 75000000 | fcfa }}</td><td class="right">{{ 180000000 | fcfa }}</td><td class="right" style="color:#185FA5">42%</td></tr>
          </tbody>
        </table>

        <div class="fs">Recettes par service</div>
        <table class="tbl" style="margin-bottom:.75rem">
          <thead><tr><th>Service</th><th>Type</th><th>Montant (FCFA)</th><th>% total</th></tr></thead>
          <tbody>
            @for (s of svc.recettesParService(); track s.service) {
              <tr>
                <td class="bold">{{ s.service }}</td>
                <td>{{ s.type }}</td>
                <td class="right">{{ s.montant | fcfa }}</td>
                <td>
                  <div class="mbw">
                    <div class="mbf" [style.width.%]="s.pct" style="background:#F77F00"></div>
                  </div>
                  <span style="font-size:10px"> {{ s.pct }}%</span>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <div style="display:flex;gap:8px">
          <button class="bs" (click)="svc.exportJSON(svc.recettesParService(),'rapport_finances')"><i class="ti ti-download"></i>Exporter JSON</button>
          <button class="bd" (click)="toast.show('Rapport mensuel généré')"><i class="ti ti-printer"></i>Rapport mensuel</button>
          <button class="bd" (click)="toast.show('Situation financière générée')"><i class="ti ti-printer"></i>Situation financière</button>
          <button class="bd" (click)="toast.show('Rapport exécution budgétaire généré')"><i class="ti ti-printer"></i>Exécution budgétaire</button>
        </div>
      </div>
    </div>
  `
})
export class RapportsComponent {
  svc   = inject(FinancesService);
  toast = inject(ToastService);
  periode = signal('mois');
}
