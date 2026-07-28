import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

interface Abonnement {
  id: number;
  nom: string;
  prenom: string | null;
  email: string;
  telephone: string | null;
  type_communication: string;
  statut: 'en_attente' | 'actif' | 'refuse' | 'suspendu';
  created_at: string;
}

@Component({
  selector: 'app-abonnements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="abo-wrapper">
      <div class="a-header">
        <h2><i class="ti ti-users-group"></i> Abonnements Communication</h2>
        <div class="a-header-actions">
          <select class="filtre-select" [ngModel]="filtre()" (ngModelChange)="filtre.set($event)">
            <option value="en_attente">Demandes en attente</option>
            <option value="actif">Registre des abonnés actifs</option>
            <option value="refuse">Refusés</option>
            <option value="suspendu">Suspendus</option>
            <option value="tous">Tous</option>
          </select>
          <button class="btn-refresh" (click)="load()"><i class="ti ti-refresh"></i> Rafraichir</button>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">Chargement des abonnements...</div>
      } @else if (filtres().length === 0) {
        <div class="empty">
          <i class="ti ti-users-group" style="font-size:2.5rem;color:#94a3b8"></i>
          <p>Aucun abonnement pour ce filtre.</p>
        </div>
      } @else {
        <table class="d-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Contact</th>
              <th>Type de communication</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (a of filtres(); track a.id) {
              <tr>
                <td class="ref-cell">{{ a.nom }} {{ a.prenom }}</td>
                <td>{{ a.email }}<br><span class="tel">{{ a.telephone }}</span></td>
                <td>{{ a.type_communication }}</td>
                <td>{{ a.created_at | date:'dd/MM/yyyy' }}</td>
                <td><span class="badge" [ngClass]="a.statut">{{ labelStatut(a.statut) }}</span></td>
                <td class="actions-cell">
                  @if (a.statut !== 'actif') {
                    <button class="btn-mini accepter" (click)="changerStatut(a, 'actif')" title="Accepter"><i class="ti ti-check"></i></button>
                  }
                  @if (a.statut !== 'refuse') {
                    <button class="btn-mini refuser" (click)="changerStatut(a, 'refuse')" title="Refuser"><i class="ti ti-x"></i></button>
                  }
                  @if (a.statut === 'actif') {
                    <button class="btn-mini suspendre" (click)="changerStatut(a, 'suspendu')" title="Suspendre"><i class="ti ti-player-pause"></i></button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [`
    .abo-wrapper { padding: 1.5rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,.05); }
    .a-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #f1f5f9; flex-wrap: wrap; gap: 0.8rem; }
    .a-header h2 { margin: 0; font-size: 1.1rem; color: #003366; display: flex; align-items: center; gap: 8px; }
    .a-header-actions { display: flex; align-items: center; gap: 0.6rem; }
    .filtre-select { padding: 7px 12px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; font-size: 0.85rem; font-weight: 600; background: #fff; }
    .btn-refresh { background: #f0f4f8; border: 1px solid #e2e8f0; padding: 7px 14px; border-radius: 8px; cursor: pointer; color: #003366; display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.85rem; }
    .btn-refresh:hover { background: #003366; color: #fff; }
    .loading { padding: 3rem; text-align: center; color: #64748b; font-style: italic; }
    .empty { padding: 3rem; text-align: center; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .d-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .d-table th { text-align: left; padding: 12px 16px; background: #f8fafc; color: #334155; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 2px solid #e2e8f0; }
    .d-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
    .d-table tr:hover td { background: #f8fafc; }
    .ref-cell { font-weight: 700; color: #003366; }
    .tel { color: #64748b; font-size: 0.8rem; }
    .badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge.en_attente { background: #fff3cd; color: #856404; }
    .badge.actif { background: #d4edda; color: #155724; }
    .badge.refuse { background: #f8d7da; color: #721c24; }
    .badge.suspendu { background: #e2e3e5; color: #383d41; }
    .actions-cell { display: flex; gap: 6px; }
    .btn-mini { border: none; border-radius: 6px; width: 30px; height: 30px; cursor: pointer; color: #fff; display: flex; align-items: center; justify-content: center; transition: all .15s; }
    .btn-mini.accepter { background: #009A44; }
    .btn-mini.refuser { background: #dc3545; }
    .btn-mini.suspendre { background: #6b7280; }
    .btn-mini:hover { filter: brightness(1.1); transform: translateY(-1px); }
  `]
})
export class AbonnementsComponent implements OnInit {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/com`;

  abonnements = signal<Abonnement[]>([]);
  loading = signal(true);
  filtre = signal('en_attente');

  filtres = computed(() => {
    const f = this.filtre();
    if (f === 'tous') return this.abonnements();
    return this.abonnements().filter(a => a.statut === f);
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.http.get<{ data: Abonnement[] }>(`${this.base}/abonnements`).subscribe({
      next: res => { this.abonnements.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  changerStatut(a: Abonnement, statut: string) {
    this.http.patch<{ data: Abonnement }>(`${this.base}/abonnements/${a.id}/statut`, { statut }).subscribe({
      next: res => {
        this.abonnements.update(list => list.map(x => x.id === res.data.id ? res.data : x));
      }
    });
  }

  labelStatut(s: string): string {
    const map: Record<string, string> = { en_attente: 'En attente', actif: 'Actif', refuse: 'Refusé', suspendu: 'Suspendu' };
    return map[s] || s;
  }
}
