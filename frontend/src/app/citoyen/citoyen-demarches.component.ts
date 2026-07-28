import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitoyenService, Demarche } from './citoyen.service';

@Component({
  selector: 'app-citoyen-demarches',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">

  <div class="page-header">
    <div>
      <h1 class="page-title"><i class="ti ti-list"></i> Mes démarches</h1>
      <p class="page-sub">Suivez l'état de toutes vos démarches administratives</p>
    </div>
    <div class="filter-bar">
      <select class="filter-select" (change)="onFilter($event)">
        <option value="">Tous les statuts</option>
        <option value="en_attente">En attente</option>
        <option value="en_cours">En cours</option>
        <option value="a_completer">À compléter</option>
        <option value="valide">Validé</option>
        <option value="refuse">Refusé</option>
        <option value="termine">Terminé</option>
      </select>
      <select class="filter-select" (change)="onModuleFilter($event)">
        <option value="">Tous les modules</option>
        <option value="etat-civil">État civil</option>
        <option value="finances">Finances</option>
        <option value="services-techniques">Services Techniques</option>
      </select>
    </div>
  </div>

  <!-- ── Stats ──────────────────────────────────── -->
  <div class="stats-row">
    @for (s of stats(); track s.label) {
      <div class="stat-chip" [style.border-color]="s.color" [style.color]="s.color">
        <span class="stat-val">{{ s.count }}</span>
        <span class="stat-lbl">{{ s.label }}</span>
      </div>
    }
  </div>

  <!-- ── Table ──────────────────────────────────── -->
  @if (loading()) {
    <div class="skeleton-wrap">
      @for (i of [1,2,3,4]; track i) {
        <div class="skeleton-row"></div>
      }
    </div>
  } @else if (filtered().length === 0) {
    <div class="empty">
      <i class="ti ti-mailbox empty-ico"></i>
      <p>Aucune démarche trouvée.</p>
    </div>
  } @else {
    <div class="table-card">
      <table class="dem-table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Module</th>
            <th>Type de démarche</th>
            <th>Statut</th>
            <th>Date création</th>
            <th>Dernière mise à jour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (d of filtered(); track d.id) {
            <tr class="dem-row">
              <td><code class="ref">{{ d.reference }}</code></td>
              <td><span class="module-badge">{{ labelModule(d.module) }}</span></td>
              <td>{{ d.type_demarche ?? '—' }}</td>
              <td>
                <span class="statut-pill"
                  [style.background]="svc.colorForStatut(d.statut)+'22'"
                  [style.color]="svc.colorForStatut(d.statut)">
                  {{ svc.labelForStatut(d.statut) }}
                </span>
              </td>
              <td class="date-cell">{{ d.created_at | date:'dd/MM/yyyy HH:mm' }}</td>
              <td class="date-cell">{{ d.updated_at | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                @if (peutImprimerExtrait(d)) {
                  <button class="btn-print" (click)="imprimerExtrait(d)" title="Imprimer l'extrait">
                    <i class="ti ti-printer"></i> Imprimer
                  </button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  }
</div>

<style>
.page { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }

/* ── Page header Ivoirien ── */
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
  background: #fff; border-radius: 12px; padding: 1.4rem 1.6rem;
  border-top: 4px solid #F77F00;
  box-shadow: 0 2px 10px rgba(0,0,0,.05);
}
.page-title {
  font-size: 1.4rem; font-weight: 800; color: #003366; margin: 0;
  display: flex; align-items: center; gap: .5rem;
}
.page-sub { font-size: .85rem; color: #7a5c3a; margin: .3rem 0 0; }

.filter-bar { display: flex; gap: .6rem; flex-wrap: wrap; align-items: center; }
.filter-select {
  padding: .5rem .9rem; border-radius: 8px;
  border: 1.5px solid #e2e8f0; background: #fff;
  font-size: .82rem; color: #003366; font-weight: 600;
  cursor: pointer; transition: border-color .15s ease;
}
.filter-select:hover { border-color: #F77F00; }
.filter-select:focus { outline: none; border-color: #F77F00; box-shadow: 0 0 0 3px rgba(247,127,0,.15); }

/* ── Stats Ivoiriens ── */
.stats-row { display: flex; gap: .8rem; flex-wrap: wrap; }
.stat-chip {
  padding: .5rem 1.1rem; border-radius: 30px;
  border: 1.5px solid;
  background: #fff;
  display: flex; align-items: center; gap: .5rem;
  transition: transform .15s ease, box-shadow .15s ease;
}
.stat-chip:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.08); }
.stat-val { font-weight: 800; font-size: 1.1rem; }
.stat-lbl { font-size: .75rem; font-weight: 600; }

/* ── Skeleton Ivoirien ── */
.skeleton-wrap { display: flex; flex-direction: column; gap: .6rem; }
.skeleton-row {
  height: 52px; border-radius: 10px;
  background: linear-gradient(90deg, rgba(247,127,0,.07) 25%, rgba(0,154,68,.07) 50%, rgba(247,127,0,.07) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ── Empty ── */
.empty { padding: 3rem; text-align: center; background: #fff; border-radius: 14px; border-top: 4px solid #009A44; }
.empty-ico { font-size: 3rem; color: #009A44; opacity: .6; }
.empty p { color: #7a5c3a; margin: .8rem 0 0; }

/* ── Table Ivoirienne ── */
.table-card {
  background: #fff; border-radius: 14px; overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  border-top: 4px solid #009A44;
}
.dem-table { width: 100%; border-collapse: collapse; font-size: .85rem; }
.dem-table th {
  background: linear-gradient(90deg, rgba(247,127,0,.06), rgba(0,154,68,.06));
  padding: .9rem 1rem;
  text-align: left; font-size: .75rem; font-weight: 700;
  color: #003366; text-transform: uppercase; letter-spacing: .5px;
  border-bottom: 2px solid rgba(247,127,0,.2);
}
.dem-row { border-bottom: 1px solid #f0f3fa; transition: background .12s ease; }
.dem-row:last-child { border-bottom: none; }
.dem-row:hover { background: #fff8f0; }
.dem-row td { padding: .9rem 1rem; vertical-align: middle; }

.ref { font-family: 'Courier New', monospace; font-size: .8rem; color: #003366; font-weight: 700; }
.module-badge {
  display: inline-block;
  background: rgba(247,127,0,.12); color: #cc6600;
  font-size: .72rem; font-weight: 700; padding: .2rem .65rem; border-radius: 20px;
}
.statut-pill { display: inline-block; font-size: .73rem; font-weight: 700; padding: .2rem .65rem; border-radius: 20px; }
.date-cell { color: #9ba8be; font-size: .78rem; white-space: nowrap; }
.btn-print {
  display: inline-flex; align-items: center; gap: .35rem;
  background: #003366; color: #fff; border: none; border-radius: 8px;
  padding: .35rem .75rem; font-size: .78rem; font-weight: 700; cursor: pointer;
  transition: background .15s ease;
}
.btn-print:hover { background: #004fa3; }
</style>
  `,
})
export class CitoyenDemarchesComponent implements OnInit {
  readonly svc = inject(CitoyenService);

  loading   = signal(true);
  demarches = signal<Demarche[]>([]);
  filterStatut = signal('');
  filterModule = signal('');

  filtered = () => this.demarches().filter(d =>
    (!this.filterStatut() || d.statut === this.filterStatut()) &&
    (!this.filterModule() || d.module === this.filterModule())
  );

  stats = () => {
    const all = this.demarches();
    return [
      { label: 'Total',       count: all.length,                                                         color: '#003366' },
      { label: 'En attente',  count: all.filter(d => d.statut === 'en_attente').length,                  color: '#F77F00' },
      { label: 'En cours',    count: all.filter(d => d.statut === 'en_cours').length,                    color: '#F77F00' },
      { label: 'Validées',    count: all.filter(d => d.statut === 'valide' || d.statut === 'termine').length, color: '#009A44' },
      { label: 'Refusées',    count: all.filter(d => d.statut === 'refuse').length,                      color: '#e63946' },
    ];
  };

  ngOnInit(): void {
    this.svc.getDemarches().subscribe({
      next:  r => { this.demarches.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onFilter(e: Event)       { this.filterStatut.set((e.target as HTMLSelectElement).value); }
  onModuleFilter(e: Event) { this.filterModule.set((e.target as HTMLSelectElement).value); }

  labelModule(m: string): string {
    const map: Record<string, string> = {
      'etat-civil': 'État civil',
      'finances': 'Finances', 'services-techniques': 'ST',
    };
    return map[m] ?? m;
  }

  /**
   * Seul l'extrait de naissance, une fois validé par l'officier d'état civil,
   * peut être réimprimé par le citoyen — avec le même modèle que celui utilisé
   * par le gestionnaire, pour un rendu strictement identique.
   */
  peutImprimerExtrait(d: Demarche): boolean {
    return d.type_demarche === "Demande d'acte de naissance" && (d.statut === 'valide' || d.statut === 'termine');
  }

  async imprimerExtrait(d: Demarche): Promise<void> {
    const don: any = d.donnees || {};
    const { genererExtraitNaissancePDF } = await import('../etat-civil/modules/etat-civil/pages/naissances/naissances');
    await genererExtraitNaissancePDF({
      numero: d.reference, nom: don.nom, prenom: don.prenom,
      dateNaissance: don.date_naissance, heureNaissance: don.heure_naissance, sexe: don.sexe,
      lieuNaissance: don.lieu_naissance, commune: don.commune,
      pereNom: don.pere_nom, mereNom: don.mere_nom,
      pereProf: don.pere_profession, mereProf: don.mere_profession,
      pereNat: don.pere_nationalite, mereNat: don.mere_nationalite,
    });
  }
}
