import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  BienApi, BienCreateRequest, BienFilters,
  VehiculeApi, VehiculeCreateRequest,
  TerrainApi, TerrainCreateRequest,
  MobilierCreateRequest, InformatiqueCreateRequest, EquipementCreateRequest,
  MouvementApi, AffectationCreateRequest,
  EntretienApi, EntretienCreateRequest,
  ReparationApi, ReparationCreateRequest,
  AmortissementApi, StatsPatrimoineApi,
  PaginatedResponse, ApiResponse
} from '../models/api.models';

const API = () => environment.apiUrl;

// ═══════════════════════════════════════════════════════════════════════════
//  Biens (inventaire général)
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class BienApiService {
  private http = inject(HttpClient);
  private base = `${API()}/patrimoine/biens`;

  getAll(f: BienFilters = {}): Observable<PaginatedResponse<BienApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v !== undefined && v !== '') p = p.set(k, String(v)); });
    return this.http.get<PaginatedResponse<BienApi>>(this.base, { params: p });
  }

  getById(id: number): Observable<ApiResponse<BienApi>> {
    return this.http.get<ApiResponse<BienApi>>(`${this.base}/${id}`);
  }

  getByReference(ref: string): Observable<ApiResponse<BienApi>> {
    return this.http.get<ApiResponse<BienApi>>(`${this.base}/reference/${ref}`);
  }

  create(data: BienCreateRequest): Observable<ApiResponse<BienApi>> {
    return this.http.post<ApiResponse<BienApi>>(this.base, data);
  }

  update(id: number, data: Partial<BienCreateRequest>): Observable<ApiResponse<BienApi>> {
    return this.http.put<ApiResponse<BienApi>>(`${this.base}/${id}`, data);
  }

  updateStatut(id: number, statut: string): Observable<ApiResponse<BienApi>> {
    return this.http.patch<ApiResponse<BienApi>>(`${this.base}/${id}/statut`, { statut });
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.base}/${id}`);
  }

  /** Génère et retourne le QR code d'un bien */
  getQr(id: number): Observable<ApiResponse<{ qr_code: string; url: string }>> {
    return this.http.get<ApiResponse<{ qr_code: string; url: string }>>(`${this.base}/${id}/qr`);
  }

  /** Export PDF fiche bien */
  downloadFiche(id: number): Observable<Blob> {
    return this.http.get(`${this.base}/${id}/fiche`, { responseType: 'blob' });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  Véhicules
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class VehiculeApiService {
  private http = inject(HttpClient);
  private base = `${API()}/patrimoine/vehicules`;

  getAll(f: { statut?: string; page?: number } = {}): Observable<PaginatedResponse<VehiculeApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, String(v)); });
    return this.http.get<PaginatedResponse<VehiculeApi>>(this.base, { params: p });
  }

  create(data: VehiculeCreateRequest): Observable<ApiResponse<VehiculeApi>> {
    return this.http.post<ApiResponse<VehiculeApi>>(this.base, data);
  }

  update(id: number, data: Partial<VehiculeCreateRequest>): Observable<ApiResponse<VehiculeApi>> {
    return this.http.put<ApiResponse<VehiculeApi>>(`${this.base}/${id}`, data);
  }

  /** Met à jour le kilométrage */
  updateKm(id: number, km: number): Observable<ApiResponse<VehiculeApi>> {
    return this.http.patch<ApiResponse<VehiculeApi>>(`${this.base}/${id}/kilometrage`, { kilometrage: km });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  Terrains
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class TerrainApiService {
  private http = inject(HttpClient);
  private base = `${API()}/patrimoine/terrains`;

  getAll(): Observable<PaginatedResponse<TerrainApi>> {
    return this.http.get<PaginatedResponse<TerrainApi>>(this.base);
  }

  create(data: TerrainCreateRequest): Observable<ApiResponse<TerrainApi>> {
    return this.http.post<ApiResponse<TerrainApi>>(this.base, data);
  }

  update(id: number, data: Partial<TerrainCreateRequest>): Observable<ApiResponse<TerrainApi>> {
    return this.http.put<ApiResponse<TerrainApi>>(`${this.base}/${id}`, data);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  Mobilier / Informatique / Équipements (sous-catégories de Bien)
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class MobilierApiService {
  private http = inject(HttpClient);
  create(data: MobilierCreateRequest): Observable<ApiResponse<BienApi>> {
    return this.http.post<ApiResponse<BienApi>>(`${API()}/patrimoine/mobilier`, data);
  }
}

@Injectable({ providedIn: 'root' })
export class InformatiqueApiService {
  private http = inject(HttpClient);
  create(data: InformatiqueCreateRequest): Observable<ApiResponse<BienApi>> {
    return this.http.post<ApiResponse<BienApi>>(`${API()}/patrimoine/informatique`, data);
  }
}

@Injectable({ providedIn: 'root' })
export class EquipementApiService {
  private http = inject(HttpClient);
  create(data: EquipementCreateRequest): Observable<ApiResponse<BienApi>> {
    return this.http.post<ApiResponse<BienApi>>(`${API()}/patrimoine/equipements`, data);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  Affectations & Mouvements
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class AffectationApiService {
  private http = inject(HttpClient);
  private base = `${API()}/patrimoine/affectations`;

  getHistorique(f: { reference?: string; page?: number } = {}): Observable<PaginatedResponse<MouvementApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, String(v)); });
    return this.http.get<PaginatedResponse<MouvementApi>>(this.base, { params: p });
  }

  affecter(data: AffectationCreateRequest): Observable<ApiResponse<MouvementApi>> {
    return this.http.post<ApiResponse<MouvementApi>>(this.base, data);
  }

  /** Export JSON historique */
  exportJson(): Observable<Blob> {
    return this.http.get(`${this.base}/export`, { responseType: 'blob' });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  Entretiens
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class EntretienApiService {
  private http = inject(HttpClient);
  private base = `${API()}/patrimoine/entretiens`;

  getAll(f: { statut?: string; page?: number } = {}): Observable<PaginatedResponse<EntretienApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, String(v)); });
    return this.http.get<PaginatedResponse<EntretienApi>>(this.base, { params: p });
  }

  create(data: EntretienCreateRequest): Observable<ApiResponse<EntretienApi>> {
    return this.http.post<ApiResponse<EntretienApi>>(this.base, data);
  }

  valider(id: number): Observable<ApiResponse<EntretienApi>> {
    return this.http.patch<ApiResponse<EntretienApi>>(`${this.base}/${id}/valider`, {});
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.base}/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  Réparations
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class ReparationApiService {
  private http = inject(HttpClient);
  private base = `${API()}/patrimoine/reparations`;

  getAll(f: { statut?: string; priorite?: string } = {}): Observable<PaginatedResponse<ReparationApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, v); });
    return this.http.get<PaginatedResponse<ReparationApi>>(this.base, { params: p });
  }

  create(data: ReparationCreateRequest): Observable<ApiResponse<ReparationApi>> {
    return this.http.post<ApiResponse<ReparationApi>>(this.base, data);
  }

  resoudre(id: number): Observable<ApiResponse<ReparationApi>> {
    return this.http.patch<ApiResponse<ReparationApi>>(`${this.base}/${id}/resoudre`, {});
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  Amortissements & Statistiques
// ═══════════════════════════════════════════════════════════════════════════
@Injectable({ providedIn: 'root' })
export class AmortissementApiService {
  private http = inject(HttpClient);

  getTableau(): Observable<PaginatedResponse<AmortissementApi>> {
    return this.http.get<PaginatedResponse<AmortissementApi>>(`${API()}/patrimoine/amortissements`);
  }

  simuler(valeur: number, taux: number, annees: number): Observable<ApiResponse<{ cumul: number; vnc: number }>> {
    return this.http.post<ApiResponse<{ cumul: number; vnc: number }>>(`${API()}/patrimoine/amortissements/simuler`, { valeur, taux, annees });
  }
}

@Injectable({ providedIn: 'root' })
export class StatsPatrimoineApiService {
  private http = inject(HttpClient);

  getDashboard(): Observable<StatsPatrimoineApi> {
    return this.http.get<StatsPatrimoineApi>(`${API()}/patrimoine/statistiques`);
  }

  exportTout(): Observable<Blob> {
    return this.http.get(`${API()}/patrimoine/export`, { responseType: 'blob' });
  }

  exportCategorie(cat: string): Observable<Blob> {
    return this.http.get(`${API()}/patrimoine/export`, {
      params: new HttpParams().set('categorie', cat),
      responseType: 'blob'
    });
  }
}
