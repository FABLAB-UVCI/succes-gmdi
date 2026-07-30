import { Component, inject, signal, computed, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

export interface DemandeRh {
  id: number;
  reference: string;
  demandeurNom: string;
  moduleOrigine: string;
  typeDemande: string;
  titre: string;
  description: string;
  montantDemande: number | null;
  statut: 'en_attente' | 'validee' | 'refusee';
  commentaireRh: string | null;
  createdAt: string;
  updatedAt: string;
}

const TYPES_DEMANDE = [
  { value: 'augmentation', label: 'Augmentation salariale' },
  { value: 'formation', label: 'Formation' },
  { value: 'materiel', label: 'Matériel' },
  { value: 'recrutement', label: 'Recrutement' },
  { value: 'conges', label: 'Congé' },
  { value: 'autre', label: 'Autre' },
];

const LABELS_MODULE: Record<string, string> = {
  communication: 'Communication',
  'etat-civil': 'État civil',
  finances: 'Finances',
  patrimoine: 'Patrimoine',
  rh: 'Ressources humaines',
  'services-techniques': 'Services techniques',
  urbanisme: 'Urbanisme / SIG',
};

/**
 * Demandes internes des gestionnaires vers le service RH (augmentation,
 * formation, matériel, recrutement, congé, autre) — distinctes des
 * démarches citoyennes. Composant partagé utilisé dans deux contextes :
 *  - `moduleOrigine` défini : mode "soumission" dans un module non-RH
 *    (formulaire + historique de ses propres demandes) ;
 *  - `vueRh` à true : mode "gestion" dans le module RH lui-même
 *    (liste de toutes les demandes, validation/refus).
 */
@Component({
  selector: 'app-demande-rh',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="drh-wrapper">
      @if (!vueRh) {
        <div class="drh-header">
          <h2><i class="ti ti-send"></i> Nouvelle demande au service RH</h2>
        </div>
        <form class="drh-form" (ngSubmit)="soumettre()">
          <div class="fg">
            <label>Type de demande <span class="req">*</span></label>
            <select class="fsel" [(ngModel)]="form.typeDemande" name="typeDemande">
              @for (t of typesDemande; track t.value) { <option [value]="t.value">{{ t.label }}</option> }
            </select>
          </div>
          <div class="fg">
            <label>Titre <span class="req">*</span></label>
            <input type="text" class="fi" [(ngModel)]="form.titre" name="titre" placeholder="Ex: Demande d'augmentation salariale">
          </div>
          @if (form.typeDemande === 'augmentation') {
            <div class="fg">
              <label>Montant demandé (FCFA)</label>
              <input type="number" class="fi" [(ngModel)]="form.montantDemande" name="montantDemande" placeholder="Ex: 50000">
            </div>
          }
          <div class="fg">
            <label>Description <span class="req">*</span></label>
            <textarea class="fi" rows="4" [(ngModel)]="form.description" name="description" placeholder="Détaillez votre demande..."></textarea>
          </div>
          @if (erreur()) { <p class="drh-error">{{ erreur() }}</p> }
          <button type="submit" class="btn-submit" [disabled]="envoi()">
            <i class="ti ti-send"></i> {{ envoi() ? 'Envoi...' : 'Envoyer au RH' }}
          </button>
        </form>

        <div class="drh-header" style="margin-top:2rem;">
          <h2><i class="ti ti-history"></i> Mes demandes envoyées</h2>
        </div>
        @if (loading()) {
          <div class="drh-empty">Chargement...</div>
        } @else if (demandes().length === 0) {
          <div class="drh-empty">Aucune demande envoyée pour le moment.</div>
        } @else {
          <div class="drh-list">
            @for (d of demandes(); track d.id) {
              <div class="drh-item">
                <div class="drh-item-head">
                  <span class="drh-ref">{{ d.reference }}</span>
                  <span class="badge" [ngClass]="d.statut">{{ labelStatut(d.statut) }}</span>
                </div>
                <div class="drh-titre">{{ d.titre }}</div>
                <div class="drh-type">{{ labelType(d.typeDemande) }}@if (d.montantDemande) { — {{ d.montantDemande | number:'1.0-0':'fr-FR' }} FCFA }</div>
                @if (d.commentaireRh) {
                  <div class="drh-commentaire"><i class="ti ti-message-circle"></i> {{ d.commentaireRh }}</div>
                }
                <div class="drh-date">{{ d.createdAt | date:'dd/MM/yyyy HH:mm' }}</div>
              </div>
            }
          </div>
        }
      } @else {
        <div class="drh-header">
          <h2><i class="ti ti-inbox"></i> Demandes des services</h2>
          <div class="drh-header-actions">
            <select class="filtre-select" [ngModel]="filtreStatut()" (ngModelChange)="filtreStatut.set($event)">
              <option value="en_attente">En attente</option>
              <option value="validee">Validées</option>
              <option value="refusee">Refusées</option>
              <option value="tous">Toutes</option>
            </select>
            <button class="btn-refresh" (click)="charger()"><i class="ti ti-refresh"></i> Rafraichir</button>
          </div>
        </div>

        @if (loading()) {
          <div class="drh-empty">Chargement...</div>
        } @else if (demandesFiltrees().length === 0) {
          <div class="drh-empty">Aucune demande pour ce filtre.</div>
        } @else {
          <table class="d-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Demandeur</th>
                <th>Service</th>
                <th>Type</th>
                <th>Titre</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (d of demandesFiltrees(); track d.id) {
                <tr>
                  <td class="ref-cell">{{ d.reference }}</td>
                  <td>{{ d.demandeurNom }}</td>
                  <td>{{ labelModule(d.moduleOrigine) }}</td>
                  <td>{{ labelType(d.typeDemande) }}</td>
                  <td>{{ d.titre }}</td>
                  <td>{{ d.createdAt | date:'dd/MM/yyyy' }}</td>
                  <td><span class="badge" [ngClass]="d.statut">{{ labelStatut(d.statut) }}</span></td>
                  <td><button class="btn-action" (click)="voir(d)"><i class="ti ti-eye"></i> Traiter</button></td>
                </tr>
              }
            </tbody>
          </table>
        }

        @if (selection()) {
          <div class="modal-overlay" (click)="fermer()">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h3><i class="ti ti-file-description"></i> {{ selection()!.reference }}</h3>
                <button class="btn-close" (click)="fermer()"><i class="ti ti-x"></i></button>
              </div>
              <div class="modal-body">
                <div class="info-grid">
                  <div class="ig-item"><div class="ig-label">Demandeur</div><div class="ig-val">{{ selection()!.demandeurNom }}</div></div>
                  <div class="ig-item"><div class="ig-label">Service</div><div class="ig-val">{{ labelModule(selection()!.moduleOrigine) }}</div></div>
                  <div class="ig-item"><div class="ig-label">Type</div><div class="ig-val">{{ labelType(selection()!.typeDemande) }}</div></div>
                  @if (selection()!.montantDemande) {
                    <div class="ig-item"><div class="ig-label">Montant</div><div class="ig-val">{{ selection()!.montantDemande | number:'1.0-0':'fr-FR' }} FCFA</div></div>
                  }
                </div>
                <div class="donnees-box">
                  <h4>{{ selection()!.titre }}</h4>
                  <p style="white-space:pre-line;margin:0;">{{ selection()!.description }}</p>
                </div>
                <div class="actions-traitement">
                  <label class="commentaire-label">Commentaire (optionnel)</label>
                  <textarea class="commentaire-input" rows="2" [(ngModel)]="commentaire" placeholder="Précision au demandeur..."></textarea>
                  <div class="btn-group">
                    <button class="btn-statut validee" (click)="statuer('validee')" [disabled]="selection()!.statut==='validee'"><i class="ti ti-check"></i> Valider</button>
                    <button class="btn-statut refusee" (click)="statuer('refusee')" [disabled]="selection()!.statut==='refusee'"><i class="ti ti-x"></i> Refuser</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .drh-wrapper { padding: 1.5rem; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,.05); }
    .drh-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; padding-bottom: .8rem; border-bottom: 2px solid #f1f5f9; flex-wrap: wrap; gap: .6rem; }
    .drh-header h2 { margin: 0; font-size: 1.05rem; color: #003366; display: flex; align-items: center; gap: 8px; }
    .drh-header-actions { display: flex; gap: .6rem; }
    .filtre-select { padding: 7px 12px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; font-size: .85rem; font-weight: 600; }
    .btn-refresh { background: #f0f4f8; border: 1px solid #e2e8f0; padding: 7px 14px; border-radius: 8px; cursor: pointer; color: #003366; font-weight: 600; font-size: .85rem; }
    .btn-refresh:hover { background: #003366; color: #fff; }

    .drh-form { display: flex; flex-direction: column; gap: 1rem; max-width: 560px; }
    .fg { display: flex; flex-direction: column; gap: .4rem; }
    .fg label { font-size: .8rem; font-weight: 700; color: #475569; }
    .req { color: #ef4444; }
    .fi, .fsel { padding: .6rem .8rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: .88rem; font-family: inherit; outline: none; background: #f8fafc; }
    .fi:focus, .fsel:focus { border-color: #F77F00; background: #fff; box-shadow: 0 0 0 3px rgba(247,127,0,.1); }
    .drh-error { color: #e63946; font-size: .82rem; margin: 0; }
    .btn-submit { padding: .9rem; background: #009A44; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .4rem; }
    .btn-submit:hover:not(:disabled) { background: #007a36; }
    .btn-submit:disabled { opacity: .6; cursor: not-allowed; }

    .drh-empty { padding: 2rem; text-align: center; color: #64748b; font-style: italic; }
    .drh-list { display: flex; flex-direction: column; gap: .8rem; }
    .drh-item { padding: 1rem; border: 1px solid #edf2f7; border-radius: 8px; background: #f8fafc; }
    .drh-item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: .4rem; gap: .5rem; }
    .drh-ref { font-family: 'Courier New', monospace; font-weight: 700; color: #003366; font-size: .85rem; }
    .drh-titre { font-weight: 700; color: #1e293b; margin-bottom: .2rem; }
    .drh-type { font-size: .82rem; color: #64748b; }
    .drh-commentaire { font-size: .8rem; color: #7a5c3a; font-style: italic; margin-top: .4rem; display: flex; align-items: center; gap: 4px; }
    .drh-date { font-size: .75rem; color: #94a3b8; margin-top: .3rem; }

    .badge { padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
    .badge.en_attente { background: #fff3cd; color: #856404; }
    .badge.validee { background: #d4edda; color: #155724; }
    .badge.refusee { background: #f8d7da; color: #721c24; }

    .d-table { width: 100%; border-collapse: collapse; font-size: .88rem; }
    .d-table th { text-align: left; padding: 10px 14px; background: #f8fafc; color: #334155; font-size: .74rem; text-transform: uppercase; letter-spacing: .5px; border-bottom: 2px solid #e2e8f0; }
    .d-table td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
    .d-table tr:hover td { background: #f8fafc; }
    .ref-cell { font-family: 'Courier New', monospace; font-weight: 700; color: #003366; font-size: .8rem; }
    .btn-action { background: #F77F00; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: .78rem; font-weight: 600; display: flex; align-items: center; gap: 5px; }
    .btn-action:hover { background: #cc6600; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(2px); }
    .modal-content { background: #fff; width: 560px; max-width: 92vw; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.25); overflow: hidden; max-height: 85vh; display: flex; flex-direction: column; }
    .modal-header { padding: 1.1rem 1.5rem; background: linear-gradient(135deg, #003366, #004fa3); color: #fff; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h3 { margin: 0; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
    .btn-close { background: rgba(255,255,255,.15); border: none; color: #fff; width: 30px; height: 30px; border-radius: 6px; cursor: pointer; }
    .btn-close:hover { background: rgba(255,255,255,.3); }
    .modal-body { padding: 1.5rem; overflow-y: auto; }
    .info-grid { display: flex; gap: 1.5rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
    .ig-item { display: flex; flex-direction: column; gap: 4px; }
    .ig-label { font-size: .72rem; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .ig-val { font-weight: 600; color: #0f172a; font-size: .92rem; }
    .donnees-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.1rem; margin-bottom: 1.2rem; }
    .donnees-box h4 { margin: 0 0 8px; font-size: .92rem; color: #003366; }
    .actions-traitement { border-top: 1px solid #f1f5f9; padding-top: 1rem; }
    .commentaire-label { display: block; font-size: .8rem; font-weight: 700; color: #475569; margin-bottom: 6px; }
    .commentaire-input { width: 100%; box-sizing: border-box; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; font-family: inherit; font-size: .85rem; resize: vertical; margin-bottom: 1rem; }
    .btn-group { display: flex; gap: 10px; }
    .btn-statut { padding: 9px 18px; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px; }
    .btn-statut:disabled { opacity: .5; cursor: not-allowed; }
    .btn-statut.validee { background: #009A44; }
    .btn-statut.refusee { background: #dc3545; }
  `]
})
export class DemandeRhComponent implements OnInit {
  @Input() moduleOrigine?: string;
  @Input() vueRh = false;

  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/rh-demandes`;

  typesDemande = TYPES_DEMANDE;
  demandes = signal<DemandeRh[]>([]);
  loading = signal(true);
  envoi = signal(false);
  erreur = signal('');
  filtreStatut = signal('en_attente');
  selection = signal<DemandeRh | null>(null);
  commentaire = '';

  form = { typeDemande: 'augmentation', titre: '', description: '', montantDemande: null as number | null };

  demandesFiltrees = computed(() => {
    const f = this.filtreStatut();
    if (f === 'tous') return this.demandes();
    return this.demandes().filter(d => d.statut === f);
  });

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.loading.set(true);
    this.http.get<{ data: DemandeRh[] }>(this.base).subscribe({
      next: r => { this.demandes.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  soumettre(): void {
    this.erreur.set('');
    if (!this.form.titre.trim() || !this.form.description.trim()) {
      this.erreur.set('Le titre et la description sont obligatoires.');
      return;
    }
    this.envoi.set(true);
    this.http.post(this.base, {
      module_origine: this.moduleOrigine,
      type_demande: this.form.typeDemande,
      titre: this.form.titre.trim(),
      description: this.form.description.trim(),
      montant_demande: this.form.typeDemande === 'augmentation' ? this.form.montantDemande : null,
    }).subscribe({
      next: () => {
        this.envoi.set(false);
        this.form = { typeDemande: 'augmentation', titre: '', description: '', montantDemande: null };
        this.charger();
      },
      error: (err) => {
        this.envoi.set(false);
        this.erreur.set(err?.error?.message ?? "Impossible d'envoyer la demande.");
      },
    });
  }

  voir(d: DemandeRh): void {
    this.selection.set(d);
    this.commentaire = '';
  }

  fermer(): void {
    this.selection.set(null);
  }

  statuer(statut: 'validee' | 'refusee'): void {
    const d = this.selection();
    if (!d) return;
    this.http.patch(`${this.base}/${d.id}/statut`, { statut, commentaire_rh: this.commentaire.trim() || null }).subscribe({
      next: () => { this.fermer(); this.charger(); },
    });
  }

  labelType(type: string): string {
    return this.typesDemande.find(t => t.value === type)?.label ?? type;
  }

  labelModule(module: string): string {
    return LABELS_MODULE[module] ?? module;
  }

  labelStatut(statut: string): string {
    const map: Record<string, string> = { en_attente: 'En attente', validee: 'Validée', refusee: 'Refusée' };
    return map[statut] ?? statut;
  }
}
