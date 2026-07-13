// src/app/features/rapports/rapports.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
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
          <div class="kcard"><div class="kv" style="color:#009A44">{{ svc.totalRecettesEncaissees() | fcfa }}</div><div class="kl">Recettes réalisées</div><div class="ks">Exercice en cours</div></div>
          <div class="kcard"><div class="kv" style="color:#F77F00">{{ svc.totalDepensesPayees() | fcfa }}</div><div class="kl">Dépenses réalisées</div><div class="ks">Exercice en cours</div></div>
          <div class="kcard"><div class="kv" style="color:#009A44">{{ excedent() | fcfa }}</div><div class="kl">Excédent</div><div class="ks">Recettes – Dépenses</div></div>
          <div class="kcard"><div class="kv" style="color:#8c4a00">{{ svc.pct(svc.totalRecettesEncaissees(), totalPrevisionnel()) }}%</div><div class="kl">Taux exécution recettes</div><div class="ks">/ {{ totalPrevisionnel() | fcfa }} prévues</div></div>
        </div>

        <div class="fs" style="margin-top:.75rem">Situation financière globale</div>
        <table class="tbl" style="margin-bottom:1rem">
          <thead><tr><th>Indicateur</th><th>Valeur</th><th>Référence</th><th>Variation</th></tr></thead>
          <tbody>
            <tr><td class="bold">Recettes cumulées</td><td class="right">{{ svc.totalRecettesEncaissees() | fcfa }}</td><td class="right">{{ totalPrevisionnel() | fcfa }}</td><td class="right" style="color:#009A44">{{ svc.pct(svc.totalRecettesEncaissees(), totalPrevisionnel()) }}%</td></tr>
            <tr><td class="bold">Dépenses cumulées</td><td class="right">{{ svc.totalDepensesPayees() | fcfa }}</td><td class="right">{{ totalEngage() | fcfa }}</td><td class="right" style="color:#F77F00">{{ svc.pct(svc.totalDepensesPayees(), totalEngage()) }}%</td></tr>
            <tr><td class="bold">Solde de trésorerie</td><td class="right">{{ soldeTresorerie() | fcfa }}</td><td class="right">—</td><td class="right" style="color:#009A44">{{ soldeTresorerie() >= 0 ? 'Excédent' : 'Déficit' }}</td></tr>
            <tr><td class="bold">Masse salariale versée</td><td class="right">{{ salairesVerses() | fcfa }}</td><td class="right">{{ masseSalarialeEngagee() | fcfa }}</td><td class="right" style="color:#8c4a00">{{ svc.pct(salairesVerses(), masseSalarialeEngagee()) }}%</td></tr>
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
export class RapportsComponent implements OnInit {
  svc   = inject(FinancesService);
  toast = inject(ToastService);
  periode = signal('mois');

  ngOnInit(): void { this.svc.chargerTout(); }

  totalPrevisionnel = computed(() => this.svc.lignesBudget().reduce((s, l) => s + l.montantPrevisionnel, 0));
  totalEngage       = computed(() => this.svc.lignesBudget().reduce((s, l) => s + l.montantConsomme, 0));
  excedent          = computed(() => this.svc.totalRecettesEncaissees() - this.svc.totalDepensesPayees());
  soldeTresorerie   = computed(() => {
    const c = this.svc.mouvementsCaisse(); const b = this.svc.mouvementsBanque();
    return (c.length ? c[c.length - 1].soldeApres : 0) + (b.length ? b[b.length - 1].solde : 0);
  });
  salairesVerses          = computed(() => this.svc.depenses().filter(d => d.chapitre === 'personnel' && d.statut === 'paye').reduce((s, d) => s + d.montant, 0));
  masseSalarialeEngagee   = computed(() => this.svc.depenses().filter(d => d.chapitre === 'personnel').reduce((s, d) => s + d.montant, 0));
}
