import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ToastService } from '../communication/core/services/toast.service';
import { AuthService } from '../communication/core/services/auth.service';

interface Demarche {
  id: number; reference: string; module: string; type_demarche: string | null;
  statut: string; donnees: any; created_at: string; updated_at: string;
}

@Component({
  selector: 'app-manager-demarches',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="manager-container">
      <div class="header">
        <button class="btn-back" (click)="auth.backToModules()"><i class="ti ti-arrow-left"></i> Accueil modules</button>
        <h1>Demandes Citoyens</h1>
        <p>Gérez les demandes soumises par les citoyens pour votre/vos module(s).</p>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="empty-state">Chargement des demandes...</div>
        } @else if (demarches().length === 0) {
          <div class="empty-state">
            <i class="ti ti-inbox"></i>
            <p>Aucune demande citoyenne trouvée.</p>
          </div>
        } @else {
          <table class="data-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Module</th>
                <th>Type</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (d of demarches(); track d.id) {
                <tr>
                  <td class="fw-bold">{{ d.reference }}</td>
                  <td><span class="badge-module">{{ d.module }}</span></td>
                  <td>{{ d.type_demarche }}</td>
                  <td>{{ d.created_at | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>
                    <select class="status-select" [ngClass]="d.statut" [value]="d.statut" (change)="updateStatut(d, $event)">
                      <option value="en_attente">En attente</option>
                      <option value="en_cours">En cours</option>
                      <option value="a_completer">À compléter</option>
                      <option value="valide">Validé</option>
                      <option value="refuse">Refusé</option>
                      <option value="termine">Terminé</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn-view" (click)="viewDetails(d)">Détails</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      <!-- Modal Détails -->
      @if (selectedDemarche()) {
        <div class="modal-overlay" (click)="selectedDemarche.set(null)">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Détails de la demande {{ selectedDemarche()?.reference }}</h2>
              <button class="btn-close" (click)="selectedDemarche.set(null)">&times;</button>
            </div>
            <div class="modal-body">
              <div class="detail-grid">
                <div class="detail-item"><span>Module:</span> {{ selectedDemarche()?.module }}</div>
                <div class="detail-item"><span>Type:</span> {{ selectedDemarche()?.type_demarche }}</div>
                <div class="detail-item"><span>Soumis le:</span> {{ selectedDemarche()?.created_at | date:'dd/MM/yyyy HH:mm' }}</div>
              </div>
              
              <h3 class="mt-4">Données du formulaire</h3>
              <div class="donnees-box">
                @if (selectedDemarche()?.donnees) {
                  @for (key of getKeys(selectedDemarche()!.donnees); track key) {
                    <div class="donnee-row">
                      <span class="d-key">{{ key }}</span>
                      <span class="d-val">{{ selectedDemarche()!.donnees[key] }}</span>
                    </div>
                  }
                } @else {
                  <p>Aucune donnée spécifique.</p>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    <style>
      .manager-container { padding: 2rem; max-width: 1200px; margin: 0 auto; font-family: 'Inter', sans-serif; background: #f4f7f6; min-height: 100vh; }
      .header { margin-bottom: 2rem; }
      .btn-back { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; color: #003366; font-weight: 600; margin-bottom: 1rem; padding: 0; font-size: 1rem; }
      .btn-back:hover { text-decoration: underline; }
      .header h1 { font-size: 2rem; color: #003366; margin: 0 0 0.5rem 0; }
      .header p { color: #4a5568; margin: 0; }

      .card { background: #fff; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
      .empty-state { text-align: center; padding: 4rem 1rem; color: #a0aec0; }
      .empty-state i { font-size: 3rem; margin-bottom: 1rem; }

      .data-table { width: 100%; border-collapse: collapse; }
      .data-table th { text-align: left; padding: 1rem; border-bottom: 2px solid #edf2f7; color: #4a5568; font-weight: 600; font-size: 0.9rem; }
      .data-table td { padding: 1rem; border-bottom: 1px solid #edf2f7; font-size: 0.9rem; color: #2d3748; }
      .fw-bold { font-weight: 700; color: #003366; }
      
      .badge-module { background: #e8f0ff; color: #003366; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
      
      .status-select { padding: 0.4rem 0.6rem; border-radius: 8px; border: 1px solid #cbd5e0; font-weight: 600; font-size: 0.85rem; outline: none; cursor: pointer; }
      .status-select.en_attente { background: #fff3cd; color: #856404; }
      .status-select.en_cours { background: #cce5ff; color: #004085; }
      .status-select.valide, .status-select.termine { background: #d4edda; color: #155724; }
      .status-select.refuse { background: #f8d7da; color: #721c24; }

      .btn-view { background: #f0f4f8; color: #003366; border: 1px solid #d0d9ec; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: background 0.2s; }
      .btn-view:hover { background: #e2e8f0; }

      /* Modal */
      .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
      .modal-content { background: #fff; border-radius: 12px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
      .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #edf2f7; }
      .modal-header h2 { margin: 0; font-size: 1.2rem; color: #003366; }
      .btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #718096; }
      .modal-body { padding: 1.5rem; }
      
      .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: #f8fafc; padding: 1rem; border-radius: 8px; }
      .detail-item span { font-weight: 600; color: #4a5568; display: block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }
      
      .mt-4 { margin-top: 2rem; font-size: 1.1rem; color: #003366; margin-bottom: 1rem; }
      
      .donnees-box { border: 1px solid #edf2f7; border-radius: 8px; overflow: hidden; }
      .donnee-row { display: flex; padding: 0.8rem 1rem; border-bottom: 1px solid #edf2f7; }
      .donnee-row:last-child { border-bottom: none; }
      .donnee-row:nth-child(even) { background: #f8fafc; }
      .d-key { flex: 1; font-weight: 600; color: #4a5568; text-transform: capitalize; }
      .d-val { flex: 2; color: #2d3748; }
    </style>
  `
})
export class ManagerDemarchesComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  readonly auth = inject(AuthService);

  loading = signal(true);
  demarches = signal<Demarche[]>([]);
  selectedDemarche = signal<Demarche | null>(null);

  ngOnInit() {
    this.loadDemarches();
  }

  loadDemarches() {
    this.http.get<{data: Demarche[]}>(`${environment.apiUrl}/demarches`).subscribe({
      next: (res) => {
        this.demarches.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.showError('manager-load-err', 'Impossible de charger les demandes.', 'Erreur');
        this.loading.set(false);
      }
    });
  }

  updateStatut(d: Demarche, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatut = select.value;
    
    this.http.put(`${environment.apiUrl}/demarches/${d.id}`, { statut: newStatut }).subscribe({
      next: () => {
        this.toast.show('manager-upd-ok', 'Le statut a été mis à jour.');
        // Update local object
        d.statut = newStatut;
      },
      error: () => {
        this.toast.showError('manager-upd-err', 'Impossible de mettre à jour le statut.', 'Erreur');
        // Revert select
        select.value = d.statut;
      }
    });
  }

  viewDetails(d: Demarche) {
    this.selectedDemarche.set(d);
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
