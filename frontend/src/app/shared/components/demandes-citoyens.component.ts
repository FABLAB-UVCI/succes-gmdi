import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

export interface Demarche {
  id: number;
  reference: string;
  module: string;
  type_demarche: string | null;
  statut: string;
  donnees?: any;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-demandes-citoyens',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demandes-wrapper">
      <div class="d-header">
        <h2><i class="ti ti-inbox"></i> Demandes Citoyens — {{ moduleLabel }}</h2>
        <button class="btn-refresh" (click)="load()"><i class="ti ti-refresh"></i> Rafraichir</button>
      </div>

      @if (loading()) {
        <div class="loading">Chargement des demandes...</div>
      } @else if (demarches().length === 0) {
        <div class="empty">
          <i class="ti ti-inbox-off" style="font-size:2.5rem;color:#94a3b8"></i>
          <p>Aucune demande citoyenne pour le moment.</p>
        </div>
      } @else {
        <table class="d-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Type de demande</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (d of demarches(); track d.id) {
              <tr>
                <td class="ref-cell">{{ d.reference }}</td>
                <td>{{ d.updated_at | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ d.type_demarche || 'Demande generale' }}</td>
                <td>
                  <span class="badge" [ngClass]="d.statut">
                    {{ labelStatut(d.statut) }}
                  </span>
                </td>
                <td>
                  <button class="btn-action" (click)="voir(d)">
                    <i class="ti ti-eye"></i> {{ readonly ? 'Consulter' : 'Traiter' }}
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }

      @if (selectedDemarche()) {
        <div class="modal-overlay" (click)="fermer()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3><i class="ti ti-file-description"></i> {{ readonly ? 'Consultation' : 'Traitement' }} — {{ selectedDemarche()?.reference }}</h3>
              <button class="btn-close" (click)="fermer()"><i class="ti ti-x"></i></button>
            </div>
            <div class="modal-body">
              <div class="info-grid">
                <div class="ig-item">
                  <div class="ig-label">Type de demande</div>
                  <div class="ig-val">{{ selectedDemarche()?.type_demarche || 'Non specifie' }}</div>
                </div>
                <div class="ig-item">
                  <div class="ig-label">Date de soumission</div>
                  <div class="ig-val">{{ selectedDemarche()?.created_at | date:'dd/MM/yyyy HH:mm' }}</div>
                </div>
                <div class="ig-item">
                  <div class="ig-label">Statut actuel</div>
                  <div class="ig-val">
                    <span class="badge" [ngClass]="selectedDemarche()?.statut ?? ''">
                      {{ labelStatut(selectedDemarche()?.statut ?? '') }}
                    </span>
                  </div>
                </div>
              </div>

              @if (selectedDemarche()?.donnees) {
                <div class="donnees-box">
                  <h4><i class="ti ti-forms"></i> Donnees du formulaire :</h4>
                  <div class="donnees-grid">
                    @for (entry of objectEntries(selectedDemarche()?.donnees); track entry[0]) {
                      <div class="donnee-item">
                        <span class="donnee-key">{{ formatKey(entry[0]) }}</span>
                        <span class="donnee-val">{{ entry[1] }}</span>
                      </div>
                    }
                  </div>
                </div>

                @if (selectedDemarche()?.donnees?.pieces_jointes) {
                  <div class="donnees-box">
                    <h4><i class="ti ti-paperclip"></i> Pièces jointes :</h4>
                    <div class="donnees-grid">
                      @for (pj of selectedDemarche()?.donnees?.pieces_jointes; track pj.url) {
                        <div class="donnee-item" style="justify-content: space-between; align-items: center;">
                          <span class="donnee-key"><i class="ti ti-file" style="margin-right: 5px;"></i> {{ pj.nom }}</span>
                          <a [href]="pj.url" target="_blank" class="btn-download">
                            <i class="ti ti-download"></i> Télécharger
                          </a>
                        </div>
                      }
                    </div>
                  </div>
                }
              }

              @if (!readonly) {
                <div class="actions-traitement">
                  <p><i class="ti ti-settings"></i> Mettre a jour le statut :</p>
                  <div class="btn-group">
                    <button class="btn-statut en_cours" (click)="updateStatut('en_cours')"
                            [disabled]="selectedDemarche()?.statut === 'en_cours'">
                      <i class="ti ti-clock"></i> En cours
                    </button>
                    <button class="btn-statut valide" (click)="updateStatut('valide')"
                            [disabled]="selectedDemarche()?.statut === 'valide'">
                      <i class="ti ti-check"></i> Valider
                    </button>
                    <button class="btn-statut refuse" (click)="updateStatut('refuse')"
                            [disabled]="selectedDemarche()?.statut === 'refuse'">
                      <i class="ti ti-x"></i> Refuser
                    </button>
                  </div>
                  @if (updating()) {
                    <p style="color:#F77F00;margin-top:10px;font-size:0.85rem">
                      <i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Mise a jour...
                    </p>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    .demandes-wrapper { padding: 1.5rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,.05); }
    .d-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #f1f5f9; }
    .d-header h2 { margin: 0; font-size: 1.1rem; color: #003366; display: flex; align-items: center; gap: 8px; }
    .btn-refresh { background: #f0f4f8; border: 1px solid #e2e8f0; padding: 7px 14px; border-radius: 8px; cursor: pointer; color: #003366; display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.85rem; transition: all .15s; }
    .btn-refresh:hover { background: #003366; color: #fff; }
    .loading { padding: 3rem; text-align: center; color: #64748b; font-style: italic; }
    .empty { padding: 3rem; text-align: center; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .d-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .d-table th { text-align: left; padding: 12px 16px; background: #f8fafc; color: #334155; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 2px solid #e2e8f0; }
    .d-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
    .d-table tr:hover td { background: #f8fafc; }
    .ref-cell { font-family: 'Courier New', monospace; font-weight: 700; color: #003366; font-size: 0.82rem; }
    .badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge.en_attente { background: #fff3cd; color: #856404; }
    .badge.en_cours { background: #cce5ff; color: #004085; }
    .badge.valide { background: #d4edda; color: #155724; }
    .badge.refuse { background: #f8d7da; color: #721c24; }
    .badge.termine { background: #e2e3e5; color: #383d41; }
    .btn-action { background: #F77F00; color: white; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 5px; transition: all .15s; }
    .btn-action:hover { background: #cc6600; transform: translateY(-1px); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(2px); }
    .modal-content { background: #fff; width: 640px; max-width: 92vw; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.25); overflow: hidden; max-height: 90vh; display: flex; flex-direction: column; }
    .modal-header { padding: 1.1rem 1.5rem; background: linear-gradient(135deg, #003366, #004fa3); color: white; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
    .modal-header h3 { margin: 0; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
    .btn-close { background: rgba(255,255,255,.15); border: none; color: white; font-size: 1rem; cursor: pointer; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: background .15s; }
    .btn-close:hover { background: rgba(255,255,255,.3); }
    .modal-body { padding: 1.5rem; overflow-y: auto; }
    .info-grid { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .ig-item { display: flex; flex-direction: column; gap: 4px; }
    .ig-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .ig-val { font-weight: 600; color: #0f172a; font-size: 0.95rem; }
    .donnees-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.2rem; margin-bottom: 1.5rem; }
    .donnees-box h4 { margin: 0 0 12px 0; font-size: 0.9rem; color: #334155; display: flex; align-items: center; gap: 6px; }
    .donnees-grid { display: flex; flex-direction: column; gap: 8px; }
    .donnee-item { display: flex; gap: 12px; padding: 8px 12px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; }
    .donnee-key { font-weight: 700; color: #475569; font-size: 0.82rem; min-width: 160px; }
    .donnee-val { color: #0f172a; font-size: 0.88rem; }
    .actions-traitement { border-top: 1px solid #f1f5f9; padding-top: 1.2rem; }
    .actions-traitement p { margin: 0 0 12px 0; font-weight: 700; color: #334155; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; }
    .btn-group { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn-statut { padding: 9px 18px; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; color: white; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; transition: all .15s; }
    .btn-statut:disabled { opacity: .5; cursor: not-allowed; }
    .btn-statut.en_cours { background: #0056b3; }
    .btn-statut.valide { background: #009A44; }
    .btn-statut.refuse { background: #dc3545; }
    .btn-statut:not(:disabled):hover { filter: brightness(1.1); transform: translateY(-1px); }
    .btn-download { background: #003366; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 5px; text-decoration: none; transition: background .15s; }
    .btn-download:hover { background: #004fa3; }
  `]
})
export class DemandesCitoyensComponent implements OnInit {
  @Input() moduleName: string = '';
  @Input() moduleLabel: string = 'Demandes';
  @Input() readonly: boolean = false;

  private http  = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private base  = environment.apiUrl;

  demarches        = signal<Demarche[]>([]);
  loading          = signal(true);
  updating         = signal(false);
  selectedDemarche = signal<Demarche | null>(null);

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['moduleName']) this.moduleName = data['moduleName'];
      if (data['moduleLabel']) this.moduleLabel = data['moduleLabel'];
      this.load();
    });
    // If no route data, load immediately (when used as direct component with @Input)
    if (!this.route.snapshot.data['moduleName']) {
      this.load();
    }
  }

  load() {
    this.loading.set(true);
    const url = this.moduleName
      ? `${this.base}/demarches?module=${this.moduleName}`
      : `${this.base}/demarches`;

    this.http.get<{data: Demarche[]}>(url).subscribe({
      next:  res => { this.demarches.set(res.data); this.loading.set(false); },
      error: ()  => this.loading.set(false)
    });
  }

  voir(d: Demarche) {
    this.selectedDemarche.set(d);
  }

  fermer() {
    this.selectedDemarche.set(null);
  }

  updateStatut(nouveauStatut: string) {
    const d = this.selectedDemarche();
    if (!d) return;
    this.updating.set(true);
    this.http.put(`${this.base}/demarches/${d.id}`, { statut: nouveauStatut }).subscribe({
      next: () => {
        this.updating.set(false);
        this.fermer();
        this.load();
      },
      error: () => this.updating.set(false)
    });
  }

  labelStatut(s: string): string {
    const map: Record<string, string> = {
      en_attente: 'En attente',
      en_cours:   'En cours',
      valide:     'Valide',
      refuse:     'Refuse',
      termine:    'Termine'
    };
    return map[s] || s;
  }

  objectEntries(obj: any): [string, any][] {
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj).filter(([key]) => key !== 'pieces_jointes');
  }

  formatKey(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
