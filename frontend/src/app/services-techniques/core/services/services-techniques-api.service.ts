import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  RouteApi, RouteCreateRequest,
  EntretienVoirieApi, EntretienVoirieCreateRequest,
  ReparationVoirieApi, ReparationVoirieCreateRequest,
  LampadaireApi, LampadaireCreateRequest,
  PanneEclairageApi, PanneEclairageCreateRequest,
  MaintenanceEclairageApi,
  CaniveauApi, CaniveauCreateRequest,
  InterventionDrainageApi, CollecteDechetApi,
  BatimentCommunalApi, BatimentCreateRequest,
  TravauxBatimentApi, TravauxBatimentCreateRequest,
  DemandeInterventionApi, DemandeCreateRequest,
  BonTravailApi, BonTravailCreateRequest,
  EquipeApi, PlanningMaintenanceApi, PlanningCreateRequest,
  MaintenanceCorrectiveApi, MaintenanceCorrectiveCreateRequest,
  StatsServicesTechniquesApi,
  PaginatedResponse, ApiResponse
} from '../models/api.models';

const BASE = () => environment.apiUrl;

// ═══════════════════════════════════════════════════════════════════════════
//  VOIRIE
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class RouteApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/voirie/routes`;

  getAll(f: { search?: string; etat?: string; page?: number } = {}): Observable<PaginatedResponse<RouteApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v !== undefined && v !== '') p = p.set(k, String(v)); });
    return this.http.get<PaginatedResponse<RouteApi>>(this.base, { params: p });
  }
  create(data: RouteCreateRequest): Observable<ApiResponse<RouteApi>> {
    return this.http.post<ApiResponse<RouteApi>>(this.base, data);
  }
  update(id: number, data: Partial<RouteCreateRequest>): Observable<ApiResponse<RouteApi>> {
    return this.http.put<ApiResponse<RouteApi>>(`${this.base}/${id}`, data);
  }
}

@Injectable({ providedIn: 'root' })
export class EntretienVoirieApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/voirie/entretiens`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<EntretienVoirieApi>> {
    let p = new HttpParams();
    if (f.statut) p = p.set('statut', f.statut);
    return this.http.get<PaginatedResponse<EntretienVoirieApi>>(this.base, { params: p });
  }
  create(data: EntretienVoirieCreateRequest): Observable<ApiResponse<EntretienVoirieApi>> {
    return this.http.post<ApiResponse<EntretienVoirieApi>>(this.base, data);
  }
  terminer(id: number): Observable<ApiResponse<EntretienVoirieApi>> {
    return this.http.patch<ApiResponse<EntretienVoirieApi>>(`${this.base}/${id}/terminer`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class ReparationVoirieApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/voirie/reparations`;

  getAll(f: { statut?: string; priorite?: string } = {}): Observable<PaginatedResponse<ReparationVoirieApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, v); });
    return this.http.get<PaginatedResponse<ReparationVoirieApi>>(this.base, { params: p });
  }
  create(data: ReparationVoirieCreateRequest): Observable<ApiResponse<ReparationVoirieApi>> {
    return this.http.post<ApiResponse<ReparationVoirieApi>>(this.base, data);
  }
  intervenir(id: number): Observable<ApiResponse<ReparationVoirieApi>> {
    return this.http.patch<ApiResponse<ReparationVoirieApi>>(`${this.base}/${id}/intervenir`, {});
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  ÉCLAIRAGE PUBLIC
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class LampadaireApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/eclairage/lampadaires`;

  getAll(f: { statut?: string; quartier?: string } = {}): Observable<PaginatedResponse<LampadaireApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, v); });
    return this.http.get<PaginatedResponse<LampadaireApi>>(this.base, { params: p });
  }
  create(data: LampadaireCreateRequest): Observable<ApiResponse<LampadaireApi>> {
    return this.http.post<ApiResponse<LampadaireApi>>(this.base, data);
  }
  updateStatut(id: number, statut: string): Observable<ApiResponse<LampadaireApi>> {
    return this.http.patch<ApiResponse<LampadaireApi>>(`${this.base}/${id}/statut`, { statut });
  }
}

@Injectable({ providedIn: 'root' })
export class PanneEclairageApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/eclairage/pannes`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<PanneEclairageApi>> {
    let p = new HttpParams();
    if (f.statut) p = p.set('statut', f.statut);
    return this.http.get<PaginatedResponse<PanneEclairageApi>>(this.base, { params: p });
  }
  create(data: PanneEclairageCreateRequest): Observable<ApiResponse<PanneEclairageApi>> {
    return this.http.post<ApiResponse<PanneEclairageApi>>(this.base, data);
  }
  resoudre(id: number, technicien: string): Observable<ApiResponse<PanneEclairageApi>> {
    return this.http.patch<ApiResponse<PanneEclairageApi>>(`${this.base}/${id}/resoudre`, { technicien });
  }
}

@Injectable({ providedIn: 'root' })
export class MaintenanceEclairageApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/eclairage/maintenance`;

  getAll(): Observable<PaginatedResponse<MaintenanceEclairageApi>> {
    return this.http.get<PaginatedResponse<MaintenanceEclairageApi>>(this.base);
  }
  create(data: { zone: string; nb_lampadaires: number; type_intervention: string; date_prevue: string; technicien: string }): Observable<ApiResponse<MaintenanceEclairageApi>> {
    return this.http.post<ApiResponse<MaintenanceEclairageApi>>(this.base, data);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  EAU & ASSAINISSEMENT
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class CaniveauApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/eau/caniveaux`;

  getAll(f: { etat?: string } = {}): Observable<PaginatedResponse<CaniveauApi>> {
    let p = new HttpParams();
    if (f.etat) p = p.set('etat', f.etat);
    return this.http.get<PaginatedResponse<CaniveauApi>>(this.base, { params: p });
  }
  create(data: CaniveauCreateRequest): Observable<ApiResponse<CaniveauApi>> {
    return this.http.post<ApiResponse<CaniveauApi>>(this.base, data);
  }
  signalerNettoyage(id: number): Observable<ApiResponse<CaniveauApi>> {
    return this.http.patch<ApiResponse<CaniveauApi>>(`${this.base}/${id}/nettoyage`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class DrainageApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/eau/drainage`;

  getAll(): Observable<PaginatedResponse<InterventionDrainageApi>> {
    return this.http.get<PaginatedResponse<InterventionDrainageApi>>(this.base);
  }
  create(data: { localisation: string; type: string; date_intervention: string; equipe: string; observations?: string }): Observable<ApiResponse<InterventionDrainageApi>> {
    return this.http.post<ApiResponse<InterventionDrainageApi>>(this.base, data);
  }
}

@Injectable({ providedIn: 'root' })
export class DechetApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/eau/dechets`;

  getAll(): Observable<PaginatedResponse<CollecteDechetApi>> {
    return this.http.get<PaginatedResponse<CollecteDechetApi>>(this.base);
  }
  create(data: { zone: string; frequence: string; prochaine_collecte: string }): Observable<ApiResponse<CollecteDechetApi>> {
    return this.http.post<ApiResponse<CollecteDechetApi>>(this.base, data);
  }
  marquerEffectue(id: number, tonnage?: number): Observable<ApiResponse<CollecteDechetApi>> {
    return this.http.patch<ApiResponse<CollecteDechetApi>>(`${this.base}/${id}/effectuer`, { tonnage });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  BÂTIMENTS COMMUNAUX
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class BatimentApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/batiments`;

  getAll(f: { type?: string; etat?: string } = {}): Observable<PaginatedResponse<BatimentCommunalApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, v); });
    return this.http.get<PaginatedResponse<BatimentCommunalApi>>(this.base, { params: p });
  }
  create(data: BatimentCreateRequest): Observable<ApiResponse<BatimentCommunalApi>> {
    return this.http.post<ApiResponse<BatimentCommunalApi>>(this.base, data);
  }
  update(id: number, data: Partial<BatimentCreateRequest>): Observable<ApiResponse<BatimentCommunalApi>> {
    return this.http.put<ApiResponse<BatimentCommunalApi>>(`${this.base}/${id}`, data);
  }
}

@Injectable({ providedIn: 'root' })
export class TravauxBatimentApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/batiments/travaux`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<TravauxBatimentApi>> {
    let p = new HttpParams();
    if (f.statut) p = p.set('statut', f.statut);
    return this.http.get<PaginatedResponse<TravauxBatimentApi>>(this.base, { params: p });
  }
  create(data: TravauxBatimentCreateRequest): Observable<ApiResponse<TravauxBatimentApi>> {
    return this.http.post<ApiResponse<TravauxBatimentApi>>(this.base, data);
  }
  updateStatut(id: number, statut: string): Observable<ApiResponse<TravauxBatimentApi>> {
    return this.http.patch<ApiResponse<TravauxBatimentApi>>(`${this.base}/${id}/statut`, { statut });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  INTERVENTIONS
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class DemandeApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/interventions/demandes`;

  getAll(f: { statut?: string; type_service?: string; priorite?: string; page?: number } = {}): Observable<PaginatedResponse<DemandeInterventionApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v !== undefined && v !== '') p = p.set(k, String(v)); });
    return this.http.get<PaginatedResponse<DemandeInterventionApi>>(this.base, { params: p });
  }
  create(data: DemandeCreateRequest): Observable<ApiResponse<DemandeInterventionApi>> {
    return this.http.post<ApiResponse<DemandeInterventionApi>>(this.base, data);
  }
  assigner(id: number, agent: string): Observable<ApiResponse<DemandeInterventionApi>> {
    return this.http.patch<ApiResponse<DemandeInterventionApi>>(`${this.base}/${id}/assigner`, { assigne_a: agent });
  }
  cloturer(id: number): Observable<ApiResponse<DemandeInterventionApi>> {
    return this.http.patch<ApiResponse<DemandeInterventionApi>>(`${this.base}/${id}/cloturer`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class BonTravailApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/interventions/bons`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<BonTravailApi>> {
    let p = new HttpParams();
    if (f.statut) p = p.set('statut', f.statut);
    return this.http.get<PaginatedResponse<BonTravailApi>>(this.base, { params: p });
  }
  create(data: BonTravailCreateRequest): Observable<ApiResponse<BonTravailApi>> {
    return this.http.post<ApiResponse<BonTravailApi>>(this.base, data);
  }
  terminer(id: number): Observable<ApiResponse<BonTravailApi>> {
    return this.http.patch<ApiResponse<BonTravailApi>>(`${this.base}/${id}/terminer`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class EquipeApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/interventions/equipes`;

  getAll(): Observable<PaginatedResponse<EquipeApi>> {
    return this.http.get<PaginatedResponse<EquipeApi>>(this.base);
  }
  create(data: { nom: string; chef: string; membres: number }): Observable<ApiResponse<EquipeApi>> {
    return this.http.post<ApiResponse<EquipeApi>>(this.base, data);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  MAINTENANCE
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class PlanningMaintenanceApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/maintenance/planning`;

  getAll(f: { statut?: string; service?: string } = {}): Observable<PaginatedResponse<PlanningMaintenanceApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, v); });
    return this.http.get<PaginatedResponse<PlanningMaintenanceApi>>(this.base, { params: p });
  }
  create(data: PlanningCreateRequest): Observable<ApiResponse<PlanningMaintenanceApi>> {
    return this.http.post<ApiResponse<PlanningMaintenanceApi>>(this.base, data);
  }
  valider(id: number): Observable<ApiResponse<PlanningMaintenanceApi>> {
    return this.http.patch<ApiResponse<PlanningMaintenanceApi>>(`${this.base}/${id}/valider`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class MaintenanceCorrectiveApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/st/maintenance/corrective`;

  getAll(f: { statut?: string; priorite?: string } = {}): Observable<PaginatedResponse<MaintenanceCorrectiveApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, v); });
    return this.http.get<PaginatedResponse<MaintenanceCorrectiveApi>>(this.base, { params: p });
  }
  create(data: MaintenanceCorrectiveCreateRequest): Observable<ApiResponse<MaintenanceCorrectiveApi>> {
    return this.http.post<ApiResponse<MaintenanceCorrectiveApi>>(this.base, data);
  }
  resoudre(id: number, cout?: number): Observable<ApiResponse<MaintenanceCorrectiveApi>> {
    return this.http.patch<ApiResponse<MaintenanceCorrectiveApi>>(`${this.base}/${id}/resoudre`, { cout_reel: cout });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  STATISTIQUES
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class StatsStApiService {
  private http = inject(HttpClient);

  getDashboard(): Observable<StatsServicesTechniquesApi> {
    return this.http.get<StatsServicesTechniquesApi>(`${BASE()}/st/statistiques`);
  }
  export(service?: string): Observable<Blob> {
    let p = new HttpParams();
    if (service) p = p.set('service', service);
    return this.http.get(`${BASE()}/st/export`, { params: p, responseType: 'blob' });
  }
}
