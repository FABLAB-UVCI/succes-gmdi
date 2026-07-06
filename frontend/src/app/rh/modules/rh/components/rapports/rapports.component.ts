import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhService } from '../../../../core/services/rh.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="card">
  <div class="ch">
    <h3><i class="ti ti-report"></i>Rapports RH — 2025</h3>
    <button class="bs" (click)="exportAll()"><i class="ti ti-download"></i>Exporter JSON</button>
  </div>
  <div class="pb">
    <!-- KPIs existants -->
    <div class="kpi4" style="margin-bottom:1rem">
      <div class="kcard"><div class="kv" style="color:#C9A84C">347</div><div class="kl">Effectif total</div><div class="ks">Tous statuts confondus</div></div>
      <div class="kcard">
        <div class="kv" style="color:#009A44">15 000 000</div>
        <div class="kl">Masse salariale mai (FCFA)</div>
        <div class="ks">/ 180 M budget annuel</div>
        <div class="kb"><div style="width:42%;background:#009A44;height:100%;border-radius:2px"></div></div>
      </div>
      <div class="kcard"><div class="kv" style="color:#185FA5">43 285</div><div class="kl">Salaire moyen (FCFA)</div><div class="ks">Tous agents confondus</div></div>
      <div class="kcard"><div class="kv" style="color:#F77F00">3</div><div class="kl">Congés en attente</div><div class="ks">À valider</div></div>
    </div>

    <!-- Répartition par type de contrat (existante) -->
    <div class="fs">Répartition des effectifs</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <table class="tbl">
        <thead><tr><th>Par type de contrat</th><th>Effectif</th><th>%</th></tr></thead>
        <tbody>
          <tr><td class="bold">Fonctionnaires</td><td>280</td><td><div class="mbw"><div class="mbf" style="width:81%;background:#185FA5"></div></div> 81%</td></tr>
          <tr><td class="bold">Contractuels</td><td>52</td><td><div class="mbw"><div class="mbf" style="width:15%;background:#F77F00"></div></div> 15%</td></tr>
          <tr><td class="bold">Stagiaires</td><td>15</td><td><div class="mbw"><div class="mbf" style="width:4%;background:#009A44"></div></div> 4%</td></tr>
        </tbody>
      </table>
      <table class="tbl">
        <thead><tr><th>Par direction</th><th>Effectif</th></tr></thead>
        <tbody>
          <tr><td class="bold">Services Techniques</td><td>89</td></tr>
          <tr><td class="bold">Direction Finances</td><td>54</td></tr>
          <tr><td class="bold">Direction État Civil</td><td>38</td></tr>
          <tr><td class="bold">DRH</td><td>22</td></tr>
          <tr><td class="bold">Autres directions</td><td>144</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 📊 NOUVEAU : Graphiques à la place du tableau "Statistiques du personnel" -->
    <div class="fs">📊 Statistiques du personnel - Visualisation graphique</div>
    
    <!-- Graphique 1: Taux de féminisation (Jauge) -->
    <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #003366; margin-bottom: 0.5rem;">👩 Taux de féminisation</div>
          <div style="font-size: 2rem; font-weight: 700; color: #C9A84C;">38%</div>
          <div style="font-size: 0.75rem; color: #009A44; margin-top: 0.25rem;">⬆ +3% vs 2024</div>
        </div>
        <div style="flex: 2;">
          <div class="kb" style="height: 24px; border-radius: 12px; background: #e2e8f0;">
            <div style="width: 38%; background: #C9A84C; height: 100%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; font-weight: bold;">38%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphique 2: Âge moyen et Ancienneté moyenne (cartes côte à côte) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
      <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; text-align: center;">
        <div style="font-size: 0.7rem; color: #6c757d;">🎂 ÂGE MOYEN</div>
        <div style="font-size: 2.5rem; font-weight: 700; color: #185FA5;">42</div>
        <div style="font-size: 0.7rem; color: #6c757d;">ans</div>
        <div class="kb" style="margin-top: 0.5rem;"><div style="width: 70%; background: #185FA5; height: 100%; border-radius: 2px;"></div></div>
      </div>
      <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; text-align: center;">
        <div style="font-size: 0.7rem; color: #6c757d;">📅 ANCIENNETÉ MOYENNE</div>
        <div style="font-size: 2.5rem; font-weight: 700; color: #185FA5;">14</div>
        <div style="font-size: 0.7rem; color: #6c757d;">ans</div>
        <div class="kb" style="margin-top: 0.5rem;"><div style="width: 58%; background: #185FA5; height: 100%; border-radius: 2px;"></div></div>
      </div>
    </div>

    <!-- Graphique 3: Taux d'absentéisme (avec alerte) -->
    <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #003366; margin-bottom: 0.5rem;">📊 Taux d'absentéisme - Mai 2025</div>
          <div style="font-size: 2rem; font-weight: 700; color: #E24B4A;">4,2%</div>
          <div style="font-size: 0.75rem; color: #E24B4A; margin-top: 0.25rem;">⚠ +0.8% vs avril</div>
        </div>
        <div style="flex: 2;">
          <div class="kb" style="height: 24px; border-radius: 12px; background: #e2e8f0;">
            <div style="width: 4.2%; background: #E24B4A; height: 100%; border-radius: 12px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphique 4: Agents en formation et Promotions (Barres horizontales) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
      <div style="background: #f8fafc; border-radius: 12px; padding: 1rem;">
        <div style="font-weight: 600; color: #003366; margin-bottom: 0.5rem;">🎓 Agents en formation</div>
        <div style="display: flex; align-items: baseline; gap: 0.5rem;">
          <span style="font-size: 2rem; font-weight: 700; color: #009A44;">18</span>
          <span style="font-size: 0.75rem; color: #009A44;">⬆ +6 vs mai 2024</span>
        </div>
        <div class="kb" style="margin-top: 0.5rem;"><div style="width: 18%; background: #009A44; height: 100%; border-radius: 2px;"></div></div>
      </div>
      <div style="background: #f8fafc; border-radius: 12px; padding: 1rem;">
        <div style="font-weight: 600; color: #003366; margin-bottom: 0.5rem;">🏆 Promotions accordées 2025</div>
        <div style="display: flex; align-items: baseline; gap: 0.5rem;">
          <span style="font-size: 2rem; font-weight: 700; color: #009A44;">12</span>
          <span style="font-size: 0.75rem; color: #009A44;">⬆ +4 vs 2024</span>
        </div>
        <div class="kb" style="margin-top: 0.5rem;"><div style="width: 12%; background: #C9A84C; height: 100%; border-radius: 2px;"></div></div>
      </div>
    </div>

    <!-- Boutons d'export -->
    <div style="display:flex;gap:8px;margin-top:1rem">
      <button class="bs" (click)="exportAll()"><i class="ti ti-download"></i>Exporter JSON</button>
      <button class="bd" (click)="imprimer()"><i class="ti ti-printer"></i>Imprimer le rapport</button>
    </div>
  </div>
</div>
  `,
  styles: [`
    .kpi4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
    .kcard { background: #f7f8fa; border-radius: 8px; padding: 1rem; border: 0.5px solid #e5e7eb; }
    .kv { font-size: 19px; font-weight: 500; }
    .kl { font-size: 11px; color: #6b7280; margin-top: 2px; }
    .ks { font-size: 10px; color: #9ca3af; margin-top: 1px; }
    .kb { height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; margin-top: 7px; }
    .mbf { height: 100%; border-radius: 2px; }
    .mbw { height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; width: 70px; display: inline-block; vertical-align: middle; margin-left: 8px; }
    .fs { font-size: 11px; font-weight: 500; color: #C9A84C; margin: 15px 0 10px; text-transform: uppercase; letter-spacing: .5px; border-bottom: 0.5px solid #f0e4b8; padding-bottom: 3px; }
    .tbl { width: 100%; border-collapse: collapse; }
    .tbl th { font-size: 11px; font-weight: 500; color: #6b7280; padding: 7px 10px; border-bottom: 0.5px solid #e5e7eb; background: #f7f8fa; text-align: left; }
    .tbl td { font-size: 12px; padding: 7px 10px; border-bottom: 0.5px solid #e5e7eb; }
    .bold { font-weight: 500; }
    .bs { background: white; border: 0.5px solid #d1d5db; color: #111827; font-size: 12px; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
    .bd { background: #003366; border: none; color: white; font-size: 12px; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
  `]
})
export class RapportsComponent {
  constructor(private rh: RhService) {}

  exportAll(): void {
    this.rh.exportJSON({
      agents: this.rh.agents(),
      conges: this.rh.conges(),
      absences: this.rh.absences(),
      formations: this.rh.formations(),
    }, 'rapport_rh');
  }

  imprimer(): void {
    window.print();
  }
}