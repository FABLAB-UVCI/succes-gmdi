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

  chargerRecettes(params: { search?: string; typeTaxe?: string; statut?: string } = {}) {
    let query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
    const qs = query.toString();
    this.http.get<Recette[]>(`${this.api}/recettes${qs ? '?' + qs : ''}`).subscribe({
      next: d => this.recettes.set(d),
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur chargement recettes')
    });
  }

  chargerDepenses(params: { search?: string; chapitre?: string; statut?: string } = {}) {
    let query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
    const qs = query.toString();
    this.http.get<Depense[]>(`${this.api}/depenses${qs ? '?' + qs : ''}`).subscribe({
      next: d => this.depenses.set(d),
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur chargement dépenses')
    });
  }

  chargerLignesBudget() {
    this.http.get<LigneBudget[]>(`${this.api}/budget/lignes`).subscribe({
      next: d => this.lignesBudget.set(d),
      error: () => this.toast.showError('Erreur chargement budget')
    });
  }

  chargerEcritures() {
    this.http.get<EcritureComptable[]>(`${this.api}/comptabilite/ecritures`).subscribe({
      next: d => this.ecritures.set(d),
      error: () => this.toast.showError('Erreur chargement journal')
    });
  }

  chargerComptes() {
    this.http.get<CompteGL[]>(`${this.api}/comptabilite/comptes`).subscribe({
      next: d => this.comptes.set(d),
      error: () => this.toast.showError('Erreur chargement comptes')
    });
  }

  chargerRecettesParService() {
    this.http.get<RecetteParService[]>(`${this.api}/rapports/recettes-par-service`).subscribe({
      next: d => this.recettesParService.set(d),
      error: () => this.toast.showError('Erreur chargement rapports')
    });
  }

  chargerMouvementsCaisse() {
    this.http.get<MouvementCaisse[]>(`${this.api}/tresorerie/mouvements-caisse`).subscribe({
      next: d => this.mouvementsCaisse.set(d),
      error: () => this.toast.showError('Erreur chargement caisse')
    });
  }

  chargerMouvementsBanque() {
    this.http.get<MouvementBanque[]>(`${this.api}/tresorerie/mouvements-banque`).subscribe({
      next: d => this.mouvementsBanque.set(d),
      error: () => this.toast.showError('Erreur chargement banque')
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
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur création recette')
    });
  }

  modifierRecette(id: string, r: Omit<Recette, 'id' | 'reference'>): void {
    this.http.put<Recette>(`${this.api}/recettes/${id}`, r).subscribe({
      next: rec => {
        this.recettes.update(list => list.map(x => x.id === rec.id ? rec : x));
        this.toast.show(`Recette ${rec.reference} modifiée`);
      },
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur modification recette')
    });
  }

  supprimerRecette(id: string): void {
    this.http.delete(`${this.api}/recettes/${id}`).subscribe({
      next: () => {
        this.recettes.update(list => list.filter(r => r.id !== id));
        this.toast.show('Recette supprimée');
      },
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur suppression recette')
    });
  }

  encaisserRecette(id: string): void {
    this.http.patch<Recette>(`${this.api}/recettes/${id}/encaisser`, {}).subscribe({
      next: rec => {
        this.recettes.update(list => list.map(r => r.id === rec.id ? rec : r));
        this.toast.show(`Recette ${rec.reference} encaissée`);
      },
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur encaissement')
    });
  }

  // ── Actions Dépenses ──────────────────────────────────────────────
  ajouterDepense(d: Omit<Depense, 'id' | 'reference'>): void {
    this.http.post<Depense>(`${this.api}/depenses`, d).subscribe({
      next: dep => {
        this.depenses.update(list => [...list, dep]);
        this.toast.show(`Dépense ${dep.reference} enregistrée`);
      },
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur création dépense')
    });
  }

  modifierDepense(id: string, d: Omit<Depense, 'id' | 'reference'>): void {
    this.http.put<Depense>(`${this.api}/depenses/${id}`, d).subscribe({
      next: dep => {
        this.depenses.update(list => list.map(x => x.id === dep.id ? dep : x));
        this.toast.show(`Dépense ${dep.reference} modifiée`);
      },
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur modification dépense')
    });
  }

  supprimerDepense(id: string): void {
    this.http.delete(`${this.api}/depenses/${id}`).subscribe({
      next: () => {
        this.depenses.update(list => list.filter(d => d.id !== id));
        this.toast.show('Dépense supprimée');
      },
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur suppression dépense')
    });
  }

  payerDepense(id: string): void {
    this.http.patch<Depense>(`${this.api}/depenses/${id}/payer`, {}).subscribe({
      next: dep => {
        this.depenses.update(list => list.map(d => d.id === dep.id ? dep : d));
        this.toast.show(`Dépense ${dep.reference} payée`);
      },
      error: (err) => this.toast.showError(err?.error?.message || 'Erreur paiement dépense')
    });
  }

  // ── Actions Budget ────────────────────────────────────────────────
  ajouterLigneBudget(l: Omit<LigneBudget, 'id' | 'montantConsomme' | 'statut'>): void {
    this.http.post<LigneBudget>(`${this.api}/budget/lignes`, l).subscribe({
      next: ligne => {
        this.lignesBudget.update(list => [...list, ligne]);
        this.toast.show('Ligne budgétaire ajoutée');
      },
      error: () => this.toast.showError('Erreur création ligne budget')
    });
  }

  soumettrRevision(motif: string, ligneId: string, montant: number): void {
    this.http.post(`${this.api}/budget/revisions`, { motif, ligne_budget_id: ligneId, montant }).subscribe({
      next: () => this.toast.show('Révision soumise avec succès'),
      error: () => this.toast.showError('Erreur soumission révision')
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
