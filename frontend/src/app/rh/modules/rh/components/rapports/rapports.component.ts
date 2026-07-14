import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhService } from '../../../../core/services/rh.service';
import { FcfaPipe } from '../../../../shared/pipes/fcfa.pipe';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule, FcfaPipe],
  template: `
<div class="card">
  <div class="ch">
    <h3><i class="ti ti-report"></i>Rapports RH — {{ anneeCourante }}</h3>
    <button class="bs" (click)="exportAll()"><i class="ti ti-download"></i>Exporter JSON</button>
  </div>
  <div class="pb">
    <!-- KPIs -->
    <div class="kpi4" style="margin-bottom:1rem">
      <div class="kcard"><div class="kv" style="color:#C9A84C">{{ rh.totalAgents() }}</div><div class="kl">Effectif total</div><div class="ks">Tous statuts confondus (hors départs)</div></div>
      <div class="kcard">
        <div class="kv" style="color:#009A44">{{ masseSalariale() | fcfa }}</div>
        <div class="kl">Masse salariale du mois</div>
      </div>
      <div class="kcard"><div class="kv" style="color:#8c4a00">{{ salaireMoyen() | fcfa }}</div><div class="kl">Salaire moyen (FCFA)</div><div class="ks">Tous agents confondus</div></div>
      <div class="kcard"><div class="kv" style="color:#F77F00">{{ congesEnAttente() }}</div><div class="kl">Congés en attente</div><div class="ks">À valider</div></div>
    </div>

    <!-- Répartition par type de contrat -->
    <div class="fsec">Répartition des effectifs</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <table class="tbl">
        <thead><tr><th>Par type de contrat</th><th>Effectif</th><th>%</th></tr></thead>
        <tbody>
          @for (r of parContrat(); track r.label) {
            <tr><td class="bold">{{ r.label }}</td><td>{{ r.n }}</td><td><div class="mbw"><div class="mbf" [style.width]="r.pct + '%'" [style.background]="r.color"></div></div> {{ r.pct }}%</td></tr>
          }
        </tbody>
      </table>
      <table class="tbl">
        <thead><tr><th>Par direction</th><th>Effectif</th></tr></thead>
        <tbody>
          @for (r of parDirection(); track r.label) {
            <tr><td class="bold">{{ r.label }}</td><td>{{ r.n }}</td></tr>
          } @empty {
            <tr><td colspan="2" class="empty">Aucun agent enregistré</td></tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Statistiques du personnel -->
    <div class="fsec">📊 Statistiques du personnel</div>

    <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #006B30; margin-bottom: 0.5rem;">👩 Taux de féminisation</div>
          <div style="font-size: 2rem; font-weight: 700; color: #C9A84C;">{{ tauxFeminisation() }}%</div>
        </div>
        <div style="flex: 2;">
          <div class="kb" style="height: 24px; border-radius: 12px; background: #e2e8f0;">
            <div [style.width]="tauxFeminisation() + '%'" style="background: #C9A84C; height: 100%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.7rem; font-weight: bold;">{{ tauxFeminisation() }}%</div>
          </div>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
      <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; text-align: center;">
        <div style="font-size: 0.7rem; color: #6c757d;">🎂 ÂGE MOYEN</div>
        <div style="font-size: 2.5rem; font-weight: 700; color: #8c4a00;">{{ ageMoyen() }}</div>
        <div style="font-size: 0.7rem; color: #6c757d;">ans</div>
      </div>
      <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; text-align: center;">
        <div style="font-size: 0.7rem; color: #6c757d;">📅 ANCIENNETÉ MOYENNE</div>
        <div style="font-size: 2.5rem; font-weight: 700; color: #8c4a00;">{{ ancienneteMoyenne() }}</div>
        <div style="font-size: 0.7rem; color: #6c757d;">ans</div>
      </div>
    </div>

    <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #006B30; margin-bottom: 0.5rem;">📊 Absences déclarées — {{ moisCourant }}</div>
          <div style="font-size: 2rem; font-weight: 700; color: #E24B4A;">{{ absencesCeMois() }}</div>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
      <div style="background: #f8fafc; border-radius: 12px; padding: 1rem;">
        <div style="font-weight: 600; color: #006B30; margin-bottom: 0.5rem;">🎓 Agents en formation</div>
        <div style="display: flex; align-items: baseline; gap: 0.5rem;">
          <span style="font-size: 2rem; font-weight: 700; color: #009A44;">{{ agentsEnFormation() }}</span>
        </div>
      </div>
      <div style="background: #f8fafc; border-radius: 12px; padding: 1rem;">
        <div style="font-weight: 600; color: #006B30; margin-bottom: 0.5rem;">📢 Recrutements en cours</div>
        <div style="display: flex; align-items: baseline; gap: 0.5rem;">
          <span style="font-size: 2rem; font-weight: 700; color: #009A44;">{{ recrutementsEnCours() }}</span>
        </div>
      </div>
    </div>

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
    .fsec { font-size: 11px; font-weight: 500; color: #C9A84C; margin: 15px 0 10px; text-transform: uppercase; letter-spacing: .5px; border-bottom: 0.5px solid #f0e4b8; padding-bottom: 3px; }
    .tbl { width: 100%; border-collapse: collapse; }
    .tbl th { font-size: 11px; font-weight: 500; color: #6b7280; padding: 7px 10px; border-bottom: 0.5px solid #e5e7eb; background: #f7f8fa; text-align: left; }
    .tbl td { font-size: 12px; padding: 7px 10px; border-bottom: 0.5px solid #e5e7eb; }
    .empty { text-align: center; font-style: italic; color: #9ca3af; padding: 1.5rem; }
    .bold { font-weight: 500; }
    .bs { background: white; border: 0.5px solid #d1d5db; color: #111827; font-size: 12px; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
    .bd { background: #006B30; border: none; color: white; font-size: 12px; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
  `]
})
export class RapportsComponent {
  constructor(readonly rh: RhService) {}

  readonly anneeCourante = new Date().getFullYear();
  readonly moisCourant = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  masseSalariale = computed(() => this.rh.lignesPaie().reduce((s, l) => s + l.brut, 0));
  salaireMoyen = computed(() => {
    const lignes = this.rh.lignesPaie();
    return lignes.length ? Math.round(lignes.reduce((s, l) => s + l.brut, 0) / lignes.length) : 0;
  });
  congesEnAttente = computed(() => this.rh.conges().filter(c => c.statut === 'soumis').length);

  parContrat = computed(() => {
    const total = this.rh.totalAgents() || 1;
    const rows = [
      { label: 'Fonctionnaires', n: this.rh.totalFonct(), color: '#8c4a00' },
      { label: 'Contractuels', n: this.rh.totalContrat(), color: '#F77F00' },
      { label: 'Stagiaires', n: this.rh.totalStagiaires(), color: '#009A44' },
    ];
    return rows.map(r => ({ ...r, pct: Math.round(r.n / total * 100) }));
  });

  parDirection = computed(() => {
    const map = new Map<string, number>();
    for (const a of this.rh.agentsActifs()) map.set(a.direction, (map.get(a.direction) ?? 0) + 1);
    return Array.from(map.entries()).map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n);
  });

  tauxFeminisation = computed(() => {
    const agents = this.rh.agentsActifs();
    return agents.length ? Math.round(agents.filter(a => a.genre === 'F').length / agents.length * 100) : 0;
  });

  ageMoyen = computed(() => {
    const agents = this.rh.agentsActifs().filter(a => !!a.dateNaissance);
    if (!agents.length) return 0;
    const now = Date.now();
    const total = agents.reduce((s, a) => s + (now - new Date(a.dateNaissance).getTime()) / 31557600000, 0);
    return Math.round(total / agents.length);
  });

  ancienneteMoyenne = computed(() => {
    const agents = this.rh.agentsActifs().filter(a => !!a.dateEmbauche);
    if (!agents.length) return 0;
    const now = Date.now();
    const total = agents.reduce((s, a) => s + (now - new Date(a.dateEmbauche).getTime()) / 31557600000, 0);
    return Math.round(total / agents.length);
  });

  absencesCeMois = computed(() => {
    const now = new Date();
    return this.rh.absences().filter(a => {
      const d = new Date(a.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  });

  agentsEnFormation = computed(() => {
    const now = new Date();
    const matricules = new Set<string>();
    for (const f of this.rh.formations()) {
      if (f.statut === 'termine') continue;
      const debut = new Date(f.dateDebut), fin = new Date(f.dateFin);
      if (now >= debut && now <= fin) {
        (f.agents || '').split(',').map(m => m.trim()).filter(Boolean).forEach(m => matricules.add(m));
      }
    }
    return matricules.size;
  });

  recrutementsEnCours = computed(() => this.rh.recrutements().filter(r => r.statut === 'en_cours').length);

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
