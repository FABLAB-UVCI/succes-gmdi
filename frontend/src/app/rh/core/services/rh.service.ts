import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  Agent, Conge, Absence, Recrutement, Formation, LignePaie, Prime, Evaluation
} from '../models/rh.models';
import { environment } from '@env/environment';

export interface Depart {
  id: string;
  matricule: string;
  nom: string;
  cause: string;
  date: string;
  derniere_presence?: string;
  dernier_salaire?: number | null;
  observations?: string;
  statut: 'valide' | 'attente';
}

@Injectable({ providedIn: 'root' })
export class RhService {
  private api = environment.apiUrl;

  // ── État réactif (chargé depuis le backend) ──────────────────────────────
  readonly agents      = signal<Agent[]>([]);
  readonly conges      = signal<Conge[]>([]);
  readonly absences    = signal<Absence[]>([]);
  readonly recrutements= signal<Recrutement[]>([]);
  readonly formations  = signal<Formation[]>([]);
  readonly departs     = signal<Depart[]>([]);

  // ── Computed KPIs ────────────────────────────────────────────────────────
  readonly totalAgents     = computed(() => this.agents().length || 347);
  readonly totalFonct      = computed(() => this.agents().filter(a => a.typeContrat === 'fonctionnaire').length || 280);
  readonly totalContrat    = computed(() => this.agents().filter(a => a.typeContrat === 'contractuel').length || 52);
  readonly totalStagiaires = computed(() => this.agents().filter(a => a.typeContrat === 'stage').length || 15);

  readonly lignesPaie = computed<LignePaie[]>(() =>
    this.agents().slice(0, 4).map(a => {
      const retenues = Math.round(a.salaireBrut * 0.22);
      const net = a.salaireBrut - retenues + 50000;
      return { matricule: a.matricule, nomComplet: a.nomComplet, poste: a.poste, brut: a.salaireBrut, retenues, net, mode: 'Virement', statut: 'Payé' };
    })
  );

  constructor(private http: HttpClient) {
    this.chargerAgents();
    this.chargerConges();
    this.chargerAbsences();
    this.chargerRecrutements();
    this.chargerFormations();
    this.chargerDeparts();
  }

  // ── Chargement initial ────────────────────────────────────────────────────
  chargerAgents()       { this.http.get<any[]>(`${this.api}/agents`).subscribe(d => this.agents.set(this._mapAgents(d))); }
  chargerConges()       { this.http.get<any[]>(`${this.api}/conges`).subscribe(d => this.conges.set(this._mapConges(d))); }
  chargerAbsences()     { this.http.get<any[]>(`${this.api}/absences`).subscribe(d => this.absences.set(this._mapAbsences(d))); }
  chargerRecrutements() { this.http.get<any[]>(`${this.api}/recrutements`).subscribe(d => this.recrutements.set(this._mapRecrutements(d))); }
  chargerFormations()   { this.http.get<any[]>(`${this.api}/formations`).subscribe(d => this.formations.set(this._mapFormations(d))); }
  chargerDeparts()      { this.http.get<Depart[]>(`${this.api}/departs`).subscribe(d => this.departs.set(d)); }

  // ── CRUD Agents ──────────────────────────────────────────────────────────
  ajouterAgent(a: Omit<Agent, 'id'>): Observable<Agent> {
    const payload = this._agentToApi(a);
    return this.http.post<any>(`${this.api}/agents`, payload).pipe(
      tap(res => this.agents.update(list => [...list, this._mapAgent(res)]))
    );
  }

  modifierAgent(id: string, a: Partial<Agent>): Observable<Agent> {
    return this.http.put<any>(`${this.api}/agents/${id}`, this._agentToApi(a as Agent)).pipe(
      tap(res => this.agents.update(list => list.map(x => x.id === id ? this._mapAgent(res) : x)))
    );
  }

  supprimerAgent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/agents/${id}`).pipe(
      tap(() => this.agents.update(list => list.filter(a => a.id !== id)))
    );
  }

  filtrerAgents(recherche: string, direction: string, contrat: string, statut: string): Agent[] {
    return this.agents().filter(a => {
      const q = recherche.toLowerCase();
      const matchQ    = !q       || a.nomComplet.toLowerCase().includes(q) || a.matricule.toLowerCase().includes(q);
      const matchDir  = !direction || a.direction === direction;
      const matchCont = !contrat   || a.typeContrat === contrat;
      const matchStat = !statut    || a.statut === statut;
      return matchQ && matchDir && matchCont && matchStat;
    });
  }

  // ── CRUD Congés ──────────────────────────────────────────────────────────
  soumettreConge(c: Omit<Conge, 'id'>): Observable<Conge> {
    return this.http.post<any>(`${this.api}/conges`, this._congeToApi(c)).pipe(
      tap(res => this.conges.update(list => [...list, this._mapConge(res)]))
    );
  }

  approuverConge(id: string): Observable<Conge> {
    return this.http.put<any>(`${this.api}/conges/${id}`, { statut: 'approuve' }).pipe(
      tap(res => this.conges.update(list => list.map(c => c.id === id ? this._mapConge(res) : c)))
    );
  }

  refuserConge(id: string): Observable<Conge> {
    return this.http.put<any>(`${this.api}/conges/${id}`, { statut: 'refuse' }).pipe(
      tap(res => this.conges.update(list => list.map(c => c.id === id ? this._mapConge(res) : c)))
    );
  }

  // ── CRUD Absences ─────────────────────────────────────────────────────────
  declareAbsence(a: Absence): Observable<Absence> {
    return this.http.post<any>(`${this.api}/absences`, {
      matricule: a.matricule, agent: a.agent, date: a.date, motif: a.motif, justifie: a.justifie
    }).pipe(
      tap(res => this.absences.update(list => [...list, this._mapAbsence(res)]))
    );
  }

  // ── CRUD Recrutements ─────────────────────────────────────────────────────
  ouvrirPoste(r: Omit<Recrutement, 'id' | 'candidatures' | 'statut'>): Observable<Recrutement> {
    return this.http.post<any>(`${this.api}/recrutements`, {
      poste: r.poste, direction: r.direction, nb_postes: r.nbPostes, type: r.type, cloture: r.cloture
    }).pipe(
      tap(res => this.recrutements.update(list => [this._mapRecrutement(res), ...list]))
    );
  }

  // ── CRUD Formations ───────────────────────────────────────────────────────
  planifierFormation(f: Omit<Formation, 'id' | 'statut'>): Observable<Formation> {
    return this.http.post<any>(`${this.api}/formations`, {
      titre: f.titre, organisme: f.organisme, formateur: f.formateur,
      date_debut: f.dateDebut, date_fin: f.dateFin, agents: f.agents, cout: f.cout
    }).pipe(
      tap(res => this.formations.update(list => [...list, this._mapFormation(res)]))
    );
  }

  // ── CRUD Départs ─────────────────────────────────────────────────────────
  enregistrerDepart(d: Omit<Depart, 'id' | 'statut'>): Observable<Depart> {
    return this.http.post<Depart>(`${this.api}/departs`, d).pipe(
      tap(res => this.departs.update(list => [res, ...list]))
    );
  }

  validerDepart(id: string): Observable<Depart> {
    return this.http.put<Depart>(`${this.api}/departs/${id}`, { statut: 'valide' }).pipe(
      tap(res => this.departs.update(list => list.map(d => d.id === id ? res : d)))
    );
  }

  supprimerDepart(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/departs/${id}`).pipe(
      tap(() => this.departs.update(list => list.filter(d => d.id !== id)))
    );
  }

  // ── Utilitaires ───────────────────────────────────────────────────────────
  formaterFCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n || 0) + ' FCFA';
  }

  findAgent(q: string): Agent | undefined {
    const t = q.toLowerCase();
    return this.agents().find(a => a.matricule.toLowerCase() === t || a.nomComplet.toLowerCase().includes(t));
  }

  exportJSON(data: unknown, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename + '_' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
  }

  // ── Mapping snake_case → camelCase ────────────────────────────────────────
  private _mapAgent(r: any): Agent {
    return {
      id: String(r.id), matricule: r.matricule, nomComplet: r.nom_complet,
      nom: r.nom, prenom: r.prenom, poste: r.poste, direction: r.direction,
      typeContrat: r.type_contrat, categorie: r.categorie, specialite: r.specialite,
      grade: r.grade, dateEmbauche: r.date_embauche, dateNaissance: r.date_naissance,
      genre: r.genre, telephone: r.telephone, email: r.email, statut: r.statut,
      salaireBrut: Number(r.salaire_brut), congesRestants: Number(r.conges_restants),
      situationFamiliale: r.situation_familiale, diplome: r.diplome,
    };
  }
  private _mapAgents(list: any[]): Agent[] { return list.map(r => this._mapAgent(r)); }

  private _agentToApi(a: Partial<Agent>): any {
    return {
      matricule: a.matricule, nom_complet: a.nomComplet, nom: a.nom, prenom: a.prenom,
      poste: a.poste, direction: a.direction, type_contrat: a.typeContrat,
      categorie: a.categorie, specialite: a.specialite, grade: a.grade,
      date_embauche: a.dateEmbauche, date_naissance: a.dateNaissance,
      genre: a.genre, telephone: a.telephone, email: a.email, statut: a.statut,
      salaire_brut: a.salaireBrut, conges_restants: a.congesRestants,
      situation_familiale: a.situationFamiliale, diplome: a.diplome,
    };
  }

  private _mapConge(r: any): Conge {
    return {
      id: String(r.id), matricule: r.matricule, agent: r.agent, type: r.type,
      dateDebut: r.date_debut, duree: Number(r.duree), motif: r.motif,
      pieceJointe: r.piece_jointe, statut: r.statut,
    };
  }
  private _mapConges(list: any[]): Conge[] { return list.map(r => this._mapConge(r)); }

  private _congeToApi(c: Partial<Conge>): any {
    return {
      matricule: c.matricule, agent: c.agent, type: c.type,
      date_debut: c.dateDebut, duree: c.duree, motif: c.motif,
    };
  }

  private _mapAbsence(r: any): Absence {
    return { matricule: r.matricule, agent: r.agent, date: r.date, motif: r.motif, justifie: !!r.justifie };
  }
  private _mapAbsences(list: any[]): Absence[] { return list.map(r => this._mapAbsence(r)); }

  private _mapRecrutement(r: any): Recrutement {
    return {
      id: String(r.id), poste: r.poste, direction: r.direction,
      nbPostes: Number(r.nb_postes), type: r.type, cloture: r.cloture,
      candidatures: Number(r.candidatures), statut: r.statut,
    };
  }
  private _mapRecrutements(list: any[]): Recrutement[] { return list.map(r => this._mapRecrutement(r)); }

  private _mapFormation(r: any): Formation {
    return {
      id: String(r.id), titre: r.titre, organisme: r.organisme, formateur: r.formateur,
      dateDebut: r.date_debut, dateFin: r.date_fin, agents: r.agents,
      cout: Number(r.cout), statut: r.statut,
    };
  }
  private _mapFormations(list: any[]): Formation[] { return list.map(r => this._mapFormation(r)); }
}
