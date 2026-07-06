import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  ParcelleApi, ParcelleCreateRequest,
  LotApi, LotCreateRequest,
  TitreFoncierApi, TitreFoncierCreateRequest,
  ReserveAdministrativeApi, ReserveAdministrativeCreateRequest,
  PermisConstruireApi, PermisConstruireCreateRequest,
  PermisDemolirApi, CertificatUrbanismeApi,
  AutorisationOccupationApi, AutorisationCreateRequest,
  QuartierSIGApi, VoirieSIGApi, ReseauSIGApi,
  LotissementApi, LotissementCreateRequest,
  AmenagementUrbainApi, AmenagementCreateRequest,
  SuiviChantierApi, SuiviChantierCreateRequest,
  EquipementPublicApi, EquipementCreateRequest,
  StatsUrbanismeApi, PaginatedResponse, ApiResponse
} from '../models/api.models';

const BASE = () => environment.apiUrl;
const p = (f: Record<string, unknown>): HttpParams => {
  let params = new HttpParams();
  Object.entries(f).forEach(([k, v]) => { if (v !== undefined && v !== '') params = params.set(k, String(v)); });
  return params;
};

// ════════════════════════════════════════════════════════════════════════════
//  GESTION FONCIÈRE
// ════════════════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class ParcelleApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/foncier/parcelles`;

  getAll(f: { search?: string; statut?: string; quartier?: string; page?: number } = {}): Observable<PaginatedResponse<ParcelleApi>> {
    return this.http.get<PaginatedResponse<ParcelleApi>>(this.base, { params: p(f) });
  }
  getOne(id: number): Observable<ApiResponse<ParcelleApi>> {
    return this.http.get<ApiResponse<ParcelleApi>>(`${this.base}/${id}`);
  }
  create(data: ParcelleCreateRequest): Observable<ApiResponse<ParcelleApi>> {
    return this.http.post<ApiResponse<ParcelleApi>>(this.base, data);
  }
  update(id: number, data: Partial<ParcelleCreateRequest>): Observable<ApiResponse<ParcelleApi>> {
    return this.http.put<ApiResponse<ParcelleApi>>(`${this.base}/${id}`, data);
  }
  updateStatut(id: number, statut: string): Observable<ApiResponse<ParcelleApi>> {
    return this.http.patch<ApiResponse<ParcelleApi>>(`${this.base}/${id}/statut`, { statut });
  }
}

@Injectable({ providedIn: 'root' })
export class LotApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/foncier/lots`;

  getAll(f: { statut?: string; lotissement?: string } = {}): Observable<PaginatedResponse<LotApi>> {
    return this.http.get<PaginatedResponse<LotApi>>(this.base, { params: p(f) });
  }
  create(data: LotCreateRequest): Observable<ApiResponse<LotApi>> {
    return this.http.post<ApiResponse<LotApi>>(this.base, data);
  }
  attribuer(id: number, beneficiaire: string): Observable<ApiResponse<LotApi>> {
    return this.http.patch<ApiResponse<LotApi>>(`${this.base}/${id}/attribuer`, { attribue_a: beneficiaire });
  }
}

@Injectable({ providedIn: 'root' })
export class TitreFoncierApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/foncier/titres`;

  getAll(f: { statut?: string; search?: string } = {}): Observable<PaginatedResponse<TitreFoncierApi>> {
    return this.http.get<PaginatedResponse<TitreFoncierApi>>(this.base, { params: p(f) });
  }
  create(data: TitreFoncierCreateRequest): Observable<ApiResponse<TitreFoncierApi>> {
    return this.http.post<ApiResponse<TitreFoncierApi>>(this.base, data);
  }
}

@Injectable({ providedIn: 'root' })
export class ReserveApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/foncier/reserves`;

  getAll(): Observable<PaginatedResponse<ReserveAdministrativeApi>> {
    return this.http.get<PaginatedResponse<ReserveAdministrativeApi>>(this.base);
  }
  create(data: ReserveAdministrativeCreateRequest): Observable<ApiResponse<ReserveAdministrativeApi>> {
    return this.http.post<ApiResponse<ReserveAdministrativeApi>>(this.base, data);
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  PERMIS & AUTORISATIONS
// ════════════════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class PermisConstruireApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/permis/construire`;

  getAll(f: { statut?: string; page?: number } = {}): Observable<PaginatedResponse<PermisConstruireApi>> {
    return this.http.get<PaginatedResponse<PermisConstruireApi>>(this.base, { params: p(f) });
  }
  create(data: PermisConstruireCreateRequest): Observable<ApiResponse<PermisConstruireApi>> {
    return this.http.post<ApiResponse<PermisConstruireApi>>(this.base, data);
  }
  instruire(id: number, instructeur: string): Observable<ApiResponse<PermisConstruireApi>> {
    return this.http.patch<ApiResponse<PermisConstruireApi>>(`${this.base}/${id}/instruire`, { instructeur });
  }
  decider(id: number, decision: 'accorde' | 'refuse', motif?: string): Observable<ApiResponse<PermisConstruireApi>> {
    return this.http.patch<ApiResponse<PermisConstruireApi>>(`${this.base}/${id}/decider`, { statut: decision, motif_refus: motif });
  }
}

@Injectable({ providedIn: 'root' })
export class PermisDemolirApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/permis/demolir`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<PermisDemolirApi>> {
    return this.http.get<PaginatedResponse<PermisDemolirApi>>(this.base, { params: p(f) });
  }
  create(data: { demandeur: string; adresse_travaux: string; description_batiment: string }): Observable<ApiResponse<PermisDemolirApi>> {
    return this.http.post<ApiResponse<PermisDemolirApi>>(this.base, data);
  }
  decider(id: number, statut: string): Observable<ApiResponse<PermisDemolirApi>> {
    return this.http.patch<ApiResponse<PermisDemolirApi>>(`${this.base}/${id}/decider`, { statut });
  }
}

@Injectable({ providedIn: 'root' })
export class CertificatUrbanismeApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/permis/certificats`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<CertificatUrbanismeApi>> {
    return this.http.get<PaginatedResponse<CertificatUrbanismeApi>>(this.base, { params: p(f) });
  }
  create(data: { demandeur: string; adresse: string; type: string }): Observable<ApiResponse<CertificatUrbanismeApi>> {
    return this.http.post<ApiResponse<CertificatUrbanismeApi>>(this.base, data);
  }
  delivrer(id: number): Observable<ApiResponse<CertificatUrbanismeApi>> {
    return this.http.patch<ApiResponse<CertificatUrbanismeApi>>(`${this.base}/${id}/delivrer`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class AutorisationOccupationApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/permis/autorisations`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<AutorisationOccupationApi>> {
    return this.http.get<PaginatedResponse<AutorisationOccupationApi>>(this.base, { params: p(f) });
  }
  create(data: AutorisationCreateRequest): Observable<ApiResponse<AutorisationOccupationApi>> {
    return this.http.post<ApiResponse<AutorisationOccupationApi>>(this.base, data);
  }
  resilier(id: number): Observable<ApiResponse<AutorisationOccupationApi>> {
    return this.http.patch<ApiResponse<AutorisationOccupationApi>>(`${this.base}/${id}/resilier`, {});
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  CARTOGRAPHIE SIG
// ════════════════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class QuartierSIGApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/sig/quartiers`;

  getAll(): Observable<PaginatedResponse<QuartierSIGApi>> {
    return this.http.get<PaginatedResponse<QuartierSIGApi>>(this.base);
  }
  create(data: { nom: string; superficie: number; statut?: string; population?: number; lat?: number; lng?: number }): Observable<ApiResponse<QuartierSIGApi>> {
    return this.http.post<ApiResponse<QuartierSIGApi>>(this.base, data);
  }
}

@Injectable({ providedIn: 'root' })
export class VoirieSIGApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/sig/voiries`;

  getAll(f: { type?: string; statut?: string } = {}): Observable<PaginatedResponse<VoirieSIGApi>> {
    return this.http.get<PaginatedResponse<VoirieSIGApi>>(this.base, { params: p(f) });
  }
  create(data: { nom: string; quartier: string; longueur: number; largeur?: number; type: string }): Observable<ApiResponse<VoirieSIGApi>> {
    return this.http.post<ApiResponse<VoirieSIGApi>>(this.base, data);
  }
}

@Injectable({ providedIn: 'root' })
export class ReseauSIGApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/sig/reseaux`;

  getAll(f: { type?: string } = {}): Observable<PaginatedResponse<ReseauSIGApi>> {
    return this.http.get<PaginatedResponse<ReseauSIGApi>>(this.base, { params: p(f) });
  }
  create(data: { designation: string; type: string; quartier: string; longueur?: number; capacite?: string }): Observable<ApiResponse<ReseauSIGApi>> {
    return this.http.post<ApiResponse<ReseauSIGApi>>(this.base, data);
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  PROJETS URBAINS
// ════════════════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class LotissementApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/projets/lotissements`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<LotissementApi>> {
    return this.http.get<PaginatedResponse<LotissementApi>>(this.base, { params: p(f) });
  }
  create(data: LotissementCreateRequest): Observable<ApiResponse<LotissementApi>> {
    return this.http.post<ApiResponse<LotissementApi>>(this.base, data);
  }
  updateAvancement(id: number, avancement: number): Observable<ApiResponse<LotissementApi>> {
    return this.http.patch<ApiResponse<LotissementApi>>(`${this.base}/${id}/avancement`, { avancement });
  }
}

@Injectable({ providedIn: 'root' })
export class AmenagementApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/projets/amenagements`;

  getAll(f: { statut?: string; type?: string } = {}): Observable<PaginatedResponse<AmenagementUrbainApi>> {
    return this.http.get<PaginatedResponse<AmenagementUrbainApi>>(this.base, { params: p(f) });
  }
  create(data: AmenagementCreateRequest): Observable<ApiResponse<AmenagementUrbainApi>> {
    return this.http.post<ApiResponse<AmenagementUrbainApi>>(this.base, data);
  }
  updateAvancement(id: number, avancement: number): Observable<ApiResponse<AmenagementUrbainApi>> {
    return this.http.patch<ApiResponse<AmenagementUrbainApi>>(`${this.base}/${id}/avancement`, { avancement });
  }
}

@Injectable({ providedIn: 'root' })
export class SuiviChantierApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/projets/chantiers`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<SuiviChantierApi>> {
    return this.http.get<PaginatedResponse<SuiviChantierApi>>(this.base, { params: p(f) });
  }
  create(data: SuiviChantierCreateRequest): Observable<ApiResponse<SuiviChantierApi>> {
    return this.http.post<ApiResponse<SuiviChantierApi>>(this.base, data);
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  GÉOLOCALISATION ÉQUIPEMENTS
// ════════════════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class EquipementPublicApiService {
  private http = inject(HttpClient);
  private base = `${BASE()}/urb/geo/equipements`;

  getAll(f: { type?: string; statut?: string; quartier?: string } = {}): Observable<PaginatedResponse<EquipementPublicApi>> {
    return this.http.get<PaginatedResponse<EquipementPublicApi>>(this.base, { params: p(f) });
  }
  create(data: EquipementCreateRequest): Observable<ApiResponse<EquipementPublicApi>> {
    return this.http.post<ApiResponse<EquipementPublicApi>>(this.base, data);
  }
  update(id: number, data: Partial<EquipementCreateRequest>): Observable<ApiResponse<EquipementPublicApi>> {
    return this.http.put<ApiResponse<EquipementPublicApi>>(`${this.base}/${id}`, data);
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  STATISTIQUES
// ════════════════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class StatsUrbanismeApiService {
  private http = inject(HttpClient);

  getDashboard(): Observable<StatsUrbanismeApi> {
    return this.http.get<StatsUrbanismeApi>(`${BASE()}/urb/statistiques`);
  }
  export(type?: string): Observable<Blob> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    return this.http.get(`${BASE()}/urb/export`, { params, responseType: 'blob' });
  }
}
