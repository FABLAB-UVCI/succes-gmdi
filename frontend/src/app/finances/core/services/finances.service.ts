import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ToastService } from './toast.service';
import {
  Recette, Depense, LigneBudget, EcritureComptable,
  CompteGL, RecetteParService, MouvementCaisse, MouvementBanque
} from '../models/finances.models';

export interface DashboardStats {
  totalRecettes: number;
  totalDepenses: number;
  tauxExecution: number;
  tauxDematerialise: number;
}

export interface ExecutionMensuelle {
  mois: string;
  recettes: number;
  depenses: number;
}

@Injectable({ providedIn: 'root' })
export class FinancesService {
  private http  = inject(HttpClient);
  private toast = inject(ToastService);
  private api   = environment.apiUrl;

  // ── Signals ───────────────────────────────────────────────────────
  recettes            = signal<Recette[]>([]);
  depenses            = signal<Depense[]>([]);
  lignesBudget        = signal<LigneBudget[]>([]);
  ecritures           = signal<EcritureComptable[]>([]);
  comptes             = signal<CompteGL[]>([]);
  recettesParService  = signal<RecetteParService[]>([]);
  mouvementsCaisse    = signal<MouvementCaisse[]>([]);
  mouvementsBanque    = signal<MouvementBanque[]>([]);
  executionMensuelle  = signal<ExecutionMensuelle[]>([]);
  dashboardStats      = signal<DashboardStats>({ totalRecettes: 0, totalDepenses: 0, tauxExecution: 0, tauxDematerialise: 0 });
  chargement          = signal(false);

  // ── Computed ──────────────────────────────────────────────────────
  totalRecettesEncaissees = computed(() =>
    this.recettes().filter(r => r.statut === 'valide').reduce((s, r) => s + r.montant, 0)
  );
  totalDepensesPayees = computed(() =>
    this.depenses().filter(d => d.statut === 'valide').reduce((s, d) => s + d.montant, 0)
  );
  totalDebit  = computed(() => this.ecritures().reduce((s, e) => s + e.debit, 0));
  totalCredit = computed(() => this.ecritures().reduce((s, e) => s + e.credit, 0));

  // ── Chargement initial ────────────────────────────────────────────
  chargerTout() {
    this.chargerRecettes();
    this.chargerDepenses();
    this.chargerLignesBudget();
    this.chargerEcritures();
    this.chargerComptes();
    this.chargerRecettesParService();
    this.chargerMouvementsCaisse();
    this.chargerMouvementsBanque();
    this.chargerExecutionMensuelle();
    this.chargerDashboard();
  }

  chargerRecettes() {
    this.http.get<Recette[]>(`${this.api}/recettes`).subscribe({
      next: d => this.recettes.set(d),
      error: () => this.toast.show('Erreur chargement recettes')
    });
  }

  chargerDepenses() {
    this.http.get<Depense[]>(`${this.api}/depenses`).subscribe({
      next: d => this.depenses.set(d),
      error: () => this.toast.show('Erreur chargement dépenses')
    });
  }

  chargerLignesBudget() {
    this.http.get<LigneBudget[]>(`${this.api}/budget/lignes`).subscribe({
      next: d => this.lignesBudget.set(d),
      error: () => this.toast.show('Erreur chargement budget')
    });
  }

  chargerEcritures() {
    this.http.get<EcritureComptable[]>(`${this.api}/comptabilite/ecritures`).subscribe({
      next: d => this.ecritures.set(d),
      error: () => this.toast.show('Erreur chargement journal')
    });
  }

  chargerComptes() {
    this.http.get<CompteGL[]>(`${this.api}/comptabilite/comptes`).subscribe({
      next: d => this.comptes.set(d),
      error: () => this.toast.show('Erreur chargement comptes')
    });
  }

  chargerRecettesParService() {
    this.http.get<RecetteParService[]>(`${this.api}/rapports/recettes-par-service`).subscribe({
      next: d => this.recettesParService.set(d),
      error: () => this.toast.show('Erreur chargement rapports')
    });
  }

  chargerMouvementsCaisse() {
    this.http.get<MouvementCaisse[]>(`${this.api}/tresorerie/mouvements-caisse`).subscribe({
      next: d => this.mouvementsCaisse.set(d),
      error: () => this.toast.show('Erreur chargement caisse')
    });
  }

  chargerMouvementsBanque() {
    this.http.get<MouvementBanque[]>(`${this.api}/tresorerie/mouvements-banque`).subscribe({
      next: d => this.mouvementsBanque.set(d),
      error: () => this.toast.show('Erreur chargement banque')
    });
  }

  chargerExecutionMensuelle() {
    this.http.get<ExecutionMensuelle[]>(`${this.api}/budget/execution-mensuelle`).subscribe({
      next: d => this.executionMensuelle.set(d),
      error: () => {}
    });
  }

  chargerDashboard() {
    this.http.get<DashboardStats>(`${this.api}/dashboard/stats`).subscribe({
      next: d => this.dashboardStats.set(d),
      error: () => {}
    });
  }

  // ── Actions Recettes ──────────────────────────────────────────────
  ajouterRecette(r: Omit<Recette, 'id' | 'reference'>): void {
    this.http.post<Recette>(`${this.api}/recettes`, r).subscribe({
      next: rec => {
        this.recettes.update(list => [...list, rec]);
        this.toast.show(`Recette ${rec.reference} créée`);
      },
      error: () => this.toast.show('Erreur création recette')
    });
  }

  encaisserRecette(id: string): void {
    this.http.patch<Recette>(`${this.api}/recettes/${id}/encaisser`, {}).subscribe({
      next: rec => {
        this.recettes.update(list => list.map(r => r.id === rec.id ? rec : r));
        this.toast.show(`Recette ${rec.reference} encaissée`);
      },
      error: () => this.toast.show('Erreur encaissement')
    });
  }

  // ── Actions Dépenses ──────────────────────────────────────────────
  ajouterDepense(d: Omit<Depense, 'id' | 'reference'>): void {
    this.http.post<Depense>(`${this.api}/depenses`, d).subscribe({
      next: dep => {
        this.depenses.update(list => [...list, dep]);
        this.toast.show(`Dépense ${dep.reference} enregistrée`);
      },
      error: () => this.toast.show('Erreur création dépense')
    });
  }

  payerDepense(id: string): void {
    this.http.patch<Depense>(`${this.api}/depenses/${id}/payer`, {}).subscribe({
      next: dep => {
        this.depenses.update(list => list.map(d => d.id === dep.id ? dep : d));
        this.toast.show(`Dépense ${dep.reference} payée`);
      },
      error: () => this.toast.show('Erreur paiement dépense')
    });
  }

  // ── Actions Budget ────────────────────────────────────────────────
  ajouterLigneBudget(l: Omit<LigneBudget, 'id' | 'montantConsomme' | 'statut'>): void {
    this.http.post<LigneBudget>(`${this.api}/budget/lignes`, l).subscribe({
      next: ligne => {
        this.lignesBudget.update(list => [...list, ligne]);
        this.toast.show('Ligne budgétaire ajoutée');
      },
      error: () => this.toast.show('Erreur création ligne budget')
    });
  }

  soumettrRevision(motif: string, ligneId: string, montant: number): void {
    this.http.post(`${this.api}/budget/revisions`, { motif, ligne_budget_id: ligneId, montant }).subscribe({
      next: () => this.toast.show('Révision soumise avec succès'),
      error: () => this.toast.show('Erreur soumission révision')
    });
  }

  // ── Utilitaires ───────────────────────────────────────────────────
  fc(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n || 0) + ' FCFA';
  }

  pct(v: number, t: number): number {
    return Math.min(100, Math.round((v / Math.max(1, t)) * 100));
  }

  exportJSON(data: unknown, nom: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nom + '_' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
  }
}
