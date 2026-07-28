import { Component, inject, signal, computed, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '@env/environment';
import { ApiService as EtatCivilApiService } from '../../etat-civil/services/api.service';
import { FinancesService } from '../../finances/core/services/finances.service';
import { DemandeApiService } from '../../services-techniques/core/services/services-techniques-api.service';

export interface Demarche {
  id: number;
  reference: string;
  module: string;
  type_demarche: string | null;
  statut: string;
  donnees?: any;
  commentaire_gestionnaire?: string | null;
  demandeur?: string | null;
  demandeur_telephone?: string | null;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-demandes-citoyens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demandes-wrapper">
      <div class="d-header">
        <h2><i class="ti ti-inbox"></i> Demandes Citoyens — {{ moduleLabel }}</h2>
        <div class="d-header-actions">
          <select class="filtre-select" [ngModel]="filtreStatut()" (ngModelChange)="filtreStatut.set($event)">
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="a_completer">À compléter / Affecté</option>
            <option value="valide">Validé</option>
            <option value="refuse">Refusé</option>
            <option value="termine">Terminé</option>
            <option value="tous">Tous les statuts</option>
          </select>
          <button class="btn-refresh" (click)="load()"><i class="ti ti-refresh"></i> Rafraichir</button>
        </div>
      </div>

      @if (loading()) {
        <div class="loading">Chargement des demandes...</div>
      } @else if (demarchesFiltrees().length === 0) {
        <div class="empty">
          <i class="ti ti-inbox-off" style="font-size:2.5rem;color:#94a3b8"></i>
          <p>Aucune demande citoyenne pour ce filtre.</p>
        </div>
      } @else {
        <table class="d-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Demandeur</th>
              <th>Type de demande</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (d of demarchesFiltrees(); track d.id) {
              <tr>
                <td class="ref-cell">{{ d.reference }}</td>
                <td>{{ d.updated_at | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ d.demandeur || '—' }}</td>
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
                @if (selectedDemarche()?.demandeur) {
                  <div class="ig-item">
                    <div class="ig-label">Demandeur</div>
                    <div class="ig-val">{{ selectedDemarche()?.demandeur }}</div>
                  </div>
                }
              </div>

              @if (selectedDemarche()?.donnees?.recette_reference || selectedDemarche()?.donnees?.intervention_ref) {
                <div class="donnees-box" style="border-color:#009A44;background:#f0fdf4;">
                  <h4><i class="ti ti-link"></i> Suivi métier lié :</h4>
                  <div class="donnees-grid">
                    @if (selectedDemarche()?.donnees?.recette_reference) {
                      <div class="donnee-item"><span class="donnee-key">Registre des paiements</span><span class="donnee-val">{{ selectedDemarche()?.donnees?.recette_reference }}</span></div>
                    }
                    @if (selectedDemarche()?.donnees?.intervention_ref) {
                      <div class="donnee-item"><span class="donnee-key">Registre des interventions</span><span class="donnee-val">{{ selectedDemarche()?.donnees?.intervention_ref }}</span></div>
                    }
                  </div>
                </div>
              }

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
                  <label class="commentaire-label" for="commentaire-gest"><i class="ti ti-message-circle"></i> Commentaire (optionnel) :</label>
                  <textarea id="commentaire-gest" class="commentaire-input" rows="2" [ngModel]="commentaire()" (ngModelChange)="commentaire.set($event)"
                            placeholder="Ex: Pièce manquante, délai supplémentaire, précision utile au citoyen..."></textarea>

                  <p><i class="ti ti-settings"></i> Mettre a jour le statut :</p>
                  <div class="btn-group">
                    <button class="btn-statut en_cours" (click)="updateStatut('en_cours')"
                            [disabled]="selectedDemarche()?.statut === 'en_cours'">
                      <i class="ti ti-clock"></i> {{ moduleName === 'services-techniques' ? 'Prendre en charge' : 'En cours' }}
                    </button>
                    <button class="btn-statut valide" (click)="updateStatut('valide')"
                            [disabled]="selectedDemarche()?.statut === 'valide'">
                      <i class="ti ti-check"></i> {{ moduleName === 'services-techniques' ? 'Résolu' : 'Valider' }}
                    </button>
                    @if (moduleName === 'services-techniques') {
                      <button class="btn-statut termine" (click)="updateStatut('termine')"
                              [disabled]="selectedDemarche()?.statut === 'termine'">
                        <i class="ti ti-checkbox"></i> Clôturer
                      </button>
                    }
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
    .d-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #f1f5f9; flex-wrap: wrap; gap: 0.8rem; }
    .d-header h2 { margin: 0; font-size: 1.1rem; color: #003366; display: flex; align-items: center; gap: 8px; }
    .d-header-actions { display: flex; align-items: center; gap: 0.6rem; }
    .filtre-select { padding: 7px 12px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; font-size: 0.85rem; font-weight: 600; background: #fff; }
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
    .commentaire-label { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 6px; }
    .commentaire-input { width: 100%; box-sizing: border-box; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; font-family: inherit; font-size: 0.85rem; resize: vertical; margin-bottom: 1rem; }
    .commentaire-input:focus { outline: none; border-color: #F77F00; }
    .btn-group { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn-statut { padding: 9px 18px; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; color: white; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; transition: all .15s; }
    .btn-statut:disabled { opacity: .5; cursor: not-allowed; }
    .btn-statut.en_cours { background: #0056b3; }
    .btn-statut.valide { background: #009A44; }
    .btn-statut.termine { background: #6b21a8; }
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
  filtreStatut     = signal('en_attente');
  commentaire      = signal('');

  demarchesFiltrees = computed(() => {
    const f = this.filtreStatut();
    if (f === 'tous') return this.demarches();
    return this.demarches().filter(d => d.statut === f);
  });

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
    this.commentaire.set('');
  }

  fermer() {
    this.selectedDemarche.set(null);
    this.commentaire.set('');
  }

  private etatCivilApi   = inject(EtatCivilApiService);
  private financesApi    = inject(FinancesService);
  private demandeStApi   = inject(DemandeApiService);

  async updateStatut(nouveauStatut: string) {
    const d = this.selectedDemarche();
    if (!d) return;
    this.updating.set(true);

    const extraDonnees: Record<string, any> = {};

    if (nouveauStatut === 'valide' && this.moduleName === 'etat-civil') {
      try {
        await this.genererActeOuCertificat(d);
      } catch (e) {
        console.error("Impossible de dresser l'acte / certificat officiel :", e);
      }
    }

    // Promotion vers le registre des paiements (Recette) dès validation d'un paiement citoyen
    if (nouveauStatut === 'valide' && this.moduleName === 'finances' && !d.donnees?.recette_reference) {
      try {
        const recette: any = await firstValueFrom(this.financesApi.ajouterRecette({
          contribuable: d.demandeur || 'Citoyen',
          adresse: undefined,
          serviceEmetteur: 'Portail citoyen',
          operateur: undefined,
          numeroTransaction: undefined,
          typeTaxe: d.donnees?.type_taxe || d.type_demarche || 'Paiement citoyen',
          montant: Number(d.donnees?.montant) || 0,
          dateEcheance: new Date().toISOString().slice(0, 10),
          modePaiement: this.mapModePaiement(d.donnees?.mode_paiement),
          statut: 'valide',
        } as any));
        extraDonnees['recette_reference'] = recette.reference;
      } catch (e) {
        console.error("Impossible de créer la recette dans le registre des paiements :", e);
      }
    }

    // Promotion vers le registre des interventions (DemandeIntervention) à la prise en charge
    if (nouveauStatut === 'en_cours' && this.moduleName === 'services-techniques' && !d.donnees?.intervention_ref) {
      try {
        const res: any = await firstValueFrom(this.demandeStApi.create({
          type_service: d.donnees?.type_incident || d.type_demarche || 'Signalement citoyen',
          description: d.donnees?.description || 'Signalement transmis via le portail citoyen.',
          localisation: [d.donnees?.quartier, d.donnees?.localisation || d.donnees?.adresse].filter(Boolean).join(' — ') || 'Non renseignée',
          demandeur: d.demandeur || 'Citoyen',
          telephone: d.demandeur_telephone || undefined,
          priorite: this.mapPriorite(d.donnees?.urgence),
        }));
        extraDonnees['intervention_ref'] = res?.data?.reference;
      } catch (e) {
        console.error("Impossible de créer la demande d'intervention :", e);
      }
    }

    const payload: Record<string, any> = { statut: nouveauStatut };
    if (this.commentaire().trim()) payload['commentaire'] = this.commentaire().trim();
    if (Object.keys(extraDonnees).length) payload['extra_donnees'] = extraDonnees;

    this.http.put(`${this.base}/demarches/${d.id}`, payload).subscribe({
      next: () => {
        this.updating.set(false);
        this.fermer();
        this.load();
      },
      error: () => this.updating.set(false)
    });
  }

  private mapModePaiement(modePaiement?: string): 'especes' | 'virement' | 'mobile_money' | 'cheque' {
    const m = (modePaiement || '').toLowerCase();
    if (m.includes('espèce') || m.includes('espece') || m.includes('cash') || m.includes('guichet')) return 'especes';
    if (m.includes('virement')) return 'virement';
    if (m.includes('carte')) return 'cheque';
    return 'mobile_money';
  }

  private mapPriorite(urgence?: string): 'normale' | 'haute' | 'urgente' {
    const u = (urgence || '').toLowerCase();
    if (u.includes('élevé') || u.includes('eleve') || u.includes('urgent')) return 'urgente';
    if (u.includes('moyen')) return 'haute';
    return 'normale';
  }

  /**
   * Enregistre la démarche citoyenne dans le registre officiel correspondant
   * puis imprime l'acte/certificat avec le même modèle que celui utilisé
   * par les agents d'état civil, pour garder un rendu identique.
   */
  private async genererActeOuCertificat(d: Demarche): Promise<void> {
    const type = d.type_demarche || '';
    const don: any = d.donnees || {};
    const api = this.etatCivilApi;

    if (type === "Demande d'acte de naissance") {
      const res: any = await firstValueFrom(api.createNaissance({
        nom: don.nom, prenom: don.prenom, date_naissance: don.date_naissance, heure_naissance: don.heure_naissance,
        sexe: don.sexe, lieu_naissance: don.lieu_naissance, commune: don.commune,
        pere_nom: don.pere_nom, pere_profession: don.pere_profession, pere_nationalite: don.pere_nationalite,
        mere_nom: don.mere_nom, mere_profession: don.mere_profession, mere_nationalite: don.mere_nationalite,
      }));
      const { genererExtraitNaissancePDF } = await import('../../etat-civil/modules/etat-civil/pages/naissances/naissances');
      await genererExtraitNaissancePDF({
        numero: res.numero, nom: don.nom, prenom: don.prenom,
        dateNaissance: don.date_naissance, heureNaissance: don.heure_naissance, sexe: don.sexe,
        lieuNaissance: don.lieu_naissance, commune: don.commune,
        pereNom: don.pere_nom, mereNom: don.mere_nom,
        pereProf: don.pere_profession, mereProf: don.mere_profession,
        pereNat: don.pere_nationalite, mereNat: don.mere_nationalite,
      });
    } else if (type === "Demande d'acte de mariage") {
      const res: any = await firstValueFrom(api.createMariage({
        epoux_nom: don.epoux_nom, epoux_prenom: don.epoux_prenom, epoux_profession: don.epoux_profession, epoux_nationalite: don.epoux_nationalite,
        epouse_nom: don.epouse_nom, epouse_prenom: don.epouse_prenom, epouse_profession: don.epouse_profession, epouse_nationalite: don.epouse_nationalite,
        date_mariage: don.date_mariage, lieu_mariage: don.lieu_mariage, regime_matrimonial: don.regime_matrimonial,
        temoin1_nom: don.epoux_temoin_nom, temoin1_profession: don.epoux_temoin_profession,
        temoin2_nom: don.epouse_temoin_nom, temoin2_profession: don.epouse_temoin_profession,
      }));
      const { genererActeMariagePDF } = await import('../../etat-civil/modules/etat-civil/pages/mariages/mariages');
      await genererActeMariagePDF({
        numero: res.numero,
        epoux: `${don.epoux_nom ?? ''} ${don.epoux_prenom ?? ''}`.trim(),
        epouse: `${don.epouse_nom ?? ''} ${don.epouse_prenom ?? ''}`.trim(),
        dateMariage: don.date_mariage, lieu: don.lieu_mariage, regime: don.regime_matrimonial,
        epouxProf: don.epoux_profession, epouxNat: don.epoux_nationalite,
        epouseProf: don.epouse_profession, epouseNat: don.epouse_nationalite,
        temoin1: don.epoux_temoin_nom, temoin1Prof: don.epoux_temoin_profession,
        temoin2: don.epouse_temoin_nom, temoin2Prof: don.epouse_temoin_profession,
      });
    } else if (type === "Demande d'acte de décès") {
      const res: any = await firstValueFrom(api.createDeces({
        nom: don.defunt_nom, prenom: don.defunt_prenom, date_naissance: don.defunt_date_naissance,
        date_deces: don.date_deces, heure_deces: don.heure_deces, lieu_deces: don.lieu_deces,
        commune: don.defunt_commune, cause_deces: don.cause_deces, declarant_nom: don.declarant_nom,
      }));
      const { genererActeDecesPDF } = await import('../../etat-civil/modules/etat-civil/pages/deces/deces');
      await genererActeDecesPDF({
        numero: res.numero, nom: don.defunt_nom, prenom: don.defunt_prenom, dob: don.defunt_date_naissance,
        dateDeces: don.date_deces, heureDeces: don.heure_deces, lieuDeces: don.lieu_deces,
        commune: don.defunt_commune, causeDeces: don.cause_deces, declarant: don.declarant_nom,
      });
    } else if (type === 'Certificat de célibat' || type === 'Certificat de résidence' || type === 'Certificat de vie individuelle') {
      const typeLabel = type === 'Certificat de célibat' ? 'Célibat' : type === 'Certificat de résidence' ? 'Résidence' : 'Vie';
      const res: any = await firstValueFrom(api.createCertificat({
        type: typeLabel, beneficiaire_nom: don.nom, beneficiaire_prenom: don.prenom, acte_reference: don.acte_reference,
      }));
      const { genererCertificatPDF } = await import('../../etat-civil/modules/etat-civil/pages/certificats/certificats');
      await genererCertificatPDF(typeLabel, {
        numero: res.numero, nom: don.nom, prenom: don.prenom, dob: don.date_naissance,
        acteRef: don.acte_reference, adresse: don.adresse, quartier: don.quartier, commune: don.commune,
        profession: don.profession, dateDelivrance: res.dateDelivrance,
      });
    } else if (type === 'Jugement supplétif') {
      const res: any = await firstValueFrom(api.createNaissance({
        nom: don.nom, prenom: '', date_naissance: don.date_naissance, lieu_naissance: don.lieu,
        tribunal: don.tribunal, date_jugement: don.date_jugement, type: 'Jugement',
      }));
      const { genererExtraitNaissancePDF } = await import('../../etat-civil/modules/etat-civil/pages/naissances/naissances');
      await genererExtraitNaissancePDF({
        numero: res.numero, nom: don.nom, prenom: '',
        dateNaissance: don.date_naissance, heureNaissance: '', sexe: '',
        lieuNaissance: don.lieu, commune: '', pereNom: '', mereNom: '',
      });
    } else if (type === "Demande d'adoption") {
      const parts = (don.enfant_nom ?? '').trim().split(' ');
      const enfantNom = parts[0] ?? '';
      const enfantPrenom = parts.slice(1).join(' ');
      const res: any = await firstValueFrom(api.createNaissance({
        nom: enfantNom, prenom: enfantPrenom, date_naissance: don.enfant_date_naissance, lieu_naissance: don.enfant_lieu_naissance,
        pere_nom: don.pere_nom, pere_profession: don.pere_profession, pere_nationalite: don.pere_nationalite,
        mere_nom: don.mere_nom, mere_profession: don.mere_profession, mere_nationalite: don.mere_nationalite,
        tribunal: don.tribunal, date_jugement: don.date_jugement, type: 'Adoption',
      }));
      const { genererActeAdoptionPDF } = await import('../../etat-civil/modules/etat-civil/pages/naissances/naissances');
      await genererActeAdoptionPDF({
        numero: res.numero, nom: enfantNom, prenom: enfantPrenom,
        dateNaissance: don.enfant_date_naissance, lieuNaissance: don.enfant_lieu_naissance, commune: '',
        pereNom: don.pere_nom, mereNom: don.mere_nom,
        pereProf: don.pere_profession, mereProf: don.mere_profession,
        pereNat: don.pere_nationalite, mereNat: don.mere_nationalite,
        tribunal: don.tribunal, dateJugement: don.date_jugement,
      });
    }
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
